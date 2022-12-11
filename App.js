import React, { useEffect, useState } from 'react';
import { View,  Text} from 'react-native';
import { SplashScreen } from './src/SplashScreen';

export const App = () => {
  const [ShowSplashScreen, setShowSplashScreen] = useState(true);

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
      return(
        <Text>
          MainScreen
        </Text>
      )
    }
  }

  return (
    <View>
      {getScreen()}
    </View>
    
  );
};

export default App;