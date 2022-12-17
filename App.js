import React, { useEffect, useState } from 'react';
import { View,  Text} from 'react-native';
import { SplashScreen } from './src/SplashScreen';
import { SignInScreen } from './src/SignInScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MainScreen } from './src/MainScreen';
import axios from 'axios'; //For pbnb API Test

export const App = () => {
  const [ShowSplashScreen, setShowSplashScreen] = useState(true);
  const [pbnbData, setpbnbData] = useState(null);
  const [TeamData, setTeamData] = useState(null);
  const [TeamLabelData, setTeamLabelData] = useState(null);
  const [Teamitems, setTeamitems] = useState([
    {label: '연료전지제어개발1팀', value: 'FCCD'},
    {label: '연료전지제어개발2팀', value: 'FCCF'},
  ]);

  const ResetTeamData = () => {
    setTeamData(null);
  }
  const getPbnbState = async (TeamData) => {
    const response = await axios.get(
      'https://asia-northeast1-beme-55b97.cloudfunctions.net/getPbnb/',
      {
        params: {
          team : TeamData
        }
      }
    )
    setpbnbData(response.data.status);
  };

  const onSetTeamData = async (TeamData) => {
    await setTeamData(TeamData);
    let res = Teamitems.filter(it => it.value.includes(TeamData));
    console.log(res[0].label);
    await setTeamLabelData(res[0].label);
    await getPbnbState(TeamData);
  }

  const onSetTeam = async (TeamSelected) => {
    if(TeamSelected !== null){
      onSetTeamData(TeamSelected);
      await AsyncStorage.setItem("TeamData", TeamSelected);
    }
  }
  
  useEffect( //초기 실행시 2초간 SplashScreen 수행 후 Local Storage에 저장된 Team Data Get
    ()=>{
      setTimeout(()=>{setShowSplashScreen(false)}, 2000); // 2s후 ShowSplashScreen을 True로 Set
      const getTeamData = async () => {
        const storageTeamData = await AsyncStorage.getItem("TeamData");
        if(storageTeamData) {
          console.log("GET Team data from storage");
          onSetTeamData(storageTeamData);
        }
        else{
          console.log("Team Information is not saved");
          
        }
        console.log('초기 Team Data Get : '+storageTeamData);
      }
      getTeamData();   
    },
    []
  );

  const getScreen = () =>{
    if(ShowSplashScreen === true){
      return(
        <SplashScreen/>
      )
    } else{
      if(TeamData !== null)
      {
        return(
          <MainScreen TeamLabel = {TeamLabelData} TeamValue = {TeamData} pbnbData = {pbnbData} ResetTeamData = {ResetTeamData}/>
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
    <View>
      {getScreen()}
    </View>
    
  );
};

export default App;