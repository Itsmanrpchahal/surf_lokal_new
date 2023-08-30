import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Switch, FlatList, SafeAreaView } from 'react-native';
import axios from 'axios';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import Loader from '../../components/Loader';
const Notification = () => {
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  const datan = [
    {
      name: 'Jessica Kent',
      description: 'Called about 221 Main St.',
      date: '07/21/2023'
    },
    {
      name: 'Jessica Kent',
      description: 'Called about 221 Main St.',
      date: '07/21/2023'
    },
  ];

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    setToggle(!isEnabled);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const id = await AsyncStorage.getItem('userId');
    try {
      const response = await axios.get('https://www.surflokal.com/webapi/v1/notifications/?userID=' + id);
      const responseData = response.data;
      const nestedData = responseData.data[0];
      setData(nestedData);

    } catch (error) {
    }
  };

  const renderItem = ({ item, index }) => {
    if (!isEnabled) {
      return null;
    }
    return (
      <View style={styles.slideOuter}>
        <Image
          source={{ uri: item.featured_image_url }}
          style={{ height: DeviceInfo.getDeviceType() === 'Tablet'?100:100, width: DeviceInfo.getDeviceType() === 'Tablet'?120:90, resizeMode: 'contain', borderRadius: 4, marginRight: 8 }}
        />
        <View style={{ flex: 1, flexDirection: 'column', width: '100%', alignItems: 'flex-start', paddingVertical: 8 }}>


          <Text numberOfLines={1} style={{ marginRight: 8, width: "100%", fontSize: DeviceInfo.getDeviceType() === 'Tablet'?20:14, 
          color: Colors.black, fontFamily: "Poppins-Medium", }}>{item.post_title}</Text>
          <Text numberOfLines={2} style={{ width: "100%", fontSize: DeviceInfo.getDeviceType() === 'Tablet'?18:13, color: Colors.textColorLight, fontFamily: "Poppins-Regular", }}>
            {item.post_content}
          </Text>

          <Text style={{ width: "100%", fontSize: DeviceInfo.getDeviceType() === 'Tablet'?14:11, color: Colors.textColorLight, fontFamily: "Poppins-Light", alignItems: "flex-end", justifyContent: "flex-end", textAlign: "right", marginTop: 0, position: "relative", top: DeviceInfo.getDeviceType() === 'Tablet'?0:6 }}>
            {item.post_date}
          </Text>
        </View>


      </View>
    );
  };

    return (
      <View style={{ flex: 1 }}>
      {
        loading ? <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.7)', position: 'absolute', zIndex: 99, left: 0, top: 0 }
        }>
          <Loader />
        </View > : null
      }
    <SafeAreaView style={{ flex: 1 }}>

        <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          alignItems: 'center',
          paddingTop: 16,
          paddingBottom: 2,
          marginBottom:12
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            position: 'absolute',
            left: 12,
            justifyContent: 'flex-start',
            // top: 12,
            top: 13,
           // backgroundColor:"green",
width:50,
height:50,
marginBottom:20

          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              width: DeviceInfo.getDeviceType() === 'Tablet'?40:27,
              height: DeviceInfo.getDeviceType() === 'Tablet'?40:27,
              resizeMode: 'contain',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              resizeMode: 'contain',
            }}
            source={Images.leftnewarrow}></Image>
     
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
              color: Colors.black,
              fontFamily: 'Poppins-Light',
              lineHeight: DeviceInfo.getDeviceType() === 'Tablet'?42:22,
            }}>
        Notifications
          </Text>
     
        </View>
        <TouchableOpacity

          style={{
            position:"absolute",
    right:10,
    top:15
          }}

          onPress={() => navigation.goBack()}>

          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>


      </View>
      <View style={styles.container}>


        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 0,
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 12
          }}
        >
          <Text style={{ fontSize: DeviceInfo.getDeviceType() === 'Tablet'?32:16, color: Colors.black, fontFamily: 'Poppins-Medium', marginLeft: 12 }}>
            You Have <Text style={{ color: "red", fontFamily: 'Poppins-SemiBold', }}>2</Text> New Notifications
          </Text>
          <View style={{ marginTop: DeviceInfo.getDeviceType() === 'Tablet'?10:-4}}>
            <Switch
              trackColor={{ false: '#767577', true: '#11b03e' }}
              thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 10 }}>
          <FlatList data={data} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
        </View>



      </View>
    </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 5
  },
  viewStyle: {
    //  flexDirection: 'row',
    //  height: 50,
    //  width: '100%',
    //  justifyContent: 'space-between',
    //   alignItems: 'center',
    //  paddingHorizontal: 15,
    // backgroundColor: Colors.white,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginLeft: 0
  },
  slideOuter: {
    paddingVertical: 9,
    paddingHorizontal: 9,
    width: '95%',
    height: DeviceInfo.getDeviceType() === 'Tablet'?110:110,
    flex: 1,
    flexDirection: "row",
    alignSelf: 'center',
    alignItems: "center",
    borderRadius: 4,
    paddingLeft: 4,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,

  },
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  imagedata: {
    height:DeviceInfo.getDeviceType() === 'Tablet'?29:19,
    width: DeviceInfo.getDeviceType() === 'Tablet'?49:29,

    resizeMode: 'contain',
   
  },
});

export default Notification;
