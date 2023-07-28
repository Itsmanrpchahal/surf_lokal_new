import React, { useState } from 'react';
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
const App = () => {
  const navigation = useNavigation();
  const [meterValue, setMeterValue] = useState(300000);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>

      <View
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
            onPress={() => navigation.navigate('Home')}
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
      <View style={{ height: "100%", }}>
        <View style={{ marginTop: 30 }}>
          <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 16, fontFamily: Fonts.regular, color: "black" }}>Purchase Price
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '90%' }}>
              <Text style={{ fontSize: 14, fontFamily: Fonts.regular, color: "black" }}>$0</Text>
              <Text style={{ fontSize: 22, fontFamily: Fonts.bold, color: "black" }}>  ${meterValue}</Text>
              <Text style={{ fontSize: 14, fontFamily: Fonts.regular, color: "black" }}>$10MM</Text>
            </View>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
            <Slider
              style={{ width: "90%", justifyContent: "center" }}
              minimumValue={100000}
              maximumValue={1000000}
              minimumTrackTintColor={Colors.darbluec}
              maximumTrackTintColor={Colors.gray}
              thumbTintColor={Colors.white}

              value={meterValue}
              onValueChange={value => setMeterValue(value)}
              step={2}
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
        <Text style={{ fontSize: 18, fontFamily: Fonts.regular, textAlign: 'center', color: "black", marginVertical: 0 }}>Your Rebate </Text>
        <Text style={{ fontSize: 25, fontFamily: Fonts.bold, textAlign: 'center', color: "black", marginVertical: 0 }}>$960.00</Text>







        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>


          <TouchableOpacity
            onPress={() => { handlePress, navigation.navigate('Challenges') }}
            style={[
              styles.rew,
              {
                backgroundColor: isRewardsSelected ? 'transparent' : 'transparent',
                borderColor: isRewardsSelected ? Colors.primaryBlue : Colors.primaryBlue,
              },
            ]}
          >
            <Text style={[styles.text, { color: isRewardsSelected ? Colors.primaryBlue : Colors.primaryBlue, fontFamily: 'Poppins-Regular', fontSize: 14 }]}>Challenges</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { handlePress, navigation.navigate('Leaderboard') }}
            style={[
              styles.rew,
              {
                backgroundColor: isRewardsSelected ? 'trasnparent' : 'transparent',
                borderColor: isRewardsSelected ? Colors.primaryBlue : Colors.primaryBlue,
              },
            ]}
          >
            <Text style={[styles.text, { color: isRewardsSelected ? Colors.primaryBlue : Colors.primaryBlue, fontFamily: 'Poppins-Regular', fontSize: 14 }]}>Leaderboard</Text>
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
  rew: {
    height: 45,
    width: 130,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 18,
    // marginRight: '10%',
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8
  },
});
