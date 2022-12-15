import React, { useEffect, useState } from 'react';
import { View,  Text} from 'react-native';
import { SplashScreen } from './src/SplashScreen';
import { SignInScreen } from './src/SignInScreen';

export const App = () => {
  const [ShowSplashScreen, setShowSplashScreen] = useState(true);
  const [Team, setTeam] = useState(null);

  const onSetTeam = (TeamSelected) => {
      setTeam(TeamSelected);
  }

  useEffect(
    ()=>{
      setTimeout(()=>{setShowSplashScreen(false)}, 2000); // 2s후 ShowSplashScreen을 True로 Set
    },
    []
  );

  const getScreen = () =>{
    if(ShowSplashScreen === true){
      return(
        <SplashScreen/>
      )
    } else{
      if(Team === null)
      {
        return(
          <SignInScreen onSetTeam = {onSetTeam}/>
        )
      }
      else{
        return(
          <View>
            <Text>
              MainScreen 
            </Text>
          </View>  
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