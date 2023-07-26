import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Switch, FlatList } from 'react-native';
import axios from 'axios';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';

const Notification = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [toggle, setToggle] = useState(false);
  const flatListRef = useRef(null);

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
      const response = await axios.get('https://surf.topsearchrealty.com/webapi/v1/notifications/?userID=' + id);
      const responseData = response.data;
      const nestedData = responseData.data[0];
      setData(nestedData);
    } catch (error) {
    }
  };

  const renderItem = ({ item, index }) => {
    if (isEnabled) {
      return null;
    }
    return (
      <View style={styles.slideOuter}>
        <View style={{ flexDirection: 'row', width: '95%', height: 50, alignItems: 'center', marginTop: 10 }}>
          <Image
            source={{ uri: item.featured_image_url }}
            style={{ height: 60, width: 70, resizeMode: 'cover', marginLeft: 10, borderRadius: 20 }}
          />
          <Text style={{ fontSize: 16, marginLeft: 5, color: Colors.textColorLight }}>{item.post_title}</Text>
          <Text style={{ fontSize: 12, color: Colors.textColorLight, position: 'absolute', top: -5, right: 8 }}>
            {item.post_date}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      {/* <View style={styles.viewStyle}>
        <Text style={{ fontSize: 20, color: Colors.black, fontFamily: 'Poppins-Regular' }}>Notifications</Text>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignSelf: 'center',

            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            overflow: 'visible',
            zIndex: 99,
            position: 'absolute',
            top: 10,
          }}>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              position: "absolute",
              right:-12,
              top: -6,

              backgroundColor: Colors.surfblur,
              height: 25,
              width: 25,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <Animatable.Image
              source={Images.whiteclose}
              style={{
                height: 10,
                width: 10,
                resizeMode: 'contain',
                tintColor: Colors.white,
              }}
              animation="flipInY"
            />
          </TouchableOpacity>
        </View>
      </View> */}
      <View
        style={{
          marginTop: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,
          marginBottom: 4
        }}>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium' }}>Notifications</Text>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignSelf: 'center',

            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            overflow: 'visible',
            zIndex: 99,
            position: 'absolute',
            top: 10,
          }}>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              position: "absolute",
              right: -12,
              top: -10,

              backgroundColor: Colors.surfblur,
              height: 25,
              width: 25,
              borderRadius: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.goBack()}
          >
            <Animatable.Image
              source={Images.whiteclose}
              style={{
                height: 10,
                width: 10,
                resizeMode: 'contain',
                tintColor: Colors.white,
              }}
              animation="flipInY"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          marginTop: 20,
          alignSelf: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 20, color: Colors.textColorLight, fontFamily: 'Poppins-Regular' }}>
          Allow Notification
        </Text>
        <View>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <View style={{ flex: 1, marginTop: 20 }}>
        <FlatList data={data} keyExtractor={(item, index) => index.toString()} renderItem={renderItem} />
      </View>
    </View>
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
    width: '95%',
    height: 70,
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,

  },
});

export default Notification;
