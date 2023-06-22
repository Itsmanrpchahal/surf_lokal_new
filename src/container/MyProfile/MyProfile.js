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
  },
  {
    image: Images.savedSearch,
    title: 'Saved Searches',
    navigation: 'SavedSearches',
  },
  {
    image: Images.notification,
    title: 'Notifications',
    navigation: 'Notification',
  },

  {
    image: Images.contactAgent,
    title: 'Contact My lokal Agent',
    navigation: 'ContactMyAgent',
  },
  {
    image: Images.surfReward,
    title: 'Rewards',
    navigation: 'MyRewards',
  },

  {
    image: Images.surfShop,
    title: 'surf Shop',
    navigation: 'MakeAnOffer',
  },

  {
    image: Images.fill,
    title: 'Recycle Bin',
    navigation: 'RecycleBin',
  },

  // {
  //   image: Images.setting,
  //   title: 'Settings',
  //   navigation: 'Settings',
  // },
];

const MyFavorites = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [details, setDetails] = useState([]);
  const [index, setIndex] = useState(true);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
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
      let source = { uri: res.path };
      let avatarSource = source;
      let uriResponse = res.path;
      let name = res.path.split('/').pop();
      let type = res.mime;
      //let uriResponse = res.path;
      // console.log('mkm', avatarSource);
      // console.log('uri', uriResponse);
      console.log('File name:', res);
      saveFile(uriResponse, name, type);
    });
  };
  const getProfileApiCall = () => {
    dispatch(getProfile()).then(response => {
      console.log('getProfile', response.payload.data);
      setLoading(false);
      setDetails(response.payload.data);
    });
  };

  const saveFile = async (uriResponse, name, type) => {
    setLoading(true);
    const userID = await AsyncStorage.getItem('userId');
    const headers = {
      'Content-Type': 'application/json',
    };
    let data = new FormData();
    data.append("userID")
    data.append('file', {
      uri: uriResponse,
      type: type,
      name: name,
    });
    data.append('userID', userID);
    try {
      var res = await axios.post(
        'https://surf.topsearchrealty.com/webapi/v1/profile/',
        data,
      );

      // console.log('--ppp', res);
      // console.log('--ppp', typeof res.status);

      if (res.status == 200) {
        console.log('hello', res);
        getProfileApiCall();
      } else {
        Alert.alert('something went wrong!.');
        setLoading(false);
      }
    } catch (err) {
      console.log('err', err);
      setLoading(false);
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.slideOuter}>
      <TouchableOpacity
        onPress={() => {
          if (item.title == 'Sign Out') {
            AsyncStorage.removeItem('userId');
          }
          navigation.navigate(item.navigation);
        }}
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
            source={item.image}
            style={{ height: 25, width: 25, resizeMode: 'contain' }}
          />

          <Text
            style={{
              fontSize: 18,
              color: Colors.textColorLight,
              marginLeft: 20,
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
            height: 70,

            width: '87%',

            width: '100%',

            paddingHorizontal: 22,

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
              onPress={() => _pickImage()}
              activeOpacity={0.5}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
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
                    <Text style={{ fontSize: 17, color: Colors.white }}>JD</Text>
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
                  shadowColor: 'black',
                  shadowOffset: { height: 5, width: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                }}>

              </View>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 24, color: Colors.black }}>
            {details[0]?.username}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings', { data: details })}
            style={{
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={Images.setting}
              style={{
                height: 30,
                width: 30,
                resizeMode: 'contain',
              }}></Image>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 20, height: '100%' }}>

          <FlatList

            data={images}
            keyExtractor={item => item.id}
            renderItem={renderItem}
          />

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
  slideOuter: {
    width: screenWidth,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors,
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
