import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {StyleSheet,View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal,BottomSheetModalProvider,} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios'; //For pbnb API Test
import { format } from 'date-fns'
import FastImage from "react-native-fast-image";
import Spinner from 'react-native-loading-spinner-overlay';
import { createImageProgress } from 'react-native-image-progress';
const Imageload = createImageProgress(FastImage);

export const MainScreen = (props) => {
  const [open, setOpen] = useState(false); 
  const [value, setValue] = useState(null);

  const [breakfastStatus, setBreakfastStatus] = useState(false);
  const [lunchStauts, setLunchStatus] = useState(false);
  const [dinnerStatus, setDinnerStatus] = useState(false);

  const week = ['일','월','화','수','목','금','토'];

  const [menulist, setMenulist] = useState(null);
  const [eatTime, setEatTime] = useState(null);

  const [loadingstate, setLoadingstate] = useState(false);

  /* 화면 호출 시 현재 시간에 따른 식사 표기 */
  useEffect(() => {
    const newDate = new Date(props.TrgtDate);
    getMenuApi(format((+newDate), 'yyyyMMdd')); // 첫 메뉴는 현재 시간 기준 표기
    eat_hours(props.TrgtDate.getHours()); // 식사 시간 기준으로 메뉴 (탭) 결정
  },[]);

  /* 시간에 따른 메뉴 결정 */
  const eat_hours  = (hours) => {
    if (hours < 8){breakfast();}
    else if (hours < 13){lunch();}
    else {dinner();}
  }

  /*BottomSheet Function*/
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '40%'], []);
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
      props.onSetTeam(value);
      handleClosePress();
    }
  }

  /* 하루 전날 전체 메뉴 확인 */
  const beforeDate = () => {
    const newDate = new Date(props.TrgtDate);
    newDate.setDate(props.TrgtDate.getDate() - 1);
    props.setTrgtDate(newDate); 
    getMenuApi(format((+newDate), 'yyyyMMdd'));
  };
  
  /* 오늘 전체 메뉴 확인 */
  const todayDate = () => {
    const newDate = new Date();
    if (newDate.getFullYear() !== props.TrgtDate.getFullYear() || newDate.getMonth() !== props.TrgtDate.getMonth() || newDate.getDate() !== props.TrgtDate.getDate()){ 
      console.log("here")
      props.setTrgtDate(newDate);
      getMenuApi(format((+newDate), 'yyyyMMdd'));
    }
  };

  /* 하루 다음날 전체 메뉴 확인 */
  const nextDate = () => {
    const newDate = new Date(props.TrgtDate);
    newDate.setDate(props.TrgtDate.getDate() + 1);
    props.setTrgtDate(newDate);
    getMenuApi(format((+newDate), 'yyyyMMdd'))
  };
 
  /* 전체 메뉴 중 아침 메뉴 확인 */
  const breakfast = () => {
    setBreakfastStatus(true);
    setLunchStatus(false);
    setDinnerStatus(false);
    setEatTime('breakfirstList')
  }

  /* 전체 메뉴 중 점심 메뉴 확인 */
  const lunch = () => {
    setBreakfastStatus(false);
    setLunchStatus(true);
    setDinnerStatus(false);
    setEatTime('lunchList');
  }

  /* 전체 메뉴 중 저녁 메뉴 확인 */
  const dinner = () => {
    setBreakfastStatus(false);
    setLunchStatus(false);
    setDinnerStatus(true);
    setEatTime('dinnerList');
  }

  /* 서버에서 메뉴를 받아 오는 함수 */
  const getMenuApi = async (apiDate) => {
    setLoadingstate(true);
    const response = await axios.post('https://asia-northeast1-pbnb-2f164.cloudfunctions.net/menu_v_2_0_0',
      {
          st_dt: apiDate,
          end_dt: apiDate,
          bizplc_cd: "10552", // 10095: 1동 식당 코드 -> 식당 선택하게 하는 기능 추가 필요
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
        <View style={{width:'100%', height:'35%', marginTop:180}}>
          <View style={{height:'80%'}}>
            <Image
              source={require('./assets/no_menu.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode='contain'
            />
          </View>
          <View style={{alignItems:'center', margin:20 }}>
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
            props.pbnbData == '빠밥' ? {backgroundColor: '#FDC664'} : 
            props.pbnbData == '늦밥' ? {backgroundColor: '#FB8C6F'} :
            {backgroundColor: '#73607D'}
            ]}>
            <Text 
            style={{fontSize: 16, textAlign: 'center', color: 'white'}}
            >
              {props.pbnbData}
            </Text>
          </View>
          <View
          style ={{marginLeft: 15,}}
          >
            <Text style={{fontSize: 16,}}>
            {props.TrgtTeamLabelData}
            </Text>
          </View>
          <TouchableOpacity 
          style={{marginLeft:'auto',flexDirection: 'row', justifyContent:'flex-end', marginRight:20}}
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
          <TouchableOpacity style={{margin: 5}} onPress={beforeDate}>
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
            <TouchableOpacity style={{alignItems:'center', margin: 5}} onPress={todayDate}>
              <Text style={{textDecorationLine: 'underline'}}>
                오늘 메뉴 확인
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
          style={{margin: 5}} 
          onPress={nextDate}>
            <Image
                source={require('./assets/right_arrow.png')}
                style={{width: 25, height: 25}}
                resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.eattingtab}>
          <TouchableOpacity 
          style={[breakfastStatus === true ? styles.eattingtime_click : styles.eattingtime_noclick]} 
          onPress={breakfast}>
            <View>
              <Text>
                조식
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
          style={[lunchStauts === true ? styles.eattingtime_click : styles.eattingtime_noclick]} 
          onPress={lunch}>
            <View>
              <Text>
                중식
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
          style={[dinnerStatus === true ? styles.eattingtime_click : styles.eattingtime_noclick]} 
          onPress={dinner}>
            <View>
              <Text>
                석식
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView style={{width:'85%'}}>
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
                  <Text style={{fontSize:15}}>팀을 변경하고 싶으세요?</Text>
                </View>
                <View style ={{marginTop: 25, width: 300}}>
                  <DropDownPicker
                  placeholder="팀을 선택해주세요."
                  open={open}
                  value={value}
                  items={props.Teamitems}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={props.setTeamitems}
                  maxHeight={100}
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
      justifyContent: 'flex-start',
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
      marginTop: 90,
      paddingTop: 15,
      paddingBottom: 15,
      borderRadius: 25,
      backgroundColor: 'black',
  }
})


