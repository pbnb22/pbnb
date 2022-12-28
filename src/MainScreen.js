import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {StyleSheet,View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal,BottomSheetModalProvider,} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios'; //For pbnb API Test
import { format } from 'date-fns'
import FastImage from "react-native-fast-image";
import Spinner from 'react-native-loading-spinner-overlay';
import { createImageProgress } from 'react-native-image-progress';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Imageload = createImageProgress(FastImage);

export const MainScreen = (props) => {
  const [open, setOpen] = useState(false); 
  const [value, setValue] = useState(null);

  const week = ['일','월','화','수','목','금','토'];

  const [menulist, setMenulist] = useState(null);
  const [eatTime, setEatTime] = useState(null);
  const [eatSite, setEatSite] = useState("10552");

  const [loadingstate, setLoadingstate] = useState(false);

  /* 화면 호출 시 현재 시간에 따른 식사 표기 */
  useEffect(() => {
    const newDate = new Date(props.TrgtDate);
    getMenuApi(format((+newDate), 'yyyyMMdd'), eatSite); // 첫 메뉴는 현재 시간 기준 표기
    eat_hours(props.TrgtDate.getHours()); // 식사 시간 기준으로 메뉴 (탭) 결정
    const storageSite = async () => {
      const initSite = await AsyncStorage.getItem("StoragedSite");
      if (initSite !== null){
        site(initSite);
      }
      else{
        site('10552');
      }
    };
    storageSite();
  },[]);

  /* 시간에 따른 메뉴 결정 */
  const eat_hours  = (hours) => {
    if (hours < 8){breakfast();}
    else if (hours < 13){lunch();}
    else {dinner();}
  }

  /*BottomSheet Function*/
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
  }, []);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}		// 이거 추가
        disappearsOnIndex={-1}	// 이거 추가
        opacity={0.7}
      />
    ),
    [],
  );
  const handleClosePress = () => bottomSheetModalRef.current.close()

  /*Team 변경 함수 */
  const TeamStateChange = () => {
    if(value !== null)
    {
      props.onChangeGrp(value);
      handleClosePress();
    }
  }

  /*요일 변경 함수 => 0: Today */
  const changeDate = (day) => {
    if(day === 0){ //day 파라미타가 0으로 오면 오늘 날짜를 보여줘요
      let newDate = new Date();
      if (newDate.getFullYear() !== props.TrgtDate.getFullYear() || newDate.getMonth() !== props.TrgtDate.getMonth() || newDate.getDate() !== props.TrgtDate.getDate()){ 
        console.log("Today Change Date");
        props.setTrgtDate(newDate);
        getMenuApi(format((+newDate), 'yyyyMMdd'), eatSite)
      }
    }
    else{ //day의 날짜에 따라 TrgtDate 기준으로 날짜
      let newDate = new Date(props.TrgtDate);
      newDate.setDate(props.TrgtDate.getDate() + day);
      props.setTrgtDate(newDate);
      getMenuApi(format((+newDate), 'yyyyMMdd'), eatSite)
    }
  }
 
  /* 전체 메뉴 중 아침 메뉴 확인 */
  const breakfast = () => {
    setEatTime('breakfirstList')
  }

  /* 전체 메뉴 중 점심 메뉴 확인 */
  const lunch = () => {
    setEatTime('lunchList');
  }

  /* 전체 메뉴 중 저녁 메뉴 확인 */
  const dinner = () => {
    setEatTime('dinnerList');
  }

  /* 식당에 따른 메뉴 확인 */
  const site = (bizplc_cd) => {
    setEatSite(bizplc_cd);

    if (eatSite !== bizplc_cd){
      getMenuApi(format((+props.TrgtDate), 'yyyyMMdd'), bizplc_cd)
      AsyncStorage.setItem("StoragedSite", bizplc_cd); //Local Storage 저장
    };
  }

  /* 서버에서 메뉴를 받아 오는 함수 */
  const getMenuApi = async (apiDate, eatSite) => {
    setLoadingstate(true);
    const response = await axios.post('https://asia-northeast1-pbnb-2f164.cloudfunctions.net/menu_v_2_0_0',
      {
          st_dt: apiDate,
          end_dt: apiDate,
          bizplc_cd: eatSite, // 10095: 1동 식당 코드 -> 식당 선택하게 하는 기능 추가 필요
      },
    )
    setMenulist(response.data);
    setLoadingstate(false);
  }

  /* 메뉴 표기 부분 */
  const viewMenu = () => {
    if (menulist[eatTime] !== undefined){
      // 한식, 간편식 A/B 표기용 반복
      const menuInfor = menulist[eatTime].map(
      (value1,index) => {
        // 각 코스별 세부 메뉴 반복
        const menuDetail = value1.list.map(
          (value2,index) =>{
            return (
              <View style={{alignItems:'center', margin:3}}>
                <Text style={[value2 === value1.mainMenuName ? {backgroundColor:'#DEECF9', fontSize:16} : {fontSize:16}]}>
                  {value2.trim()}
                </Text>
              </View>
            )
          }
        )
        return(
          <View style={{borderBottomColor:"#8D8D8D", borderBottomWidth:0.5}}>
            <Text style={{fontSize:23, fontStyle:'italic', color:'#A17B5F', fontWeight:'600',
              marginTop:15}}>
              {value1.mealName}
            </Text>
            <Imageload
              source={{uri: 'https://sfv.hyundaigreenfood.com' + value1.image,}}
              indicator={undefined}
              style={[value1.image !== null ? {width: '100%', height: 250, marginTop:15, borderRadius:15, overflow:`hidden`} : {}]}
              resizeMode='stretch'
              />
            <View style={{margin:15}}>
              {menuDetail}
            </View>
          </View>
        );
      }
      )
      return menuInfor
    }
    
    else {
      return(
        <View style={{width:'100%', height:100, marginTop:180}}>
          <View style={{width:'100%', height: '100%', flex: 2}}>
            <Image
              source={require('./assets/no_menu.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode='contain'
            />
          </View>
          <View style={{width:'100%', height: '100%', alignItems:'center',  flex : 1, marginTop: 10}}>
            <Text style={{fontSize: 16}}>
              메뉴가 없어요.
            </Text>
          </View>
        </View>   
      )
    }
  }
  return(
    /* 전체 화면 표기 부분 */
    <SafeAreaView>
      <View style = {styles.maincontainer}>
        <View style = {styles.container_topbar}>
          <View style={[styles.pbnb, 
            props.pbnbData == '휴일' ? {backgroundColor: '#FF7FAE'} : 
            {backgroundColor: '#8333E9'}
            ]}>
            <Text 
            style={{fontSize: 16, textAlign: 'center', color: 'white'}}
            >
              {props.pbnbData}
            </Text>
          </View>

          <View style={{flexDirection:'row',borderColor: 'black', borderWidth: 1.2, width: '40%', height: '48%'}}>
            <TouchableOpacity style={[eatSite === '10552' ? styles.site_click : styles.site_noclick]} onPress={()=>site("10552")}>
              <Text style={[eatSite === '10552' ? {color:'white'} : {color:'black'}]}>
                현대 건설
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[eatSite === '10095' ? styles.site_click : styles.site_noclick]} onPress={()=>site("10095")}>
              <Text style={[eatSite === '10095' ? {color:'white'} : {color:'black'}]}>
                마북 1동
              </Text>
            </TouchableOpacity>
           </View>
           <TouchableOpacity 
            style={{flexDirection: 'row', justifyContent:'flex-end', marginRight:20, width: 50}}
            onPress={handlePresentModalPress}
            >
            <Image
              source={require('./assets/refresh.png')}
              style={{width: 23, height: 23}}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.itemcontainer}> 
          <TouchableOpacity style={{margin: 5}} onPress={()=>changeDate(-1)}>
            <Image
              source={require('./assets/left_arrow.png')}
              style={{width: 25, height: 25}}
              resizeMode='contain'
            />
          </TouchableOpacity>
          <View style={{margin: 5}}>
            <Text style={{fontSize:16}}>
              {props.TrgtDate.getFullYear() + '년 ' + (props.TrgtDate.getMonth()+1) + '월 ' + props.TrgtDate.getDate() + '일 ' + week[props.TrgtDate.getDay()] + '요일'}
            </Text>
            <TouchableOpacity style={{alignItems:'center', margin: 5}} onPress={()=>changeDate(0)}>
              <Text style={{textDecorationLine: 'underline'}}>
                오늘 메뉴 이동
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
          style={{margin: 5}} 
          onPress={()=>changeDate(+1)}>
            <Image
                source={require('./assets/right_arrow.png')}
                style={{width: 25, height: 25}}
                resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.eattingtab}>
          <TouchableOpacity 
          style={[eatTime === 'breakfirstList' ? styles.eattingtime_click : styles.eattingtime_noclick]} 
          onPress={breakfast}>
            <View>
              <Text>
                조식
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
          style={[eatTime === 'lunchList' ? styles.eattingtime_click : styles.eattingtime_noclick]} 
          onPress={lunch}>
            <View>
              <Text>
                중식
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
          style={[eatTime === 'dinnerList' ? styles.eattingtime_click : styles.eattingtime_noclick]} 
          onPress={dinner}>
            <View>
              <Text>
                석식
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={{width:'85%'}} showsVerticalScrollIndicator={false}>
          <Spinner
            visible={loadingstate}
            textContent={'메뉴 확인 중...'}
            textStyle={{color: '#FFF', fontSize:17, fontWeight:'600'}}
          />
          <View>
            {menulist ? viewMenu() : ''}
          </View>
        </ScrollView>
         
        <BottomSheetModalProvider>
          <View style={{flex:1, justifyContent: 'center'}}>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
              backdropComponent={renderBackdrop}
            >
              <View style={{flex:1, alignItems: 'center', marginTop: 15, justifyContent: 'flex-start'}}>
                <View>
                  <Text style={{fontSize:15}}>밥먹는 시간이 안맞으신가요?</Text>
                </View>
                <View style ={{marginTop: 25, width: 300}}>
                  <DropDownPicker
                  placeholder="오늘 밥먹는 순서를 알려주세요."
                  open={open}
                  value={value}
                  items={props.TimeTableitems}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={props.setTimeTableitems}
                  maxHeight={150}
                  />
                  <TouchableOpacity 
                  style ={styles.confirm}
                  onPress ={TeamStateChange}
                  >
                      <Text style ={{color : 'white'}}>
                          변경하기
                      </Text>
                  </TouchableOpacity>   
                </View>
              </View>
              </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    maincontainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    container_topbar: {
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomColor: "#bdbdbd",
      borderBottomWidth: 1,
      width:'100%',
      height: 60,
    },
    itemcontainer: {
      margin: 5,
      flexDirection: "row",
      justifyContent:"space-between",
      alignItems: 'center',
    },
    pbnb: {
      borderRadius:15,
      width: 50,
      height:30,
      justifyContent: 'center',
      marginLeft: 20,
    },
    site_click: {
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor:'black', 
      width:'50%', 
      height:'100%',
    },
    site_noclick: {
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor:'white', 
      width:'50%', 
      height:'100%',
    },
    eattingtab: {
      backgroundColor: '#EAE8E8',
      height: 30,
      borderRadius:15, 
      marginLeft: 30,
      marginRight: 30,
      flexDirection: "row", 
      justifyContent:"space-between"
    },
    eattingtime_click: {
      width: '33.33%',
      margin: 5,
      borderRadius:15,
      backgroundColor: 'white',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    eattingtime_noclick: {
      width: '33%',
      margin: 4,
      borderRadius:15,
      backgroundColor: '#EAE8E8',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    confirm: {
      
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: 300,
      marginTop: 130,
      paddingTop: 15,
      paddingBottom: 15,
      borderRadius: 25,
      backgroundColor: 'black',
  }
})


