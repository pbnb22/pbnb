import React, { useEffect, useState } from 'react';
import { SplashScreen } from './src/SplashScreen';
import { SignInScreen } from './src/SignInScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainScreen } from './src/MainScreen';
import axios from 'axios'; //For pbnb API Test
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import mobileAds from 'react-native-google-mobile-ads';
import {request, PERMISSIONS} from 'react-native-permissions';
import { requestTrackingPermission } from 'react-native-tracking-transparency';
import { AppState, Platform } from 'react-native';

// Google 광고를 초기화합니다. 반드시 App.js에 정의해야 해요.
mobileAds().initialize().then(adapterStatuses => {});

export const App = () => {
  const [ShowSplashScreen, setShowSplashScreen] = useState(true);
  const [TrgtDate, setTrgtDate] = useState(new Date());
  const [pbnbData, setpbnbData] = useState(null);
  const [TrgtGrp, setTrgtGrp] = useState(null);
  const [TimeTableitems, setTimeTableitems] = useState([
    {label: '빠밥', value: 'Atime'},
    {label: '늦밥', value: 'Btime'},
  ]);
  const week_en = ['sun','mon','tue','wed','thu','fri','sat'];

  const checkPermissionForIOS = async () => {
    return await requestTrackingPermission();
  }

  useEffect(() => {
    checkPermissionForIOS();
  },[]);

  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      if (Platform.OS === 'ios' && status === 'active') {
        request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY)
          .then((result) => console.warn(result))
          .catch((error) => console.warn(error));
      }
    });
    return () => {listener.remove()}
  }, []);

  /**처음 앱 실행시 수행되는 HOOK이에요 */
  useEffect(
  ()=>{
    setTimeout(()=>{setShowSplashScreen(false)}, 500); // 2초후 ShowSplashScreen을 True로 Set해줘요
    const getTeamData = async () => {
      const StoragedGrpData = await AsyncStorage.getItem("StoragedGrp");
      if(StoragedGrpData) {
        console.log("GET Team data from storage");
        setTrgtGrp(StoragedGrpData);
      }
      else{
        console.log("Team Information is not saved");     
      }
      console.log('초기 Team Data Get : '+StoragedGrpData);
    }
    getTeamData();
  },[]);

  /**요일이 바뀜에 따라 빠밥 늦밥 정보를 불러오는 React Hook */
  useEffect(
  ()=>{
      getPbnbState(TrgtGrp)
  },[TrgtDate])
  
  /**TrgtGrp이 바뀜에 따라 빠밥 늦밥 정보를 불러오는 React Hook */
  useEffect(
    ()=>{
        getPbnbState(TrgtGrp)
        console.log('Group SET API usestate 반환: '+ TrgtGrp)
    },[TrgtGrp])

    

  /** 빠밥 늦밥 정보 가져오기 (2부제) -> 3부제 사용으로 현재 미사용*/
  const getPbnbState = async (GrpData) => {
    if(GrpData !== null){
      console.log('밥언제먹지 : '+ GrpData," ",TrgtDate.getMonth()+1)

      if ((TrgtDate.getMonth()+1) % 2 == 0){
        if (GrpData === 'Agrp'){
          setpbnbData('빠밥')
        }
        else{
          setpbnbData('늦밥')
        }
      }else{
        if (GrpData === 'Agrp'){
          setpbnbData('늦밥')
        }
        else{
          setpbnbData('빠밥')
        }
      }
      console.log('밥먹는 시간: '+ pbnbData)
    }
    
  };
  
 /** 소속 Group을 변경하기위해 수행되는 함수에요 */
  const onSetGrp = async (SelectedPbnbState) => {
    console.log('***Selected Group : ', SelectedPbnbState, " ", TrgtDate.getMonth()+1)

    if (SelectedPbnbState === "Atime"){
      if ((TrgtDate.getMonth()+1) % 2 == 0){
        setTrgtGrp('Agrp');
        AsyncStorage.setItem("StoragedGrp", 'Agrp'); 
      }else{
        setTrgtGrp('Bgrp');
        AsyncStorage.setItem("StoragedGrp", 'Bgrp'); 
      }
    }else{
      if ((TrgtDate.getMonth()+1) % 2 == 0){
        setTrgtGrp('Bgrp');
        AsyncStorage.setItem("StoragedGrp", 'Bgrp'); 
      }else{
        setTrgtGrp('Agrp');
        AsyncStorage.setItem("StoragedGrp", 'Agrp'); 
      }
    }
  }

  /**Screen 화면 Manage 해주는 함수에요 */
  const getScreen = () =>{
    if(ShowSplashScreen === true){
      return(
        <SplashScreen/>
      )
    } else{
      if(TrgtGrp !== null) 
      {
        return(
          <MainScreen 
          pbnbData = {pbnbData} 
          TimeTableitems = {TimeTableitems} 
          setTimeTableitems = {setTimeTableitems}
          setTrgtDate = {setTrgtDate}
          TrgtDate = {TrgtDate}
          onSetGrp = {onSetGrp}
          />
        )
      }
      else{
        return(
          <SignInScreen TimeTableitems = {TimeTableitems} setTimeTableitems = {setTimeTableitems} onSetGrp = {onSetGrp}/>
        )
      }
    }
  }

  return (
    <GestureHandlerRootView>
      {getScreen()}
    </GestureHandlerRootView>
    
    
  );
};


export default App;