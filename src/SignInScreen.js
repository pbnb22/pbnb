import React, { useState } from "react";
import {StyleSheet,View, Text, Image, TouchableOpacity, ProgressViewIOSComponent} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

export const SignInScreen = (props) => {

    const [open, setOpen] = useState(false)
    const [TimeTablevalue, setTimeTablevalue] = useState(null);

    return(
        <View style = {styles.container}>
            <View style = {styles.logo_container}>
                <View style = {{marginTop : 30}}>
                    <Image source={require('./assets/pbnb_logo.png')} style={styles.image_logo}/>
                </View>
                {/* <View style={{margin :15}}>
                    <Text style ={{textAlign:'center', fontSize : 25, color: 'black', marginTop: 5, fontFamily: 'BMDoHyeon'}}> 
                        빠밥늦밥
                    </Text>
                </View> */}
            </View>

            <View style = {styles.select_container}>
                <View style = {{marginTop : 20, marginBottom: 5}}>
                    <Text style ={{textAlign:'center', fontSize: 15}}>
                        오늘 식사 순서가 언제셨나요? 
                    </Text>
                    <Text style ={{textAlign:'center', fontSize: 15}}>
                        한번 설정하시면 앞으로는
                    </Text>
                    <Text style ={{textAlign:'center', fontSize: 15}}>
                        빠밥늦밥이 밥 먹는 순서를 알려드릴게요.
                    </Text>
                </View>
                <View style={{marginTop : 25, marginBottom: 110 , width: 250}}>
                    <DropDownPicker
                    placeholder="오늘 밥먹는 순서는 언제에요?"
                    open={open}
                    value={TimeTablevalue}
                    items={props.TimeTableitems}
                    setOpen={setOpen}
                    setValue={setTimeTablevalue}
                    setItems={props.TimeTableitems}
                    maxHeight={120}
                    />
                </View>
                <TouchableOpacity 
                onPress={()=>props.onChangeGrp(TimeTablevalue)}
                style ={styles.confirm}>
                    <Text style ={{color : 'white'}}>
                        확인
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#f6f3f2',
    },

    logo_container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex : 1,
    },
    select_container:{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',

        width: '100%',
        flex : 1,
    },

    image_logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },

    confirm: {
      
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: 250,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 100,
        paddingRight: 100,
        borderRadius: 8,
        backgroundColor: 'black',
        
    }

})