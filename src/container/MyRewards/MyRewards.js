import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
// import RNSpeedometer from 'react-native-speedometer';
import Images from '../../utils/Images';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../utils/Colors';
import * as Animatable from 'react-native-animatable';
import Slider from 'react-native-slider';
import Speedmeter from '../../components/speedmeter';
import LottieView from 'lottie-react-native';
import Fonts from '../../utils/Fonts';
import DeviceInfo from 'react-native-device-info';
const App = (props) => {
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

  useEffect(() => {

  }, [])

  return (
    <SafeAreaView style={{  backgroundColor: Colors.white, height:"100%" }}>
       {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          alignItems: 'center',
          paddingTop: 16,
          paddingBottom:2
        
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
              width:27,
              height: 27,
              resizeMode: 'contain',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              resizeMode:"contain",
              tintColor:"#8B8787"
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
              fontSize: 20,
              color: Colors.black,
              fontFamily: 'Poppins-Light',
              lineHeight: 22,
            }}>
       Surf Rewards
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
      </View> */}
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
           Surf Rewards
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
      <ScrollView style={{}}>


        <View style={{
          //height:screenHeight,
        }}>
          <View style={{ marginTop: 15, }}>
            <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: DeviceInfo.getDeviceType() === 'Tablet'?26:16, fontFamily: Fonts.light, color: "black", marginBottom: 0,
               width: '90%', textAlign: 'center' }}>Purchase Price
              </Text>
              <View style={{ flexDirection: 'row', width: '33.33%', justifyContent: 'center' }}>
                <Text style={{ fontSize: DeviceInfo.getDeviceType() === 'Tablet'?36:16, color: "#0165C5", fontFamily: 'Poppins-SemiBold' }}>${meterValue}</Text>

              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%' }}>
                <Text style={{ fontSize: DeviceInfo.getDeviceType() === 'Tablet'?22:14, fontFamily: Fonts.regular, color: "black", width: '33.33%', marginTop: 22 }}>$0</Text>

                <Text style={{ fontSize:  DeviceInfo.getDeviceType() === 'Tablet'?22:14, fontFamily: Fonts.regular, color: "black", width: '33.33%', textAlign: 'right', marginTop: 22 }}>$10MM</Text>
              </View>
              <Slider
                style={{ width: "90%", justifyContent: "center" }}
                minimumValue={1000}
                maximumValue={10000}
                minimumTrackTintColor={Colors.darbluec}
                maximumTrackTintColor={Colors.gray}
                thumbTintColor={Colors.white}

                value={meterValue}
                onValueChange={value => setMeterValue(value)}
                step={500}
                thumbStyle={{
                  width: 32,
                  height: 32,
                  borderRadius: 100,
                  borderWidth: 2, // Set the desired border width
                  borderColor: Colors.darbluec, // Set the desired border color
                }}
                trackStyle={{
                  height: 10, // Set the desired height of the track
                  borderRadius: 100
                }}
              />
            </View>

          </View>
          <Text style={{ fontSize:  DeviceInfo.getDeviceType() === 'Tablet'?32:16, fontFamily: Fonts.light, textAlign: 'center', color: "black", paddingTop: 10 }}>Your Rebate </Text>
          <View style={{
            position: "relative",
            // height: "50%",
          }}>

            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', paddingTop:0 }}>
              <Text style={{ fontSize: DeviceInfo.getDeviceType() === 'Tablet'?123:60, fontFamily: Fonts.extrabold, color: "black", }}>$</Text>
              <Text style={{ fontSize: DeviceInfo.getDeviceType() === 'Tablet'?123:60, fontFamily: Fonts.extrabold, color: "black", }}>{Math.round(meterValue * 0.003)}</Text>

            </View>
          </View>
<View style={{alignItems:"center"}}>
          <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between',
           //paddingTop: 80,
           width:"90%" }}>

            <TouchableOpacity
              onPress={() => { handlePress, navigation.navigate('Challenges') }}
              style={[
                styles.rew,
                {
                  backgroundColor: isRewardsSelected ? 'transparent' : 'transparent',
                  borderColor: isRewardsSelected ? Colors.surfblur : Colors.surfblur,
                },
              ]}
            >
              <Text style={[styles.text, { color: isRewardsSelected ? Colors.surfblur : Colors.surfblur, 
                fontFamily: 'Poppins-Regular', fontSize: DeviceInfo.getDeviceType() === 'Tablet'?18:14 }]}>Challenges</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { handlePress, navigation.navigate('Leaderboard') }}
              style={[
                styles.rew,
                {
                  backgroundColor: isRewardsSelected ? 'trasnparent' : 'transparent',
                  borderColor: isRewardsSelected ? Colors.surfblur : Colors.surfblur,
                },
              ]}
            >
              <Text style={[styles.text, { color: isRewardsSelected ? Colors.surfblur : Colors.surfblur, 
                fontFamily: 'Poppins-Regular', fontSize:  DeviceInfo.getDeviceType() === 'Tablet'?18:14  }]}>Leaderboard</Text>
            </TouchableOpacity>

         
          </View>
          </View>
         

             
                  
        </View>
        
      </ScrollView>
      <View style={{position:"relative",alignItems:"flex-end",
     // position:"absolute",bottom:0,
      width:"100%"}}>
          <View style={{width:"100%",}}>
                    <View   style={{
             
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
         
            }}>  
                <LottieView  style={{ height: 150, width: 150, }} source={require('../../assets/animations/RewardsBubbleGumGirl.json')} autoPlay loop />
     
            
            </View>
                  </View>
                  </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
   height:"100%",
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
    height:  DeviceInfo.getDeviceType() === 'Tablet'?55:45,
    width:  DeviceInfo.getDeviceType() === 'Tablet'?160:130 ,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 18,
    // marginRight: '10%',
    backgroundColor: Colors.surfblur,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8
  },
  imagedata: {
    height:19,
    width: 29,
    resizeMode: 'contain',
    tintColor: Colors.black,
    // transform: [{ rotate: '90deg' }],
  },
});
