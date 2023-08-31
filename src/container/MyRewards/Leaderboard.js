import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import {useSelector, useDispatch} from 'react-redux';

import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {getLeaderboard} from '../../modules/getLeaderboard';
import {store} from '../../redux/store';
import {getProfile} from '../../modules/getProfile';
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
    dispatch(getProfile()).then(response => {
      setgetProfileData(response.payload.data);
    });
  };

  const getLeaderboardApicall = () => {
    dispatch(getLeaderboard()).then(response => {
      setleaderboarddata(response.payload.data);
    });
  };

  const sortedLeaderboard =
    leaderboarddata && [...leaderboarddata].sort((a, b) => b.points - a.points);

  const createAbbreviation = username => {
    const names = username.split(' ');
    if (names.length >= 2) {
      const firstNameInitial = names[0][0];
      const lastNameInitial = names[names.length - 1][0];
      return `${firstNameInitial} ${lastNameInitial}`.toUpperCase();
    } else {
      return username.toUpperCase();
    }
  };

  const top5Leaderboard =
    leaderboarddata.length > 0
      ? [...leaderboarddata].sort((a, b) => b.points - a.points).slice(0, 5)
      : [];

  return (
    <SafeAreaView style={{backgroundColor: Colors.darbluec}}>
      <View style={styles.headermain}>
        <TouchableOpacity
          style={styles.leftcover}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image style={styles.innerarrow} source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.centertext}>
          <Text style={styles.centermaintext}>Leader Board</Text>
        </View>
        <TouchableOpacity
          style={styles.rightmenu}
          onPress={() => navigation.goBack()}>
          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.screencover}>
        <View style={styles.surfcover}>
          <Image source={Images.searcfrank} style={styles.surfimage} />
        </View>
        <View style={styles.cover}>
          <View style={styles.topmain}>
            <Text style={styles.maintopheading}>Rank</Text>
            <Text style={styles.maintopheading}>Score</Text>
            <Text style={styles.maintopheading}>Surfer</Text>
          </View>
          {top5Leaderboard.map((user, index) => (
            <View key={index} style={styles.resultcover}>
              <Text
                style={{
                  flex: 1,
                  flexGrow: 1,
                  flexShrink: 0,
                  flexBasis: '33.33%',
                  fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
                  color:
                    user.username === getProfileData[0]?.username
                      ? '#2fff05'
                      : Colors.white,
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
                  fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
                  color:
                    user.username === getProfileData[0]?.username
                      ? '#2fff05'
                      : Colors.white,
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
                  fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
                  color:
                    user.username === getProfileData[0]?.username
                      ? '#2fff05'
                      : Colors.white,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                }}>
                {createAbbreviation(user.username)}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.bottomtext}>
          <Text style={styles.firstbottomtext}>
            We think home buying should be fun!
          </Text>
          <Text style={styles.bottombottext}>Here is where you rank.</Text>
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
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,
    tintColor: Colors.white,
    resizeMode: 'contain',
  },
  headermain: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
  },
  leftcover: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  innerarrow: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  centertext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightmenu: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  centermaintext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.white,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  maintopheading: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: '33.33%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  topmain: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 14,
    alignItems: 'flex-start',
  },
  cover: {width: '100%', marginTop: 12},
  surfimage: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: '90%',
    marginTop: 2,
    resizeMode: 'contain',
    marginHorizontal: 6,
  },
  surfcover: {justifyContent: 'center', alignItems: 'center', width: '100%'},
  screencover: {
    paddingTop: 70,
    backgroundColor: Colors.darbluec,
    height: '100%',
    width: '100%',
    alignItems: 'flex-start',
  },
  bottomtext: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '100%',
    height: '30%',
  },
  firstbottomtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 16,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    width: '100%',
  },
  bottombottext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 16,
    color: Colors.white,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    width: '100%',
  },
  resultcover: {
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 14,
    alignItems: 'flex-start',
  },
});
export default Leaderboard;
