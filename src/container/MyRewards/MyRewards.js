import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Images from '../../utils/Images';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../utils/Colors';
import * as Animatable from 'react-native-animatable';
import Slider from 'react-native-slider';
import LottieView from 'lottie-react-native';
import Fonts from '../../utils/Fonts';
import DeviceInfo from 'react-native-device-info';
const App = props => {
  const navigation = useNavigation();
  const [meterValue, setMeterValue] = useState(500);
  const [backgroundColor, setBackgroundColor] = useState('blue');
  const [textColor, setTextColor] = useState('white');
  const [borderColor, setBorderColor] = useState('black');
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const [isRewardsSelected, setIsRewardsSelected] = useState(false);

  const handlePress = () => {
    setIsRewardsSelected(!isRewardsSelected);
  };

  const getImageCall = () => {
    if (meterValue <= 500) {
      return Images.grommet;
    } else if (meterValue <= 1500) {
      return Images.longBoarder;
    } else if (meterValue <= 3000) {
      return Images.fastGun;
    } else if (meterValue >= 3001) {
      return Images.bigCahouna;
    }
  };
  const getLevelCall = () => {
    if (meterValue <= 500) {
      return 'Grommet';
    } else if (meterValue <= 1500) {
      return 'Long Boarder';
    } else if (meterValue <= 3000) {
      return 'Fast Gun';
    } else if (meterValue >= 3001) {
      return 'The Big Cahouna';
    }
  };

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{backgroundColor: Colors.white, height: '100%'}}>
      <View style={styles.headercover}>
        <TouchableOpacity
          style={styles.headerleftside}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.headerleftimage}
            source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.centertext}>
          <Text style={styles.centermaintext}>Surf Rewards</Text>
        </View>
        <TouchableOpacity
          style={styles.rightsidemenu}
          onPress={() => navigation.goBack()}>
          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>
      <ScrollView style={{}}>
        <View style={{}}>
          <View style={styles.mt15}>
            <View style={styles.covermain}>
              <Text style={styles.purchasetext}>Purchase Price</Text>
              <View style={styles.purchasevalue}>
                <Text style={styles.metervaluetext}>${"500000"}</Text>
              </View>
              <View style={styles.slidercover}>
                <Text style={styles.zerotext}>$50,000</Text>

                <Text style={styles.endtext}> $10,000,000</Text>
              </View>
              <Slider
                style={styles.mainslider}
                minimumValue={1000}
                maximumValue={10000}
                minimumTrackTintColor={Colors.darbluec}
                maximumTrackTintColor={Colors.gray}
                thumbTintColor={Colors.white}
                value={meterValue}
                onValueChange={value => setMeterValue(value)}
                step={500}
                thumbStyle={styles.thummain}
                trackStyle={styles.trackmain}
              />
            </View>
          </View>
          <Text style={styles.rebatetext}>Your Rebate </Text>
          <View
            style={{
              position: 'relative', justifyContent:"center",alignItems:"center"
            }}>
             <View style={[styles.rebatevaluecover, {width:"50%",alignItems:"center", flexDirection:"row",justifyContent:"center"}]}>
              <Text style={[styles.valuereabtemain,]}>$<Text numberOfLines={1} style={[styles.valuereabtemain,]}>
              {(meterValue * 0.0032)}
                {/* {Math.round(meterValue * .0032)} */}
              </Text></Text>
              
            </View> 
          </View>
          <View style={{alignItems: 'center'}}>
            <View style={styles.buttonscover}>
              <TouchableOpacity
                onPress={() => {
                  handlePress, navigation.navigate('Challenges');
                }}
                style={[
                  styles.rew,
                  {
                    backgroundColor: isRewardsSelected
                      ? 'transparent'
                      : 'transparent',
                    borderColor: isRewardsSelected
                      ? Colors.surfblur
                      : Colors.surfblur,
                  },
                ]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: isRewardsSelected
                        ? Colors.surfblur
                        : Colors.surfblur,
                      fontFamily: 'Poppins-Regular',
                      fontSize:
                        DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
                    },
                  ]}>
                  Challenges
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handlePress, navigation.navigate('Leaderboard');
                }}
                style={[
                  styles.rew,
                  {
                    backgroundColor: isRewardsSelected
                      ? 'trasnparent'
                      : 'transparent',
                    borderColor: isRewardsSelected
                      ? Colors.surfblur
                      : Colors.surfblur,
                  },
                ]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: isRewardsSelected
                        ? Colors.surfblur
                        : Colors.surfblur,
                      fontFamily: 'Poppins-Regular',
                      fontSize:
                        DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
                    },
                  ]}>
                  Leaderboard
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomelement}>
        <View style={styles.w100}>
          <View style={styles.centerplacement}>
            <LottieView
              style={styles.girlbubble}
              source={
                require('../../assets/animations/RewardsBubbleGumGirl.json')}
              autoPlay
              loop
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: Colors.white,
  },
  textInput: {
    height: 25,
    fontSize: 16,
    marginTop: 30,
    borderBottomWidth: 0.3,
    borderBottomColor: 'black',
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

  rew: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 45,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 160 : 130,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 18,
    backgroundColor: Colors.surfblur,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,
    resizeMode: 'contain',
  },
  headercover: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 2,
  },
  headerleftside: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  headerleftimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  centertext: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centermaintext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  rightsidemenu: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  mt15: {marginTop: 15},
  covermain: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  purchasetext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 16,
    fontFamily: Fonts.light,
    color: 'black',
    marginBottom: 0,
    width: '90%',
    textAlign: 'center',
  },
  purchasevalue: {
    flexDirection: 'row',
    width: '33.33%',
    justifyContent: 'center',
  },
  metervaluetext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 16,
    color: '#0165C5',
    fontFamily: 'Poppins-SemiBold',
  },
  slidercover: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
  },
  zerotext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 14,
    fontFamily: Fonts.regular,
    color: 'black',
    width: '33.33%',
    marginTop: 22,
  },
  endtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 14,
    fontFamily: Fonts.regular,
    color: 'black',
    width: '33.33%',
    textAlign: 'right',
    marginTop: 22,
  },
  mainslider: {width: '90%', justifyContent: 'center'},
  thummain: {
    width: 32,
    height: 32,
    borderRadius: 100,
    borderWidth: 2, 
    borderColor: Colors.darbluec, 
    marginHorizontal: 2,
  },
  trackmain: {
    height: 10, 
    borderRadius: 100,
  },
  rebatetext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 32 : 16,
    fontFamily: Fonts.light,
    textAlign: 'center',
    color: 'black',
    paddingTop: 10,
  },
  rebatevaluecover: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingTop: 0,
     alignItems:"center",
     position:"relative",
     marginHorizontal:8
  },
  dollarstyle: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 123 : 60,
    fontFamily: Fonts.extrabold,
    color: 'black',
  },
  valuereabtemain: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 123 : 60,
    fontFamily: Fonts.extrabold,
    color: 'black',
    textAlign:"center",
      alignItems:"center",justifyContent:"center"
      ,
       width:"100%",
      height:100
  },
  buttonscover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: DeviceInfo.getDeviceType() === 'Tablet' ? '70%' : '90%',
  },
  bottomelement: {position: 'relative', alignItems: 'flex-end', width: '100%'},
  centerplacement: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  girlbubble: {height: 150, width: 150},
  w100: {width: '100%'},
});
