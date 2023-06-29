import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  Image,
  Switch,
  FlatList

} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';

import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

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
const Notification = () => {
  const navigation = useNavigation();
  const [data, setdata] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [toggle, setToggle] = useState(false);
  const flatListRef = useRef(null);

  const toggleSwitch = () => {setIsEnabled(previousState => !previousState);
    setToggle(!isEnabled);}
    console.log(toggle)
  
    const renderItem = ({ item, index }) => (
      <View style={styles.slideOuter}>
        {/* <TouchableOpacity
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
          }}> */}
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
        {/* </TouchableOpacity> */}
      </View>
    );

  
  return (
   <>
   <ScrollView>
   <View
        style={styles.viewStyle}>
        <Text style={{ fontSize: 20, color: Colors.black,fontFamily:'Poppins-Regular' }}>Notification</Text>
        <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
            alignItems:'center',
      
            justifyContent:'center',
              height: 30,
              width: 30,
              borderRadius: 15,
              backgroundColor: Colors.gray,
            }}>
            <Image
              source={Images.close}
              style={{
                height: 15,
                width: 15,
                resizeMode: 'contain',
                tintColor: Colors.black,
                transform: [{rotate: '90deg'}],
              }}></Image>
          </TouchableOpacity>
          
      </View>
      <View
          style={{
            flexDirection: 'row',
            width: '90%',
            marginTop: 20,
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.textColorLight,
              fontFamily:'Poppins-Regular'
            }}>
            Allow Notfication
          </Text>
          <View>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
         
          </View>
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
   </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  error: {
    color: 'red',
    paddingHorizontal: 22,
    marginTop: 2,
    fontSize: 12
  },
  inputStyle:{
    flexDirection: 'row',
    width: '90%',
    marginTop: 20,
    height: 40,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.BorderColor,
  },
  btn:{
    height: 30,
    borderRadius: 8,
    width: 100,
    marginTop: 10,
    marginRight: '10%',
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  slideOuter: {
    // width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors,
    borderRadius: 18,
  },
  viewStyle:{
    flexDirection:'row',
    width: '90%',
    height: 60,
    justifyContent: 'space-around',
    alignSelf: 'center',
    alignItems: 'center',
  marginLeft:50
},
  view:{
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    alignItems: 'center',

    justifyContent: 'center',
  },
  slide: {
    // width: screenWidth - 40,
    // height: screenHeight / 3,
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

export default Notification