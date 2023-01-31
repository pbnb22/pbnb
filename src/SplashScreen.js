import React from "react";
import {StyleSheet,View, Text, Image} from 'react-native';

export const SplashScreen = () => {
    return(
        <View style = {styles.container}>
            <View>
                <Image source={require('./assets/pbnb_logo.png')} style={styles.image_logo}/>
            </View>
            {/* <View style={{margin :15}}>
                <Text style={styles.text_logo}>
                    빠밥늦밥
                </Text>
            </View> */}
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
        backgroundColor: '#f6f3f2'
    },

    image_logo: {
        width: 170,
        height: 170,
        resizeMode: 'contain',
    },

    text_logo: {
        color: '#212614',
        fontSize: 25,
        textAlign: 'center',
        fontFamily: 'BMDoHyeon',
        
    }
})