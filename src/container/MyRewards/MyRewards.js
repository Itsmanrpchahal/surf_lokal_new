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
import RNSpeedometer from 'react-native-speedometer';
import Images from '../../utils/Images';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../utils/Colors';
import * as Animatable from 'react-native-animatable';

const App = () => {
  const navigation = useNavigation();
  const [meterValue, setMeterValue] = useState(300);
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
      <View style={{}}>
        <View
          style={{
            marginTop: 8,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            marginLeft: 0
          }}>
          <Text style={{
            fontSize: 20,
            color: Colors.black, fontFamily: 'Poppins-Regular'
          }}>Surf Rewards</Text>
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

        </View>
      </View>
      <View>


        <View
          style={{ marginTop: 10, backgroundColor: Colors.white, width: '100%' }}>
          <RNSpeedometer

            value={meterValue}
            size={200}
            minValue={0}
            maxValue={3000}

            // needleColor="blue" 
            allowedDecimals={0}

            labels={[
              {
                name: '',
                labelColor: '#ed2024',
                activeBarColor: '#ec1a1e',
              },
              {
                name: '',
                labelColor: '#ee3323',
                activeBarColor: '#ee3323',
              },
              {
                name: '',
                labelColor: '#f05622',
                activeBarColor: '#f05622',
              },
              {
                name: '',
                labelColor: '#f36f21',
                activeBarColor: '#f36f21',
              },
              {
                name: '',
                labelColor: '#f68620',
                activeBarColor: '#f68620',
              },
              {
                name: '',
                labelColor: '#f99d1c',
                activeBarColor: '#f99d1c',
              },
              {
                name: '',
                labelColor: '#fcb218',
                activeBarColor: '#fcb218',
              },
              {
                name: '',
                labelColor: '#ffc907',
                activeBarColor: '#ffc907',
              },
              {
                name: '',
                labelColor: '#fedf00',
                activeBarColor: '#fedf00',
              },
              {
                name: '',
                labelColor: '#f7de00',
                activeBarColor: '#f7de00',
              },
              {
                name: '',
                labelColor: '#e7dd1c',
                activeBarColor: '#e7dd1c',
              },
              {
                name: '',
                labelColor: '#dadf26',
                activeBarColor: '#dadf26',
              },

              {
                name: '',
                labelColor: '#c2d82f',
                activeBarColor: '#c2d82f',
              },
              {
                name: '',
                labelColor: '#afd136',
                activeBarColor: '#afd136',
              },
              {
                name: '',
                labelColor: '#9ccb3b',
                activeBarColor: '#9ccb3b',
              },
              {
                name: '',
                labelColor: '#8bc63f',
                activeBarColor: '#8bc63f',
              },
              {
                name: '',
                labelColor: '#7ac143',
                activeBarColor: '#7ac143',
              },
              {
                name: '',
                labelColor: '#ffffff',
                activeBarColor: '#5dba46',
              },
            ]
            }
           


            //  needleImage={Images.meter}
            imageWrapperStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
         
              zIndex: 10,
            }}
            imageStyle={{
              tintColor: 'black',
          
              resizeMode:'contain',
            }}

          />
        </View>

        {/* <View style={{ backgroundColor: Colors.white, justifyContent: 'center', marginTop: 30 }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.textColorLight,
              marginTop: 20,
              textAlign: 'center',
              fontFamily: 'Poppins-Regular'
            }}>
            reaching next tier with  {'\n'}the numerical points tally
          </Text>
        </View> */}
        {meterValue <= 3000 ? (
          <View
            style={{
              width: '80%',
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: 100,
            }}>
              <View style={{}}>
              <Image source={Images.base} style={{height:50,width:230,resizeMode:'stretch',position:'relative',top:20}}/>
                <Image
          source={getImageCall()}
          resizeMode="contain"
          style={{
            height: 100,
            width: '80%',
            marginTop: 20,
             alignSelf: 'center',
            position:'absolute',
            top:-90
          }}></Image>
            
            </View>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
                <Text  style={{ fontSize: 20,
                fontWeight:'600',
                  color: Colors.black,
                  fontFamily: 'Poppins-Regular',
                  textAlign: 'center',}}>Your surf level</Text>
              <Text
                style={{
                  fontSize: 30,
                  color: Colors.black,
                  textAlign: 'center',
                  // fontWeight:"100%"
                  fontFamily: 'Poppins-Regular'
                }}>
                {getLevelCall()}
              </Text>
            </View>
          </View>
        ) : null}
      


        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10,top:-10 }}>

          <TouchableOpacity
            onPress={handlePress}
            style={[
              styles.rew,
              {
                backgroundColor: isRewardsSelected ? 'trasnparent' : 'transparent',
                borderColor: isRewardsSelected ?Colors.primaryBlue : Colors.primaryBlue,
              },
            ]}
          >
            <Text style={[styles.text, { color: isRewardsSelected ? Colors.primaryBlue :Colors.primaryBlue, fontFamily: 'Poppins-Regular' }]}>Rewards</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePress}
            style={[
              styles.rew,
              {
                backgroundColor: isRewardsSelected ? 'transparent' : 'transparent',
                borderColor: isRewardsSelected ? Colors.primaryBlue : Colors.primaryBlue ,
              },
            ]}
          >
            <Text style={[styles.text, { color: isRewardsSelected ?Colors.primaryBlue : Colors.primaryBlue, fontFamily: 'Poppins-Regular' }]}>Challenges</Text>
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
    height: 50,
    width: 150,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 40,
    // marginRight: '10%',
    backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
