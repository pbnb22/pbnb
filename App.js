import React, { useEffect, useState } from 'react';
import { View,  Text} from 'react-native';
import { SplashScreen } from './src/SplashScreen';
import { SignInScreen } from './src/SignInScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainScreen } from './src/MainScreen';
import axios from 'axios'; //For pbnb API Test
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const App = () => {
  const [ShowSplashScreen, setShowSplashScreen] = useState(true);
  const [TrgtDate, setTrgtDate] = useState(new Date());
  const [pbnbData, setpbnbData] = useState(null);
  const [TrgtGrp, setTrgtGrp] = useState(null);
  const [Teamitems, setTeamitems] = useState([
    {label: '연료전지제어개발1팀', value: 'FCCD'},
    {label: '연료전지제어개발2팀', value: 'FCCF'},
  ]);
  const week_en = ['sun','mon','tue','wed','thu','fri','sat'];

  /**처음 앱 실행시 수행되는 훅이에요 */
  useEffect(
  ()=>{
    setTimeout(()=>{setShowSplashScreen(false)}, 2000); // 2초후 ShowSplashScreen을 True로 Set해줘요
    /** */
    const getTeamData = async () => {
      const storageTeamData = await AsyncStorage.getItem("StoragedGrp");
      if(storageTeamData) {
        console.log("GET Team data from storage");
        onSetGrp(storageTeamData);
      }
      else{
        console.log("Team Information is not saved");     
      }
      console.log('초기 Team Data Get : '+storageTeamData);
    }
    getTeamData();
  },[]);

  /**요일이 바뀜에 따라 빠밥 늦밥 정보를 불러오는 React Hook */
  useEffect(
  ()=>{
      getPbnbState(TrgtGrp)
  },[week_en[TrgtDate.getDay()]])

  /**TrgtGrp이 바뀜에 따라 빠밥 늦밥 정보를 불러오는 React Hook */
  useEffect(
    ()=>{
        getPbnbState(TrgtGrp)
    },[TrgtGrp])

    

  /*빠밥늦밥 정보 얻기 */
  const getPbnbState = async (TeamData) => {
    if(TeamData !== null){
      console.log('API : '+ TeamData," ",week_en[TrgtDate.getDay()]," ",TrgtDate.getMonth()+1)
      const response = await axios.get(
        'https://asia-northeast1-beme-55b97.cloudfunctions.net/getPbnb/',
        {
          params: {
            team : TeamData,
            dayOfWeek : week_en[TrgtDate.getDay()], //요일 요청해야함. 월마다 바뀌는건 Server에서 처리함.
            month : TrgtDate.getMonth()+1,
          }
        }
      )
      setpbnbData(response.data.status);
    }
  };

  /**Group 설정에 사용되는 함수에요 2부제 일때는 Agrp, Bgrp 3부제 일때는 Cgrp까지 있어요*/
  const onSetGrp = (SelectedGrp) => {
    if(SelectedGrp !== null){
      setTrgtGrp(SelectedGrp); 
      AsyncStorage.setItem("StoragedGrp", SelectedGrp); 
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
          onSetGrp = {onSetGrp}
          Teamitems = {Teamitems} 
          setTeamitems = {setTeamitems}
          setTrgtDate = {setTrgtDate}
          TrgtDate = {TrgtDate}
          />
        )
      }
      else{
        return(
          <SignInScreen onSetGrp = {onSetGrp} Teamitems = {Teamitems} setTeamitems = {setTeamitems}/>
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