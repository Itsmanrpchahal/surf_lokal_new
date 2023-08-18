import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Switch, FlatList, SafeAreaView } from 'react-native';
import axios from 'axios';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';

const Notification = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [toggle, setToggle] = useState(false);
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
          style={{ height: 100, width: 90, resizeMode: 'contain', borderRadius: 4, marginRight: 8 }}
        />
        <View style={{ flex: 1, flexDirection: 'column', width: '100%', alignItems: 'flex-start', paddingVertical: 8 }}>


          <Text style={{ marginRight: 8, width: "100%", fontSize: 14, color: Colors.black, fontFamily: "Poppins-Medium", }}>{item.post_title}</Text>
          <Text numberOfLines={2} style={{ width: "100%", fontSize: 13, color: Colors.textColorLight, fontFamily: "Poppins-Regular", }}>
            {item.post_content}
          </Text>

          <Text style={{ width: "100%", fontSize: 11, color: Colors.textColorLight, fontFamily: "Poppins-Light", alignItems: "flex-end", justifyContent: "flex-end", textAlign: "right", marginTop: 2 }}>
            {item.post_date}
          </Text>
        </View>


      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View
          style={{
            marginTop: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            marginLeft: 0,
            marginBottom: 0,
            height: 45,
            alignItems: "center",
            backgroundColor: Colors.white, borderBottomColor: Colors.BorderColor, borderBottomWidth: 1

          }}>
          <TouchableOpacity style={{ top: 12, flexDirection: "row", alignItems: "center", position: "absolute", left: 8, justifyContent: "center" }} onPress={() => { navigation.goBack() }}>
            <Image
              style={{
                width: 11,
                height: 11,
                resizeMode: "contain",
                // position: "absolute",
                // left: 0,
                marginTop: -1,
                transform: [{ rotate: '90deg' }]
              }}
              source={Images.downArrow}
            ></Image>
            <Text style={{
              fontSize: 14,
              color: Colors.black,
              fontFamily: 'Poppins-Regular', marginLeft: 5
            }}>Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium' }}>Notifications</Text>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              position: "absolute",
              right: 10,
              top: 2,

              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40,
              width: 40,
              borderRadius: 100,
              backgroundColor: Colors.gray,
            }}
            onPress={() => navigation.goBack()}  >
            <Animatable.Image
              source={Images.whiteclose}
              style={styles.imagedata}
              animation="flipInY"
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 10,
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginHorizontal: 12
          }}
        >
          <Text style={{ fontSize: 16, color: Colors.black, fontFamily: 'Poppins-Medium', marginLeft: 12 }}>
            You Have <Text style={{ color: "red", fontFamily: 'Poppins-SemiBold', }}>2</Text> New Notifications
          </Text>
          <View style={{ marginTop: -4 }}>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
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
    height: 110,
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
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
    // transform: [{ rotate: '90deg' }],
  },
});

export default Notification;
