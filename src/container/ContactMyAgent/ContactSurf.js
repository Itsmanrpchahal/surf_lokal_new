import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  PanResponder,
  Modal,
  ScrollView,
  Animated,
  Linking,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform
} from 'react-native'; import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from "react-native-twilio-video-webrtc";
import { useSelector, useDispatch } from "react-redux";
import DeviceInfo from 'react-native-device-info';
import LottieView from 'lottie-react-native';
import styleSheet from "../../components/Video/styles";
import { getVedioCallToken } from "../../modules/getVedioCallToken";

import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Animatable from 'react-native-animatable';
import BASEURl from '../../services/Api'

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ContactSurf = () => {
  const [address, setAddress] = useState('');
  const [index, setIndex] = useState(true);
  const [agentData, setAgentData] = useState(null);
  const [responseMessage, setResponseMessage] = useState('')
  const [message, setMessage] = useState('')
  const [note, setNote] = useState('')
  const navigation = useNavigation();
  const styles1 = StyleSheet.create(styleSheet);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState("disconnected");
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [token, setToken] = useState("");
  const twilioRef = useRef(null);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [animation, setAnimatiion] = useState(new Animated.Value(0))
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const handleOpen = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const handleClose = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple(
        [PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,]
      ).then((result) => {
        if (result['android.permission.ACCESS_COARSE_LOCATION']
          && result['android.permission.CAMERA']
          && result['android.permission.ACCESS_FINE_LOCATION']
          && result['android.permission.RECORD_AUDIO']
          === 'granted') {
          this.setState({
            permissionsGranted: true
          });
        } else if (result['android.permission.ACCESS_COARSE_LOCATION']
          || result['android.permission.CAMERA']
          || result['android.permission.ACCESS_FINE_LOCATION']
          || result['android.permission.RECORD_AUDIO'] === 'never_ask_again') {
          this.refs.toast.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue');
        }
      });
    }
  }, [])

  useEffect(() => {
    if (modalVisible) {
      handleOpen()
    } else {
      handleClose()
    }
  }, [modalVisible])

  const screenHeight = Dimensions.get("window").height;

  const backdrop = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 0.01],
          outputRange: [screenHeight, 0],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0.01, 0.5],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };

  const handleModalAnimation = () => {
    Animated.timing(slideAnimation, {
      toValue: modalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    handleModalAnimation();
  }, [modalVisible]);

  useEffect(() => {
    fetchAgentData();
  }, []);

  const getToken = async () => {
    await dispatch(getVedioCallToken({ userID: 3, friend: 18 })).then((res) => {
      twilioRef.current.connect({ accessToken: res.payload.data.token });
      setStatus("connecting");
    }).catch((e) => {
      console.log('Connecting error ', e)
    })
  }
  const getToken1 = async () => {
    await dispatch(getVedioCallToken({ userID: 18, friend: 3 })).then((res) => {
      console.log('respo .... ', res)
      twilioRef.current.connect({ accessToken: res.payload.data.token });
      setStatus("connecting");
      console.log('connecting', token)
    }).catch((e) => {
      alert(JSON.stringify("e ==> " + e))
    })
  }
  const _onConnectButtonPress = () => {
    getToken()
  };

  const _onConnectButtonPress1 = () => {
    getToken1()
  };
  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
    setStatus('disconnected')
    console.log('End Press')

  };


  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
    console.log('Mute Press')
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
    console.log('Flip Button')

  };

  const _onRoomDidConnect = ({ roomName, error }) => {
    console.log("onRoomDidConnect: ", roomName);
    setStatus("connected");
  };

  const _onRoomDidDisconnect = ({ roomName, error }) => {
    console.log("[Disconnect]ERROR: ", error);
    setStatus("disconnected");
    setModalVisible(false)
  };

  const _onRoomDidFailToConnect = (error) => {
    console.log("[FailToConnect]ERROR: ", error);

    setStatus("disconnected");
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantAddedVideoTrack: ", participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          { participantSid: participant.sid, videoTrackSid: track.trackSid },
        ],
      ])
    );
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    console.log("onParticipantRemovedVideoTrack: ", participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);
    setModalVisible(false)
    setVideoTracks(videoTracksLocal);
  };


  useEffect(() => {
    {
      status === "connected" || status === "connecting" ? setModalVisible(true) : setModalVisible(false)
    }
    console.log('status', status)
  }, [status])
  const fetchAgentData = async () => {
    const id = await AsyncStorage.getItem('userId');

    try {
      const response = await axios.get(
        BASEURl + 'webapi/v1/agent/?userID=' + id
      );
      if (response.data.success) {
        const agentData = response.data.data[0];
        setAgentData(agentData);
      }
    } catch (error) {
    }
  };
  const makePhoneCall = () => {
    let phoneNumber = +18885083174
    Linking.openURL(`tel:${phoneNumber}`);
  };
  const handleEmailLink = () => {
    const email = "homes@surflokal.com"

    const subject = '';
    const body = '';

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url)
      .catch(error => console.error('Error opening email app:', error));
  };
  const whatsapp = () => {
    const phone = "+18885083174"
    Linking.openURL(`whatsapp://send?phone=${phone}&text=${''}`)
  }


  return (
    <SafeAreaView style={[styles.container, Platform.OS === 'android' && { flex: 1, }]}>
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
         Contact surf lokal
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
      <ScrollView style={{ height: '100%', width: '100%',}}>
        <View style={{ flexDirection: 'column', marginTop: 0, alignItems: "center", paddingVertical: 10, paddingBottom: 10 }}>
          <Image source={Images.appLogo} style={{ maxWidth: DeviceInfo.getDeviceType() === 'Tablet'?280:180, resizeMode: "contain", height: DeviceInfo.getDeviceType() === 'Tablet'?200:150 }} />


        </View>
        <View style={styles.informationicons}>
          <View style={styles.maininfoicons}>
            <TouchableOpacity
              style={[styles.iconcover, { backgroundColor: "#11b03e" }]}
              onPress={() => {
                makePhoneCall()
              }}
            >
              <Image
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
                  width: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
                  // margin: 2,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.telephonecall}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconcover, { backgroundColor: "#19a4df" }]}
              onPress={() => { navigation.navigate('ChatSearch') }}
            >
              <Image
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
                  width: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.messenger}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconcover, { backgroundColor: "#5f3d1c" }]}
              onPress={() => {
                // setModalVisible(true)
                // _onConnectButtonPress()
                // navigation.navigate('Video')
              }}
            >
              <Image
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
                  width: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.videochat}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              handleEmailLink()
            }} style={[styles.iconcover, { backgroundColor: Colors.black }]}>
              <Image
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
                  width: DeviceInfo.getDeviceType() === 'Tablet'?40:20,
                  resizeMode: "contain",
                  tintColor: Colors.white,
                }}
                source={Images.email}
              />
            </TouchableOpacity>



          </View>
        </View>

        <Text style={{ marginBottom: 16, fontSize: DeviceInfo.getDeviceType() === 'Tablet'?32:18, textAlign: "center", color: Colors.black, fontFamily: 'Poppins-Regular' }}>
          3010 N Military trl {'\n'}
          Suite 310 {'\n'}
          Boca Raton, FL 33431
        </Text>
        <View style={{ flexDirection: 'column' }}>
          <View
            style={{
              // height: 70,
              width: '90%',
              //  alignSelf: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginHorizontal: 12,
              borderBottomColor: Colors.BorderColor,
              //   borderBottomWidth: 1

            }}>

          </View>

          <View>
            <View style={styles.slideOuter}>
              <TouchableOpacity
                //onPress={() => navigation.navigate(item.navigation)}
                style={{
                  width: '100%',
                  padding: 12
                }}>

                <View style={{
                  flexDirection: "row", justifyContent: "flex-start", flexWrap: "wrap", textAlign: "center",
                  marginBottom: 8
                }}>
                  {/* <TouchableOpacity
                    onPress={() => navigation.navigate("ChatSearch", { agentData })}

                    style={styles.buttonview}>
                    <Text style={styles.buttonText}>Request A Showing
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("ChatSearch", { agentData })}
                    style={styles.buttonview}>
                    <Text style={styles.buttonText}>Start Offer
                    </Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ChatSearch", { agentData })}

                    style={styles.buttonview}>

                    <Text style={styles.buttonText}>List My Home
                    </Text>

                  </TouchableOpacity> */}
                  <TouchableOpacity
                    onPress={() => makePhoneCall()}
                    style={styles.buttonview}
                  >

                    <Text style={styles.buttonText}>Call
                    </Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEmailLink()}
                    style={styles.buttonview}>

                    <Text style={styles.buttonText}>E-mail
                    </Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ChatSearch')}
                    style={styles.buttonview}>

                    <Text style={styles.buttonText}>Chat
                    </Text>

                  </TouchableOpacity>
                </View>
                <View>

                </View>


              </TouchableOpacity>
            </View>


          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity
              style={{
                height: 38,
                width: 38,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
 <LottieView  style={{ height: DeviceInfo.getDeviceType() === 'Tablet'?64:38,
  width: DeviceInfo.getDeviceType() === 'Tablet'?64:38,}} 
     source={require('../../assets/animations/facebook.json')} autoPlay loop />
           
                {/* <Image
                  style={{
                    height: DeviceInfo.getDeviceType() === 'Tablet'?64:38,
                    width: DeviceInfo.getDeviceType() === 'Tablet'?64:38,
                    resizeMode: "contain",
                    marginHorizontal: 5
                  }}
                  source={Images.facebook1}
                /> */}
        
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: DeviceInfo.getDeviceType() === 'Tablet'?64:38,
                    width: DeviceInfo.getDeviceType() === 'Tablet'?64:38,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <LottieView  style={{ height: DeviceInfo.getDeviceType() === 'Tablet'?64:38,
  width: DeviceInfo.getDeviceType() === 'Tablet'?64:38,}} 
     source={require('../../assets/animations/twitter.json')} autoPlay loop />

            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 38,
                width: 38,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
            <LottieView  style={{ height: DeviceInfo.getDeviceType() === 'Tablet'?64:38,
  width: DeviceInfo.getDeviceType() === 'Tablet'?64:38,}} 
     source={require('../../assets/animations/instagram.json')} autoPlay loop />
            </TouchableOpacity>

          </View>
         
        </View>

      <View  style={{flexDirection:"row",justifyContent:"center",alignItems:"center",
      }}>
     
     <LottieView  style={{ height: DeviceInfo.getDeviceType() === 'Tablet'?250:150, width: DeviceInfo.getDeviceType() === 'Tablet'?250:150,}} 
     source={require('../../assets/animations/SurfVan.json')} autoPlay loop />

</View>
      </ScrollView>
     

      {
        modalVisible && <Animated.View
          style={[
            backdrop,
            { position: 'absolute', left: 0, right: 0, height: screenHeight, top: 0, }

          ]}
        >
          <View
            style={{
              //height: '100%',
              backgroundColor: "#252525",
              justifyContent: 'space-between',
            }}
          >
            <View style={{ height: '100%', }}>
              <View style={{ height: '50%', width: '100%', }}>
                {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                  return (
                    <TwilioVideoParticipantView
                      style={styles1.remoteVideo}
                      key={trackSid}
                      trackIdentifier={trackIdentifier}
                    />
                  );
                })}
              </View>

              <View style={{ height: '50%', width: '100%', }}>
                <TwilioVideoLocalView enabled={true} style={styles1.localVideo} />
              </View>
            </View>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                padding: 10,
                position: "absolute",
                left: 0, right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",

              }}
            >
              <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => {
                setModalVisible(false)
                _onEndButtonPress()
              }}>
                <View
                  style={{
                    backgroundColor: "rgba(255, 0, 0, 0.4)",
                    height: 55,
                    width: 55,
                    alignSelf: 'center',
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{
                      height: 25,
                      width: 25,
                      tintColor: Colors.white,
                      resizeMode: "contain",
                    }}
                    source={require("../../assets/images/calldown.png")}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => { _onMuteButtonPress() }}>
                <View
                  style={{
                    backgroundColor: "rgba(36, 74, 175, 0.5)",
                    height: 55,
                    width: 55,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{ height: 20, width: 20, resizeMode: "contain" }}
                    source={require("../../assets/images/mutemc.png")}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginHorizontal: 5 }}>
                <View
                  style={{
                    backgroundColor: Colors.borderlightcolor,
                    height: 55,
                    width: 55,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                      tintColor: Colors.white,
                    }}
                    source={require("../../assets/images/novideo.png")}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginHorizontal: 5 }} onPress={() => { _onFlipButtonPress() }}>
                <View
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    height: 55,
                    width: 55,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: "contain",
                      tintColor: Colors.white,
                    }}
                    source={require("../../assets/images/flipre.png")}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <TwilioVideo
              ref={twilioRef}
              onRoomDidConnect={_onRoomDidConnect}
              onRoomDidDisconnect={_onRoomDidDisconnect}
              onRoomDidFailToConnect={_onRoomDidFailToConnect}
              onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
              onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
            />
          </View>
        </Animated.View>
      }

    </SafeAreaView>
  );

}
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: "100%"
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center", justifyContent: "center",
    width: "100%",
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
  },
  buttonview: {
    textAlign: "center",
    borderRadius: 100,
    backgroundColor: Colors.surfblur,
    width: "100%",
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 8,
    marginRight: 6,
    alignSelf: "center",
    paddingHorizontal: 18,
    textAlign: "center",
    justifyContent: "center",

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
    height:DeviceInfo.getDeviceType() === 'Tablet'?29:19,
    width: DeviceInfo.getDeviceType() === 'Tablet'?49:29,

    resizeMode: 'contain',
   
  },
  buttonText: { fontSize:DeviceInfo.getDeviceType() === 'Tablet'?28:14, fontWeight: '400', color: Colors.white, fontFamily: 'Poppins-Regular', textAlign: "center" },
  // slideOuter: {
  //   width: "100%",
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: Colors,
  //   borderRadius: 18,
  // },
  mainareacover: { marginHorizontal: 7 },
  iconcover: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,

    padding:DeviceInfo.getDeviceType() === 'Tablet'?16:8,
    display: "flex",
    borderRadius: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },


  modalOverlay1: {
    flex: 1,
    alignItems: "center", justifyContent: "center",
    width: "98%",
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
  },
  iconcover2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    padding: 8,
    backgroundColor: Colors.PrimaryColor,
    borderRadius: 100, position: "absolute", right: 0, top: 0
  },
  slide: {
    width: screenWidth - 40,
    height: screenHeight / 3,
    borderRadius: 18,
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'contain',
    flexDirection: 'row',
  },
  informationicons: { alignItems: "center", marginBottom: 50, marginTop: 25 },
  maininfoicons: { flexDirection: "row", alignItems: "center" },
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
  // buttonText: {
  //   color: 'white',
  //   fontWeight: 'bold',
  // },
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
});

export default ContactSurf;