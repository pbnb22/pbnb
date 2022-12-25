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
  const [TrgtTeamData, setTrgtTeamData] = useState(null);
  const [TrgtTeamLabelData, setTrgtTeamLabelData] = useState(null);
  const [Teamitems, setTeamitems] = useState([
    {label: '연료전지제어개발1팀', value: 'FCCD'},
    {label: '연료전지제어개발2팀', value: 'FCCF'},
  ]);
  const week_en = ['sun','mon','tue','wed','thu','fri','sat'];

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

  /*Team Setting */
  const onSetTeam = (TeamSelected) => { //useState 저장 (Team Value, Label) -> Pbnb 상태 얻기
    if(TeamSelected !== null){
      setTrgtTeamData(TeamSelected); //useState TeamTrgtData Setting
      let res = Teamitems.filter(it => it.value.includes(TeamSelected));
      setTrgtTeamLabelData(res[0].label); //useState TeamTrgtLabel Setting
      AsyncStorage.setItem("StoragedTeamData", TeamSelected); //Local Storage 저장
      getPbnbState(TeamSelected);
    }
  }

  /* Initial Process */
  useEffect( //초기 실행시 2초간 SplashScreen 수행 후 Local Storage에 저장된 Team Data Get
  ()=>{
    setTimeout(()=>{setShowSplashScreen(false)}, 2000); // 2s후 ShowSplashScreen을 True로 Set
    const getTeamData = async () => {
      const storageTeamData = await AsyncStorage.getItem("StoragedTeamData");
      if(storageTeamData) {
        console.log("GET Team data from storage");
        onSetTeam(storageTeamData);
      }
      else{
        console.log("Team Information is not saved");     
      }
      console.log('초기 Team Data Get : '+storageTeamData);
    }
    getTeamData();
  },[]);

  useEffect(
  ()=>{
      getPbnbState(TrgtTeamData)
  },[week_en[TrgtDate.getDay()]])

  const getScreen = () =>{
    if(ShowSplashScreen === true){
      return(
        <SplashScreen/>
      )
    } else{
      if(TrgtTeamData !== null)
      {
        return(
          <MainScreen 
          TrgtTeamLabelData = {TrgtTeamLabelData} 
          pbnbData = {pbnbData} 
          onSetTeam = {onSetTeam}
          Teamitems = {Teamitems} 
          setTeamitems = {setTeamitems}
          setTrgtDate = {setTrgtDate}
          />
        )
      }
      else{
        return(
          <SignInScreen onSetTeam = {onSetTeam} Teamitems = {Teamitems} setTeamitems = {setTeamitems}/>
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