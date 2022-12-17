import React, { useEffect, useState } from "react";
import {StyleSheet,View, Text, Image, TouchableOpacity, DatePickerIOSComponent} from 'react-native';

export const MainScreen = (props) => {
  const [breakfastStatus, setBreakfastStatus] = useState(false);
  const [lunchStauts, setLunchStatus] = useState(false);
  const [dinnerStatus, setDinnerStatus] = useState(false);

  const week = ['일','월','화','수','목','금','토'];
  const [targetDate, setTargetDate] = useState(new Date());

  useEffect(() => {
    var hours = targetDate.getHours();
    
    if (hours < 8){
      setBreakfastStatus(true);
    }
    else if (hours < 12){
      setLunchStatus(true);
    }
    else{
      setDinnerStatus(true);
    }
  },[]);

  const beforeDate = () => {
    const newDate = new Date(targetDate);
    newDate.setDate(targetDate.getDate() - 1);
    setTargetDate(newDate);
  };

  const todayDate = () => {
    const newDate = new Date();
    setTargetDate(newDate);
  };

  const nextDate = () => {
    const newDate = new Date(targetDate);
    newDate.setDate(targetDate.getDate() + 1);
    setTargetDate(newDate);
  };


  const breakfast = () => {
    setBreakfastStatus(true);
    setLunchStatus(false);
    setDinnerStatus(false);
    console.log("brk")
  }
  const lunch = () => {
    setBreakfastStatus(false);
    setLunchStatus(true);
    setDinnerStatus(false);
    console.log("lunch")
  }
  const dinner = () => {
    setBreakfastStatus(false);
    setLunchStatus(false);
    setDinnerStatus(true);
    console.log("dinner")
  }

  const breakfasttab = () => {
    return(
      <View style={[breakfastStatus === true ? {backgroundColor:'blue'} : {backgroundColor:'white'}]}>
        <Text>
          조식
        </Text>
      </View>
    )
  }

  const lunchtab = () => {

      return(
        <View style={[lunchStauts === true ? {backgroundColor:'blue'} : {backgroundColor:'white'}]}>
          <Text>
            중식
          </Text>
        </View>
      )
    

  }

  const dinnertab = () => {

      return(
        <View style={[dinnerStatus === true ? {backgroundColor:'blue'} : {backgroundColor:'white'}]}>
          <Text>
            석식
          </Text>
        </View>
      )
    

  }

  const breakfastscreen = () => {
    if (breakfastStatus === true)
    {
      return(
        <View>
          <Text>
            "조식입니다."
          </Text>
        </View>
      )
    }
  }

  const lunchscreen = () => {
    if (lunchStauts === true)
    {
      return(
        <View>
          <Text>
            "중식입니다."
          </Text>
        </View>
      )
    }
  }

  const dinnerScreen = () => {
    if (dinnerStatus === true)
    {
      return(
        <View>
          <Text>
            "석식입니다."
          </Text>
        </View>
      )
    }
  }

  return(
    <View style = {styles.maincontainer}>
      <View style = {styles.tabcontainer}>
        <View style={styles.pbnb}>
          <Text style={{fontSize: 16}}>
            {props.pbnbData}
          </Text>
        </View>
        <View>
          <Text style={{fontSize: 16}}>
          {props.TeamLabel}
          </Text>
        </View>
        <TouchableOpacity style={{marginLeft:'auto',flexDirection: 'row', justifyContent:'flex-end', marginRight:20}}>
          <Image
            source={require('./assets/setting.png')}
            style={{width: 25, height: 25}}
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
          <Text>
            {targetDate.getFullYear() + '년 ' + (targetDate.getMonth()+1) + '월 ' + targetDate.getDate() + '일 ' + week[targetDate.getDay()] + '요일'}
          </Text>
        </View>
        <TouchableOpacity style={{margin: 5}}>
          <Image
            source={require('./assets/calendar.png')}
            style={{width: 25, height: 25}}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <TouchableOpacity style={{margin: 5}} onPress={nextDate}>
          <Image
              source={require('./assets/right_arrow.png')}
              style={{width: 25, height: 25}}
              resizeMode='contain'
          />
        </TouchableOpacity>
      </View>

      <View style={styles.eattingtab}>
        <TouchableOpacity style={styles.eattingtime_noclick} onPress={breakfast}>
          {breakfasttab()}
        </TouchableOpacity>
        <TouchableOpacity style={styles.eattingtime_noclick} onPress={lunch}>
          {lunchtab()}
        </TouchableOpacity>
        <TouchableOpacity style={styles.eattingtime_noclick} onPress={dinner}>
          {dinnertab()}
        </TouchableOpacity>
      </View>

      <View>
        {
          breakfastStatus ? breakfastscreen() : lunchStauts ? lunchscreen() : dinnerScreen()
        }
      </View>
      <TouchableOpacity
      onPress={props.ResetTeamData}
      >
        <Text>
          테스트용 - 팀 리셋
        </Text>
      </TouchableOpacity>
    </View>
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
    tabcontainer: {
      marginTop: 30,
      flexDirection: "row",
      // justifyContent:"space-between",
      alignItems: 'center',
      borderBottomColor: "#bdbdbd",
      borderBottomWidth: 1,
      width:'100%',
      // backgroundColor: "blue"
    },
    itemcontainer: {
      // backgroundColor: 'blue',
      margin: 20,
      flexDirection: "row",
      justifyContent:"space-between",
      alignItems: 'center',
    },
    pbnb: {
      backgroundColor:'#01a9f4',
      borderRadius:15,
      width: 60,
      height:30,
      paddingTop: 8,
      paddingEnd: 8,
      paddingRight: 12,
      paddingLeft: 18,
      margin: 20,
      // marginLeft: 20,
    },
    eattingtab: {
      // backgroundColor:"#bdbdbd",
      borderColor: 'black',
      borderWidth: 2, 
      width:'78%',
      height:'4%',
      borderRadius:5, 
      flexDirection: "row", 
      justifyContent:"space-between"
    },
    eattingtime_click: {
      width: '33%',
      backgroundColor: 'black',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    eattingtime_noclick: {
      width: '33%',
      // backgroundColor: 'black',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
})
