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
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
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
  const [count, setCount] = useState(0)


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
      setCount(response.payload.count)
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white ,}}>
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
          Challenges
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
     
   
      <View style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center', color: Colors.black, height: "100%", width: "100%", }}>
        {
          question[index] ?
            <SwiperFlatList style={{ width: screenWidth, }}
              index={count + 1}
              data={question}
              refer={index}
              renderItem={({ item, index }) => {
                const { ID, points } = item;
                const isSelected = selectedTabsMore.filter((i) => i === ID).length > 0;
                const isSelected2 = selectedTabsMore2.filter((i) => i === ID).length > 0;


                return (
                  <View style={{}}>
                  <View
                    style={{
                      boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
                      borderRadius: 12,
                    //  alignItems: "center",
                    //   // justifyContent: "center",
                      width: screenWidth,
                      paddingTop:180,
                    
                    }}
                  >
                    <Text style={{
                      textAlign: "center", justifyContent: "center", alignItems: "center", 
                      paddingHorizontal: 12, width: screenWidth,
                      fontSize: DeviceInfo.getDeviceType() === 'Tablet'?30:18, 
                      marginTop: 20, color: Colors.black, 
                      fontFamily: 'Poppins-Regular', 
                      height: DeviceInfo.getDeviceType() === 'Tablet'?120:60,
                     
                     
                    }}>
                      {"Q."}{index + 1}{" : "}{item?.post_title}</Text>
                    <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', alignContent: 'center', }} >
                      <TouchableOpacity disabled={item?.is_like != '0' || isSelected2 || isSelected && true} onPress={() => {
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
                        formData.append('status', 2)
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
                          source={isSelected || item.is_like === '2' ? Images.redlike : Images.deletethumb}
                          style={{ 
                          height: DeviceInfo.getDeviceType() === 'Tablet'?60:50, 
                          width: DeviceInfo.getDeviceType() === 'Tablet'?60:50, 
                          resizeMode: 'contain' }} />
                      </TouchableOpacity>
                      <TouchableOpacity disabled={item?.is_like != '0' || isSelected || isSelected2 && true} onPress={() => {
                        if (isSelected2) {
                          setSelectedTabsMore2((prev) => prev.filter((i) => i !== ID));
                        } else {
                          setSelectedTabsMore2(prev => [...prev, ID]);
                          setSelectedTabsMore(prev => prev.filter((i) => i !== ID));
                        }
                        const formData = new FormData()
                        formData.append('user_id', user_ID)
                        formData.append('title', item.post_title)
                        formData.append('post_id', item.ID)
                        formData.append('points', item.points)
                        formData.append('status', 1)
                        console.log(" likeDisLike selectedTabsMore", selectedTabsMore)
                        console.log(" likeDisLike selectedTabsMore2", selectedTabsMore2)
                        dispatch(likeDisLike(formData)).then((response) => {
                          console.log('Questoon response', response.payload)
                        }).catch((e) => {
                          console.log('error ', e)
                        });
                      }}
                        activeOpacity={0.8}>
                        <View style={styles.viewstyle}>
                          <Image
                            source={isSelected2 || item.is_like === '1' ? Images.upgreen : Images.upthumb}
                            style={{ height: DeviceInfo.getDeviceType() === 'Tablet'?60:50, 
                            width: DeviceInfo.getDeviceType() === 'Tablet'?60:50,  resizeMode: 'contain' }} />
                        </View>
                      </TouchableOpacity>
                    </View>
               
                  </View>
                 
                  </View>
                  
                )
              }


              }
            />
            : <>
           
              <Text style={{ fontSize:  DeviceInfo.getDeviceType() === 'Tablet'?32:16, fontWeight: '500', marginTop: 20, color: Colors.black, fontFamily: 'Poppins-Regular' }}>Wait for your challenges</Text>
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
      <View style={{position:"absolute",bottom:0,left:0,right:0}}>
                  <Text style={{textAlign:"center",width:"100%",fontSize: DeviceInfo.getDeviceType() === 'Tablet'?34:18,
                  fontFamily:"Poppins-SemiBold",color:"#3348A3",marginBottom:20}}>Are you up for a challenge?</Text>
                <View   style={{
             
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
           
            }}> 
            <LottieView  style={{ height: 120, width: 150,}} source={require('../../assets/animations/ChallengeScreen.json')} autoPlay loop />
        
            </View>
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
    height:19,
    width: 29,
    resizeMode: 'contain',
    tintColor: Colors.black,
    // transform: [{ rotate: '90deg' }],
  },
});
export default Challenges