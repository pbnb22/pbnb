import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import {BottomSheetBackdrop, BottomSheetModal,BottomSheetModalProvider,} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios'; //For pbnb API Test
import { format } from 'date-fns'
import FastImage from "react-native-fast-image";
import Spinner from 'react-native-loading-spinner-overlay';
import { createImageProgress } from 'react-native-image-progress';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import  { Calendar, }  from  'react-native-calendars' ;
import Modal from "react-native-modal";

const Imageload = createImageProgress(FastImage);

export const MainScreen = (props) => {
  const [open, setOpen] = useState(false); 
  const [value, setValue] = useState(null);

  const week = ['일','월','화','수','목','금','토'];

  const [menulist, setMenulist] = useState(null);
  const [eatTime, setEatTime] = useState(null);
  const [eatSite, setEatSite] = useState("10552");

  const [loadingstate, setLoadingstate] = useState(false);
  const [CalVisible, setCalVisible] = useState(false);

  /** 화면 호출 시 현재 시간에 따른 식사 표기 */
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

  /** 시간에 따른 메뉴 결정 */
  const eat_hours  = (hours) => {
    if (hours < 8){breakfast();}
    else if (hours < 13){lunch();}
    else {dinner();}
  }

  /** BottomSheet Function*/
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '53%'], []);
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

  /** Team 변경 함수 */
  const TeamStateChange = () => {
    if(value !== null)
    {
      props.onChangeGrp(value);
      handleClosePress();
    }
  }

  /** 요일 변경 함수 => 0: Today */
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
      console.log('date : '+ newDate);
      props.setTrgtDate(newDate);
      
      getMenuApi(format((+newDate), 'yyyyMMdd'), eatSite)
    }
  }
  const setDate = (day) => {
    let newDate = new Date();
    console.log('day  : '+day.month)
    newDate.setFullYear(day.year);
    newDate.setMonth(day.month-1);
    newDate.setDate(day.day);

    props.setTrgtDate(newDate);
    getMenuApi(format((+newDate), 'yyyyMMdd'), eatSite)

    console.log('newdate'+newDate);
  }
 
  /** 전체 메뉴 중 아침 메뉴 확인 */
  const breakfast = () => {
    setEatTime('breakfirstList')
  }

  /** 전체 메뉴 중 점심 메뉴 확인 */
  const lunch = () => {
    setEatTime('lunchList');
  }

  /** 전체 메뉴 중 저녁 메뉴 확인 */
  const dinner = () => {
    setEatTime('dinnerList');
  }

  /** 식당에 따른 메뉴 확인 */
  const site = (bizplc_cd) => {
    setEatSite(bizplc_cd);

    if (eatSite !== bizplc_cd){
      getMenuApi(format((+props.TrgtDate), 'yyyyMMdd'), bizplc_cd)
      AsyncStorage.setItem("StoragedSite", bizplc_cd); //Local Storage 저장
    };
  }

  /** 서버에서 메뉴를 받아 오는 함수 */
  const getMenuApi = async (apiDate, eatSite) => {
    setLoadingstate(true);
    const response = await axios.post('https://asia-northeast1-pbnb-2f164.cloudfunctions.net/menu_v_2_0_0',
      {
          st_dt: apiDate,
          end_dt: apiDate,
          bizplc_cd: eatSite, // 10095: 1동, 10552: 현대 건설
      },
    )
    setMenulist(response.data);
    setLoadingstate(false);
  }
  /** 구글 Admob */
  const admob = () =>{
    if (Platform.OS === 'android'){
      return(
        <BannerAd
        unitId={'ca-app-pub-7624142922095364/3340944240'}
        size={BannerAdSize.FULL_BANNER}
        />
      );
    }
    else{
      return(
        <BannerAd
        // unitId={TestIds.BANNER} 
        unitId={'ca-app-pub-7624142922095364/2589532562'}
        size={BannerAdSize.FULL_BANNER}
        />
      );
    }
  }

  /** 메뉴 표기 부분 */
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
            <Text style={{fontSize:23, fontStyle:'italic', color:'#a36b4f', fontWeight:'600',
              marginTop:15}}>
              {value1.mealName}
            </Text>
            <Imageload
              source={{uri: 'https://sfv.hyundaigreenfood.com' + value1.image,}}
              indicator={undefined}
              style={[value1.image !== null ? {width: '100%', aspectRatio:1.4, marginTop:15, borderRadius:15, overflow:`hidden`} : {}]}
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

  const ViewCalendar = (day) => {
    setCalVisible(false);
    setDate(day);
  }

  const barColor = () => {
    if (Platform.OS === 'ios'){
    return(
      <StatusBar barStyle="dark-content" />
    )
    }
  }

  return(
    /** 전체 화면 표기 부분 */
    <SafeAreaView>
      {barColor()}
      <View style = {styles.maincontainer}>
        <View style = {styles.container_topbar}>
          <View style={{flexDirection:'row', alignItems: 'center'}}>
            <View>
              <Text style={{color: '#002c5f', fontSize: 18, fontWeight:'600', marginLeft:35}}>
                현대자동차 마북연구소
              </Text>
            </View>
            <View style={[styles.pbnb, 
              props.pbnbData == '휴일' ? {backgroundColor: '#aacae6'} : 
              {backgroundColor: '#00aad2'}
              ]}>
              <Text 
              style={{fontSize: 16, textAlign: 'center', color: 'white'}}
              >
                {props.pbnbData}
              </Text>
            </View>
            <TouchableOpacity 
              style={{flexDirection: 'row', justifyContent:'flex-end', marginRight:20, width: 35}}
              onPress={handlePresentModalPress}
              >
              <Image
                source={require('./assets/refresh.png')}
                style={{width: 23, height: 23}}
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection:'row', width: '100%', height: '68%', }}>
            <TouchableOpacity style={[eatSite === '10552' ? styles.site_click : styles.site_noclick]} onPress={()=>site("10552")}>
              <Text style={[eatSite === '10552' ? {color:'#002c5f', fontWeight:'700'} : {color:'#e4dcd3'}]}>
                임대동
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[eatSite === '10095' ? styles.site_click : styles.site_noclick]} onPress={()=>site("10095")}>
              <Text style={[eatSite === '10095' ? {color:'#002c5f', fontWeight:'700'} : {color:'#e4dcd3'}]}>
                본관동
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.itemcontainer}> 
          <TouchableOpacity style={{margin: 5}} onPress={()=>changeDate(-1)}>
            <Image
              source={require('./assets/left_arrow.png')}
              style={{width: 30, height: 30}}
              resizeMode='stretch'
            />
          </TouchableOpacity>
          <View style={{margin: 5}}>
            <TouchableOpacity
            onPress={()=>setCalVisible(true)}
            >
              <Text style={{fontSize:16}}>
                {props.TrgtDate.getFullYear() + '년 ' + (props.TrgtDate.getMonth()+1) + '월 ' + props.TrgtDate.getDate() + '일 ' + week[props.TrgtDate.getDay()] + '요일'}
              </Text>
            </TouchableOpacity>
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
                style={{width: 30, height: 30}}
                resizeMode='stretch'
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
        {admob()}
        <Modal 
        isVisible={CalVisible}
        onBackdropPress={() => setCalVisible(false)}
        >
          <View style={{borderRadius: 15, overflow: 'hidden',}}>
            <Calendar
              onDayPress={(day)=>ViewCalendar(day)}
              initialDate={format((+props.TrgtDate), 'yyyy-MM-dd')}
              monthFormat={'yyyy년 MM월'}
              theme={{
                todayTextColor: '#00aad2',
                arrowColor: '#e63312',
              }}
            />
          </View>
        </Modal>
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
      flexDirection: "column",
      // alignItems: 'center',
      // justifyContent: 'space-between',
      // borderBottomColor: "#bdbdbd",
      // borderBottomWidth: 1,
      width:'100%',
      height: 78,
      marginTop: 5,
      marginBottom: 10,
    },
    itemcontainer: {
      margin: 5,
      flexDirection: "row",
      justifyContent:"space-between",
      alignItems: 'center',
    },
    pbnb: {
      borderRadius:15,
      width: 60,
      height:27,
      justifyContent: 'center',
      marginLeft: 'auto',
    },
    site_click: {
      justifyContent: 'center', 
      alignItems: 'center',
      // backgroundColor:'black', 
      width:'50%', 
      height:'100%',
      borderBottomColor: '#002c5f',
      borderBottomWidth: 6
    },
    site_noclick: {
      justifyContent: 'center', 
      alignItems: 'center',
      // backgroundColor:'white', 
      width:'50%', 
      height:'100%',
    },
    eattingtab: {
      backgroundColor: '#e4dcd3',
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
      backgroundColor: '#e4dcd3',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    confirm: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: 300,
      marginTop: 110,
      paddingTop: 15,
      paddingBottom: 15,
      borderRadius: 8,
      backgroundColor: 'black',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  }
})


