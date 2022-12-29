import React, { useEffect, useState } from 'react';
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
  const [TimeTableitems, setTimeTableitems] = useState([
    {label: '12:00~12:30', value: 'Atime'},
    {label: '12:30~13:00', value: 'Btime'},
    {label: '13:00~13:30', value: 'Ctime'},
  ]);
  const week_en = ['sun','mon','tue','wed','thu','fri','sat'];

  /**처음 앱 실행시 수행되는 HOOK이에요 */
  useEffect(
  ()=>{
    setTimeout(()=>{setShowSplashScreen(false)}, 2000); // 2초후 ShowSplashScreen을 True로 Set해줘요
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
  },[week_en[TrgtDate.getDay()]])

  /**TrgtGrp이 바뀜에 따라 빠밥 늦밥 정보를 불러오는 React Hook */
  useEffect(
    ()=>{
        getPbnbState(TrgtGrp)
        console.log('Group SET API usestate 반환: '+ TrgtGrp)
    },[TrgtGrp])

    

  /** 빠밥 늦밥 정보 가져오기 (2부제) -> 3부제 사용으로 현재 미사용*/
  const getPbnbState = async (GrpData) => {
    if(GrpData !== null){
      console.log('API : '+ GrpData," ",TrgtDate.getMonth()+1)
      const response = await axios.get(
        'https://asia-northeast1-pbnb-ed5fa.cloudfunctions.net/getPbnb',
        {
          params: {
            TeamGrp : GrpData,
            month : TrgtDate.getMonth()+1,
            weekofday: week_en[TrgtDate.getDay()],
          }
        }
      )
      setpbnbData(response.data.status);
      console.log('밥먹는 시간: '+ response.data.status)
    }
    
  };
  
 /** 소속 Group을 변경하기위해 수행되는 함수에요 */
  const onChangeGrp = async (SelectedTimeTable) => {
    if(SelectedTimeTable !== null){
      console.log('Group SET API 호출 : '+ SelectedTimeTable," ",TrgtDate.getMonth()+1)
      const response = await axios.get(
        'https://asia-northeast1-pbnb-ed5fa.cloudfunctions.net/teamGrouping',
        {
          params: {
            TimeTable : SelectedTimeTable,
            month : TrgtDate.getMonth()+1,
          }
        }
      )
      console.log('Group SET API 호출 반환: '+ response.data.status);
      setTrgtGrp(response.data.status);
      AsyncStorage.setItem("StoragedGrp", response.data.status); 
    }
  };

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
          onChangeGrp = {onChangeGrp}
          TimeTableitems = {TimeTableitems} 
          setTimeTableitems = {setTimeTableitems}
          setTrgtDate = {setTrgtDate}
          TrgtDate = {TrgtDate}
          />
        )
      }
      else{
        return(
          <SignInScreen onChangeGrp = {onChangeGrp} TimeTableitems = {TimeTableitems} setTimeTableitems = {setTimeTableitems}/>
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