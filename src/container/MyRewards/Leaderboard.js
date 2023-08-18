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
    <SafeAreaView>
      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,
          backgroundColor: Colors.darbluec,
          paddingTop: 12,
          paddingBottom: 12,
        }}>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium', color: Colors.white }}>
          LeaderBorad
        </Text>
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
            top: 15,
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              position: 'absolute',
              right: -12,
              top: -10,
              backgroundColor: Colors.surfblur,
              height: 25,
              width: 25,
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.goBack()}>
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
          paddingTop: 9,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: "center",
          width: '100%',
          marginLeft: 0,
          backgroundColor: Colors.darbluec
        }}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", position: "absolute", left: 8, justifyContent: "center", top: 14 }} onPress={() => { navigation.goBack() }}>
          <Image
            style={{
              width: 11,
              height: 11,
              resizeMode: "contain",
              // position: "absolute",
              // left: 0,
              marginTop: -1,
              tintColor: Colors.white,
              transform: [{ rotate: '90deg' }]
            }}
            source={Images.downArrow}
          ></Image>
          <Text style={{
            fontSize: 14,
            color: Colors.white,
            fontFamily: 'Poppins-Regular', marginLeft: 5
          }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, color: Colors.white, fontFamily: 'Poppins-Medium', textAlign: "center" }}>Leader Board</Text>
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
          
          }}
          >
       
        </TouchableOpacity>
      </View>
      <View style={{ paddingTop: 12, backgroundColor: Colors.darbluec, height: '100%', width: '100%', alignItems: 'flex-start' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Image
            source={Images.searcfrank}
            style={{ justifyContent: 'center', alignItems: 'center', height: 50, width: '90%', marginTop: 2, resizeMode: 'contain', marginHorizontal: 6 }}
          />
        </View>
        <View style={{ width: '100%', marginTop: 12 }}>
          <View style={{ flexDirection: 'row', marginBottom: 20, marginHorizontal: 14, alignItems: 'flex-start' }}>
            <Text style={{ flex: 1, flexGrow: 1, flexShrink: 0, flexBasis: '33.33%', fontSize: 16, color: Colors.white, fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
              Rank
            </Text>
            <Text style={{ flex: 1, flexGrow: 1, flexShrink: 0, flexBasis: '33.33%', fontSize: 16, color: Colors.white, fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
              Score
            </Text>
            <Text style={{ flex: 1, flexGrow: 1, flexShrink: 0, flexBasis: '33.33%', fontSize: 16, color: Colors.white, fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
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
                  fontSize: 16,
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
                  fontSize: 16,
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
                  fontSize: 16,
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
          <Text style={{ fontSize: 14, color: Colors.white, textAlign: 'center', fontFamily: 'Poppins-Regular', textAlign: 'center', width: '100%' }}>
            We think home buying should be fun!
          </Text>
          <Text style={{ fontSize: 14, color: Colors.white, textAlign: 'center', fontFamily: 'Poppins-Regular', textAlign: 'center', width: '100%' }}>
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
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
    // transform: [{ rotate: '90deg' }],
  },
});
export default Leaderboard;
