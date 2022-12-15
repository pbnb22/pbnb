import React, { useState } from "react";
import {StyleSheet,View, Text, Image, TouchableOpacity, ProgressViewIOSComponent} from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

export const SignInScreen = (props) => {

    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
      {label: '연료전지제어개발1팀', value: 'FCCD'},
      {label: '연료전지제어개발2팀', value: 'FCCF'},
    ]);


    const onSetTeam = async () => {
        props.onSetTeam(value);
    }

    return(
        <View style = {styles.container}>
            <View style = {styles.logo_container}>
                <View style = {{marginTop : 50}}>
                    <Image source={require('./assets/pbnb_logo.png')} style={styles.image_logo}/>
                </View>
                <View >
                    <Text style ={{textAlign:'center', fontSize : 25, color: 'black', marginTop: 5}}> 
                        빠밥늦밥
                    </Text>
                </View>
            </View>

            <View style = {styles.select_container}>
                <View style = {{marginTop : 10}}>
                    <Text style ={{textAlign:'center'}}>
                        어느 팀 소속이세요? {"\n"} 오늘 밥 먹는 순서를 알려드릴게요.
                    </Text>
                </View>
                <View style={{marginTop : 25, marginBottom: 110 , width: 250}}>
                    <DropDownPicker
                    placeholder="팀을 선택해주세요"
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    maxHeight={100}
                    />
                </View>
                <TouchableOpacity 
                onPress={onSetTeam}
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
        width: 75,
        height: 75,
        resizeMode: 'contain',
    },

    confirm: {
      
        justifyContent: 'flex-start',
        alignItems: 'center',

        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 100,
        paddingRight: 100,
        borderRadius: 25,
        backgroundColor: 'black',
    }

})