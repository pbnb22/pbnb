import React, { useEffect, useState } from 'react';
import { View,  Text} from 'react-native';
import { SplashScreen } from './src/SplashScreen';
import { SignInScreen } from './src/SignInScreen';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'; //For pbnb API Test

export const App = () => {
  const [ShowSplashScreen, setShowSplashScreen] = useState(true);
  const [TeamData, setTeamData] = useState(null);
  const [pbnbData, setpbnbData] = useState();

  const onSetTeam = async (TeamSelected) => {
    if(TeamSelected !== null){
      setTeamData(TeamSelected);
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
          setTeamData(storageTeamData);
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
  ///////////////pbnb status get -> MainScreen으로 옮길예정/////////
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
//////////////////////////////////////////////////////////////////////////////
  const getScreen = () =>{
    if(ShowSplashScreen === true){
      return(
        <SplashScreen/>
      )
    } else{
      if(TeamData !== null)
      {
        getPbnbState(TeamData);
        return(
          <View>
            <Text>
              {pbnbData}
            </Text>
          </View>
        )
      }
      else{
        return(
          <SignInScreen onSetTeam = {onSetTeam}/>
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