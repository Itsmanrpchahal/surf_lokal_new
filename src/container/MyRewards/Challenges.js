import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../utils/Colors';
import { useNavigation } from '@react-navigation/native';
import Images from '../../utils/Images';
import * as Animatable from 'react-native-animatable';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { getRewardListing } from '../../modules/getRewardListing';
import { useIsFocused } from '@react-navigation/native';
import { likeDisLike } from '../../modules/likeDislike';
import { TypingAnimation } from 'react-native-typing-animation';

const Challenges = () => {
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [isNextText, setNextText] = useState(false);
  const [question, setQuestion] = useState([])
  const [index, setindex] = useState(0)
  const navigation = useNavigation();
  const [user_ID, setUser_ID] = useState();


  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      Promise.all[
        getRewardsChallengeApicall(),
        getID()
      ];
    }
  }, [isFocused]);

  const getID = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUser_ID(id);
  };
  const getRewardsChallengeApicall = () => {
    dispatch(getRewardListing()).then(response => {
      setQuestion(response.payload.data)
    });
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
        }}>
        <Text style={{ fontSize: 20, color: Colors.black, fontFamily: 'Poppins-Medium', color: Colors.black, textAlign: "center" }}>Challenges</Text>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            alignSelf: 'center',

            justifyContent: 'center',
            alignItems: 'center',
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

      <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', color: Colors.black, height: "100%", paddingBottom: 30 }}>

        {question[index]?.post_title ?
          <>
            <View style={{ borderWidth: 1, borderColor: Colors.BorderColor, width: "95%", boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)", padding: 8, height: "40%", borderRadius: 12 }}>
              <Text style={{ fontSize: 14, marginTop: 20, color: Colors.black, fontFamily: 'Poppins-Regular', width: "97%", height: 60, }}>{"Q."}{index + 1}{" : "}{question[index]?.post_title}</Text>
              <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', alignContent: 'center', }} >
                <TouchableOpacity onPress={() => {
                  setIsImageChanged(true);
                  setIsImage(false)
                  setNextText(true)

                  const payload = {
                    user_id: user_ID,
                    title: question[index].post_title,
                    post_id: question[index].ID,
                    points: question[index].points
                  }
                  console.log("payload handleDislie Press", payload)
                  dispatch(likeDisLike(payload)).then(response => {
                    console.log(response)
                  });
                }
                }
                  activeOpacity={0.8}
                  style={{

                  }}>
                  <Image
                    source={isImageChanged ? Images.redlike : Images.deletethumb}
                    style={{ height: 50, width: 50, resizeMode: 'contain' }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setIsImage(true)
                  setIsImageChanged(false)
                  setNextText(true)
                  const payload = {
                    user_id: user_ID,
                    title: question[index].post_title,
                    post_id: question[index].ID,
                    points: question[index].points
                  }
                  console.log("payload handleFavPress", payload)
                  dispatch(likeDisLike(payload)).then(response => {
                    console.log(response)
                  });
                }}
                  activeOpacity={0.8}
                  style={{
                    // width: '100%',
                    // alignItems: 'center',
                  }}>
                  <View style={styles.viewstyle}>
                    <Image
                      source={isImage ? Images.upgreen : Images.upthumb}
                      style={{ height: 50, width: 50, resizeMode: 'contain' }} />

                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", position: "relative" }}>

                {index <= 0 ? "" : <>
                  <TouchableOpacity
                    onPress={() => {
                      setindex(index - 1)
                    }}
                    style={[styles.rew, { position: "absolute", left: 0 }]}
                  ><Text style={[styles.text, { color: Colors.primaryBlue, fontFamily: 'Poppins-Regular', fontSize: 14 }]}>Back</Text>
                  </TouchableOpacity>
                </>}


                <TouchableOpacity
                  onPress={() => {
                    setindex(index + 1)
                    setIsImage(false)
                    setIsImageChanged(false);
                    setNextText(false)
                  }} style={[styles.rew, { position: "absolute", right: 0 }]}>
                  <Text style={[styles.text, { color: Colors.primaryBlue, fontFamily: 'Poppins-Regular', fontSize: 14 }]}>{isNextText ? "Next" : "Skip"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>

          : <>
            <Text style={{ fontSize: 16, fontWeight: '500', marginTop: 20, color: Colors.black, fontFamily: 'Poppins-Regular' }}>Wait for your challenges</Text>
            <TypingAnimation
              dotColor="black"
              dotMargin={10}
              dotAmplitude={2}
              dotSpeed={0.15}
              dotRadius={1}
              dotX={8}
              dotY={5}
              style={{ marginTop: 25, marginLeft: -3 }}
            />
          </>
        }






      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  viewstyle: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 18,
    // height: 60,
    alignItems: 'center',
    paddingVertical: 18
  },
  line: {
    height: 1,
    width: '90%',
    backgroundColor: Colors.BorderColor,
    // marginHorizontal: 50
  },
  text: {
    fontSize: 14,
    color: Colors.black,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular',
  },
  slideOuter: {
    width: "100%",

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Regular'
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: 'blue',
  },
  //fliter
  filter: {
    height: 60,
  },
  rew: {
    height: 45,
    width: 130,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 18,
    // marginRight: '10%',
    // backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderColor: Colors.primaryBlue
  },
});
export default Challenges