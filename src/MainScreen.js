import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {StyleSheet,View, Text, Image, TouchableOpacity, DatePickerIOSComponent} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import DropDownPicker from 'react-native-dropdown-picker';

export const MainScreen = (props) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null);

  const [breakfastStatus, setBreakfastStatus] = useState(false);
  const [lunchStauts, setLunchStatus] = useState(false);
  const [dinnerStatus, setDinnerStatus] = useState(false);

  const week = ['일','월','화','수','목','금','토'];
  const [targetDate, setTargetDate] = useState(new Date());

  //backSheet
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
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
  const TeamStateChange = () => {
    if(value !== null)
    {
      props.onSetTeam(value);
      handleClosePress();
    }
  }

  useEffect(() => {
    var hours = targetDate.getHours();
    
    if (hours < 8){
      setBreakfastStatus(true);
    }
    else if (hours < 13){
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
      <View style = {styles.container_topbar}>
        <View style={styles.pbnb}>
          <Text 
          style={{fontSize: 16, textAlign: 'center'}}
          >
            {props.pbnbData}
          </Text>
        </View>
        <View
        style ={{marginLeft: 30,}}
        >
          <Text style={{fontSize: 17}}>
          {props.TeamLabel}
          </Text>
        </View>
        <TouchableOpacity 
        style={{marginLeft:'auto',flexDirection: 'row', justifyContent:'flex-end', marginRight:20}}
        onPress={handlePresentModalPress}
        >
          <Image
            source={require('./assets/setting.png')}
            style={{width: 23, height: 23}}
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
        <TouchableOpacity 
        style={{margin: 5}} 
        onPress={nextDate}>
          <Image
              source={require('./assets/right_arrow.png')}
              style={{width: 25, height: 25}}
              resizeMode='contain'
          />
        </TouchableOpacity>
      </View>
      <View style={styles.eattingtab}>
        <TouchableOpacity 
        style={[breakfastStatus === true ? styles.eattingtime_click : styles.eattingtime_noclick]} 
        onPress={breakfast}>
          <View>
            <Text>
              조식
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
        style={[lunchStauts === true ? styles.eattingtime_click : styles.eattingtime_noclick]} 
        onPress={lunch}>
          <View>
            <Text>
              중식
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
        style={[dinnerStatus === true ? styles.eattingtime_click : styles.eattingtime_noclick]} 
        onPress={dinner}>
          <View>
            <Text>
              석식
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View>
        {
          breakfastStatus ? breakfastscreen() : lunchStauts ? lunchscreen() : dinnerScreen()
        }
      </View>
      <BottomSheetModalProvider>
        <View style={{flex:1, justifyContent: 'center'}}>
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}
          >
            <View style={{flex:1, alignItems: 'center', marginTop: 10, justifyContent: 'flex-start'}}>
              <View>
                <Text>팀을 변경하고 싶으세요??</Text>
              </View>
              <View style ={{marginTop: 20, width: 300}}>
                <DropDownPicker
                placeholder="팀을 선택해주세요"
                open={open}
                value={value}
                items={props.Teamitems}
                setOpen={setOpen}
                setValue={setValue}
                setItems={props.setTeamitems}
                maxHeight={100}
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
    container_topbar: {
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'flex-start',
      borderBottomColor: "#bdbdbd",
      borderBottomWidth: 1,
      width:'100%',
      height: 60,
    },
    itemcontainer: {
      // backgroundColor: 'blue',
      margin: 15,
      flexDirection: "row",
      justifyContent:"space-between",
      alignItems: 'center',
    },
    pbnb: {
      backgroundColor:'#01a9f4',
      borderRadius:15,
      width: 50,
      height:30,
      justifyContent: 'center',
      marginLeft: 20,
    },
    eattingtab: {
      backgroundColor: '#EAE8E8',
      height: 30,
      borderRadius:15, 
      marginLeft: 30,
      marginRight: 40,
      flexDirection: "row", 
      justifyContent:"space-between"
    },
    eattingtime_click: {
      width: '33%',
      margin: 5,
      borderRadius:5,
      backgroundColor: 'white',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    eattingtime_noclick: {
      width: '33%',
      margin: 4,
      borderRadius:5,
      backgroundColor: '#EAE8E8',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    confirm: {
      
      justifyContent: 'flex-start',
      alignItems: 'center',

      marginTop: 130,
      marginLeft: 30,
      marginRight: 30,
      paddingTop: 15,
      paddingBottom: 15,
      borderRadius: 25,
      backgroundColor: 'black',
  }
})
