import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';

import { SafeAreaView } from 'react-native-safe-area-context';
// import Orientation from 'react-native-orientation-locker';
import Styles from './Styles';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { chatGpt } from '../../modules/chatGpt';
import { ScrollView } from 'react-native-gesture-handler';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const images = [
  {
    image: Images.favroites,
    title: '123 main St. | Boynton Beach',
    navigation:
      'Which apartment, could you send me the link plaese the one you said',
    time: '8:12 am',
  },
  {
    image: Images.favroites,
    title: '321  St. | Boynton Beach',
    navigation:
      'Which apartment, could you send me the link plaese the one you said',
    time: 'Apr 13',
  },
  {
    image: Images.favroites,
    title: '100 Ocean St. | Boynton Beach',
    navigation:
      'Which apartment, could you send me the link plaese the one you said',
    time: 'Apr 12',
  },
];

const Conversations = () => {
  const dispatch = useDispatch();
  const [data, setdata] = useState([]);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    chatGptApi();
  }, []);

  const chatGptApi = () => {
    dispatch(chatGpt()).then(response => {
     const data = response.payload.data
     const dat = data.map(obj => obj.answer)

     setdata(dat)
    });
  }

  const renderItem = ({ item, index }) => (
    <View style={styles.slideOuter}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ChatSearch',{item})}
        style={{
          width: '99%',
          alignItems: 'center',
          height: 70,
          borderColor: Colors.BorderColor,
          borderWidth: 1,
          borderLeftWidth: index == 0 ? 4 : null,
          borderLeftColor: index == 0 ? Colors.PrimaryColor : null,
          justifyContent: 'center',
          backgroundColor: index == 0 ? '#f5f9fc' : null,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
            height: 40,
            alignItems: 'center',
          }}>
          <Image
            source={Images.chat}
            style={{
              height: 20,
              width: 20,
              resizeMode: 'contain',
              tintColor: Colors.PrimaryColor,
            }}></Image>

          <Text
            style={{
              fontSize: 16,
              marginLeft: 5,
              color: Colors.textColorLight,
            }}>
            {item.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.textColorLight,
              position: 'absolute',
              top: 0,
              right: 8,
            }}>
            {item.time}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '95%',
          }}>
          <Text
            style={{
              fontSize: 10,
              color: Colors.textColorLight,
            }}>
            {item.navigation}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{flex:1}}>
      <View
        style={{
          width: '80%',
          height: 60,
          justifyContent: 'center',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 20, color: Colors.black }}>Conversations</Text>
      </View>
      <View style={{ flex:1,marginTop: 20, height: '100%' }}>
        <FlatList
          data={images}
          keyExtractor={item => item.id}
          renderItem={renderItem}
        />
        <Text style={{fontSize:14}}>{data}</Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors,
    borderRadius: 18,
  },
  slide: {
    width: screenWidth - 40,
    height: screenHeight / 3,
    borderRadius: 18,
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'contain',
    flexDirection: 'row',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: 'blue',
  },
  //fliter
  filter: {
    height: 60,
  },
});

export default Conversations;
