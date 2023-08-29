import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { getLeaderboard } from '../../modules/getLeaderboard';
import { store } from '../../redux/store';
import { getProfile } from '../../modules/getProfile';
import DeviceInfo from 'react-native-device-info';
const Leaderboard = () => {
  const [leaderboarddata, setleaderboarddata] = useState([]);
  const [getProfileData, setgetProfileData] = useState([]);

  useEffect(() => {
    getLeaderboardApicall();
    getProfileApiCall();
  }, []);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getProfileApiCall = () => {
    dispatch(getProfile()).then((response) => {
      setgetProfileData(response.payload.data);
    });
  };

  const getLeaderboardApicall = () => {
    dispatch(getLeaderboard()).then((response) => {
      setleaderboarddata(response.payload.data);
    });
  };

  const sortedLeaderboard = leaderboarddata && [...leaderboarddata].sort((a, b) => b.points - a.points);

  const createAbbreviation = (username) => {
    const names = username.split(' ');
    if (names.length >= 2) {
      const firstNameInitial = names[0][0];
      const lastNameInitial = names[names.length - 1][0];
      return `${firstNameInitial} ${lastNameInitial}`.toUpperCase();
    } else {
      return username.toUpperCase();
    }
  };

  const top5Leaderboard = leaderboarddata.length > 0 ? [...leaderboarddata].sort((a, b) => b.points - a.points).slice(0, 5) : [];

  return (
    <SafeAreaView style={{ backgroundColor: Colors.darbluec }}>
        <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          alignItems: 'center',
          paddingTop: 16,
          paddingBottom: 2,
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
height:50

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
              tintColor: Colors.white
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
              color: Colors.white,
              fontFamily: 'Poppins-Light',
              lineHeight: DeviceInfo.getDeviceType() === 'Tablet'?42:22,
            }}>
         Leader Board
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

        {/* <TouchableOpacity
              onPress={() => {
              
              }}
              activeOpacity={0.5}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.surfblur,
                borderRadius: 50,
                position:"absolute",
                right:10,
                top:5
              }}>
             
            
                <View
                  style={{
                    height:35,
                    width: 35,
                    borderRadius: 20,
                    backgroundColor: Colors.surfblur,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}>
               
                    <Image
                      style={{ height: 40, width: 40 }}
                      source={Images.user}
                    />
            
                </View>
            
         
            </TouchableOpacity> */}

      </View>
      <View style={{ paddingTop:70, backgroundColor: Colors.darbluec, height: '100%', width: '100%', alignItems: 'flex-start' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Image
            source={Images.searcfrank}
            style={{ justifyContent: 'center', alignItems: 'center', height: 50, width: '90%', marginTop: 2, resizeMode: 'contain', marginHorizontal: 6 }}
          />
        </View>
        <View style={{ width: '100%', marginTop: 12 }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, marginHorizontal: 14, alignItems: 'flex-start' }}>
            <Text style={{ flex: 1, flexGrow: 1, flexShrink: 0, flexBasis: '33.33%', fontSize: DeviceInfo.getDeviceType() === 'Tablet'?32:16, color: Colors.white, fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
              Rank
            </Text>
            <Text style={{ flex: 1, flexGrow: 1, flexShrink: 0, flexBasis: '33.33%', fontSize: DeviceInfo.getDeviceType() === 'Tablet'?32:16, color: Colors.white, fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
              Score
            </Text>
            <Text style={{ flex: 1, flexGrow: 1, flexShrink: 0, flexBasis: '33.33%', fontSize: DeviceInfo.getDeviceType() === 'Tablet'?32:16, color: Colors.white, fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
              Surfer
            </Text>
          </View>
          {top5Leaderboard.map((user, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                marginBottom: 20,
                marginHorizontal: 14,
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  flex: 1,
                  flexGrow: 1,
                  flexShrink: 0,
                  flexBasis: '33.33%',
                  fontSize:DeviceInfo.getDeviceType() === 'Tablet'?32:16,
                  color: user.username === getProfileData[0]?.username ? '#2fff05' : Colors.white,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                }}>
                {index + 1}
              </Text>
              <Text
                style={{
                  flex: 1,
                  flexGrow: 1,
                  flexShrink: 0,
                  flexBasis: '33.33%',
                  fontSize: DeviceInfo.getDeviceType() === 'Tablet'?32:16,
                  color: user.username === getProfileData[0]?.username ? '#2fff05' : Colors.white,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                }}>
                {user.points}
              </Text>
              <Text
                style={{
                  flex: 1,
                  flexGrow: 1,
                  flexShrink: 0,
                  flexBasis: '33.33%',
                  fontSize: DeviceInfo.getDeviceType() === 'Tablet'?32:16,
                  color: user.username === getProfileData[0]?.username ? '#2fff05' : Colors.white,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                }}>
                {createAbbreviation(user.username)}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'flex-end', width: '100%', height: '30%' }}>
          <Text style={{ fontSize: DeviceInfo.getDeviceType() === 'Tablet'?29:16, color: Colors.white, textAlign: 'center', fontFamily: 'Poppins-SemiBold', textAlign: 'center', width: '100%' }}>
            We think home buying should be fun!
          </Text>
          <Text style={{ fontSize: DeviceInfo.getDeviceType() === 'Tablet'?29:16, color: Colors.white, textAlign: 'center', fontFamily: 'Poppins-SemiBold', textAlign: 'center', width: '100%' }}>
            Here is where you rank.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
tintColor:Colors.white,
    resizeMode: 'contain',
   
  },
});
export default Leaderboard;
