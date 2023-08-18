import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
  Dimensions,
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
import { SwiperFlatList } from 'react-native-swiper-flatlist';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const Challenges = () => {
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isImage, setIsImage] = useState(false);
  const [isNextText, setNextText] = useState(false);
  const [question, setQuestion] = useState([])
  const [index, setindex] = useState(0)
  const navigation = useNavigation();
  const [user_ID, setUser_ID] = useState();
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedTabsMore, setSelectedTabsMore] = useState([]);
  const [selectedTabsMore2, setSelectedTabsMore2] = useState([]);



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
      {/* <View
        style={{
          marginTop: 9,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: "center",
          width: '100%',
          marginLeft: 0,
        }}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", position: "absolute", left: 8, justifyContent: "center" }} onPress={() => { navigation.goBack() }}>
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
        <Text style={{ fontSize: 20, color: Colors.black, fontFamily: 'Poppins-Medium', color: Colors.black, textAlign: "center" }}>Challenges</Text>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            position: "absolute",
            right: 10,
            top: -8,

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
      </View> */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          // height: 45,
          alignItems: 'center',
          paddingVertical: 12,
          borderBottomColor: Colors.gray,
          borderBottomWidth: 1,
          paddingTop: 16,
          marginBottom: 16,
          backgroundColor: Colors.white
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            left: 12,
            justifyContent: 'center',
            // top: 12,
            top: 13
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              width: 10,
              height: 10,
              resizeMode: 'contain',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              transform: [{ rotate: '90deg' }],
            }}
            source={Images.downArrow}></Image>
          <Text
            style={{
              fontSize: 15,
              color: Colors.black,
              fontFamily: 'Poppins-Regular',
              marginLeft: 5,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            Back
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              color: Colors.black,
              fontFamily: 'Poppins-Medium',
              marginRight: 4,
              lineHeight: 20,
            }}>
            Challenges
          </Text>

        </View>
        {/* <TouchableOpacity
          style={{
            alignItems: 'center',
            position: 'absolute',
            right: 12,
            top: 8,

            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 30,
            width: 30,
            borderRadius: 100,
            backgroundColor: Colors.gray,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Animatable.Image
            source={Images.whiteclose}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity> */}
      </View>
      <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', color: Colors.black, height: "100%", width: "100%", }}>
        {
          question[index] ?
            <SwiperFlatList style={{ width: screenWidth, }}
              index={imageIndex}
              data={question}
              refer={index}
              renderItem={({ item, index }) => {
                const { ID, points } = item;
                const isSelected = selectedTabsMore.filter((i) => i === ID).length > 0;
                const isSelected2 = selectedTabsMore2.filter((i) => i === ID).length > 0;


                return (
                  <View
                    style={{
                      boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      width: screenWidth
                    }}
                  >
                    <Text style={{ textAlign: "center", justifyContent: "center", alignItems: "center", paddingHorizontal: 12, width: screenWidth, fontSize: 18, marginTop: 20, color: Colors.black, fontFamily: 'Poppins-Regular', height: 60, }}>{"Q."}{index + 1}{" : "}{item?.post_title}</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', alignContent: 'center', }} >
                      <TouchableOpacity onPress={() => {
                        if (isSelected) {
                          setSelectedTabsMore((prev) => prev.filter((i) => i !== ID));
                          setSelectedTabsMore2((prev) => prev.filter((i) => i == ID));
                        } else {
                          setSelectedTabsMore(prev => [...prev, ID]);
                          setSelectedTabsMore2(prev => prev.filter((i) => i !== ID));
                        }
                        // setIsImageChanged(true);
                        // setIsImage(false)
                        // setNextText(true)

                        const formData = new FormData()
                        formData.append('user_id', user_ID)
                        formData.append('title', item.post_title)
                        formData.append('post_id', item.ID)
                        formData.append('points', item.points)
                        console.log(" likeDisLike selectedTabsMore", selectedTabsMore)
                        console.log(" likeDisLike selectedTabsMore2", selectedTabsMore2)

                        dispatch(likeDisLike(formData)).then((response) => {
                          console.log('Questoon response', response.payload)
                        }).catch((e) => {
                          console.log('error ', e)
                        });
                      }}
                        activeOpacity={0.8}
                        style={{

                        }}>
                        <Image
                          source={isSelected ? Images.redlike : Images.deletethumb}
                          style={{ height: 50, width: 50, resizeMode: 'contain' }} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        if (isSelected2) {
                          setSelectedTabsMore2((prev) => prev.filter((i) => i !== ID));
                        } else {
                          setSelectedTabsMore2(prev => [...prev, ID]);
                          setSelectedTabsMore(prev => prev.filter((i) => i !== ID));
                        }
                        const payload = {
                          user_id: user_ID,
                          title: item.post_title,
                          post_id: item.ID,
                          points: item.points
                        }
                        console.log(" likeDisLike selectedTabsMore", selectedTabsMore)
                        console.log(" likeDisLike selectedTabsMore2", selectedTabsMore2)

                        dispatch(likeDisLike(payload)).then(response => {
                          console.log(response)
                        });
                      }}
                        activeOpacity={0.8}>
                        <View style={styles.viewstyle}>
                          <Image
                            source={isSelected2 ? Images.upgreen : Images.upthumb}
                            style={{ height: 50, width: 50, resizeMode: 'contain' }} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }


              }
            />
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
    alignItems: 'center',
    paddingVertical: 18
  },
  line: {
    height: 1,
    width: '90%',
    backgroundColor: Colors.BorderColor,
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
    height: 35,
    width: 80,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderColor: Colors.surfblur,
    lineHeight: 17
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
});
export default Challenges