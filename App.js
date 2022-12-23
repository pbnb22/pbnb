import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import axios from 'axios'; // axios 라이브러리를 가져옵니다



const mealList = await axios.get('https://asia-northeast1-pbnb-2f164.cloudfunctions.net/menu_for_beme?date=20221219'
  );

const App = () => {
  const getContent = () => {
    const result = mealList.map( //map을 활용해서 배열 내 모든 원소에 접근해요
      (value,index) => { //input은 value와 index에요
        return(
          <View style={styles.container}>
            <Text>{value.date}</Text>
            <Text>{'아침 : ' + value.breakfast.korean[0]}</Text>
            <Text>{'점심 : ' + value.lunch.korean[0]}</Text>
            <Text>{'저녁 : ' + value.dinner.korean[0]}</Text>
          </View>
        );
      }
    )
    return result
  }

  return(
    <View style={styles.container}>
			{/* getContent 함수를 호출해요 */}
      {getContent()}
    </View>
  )

};
export default App;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    margin: 10,
  }
})