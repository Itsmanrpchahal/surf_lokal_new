import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  FlatList,
  Alert,
  Animated,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Orientation from 'react-native-orientation-locker';
import Styles from './Styles';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../../modules/getProfile';
import ImagePicker from 'react-native-image-crop-picker';
import Fonts from '../../utils/Fonts';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../components/Loader';
import { ScrollView } from 'react-native-gesture-handler';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;

const images = [
  {
    image: Images.ThumbUp,
    title: 'Favorites',
    navigation: 'MyFavorites',
    image2: Images.fillgreen

  },
  {
    image: Images.savedSearch,
    title: 'Saved Searches',
    navigation: 'SavedSearches',
    image2: Images.savedSearch

  },
  {
    image: Images.notification,
    title: 'Notifications',
    navigation: 'Notification',
    image2: Images.notification

  },

  {
    image: Images.contactAgent,
    title: 'Contact My lokal Agent',
    navigation: 'ContactMyAgent',
    image2: Images.contactAgent

  },
  {
    image: Images.surfReward,
    title: 'Rewards',
    navigation: 'MyRewards',
    image2: Images.surfReward

  },

  {
    image: Images.chart,
    title: 'surf Shop',
    navigation: 'MakeAnOffer',
    image2: Images.chart

  },

  {
    image: Images.downThumb,
    title: 'Recycle Bin',
    navigation: 'RecycleBin',
    image2: Images.fill

  },

  // {
  //   image: Images.setting,
  //   title: 'Settings',
  //   navigation: 'Settings',
  // image2:Images.setting
  // },
];

const MyFavorites = () => {

  const [selectedIcon, setSelectedIcon] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [details, setDetails] = useState([]);
  const [index, setIndex] = useState(true);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const flatListRef = useRef(null);
  const [showIcon, setShowIcon] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();


  const handleImagePress = () => {
    navigation.navigate('RecycleBin');
    setIsImageChanged(true);

    // Reset the image after 2 seconds
    setTimeout(() => {
      setIsImageChanged(false);
    }, 1500);
  };

  const handleFavPress = () => {
    navigation.navigate('MyFavorites');

    setIsImage(true)

    // Reset the image after 2 seconds
    setTimeout(() => {
      setIsImage(false)
    }, 1500);
  };

  useEffect(() => {
    // Clear the timeout if the component unmounts before the 2 seconds
    return () => {
      clearTimeout();
    };
  }, []);


  const rotateValue = useRef(new Animated.Value(0)).current;
  const startRotationAnimation = () => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  };
  useEffect(() => {
    startRotationAnimation();
  }, []);

  useEffect(() => {
    // setisFocused(false)
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
        'https://surf.topsearchrealty.com/webapi/v1/profile/',
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
              fontSize: 18,
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
            //height: 70,

            width: '100%',
            paddingHorizontal: 15,
            paddingTop: 15,
            justifyContent: 'space-between',
            alignSelf: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              flexDirection: 'row',
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
                borderColor: Colors.primaryBlue,
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
                    backgroundColor: Colors.primaryBlue,
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
                    style={{ height: 40, width: 40 }}
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
          <Text style={{ fontSize: 18, color: Colors.black, fontFamily: 'Poppins-Regular' }}>
            {details[0]?.username}
          </Text>
          <TouchableOpacity
            onPress={() => handleIconPressSetting()}

            // onPress={() => navigation.navigate('Settings', { data: details })}
            style={{
              height: 40,
              width: 40,
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

          {/* <FlatList

            data={images}
            keyExtractor={(item, index) => index.toString()}
            // keyExtractor={item => item.id}
            renderItem={renderItem}
          // extraData={isSelected}
          /> */}
          <View style={styles.slideOuter}>
            <TouchableOpacity onPress={handleFavPress}
              activeOpacity={0.8}
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={styles.viewstyle}>
                <Image
                  source={isImage ? Images.upgreen : Images.upthumb}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                <Text style={styles.text}>My Favorites</Text>
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
          </View>

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
                  style={{ height: 20, width: 20, resizeMode: 'contain' }} />
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
              <View style={styles.viewstyle}>
                <Image
                  source={Images.notification}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                <Text style={styles.text}>Notifications</Text>
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.slideOuter}>
            <TouchableOpacity onPress={() => navigation.navigate('ContactMyAgent')}
              activeOpacity={0.8}
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={styles.viewstyle}>
                <Image
                  source={Images.contactAgent}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                <Text style={styles.text}>Contact surf lokal</Text>
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.slideOuter}>
            <TouchableOpacity onPress={() => navigation.navigate('MyRewards')}
              activeOpacity={0.8}
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={styles.viewstyle}>
                <Image
                  source={Images.surfReward}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                <Text style={styles.text}>Rewards</Text>
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.slideOuter}>
            <TouchableOpacity onPress={() => navigation.navigate('MakeAnOffer')}

              activeOpacity={0.8}
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <View style={styles.viewstyle}>
                <Image
                  source={Images.surfShop}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                <Text style={styles.text}>Surf Shop</Text>
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
          </View>
          <View style={styles.slideOuter}>
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
                    style={{ height: 20, width: 20, resizeMode: 'contain' }} />
                </TouchableOpacity>
                <Text style={styles.text}>Recycle Bin</Text>
              </View>
              <View style={styles.line}></View>
            </TouchableOpacity>
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
  //fliter
  filter: {
    height: 60,
  },
});

export default MyFavorites;
