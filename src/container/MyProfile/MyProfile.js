import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getProfile } from '../../modules/getProfile';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../components/Loader';
import { ScrollView } from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import { store } from '../../redux/store';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const MyFavorites = () => {
  const [propertyChat, setPropertyChat] = useState([])
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [notification, setNotification] = useState(0)

  const [details, setDetails] = useState([]);
  const [index, setIndex] = useState(true);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isImage, setIsImage] = useState(false);

  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [tabshow, setTabshow] = useState(true)

  useEffect(() => {
    if (store?.getState()?.loginUserReducer?.loginData?.data?.user_role === "administrator") {
       setTabshow(true)
    }
  }, [])



  useEffect(() => {
    setPropertyChat(store.getState().propertyChatList?.likeDisLikeData?.data)
  }, [])

  useEffect(() => {
    const nestedData =store.getState().getNotifications.getNotificationsData?.data[0]
     console.log("nestedDatanestedDatanestedData",nestedData)
     setNotification(nestedData)
  }, []);

  const handleImagePress = () => {
    navigation.navigate('RecycleBin');
    setIsImageChanged(true);

    setTimeout(() => {
      setIsImageChanged(false);
    }, 1500);
  };
  const handleFavPress = () => {
    navigation.navigate('MyFavorites', { from: 'menu' });
    setIsImage(true)
    setTimeout(() => {
      setIsImage(false)
    }, 1500);
  };

  useEffect(() => {
    return () => {
      clearTimeout();
    };
  }, []);


  const rotateValue = useRef(new Animated.Value(0)).current;

  const startRotationAnimation = () => {
    Animated.sequence([
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
      Animated.timing(rotateValue, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    startRotationAnimation();
  }, []);

  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      getProfileApiCall();
    });

    return unsubscribe;
  }, [navigation]);
  const _pickImage = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      width: 300,
      height: 400,
      cropping: true,
      includeBase64: true,
      freeStyleCropEnabled: true,
    }).then(res => {
      let uriResponse = res.path;
      let name = res.path.split('/').pop();
      let type = res.mime;
      saveFile(uriResponse, name, type);
    }).catch(error => {
    });
  };
  const getProfileApiCall = () => {
    dispatch(getProfile()).then(response => {
      setLoading(false);
      setDetails(response.payload.data);
    });
  };

  const saveFile = async (uriResponse, name, type,) => {
    setLoading(true);
    const userID = await AsyncStorage.getItem('userId');

    let data = new FormData();
    data.append("userID", userID)
    data.append('userimage', {
      uri: uriResponse,
      type: type,
      name: name,
    });
    try {
      var res = await axios.post(
        'https://www.surflokal.com/webapi/v1/profile/',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (res.status === 200) {
        getProfileApiCall();
      } else {
        Alert.alert('something went wrong!.');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };
  const handleIconPress = (item, index) => {
    setSelectedIcon(index);
    if (item.title == 'Sign Out') {
      AsyncStorage.removeItem('userId');
    }
    navigation.navigate(item.navigation);

  };

  const handleIconPressSetting = () => {

    navigation.navigate('Settings', { data: details })

  };
  const renderItem = ({ item, index }) => (

    <View style={styles.slideOuter}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleIconPress(item, index)}
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingHorizontal: 30,
            height: 60,
            alignItems: 'center',
          }}>
          <Image
            source={selectedIcon === index ? item.image2 : item.image}
            style={{ height: 25, width: 25, resizeMode: 'contain' }}
          />

          <Text
            style={{
              fontSize: 28,
              color: Colors.textColorLight,
              marginLeft: 20,
              fontFamily: 'Poppins-Regular'
            }}>
            {item.title}
          </Text>
        </View>
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: Colors.BorderColor,
          }}></View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View
          style={{

            width: '100%',
            paddingHorizontal: 15,
            paddingTop: 15,
            justifyContent: 'space-between',
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingBottom: 45
          }}>
          <View
            style={{
              flexDirection: 'row', width: "15%"
            }}>
            <TouchableOpacity
              onPress={() => {
                _pickImage()
              }}
              activeOpacity={0.5}
              style={{
                height: 45,
                width: 45,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: Colors.surfblur,
                borderRadius: 50

              }}>
              {!index ? (
                <Image
                  source={Images.search}
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: 'contain',

                  }}></Image>
              ) : (
                <View
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 20,
                    backgroundColor: Colors.surfblur,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                  }}>
                  {details[0]?.user_image != null ? (
                    <Image
                      style={{ height: 40, width: 40 }}
                      source={{ uri: details[0]?.user_image }}
                    />
                  ) : (
                    <Image
                      style={{ height: 40, width: 40, resizeMode: "cover" }}
                      source={Images.user}
                    />
                  )}
                  <Loader loading={loading} />
                </View>
              )}
              <View
                style={{
                  position: 'absolute',
                  bottom: -4,
                  height: 20,
                  width: 20,
                  right: -5,
                  left: 23,
                  alignItems: 'center',
                  justifyContent: 'center',

                }}>

              </View>
            </TouchableOpacity>
          </View>
          <Text numberOfLines={1} style={{
            fontSize: 25, color: "#2144a0",
            fontFamily: 'Poppins-Medium', textTransform: "capitalize",
            width: "70%", paddingHorizontal: 12,
            textAlign: "center",
          }}>
            {details[0]?.username}

          </Text>
          <TouchableOpacity
            onPress={() => handleIconPressSetting()}
            style={{
              height: 40,
              width: 40,
              width: "15%",
              justifyContent: 'center',
              alignItems: 'center',
              transform: [
                {
                  rotate: rotateValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}>
            <Image
              source={Images.setting}
              style={{
                height: 37,
                width: 37,
                resizeMode: 'contain',

              }}></Image>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 2, height: '100%' }}>
          {
            tabshow ? <View style={styles.slideOuter}>
              <TouchableOpacity onPress={handleFavPress}
                activeOpacity={0.8}
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={styles.viewstyle}>
                  <Image
                    source={isImage ? Images.upgreen : Images.upthumb}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      resizeMode: 'contain'
                    }} />
                  <Text style={styles.text}>My Favorites</Text>
                </View>
                <View style={styles.line}></View>
              </TouchableOpacity>
            </View> : null
          }

          <View style={styles.slideOuter}>
            <TouchableOpacity onPress={() => navigation.navigate('SavedSearches')}
              activeOpacity={0.8}
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={styles.viewstyle}>
                <Image
                  source={Images.savedSearch}
                  style={{
                    height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                    width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                    resizeMode: 'contain'
                  }} />
                <Text style={styles.text}>Saved Searches</Text>
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.slideOuter}>
            <TouchableOpacity onPress={() => navigation.navigate('Notification')}
              activeOpacity={0.8}
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={[styles.viewstyle, { position: "relative" }]}>
                <View style={{ position: "relative" }}>
                  <Image
                    source={Images.notification}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      resizeMode: 'contain'
                    }} />
                    {
                      notification?.length > 0 ?
                      <Text style={{
                        position: "absolute", backgroundColor: "red", right: DeviceInfo.getDeviceType() === 'Tablet' ? 12 : 8, top: DeviceInfo.getDeviceType() === 'Tablet' ? -12 : -7,
                        height: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 15,
                        width: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 15,
                        borderRadius:100, color: Colors.white,
                        textAlign: "center", fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 15 : 9, alignItems: "center",
                        justifyContent: "center"
                      }}>{notification?.length > 0 ? notification?.length : "0"}</Text>:null
                    }
                 
                  </View>
                <Text style={styles.text}> My Feed</Text>
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
          </View>
          {
            tabshow ? <View style={styles.slideOuter}>
              <TouchableOpacity onPress={() => navigation.navigate('ContactMyAgent')}
                activeOpacity={0.8}
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={styles.viewstyle}>
                  <Image
                    source={Images.contactAgent}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      resizeMode: 'contain'
                    }} />
                  <Text style={styles.text}>Contact my agent</Text>
                </View>
                <View style={styles.line}></View>
              </TouchableOpacity>
            </View> : null
          }
          {
            tabshow ? <View style={styles.slideOuter}>
              <TouchableOpacity onPress={() => navigation.navigate('MyRewards', { from: 'menu' })}
                activeOpacity={0.8}
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={styles.viewstyle}>
                  <Image
                    source={Images.surfReward}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      resizeMode: 'contain'
                    }} />
                  <Text style={styles.text}>Rewards</Text>
                </View>
                <View style={styles.line}></View>
              </TouchableOpacity>
            </View> : null
          }
          {
            tabshow ? <View style={styles.slideOuter}>
              <TouchableOpacity onPress={() => navigation.navigate('MakeAnOffer')}

                activeOpacity={0.8}
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={styles.viewstyle}>
                  <Image
                    source={Images.surfShop}
                    style={{ height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20, width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20, resizeMode: 'contain' }} />
                  <Text style={styles.text}>Document Portal</Text>
                </View>
                <View style={styles.line}></View>
              </TouchableOpacity>
            </View> : null
          }

          {
            tabshow ? <View style={styles.slideOuter}>
              <TouchableOpacity onPress={handleImagePress}
                activeOpacity={0.8}
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View
                  style={styles.viewstyle}>
                  <TouchableOpacity>
                    <Image
                      source={isImageChanged ? Images.redlike : Images.deletethumb}
                      style={{
                        height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                        width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                        resizeMode: 'contain'
                      }} />
                  </TouchableOpacity>
                  <Text style={styles.text}>Recycle Bin</Text>
                </View>
                <View style={styles.line}></View>
              </TouchableOpacity>
            </View> : null
          }

          {
            tabshow ? <View style={styles.slideOuter}>
              <TouchableOpacity onPress={() => navigation.navigate('ContactSurf')}
                activeOpacity={0.8}
                style={{
                  width: '100%',
                  alignItems: 'center',
                }}>
                <View style={styles.viewstyle}>
                  <Image
                    source={Images.contactsurf}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                      resizeMode: 'contain'
                    }} />
                  <Text style={styles.text}>Contact surf lokal</Text>
                </View>
                <View style={styles.line}></View>
              </TouchableOpacity>
            </View> : null
          }
          {
            propertyChat?.length > 0 &&
            <View style={styles.slideOuter}>
              {
                tabshow ? <TouchableOpacity onPress={() => navigation.navigate('ChatHistory')}
                  activeOpacity={0.8}
                  style={{
                    width: '100%',
                    alignItems: 'center',
                  }}>
                  <View
                    style={styles.viewstyle}>
                    <TouchableOpacity>
                      <Image
                        source={isImageChanged ? Images.chatnew : Images.chatnew}
                        style={{
                          height: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                          width: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                          resizeMode: 'contain'
                        }} />
                    </TouchableOpacity>
                    <Text style={styles.text}>Chat History</Text>
                  </View>
                  <View style={styles.line}></View>
                </TouchableOpacity> : null
              }
          
            </View>
            
          }

         <View  style={{justifyContent:'flex-start',alignContent:'center',alignItems:'center'}}>
         <Image source={Images.logoocean}style={{height:"40%",width:"40%" ,resizeMode:'contain'}}/>
         </View>
        </View>
        
      
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    // marginBottom:20
  },
  viewstyle: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 18,

    alignItems: 'center',
    paddingVertical: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 18
  },
  line: {
    height: 1,
    width: '90%',
    backgroundColor: Colors.BorderColor,

  },
  text: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 14,
    color: Colors.black,
    marginLeft: 8,
    fontFamily: 'Poppins-Regular'
  },
  slideOuter: {
    width: "100%",

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 18,
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

  filter: {
    height: 60,
  },
});

export default MyFavorites;
