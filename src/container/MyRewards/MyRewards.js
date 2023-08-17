import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
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
import Fonts from '../../utils/Fonts';
const App = (props) => {
  const navigation = useNavigation();
  const [meterValue, setMeterValue] = useState(500);
  const [backgroundColor, setBackgroundColor] = useState('blue');
  const [textColor, setTextColor] = useState('white');
  const [borderColor, setBorderColor] = useState('black');

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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
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

        }}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", position: "absolute", left: 8, justifyContent: "center", top: 12 }} onPress={() => { navigation.goBack() }}>
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
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium' }}>Surf Rewards</Text>

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
      {/* <View
        style={{
          marginTop: 4,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          marginLeft: 0,

          // marginBottom: 4
        }}>
        <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Medium' }}>Surf Rewards</Text>
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
            onPress={() => { props?.route?.params?.from === 'menu' ? navigation.goBack() : navigation.navigate('Home') }}
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
      <View style={{ height: "90%", justifyContent: 'space-between', }}>
        <View style={{ marginTop: 30, }}>
          <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 18, fontFamily: Fonts.regular, color: "black", marginBottom: 5, width: '90%', textAlign: 'center' }}>Purchase Price
            </Text>
            <View style={{ flexDirection: 'row', width: '33.33%', justifyContent: 'center' }}>
              <Text style={{ fontSize: 20, color: Colors.surfblur, fontFamily: 'Poppins-Medium' }}>${meterValue}</Text>

            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%' }}>
              <Text style={{ fontSize: 14, fontFamily: Fonts.regular, color: "black", width: '33.33%', marginTop: 44 }}>$0</Text>

              <Text style={{ fontSize: 14, fontFamily: Fonts.regular, color: "black", width: '33.33%', textAlign: 'right', marginTop: 44 }}>$10MM</Text>
            </View>
            <Slider
              style={{ width: "90%", justifyContent: "center" }}
              minimumValue={1000}
              maximumValue={10000}
              minimumTrackTintColor={Colors.surfblur}
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
                borderColor: Colors.surfblur, // Set the desired border color
              }}
              trackStyle={{
                height: 10, // Set the desired height of the track
                borderRadius: 100
              }}
            />
          </View>

        </View>
        <View style={{ position: "relative", height: "50%", }}>
          <Text style={{ fontSize: 18, fontFamily: Fonts.regular, textAlign: 'center', color: "black", }}>Your Rebate </Text>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', paddingTop: 80 }}>
            <Text style={{ fontSize: 66, fontFamily: Fonts.bold, color: "black", }}>$</Text>
            <Text style={{ fontSize: 66, fontFamily: Fonts.bold, color: "black", }}>{Math.round(meterValue * 0.003)}</Text>

          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', }}>

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
            <Text style={[styles.text, { color: isRewardsSelected ? Colors.surfblur : Colors.surfblur, fontFamily: 'Poppins-Regular', fontSize: 14 }]}>Challenges</Text>
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
            <Text style={[styles.text, { color: isRewardsSelected ? Colors.surfblur : Colors.surfblur, fontFamily: 'Poppins-Regular', fontSize: 14 }]}>Leaderboard</Text>
          </TouchableOpacity>

        </View>

      </View>




    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  imagedata: {
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,
    // transform: [{ rotate: '90deg' }],
  },
  rew: {
    height: 45,
    width: 130,
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
});
