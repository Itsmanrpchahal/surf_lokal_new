import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
  FlatList,
  Share,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from './Styles';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getPoperties } from '../../modules/getPoperties';
import { getRating } from '../../modules/getRating';
import { postRating } from '../../modules/postRating';
import { getSearch } from '../../modules/getSearch';
import { getFilter } from '../../modules/getFilter';
import { getNearBy } from '../../modules/getNearBy';
import { SvgUri } from 'react-native-svg';
import { Rating } from 'react-native-ratings';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;
import DeckSwiper from 'react-native-deck-swiper';

const Home = () => {
  const dispatch = useDispatch();
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adress, setAddres] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getPopertiesApiCall();
    getFilterApiCall()
  }, []);

  const getSearchApiCall = () => {
    dispatch(getSearch(adress)).then(response => {
      console.log('res Search Api data', response.payload);
      setHomeData(response.payload.data);
    });
  };
  const getNearByApiCall = () => {
    setLoading(true);
    dispatch(getNearBy()).then(response => {
      console.log('res Near By ApiCall', response.payload.data);
      setHomeData(response.payload.data);
    }).
      finally(() => {
        setLoading(false);
      });
  };
  const getFilterApiCall = () => {
    dispatch(getFilter()).then(response => {
      console.log('res', response.payload);
      setFilterData(response.payload.data);
    });
  };
  const getPopertiesApiCall = () => {
    setLoading(true);
    dispatch(getPoperties()).then(response => {
      setLoading(false);
      console.log('res getPoperties', response.payload);
      setHomeData(response.payload.data);
    });
  };
  const renderFillterItem = ({ item }) => {
    const isSelected = selectedItem === item.counter_id;

    return (

      <View style={{}}>
        <TouchableOpacity onPress={() => setSelectedItem(item.counter_id)}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 20,
              marginRight: 20,
              // height:80
              // marginHorizontal:10,
              // marginVertical:10
            }}>
            <SvgUri
              style={{ height: 19, width: 19, resizeMode: 'contain' }}
              uri={item.term_icon_url}
            />
            <Text
              style={{
                fontSize: 12,
                color: isSelected ? Colors.black : Colors.gray,
                marginTop: 5,
                fontWeight: isSelected ? 'bold' : 'normal',
                fontFamily: 'Poppins-Regular'

              }}>
              {item.term_name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // const position = useRef(new Animated.ValueXY()).current;
  // const swipeThreshold = 120; // Minimum distance required to trigger a swipe action
  // const likeOpacity = position.x.interpolate({
  //   inputRange: [0, swipeThreshold],
  //   outputRange: [0, 1],
  //   extrapolate: 'clamp',
  // });
  // const nopeOpacity = position.x.interpolate({
  //   inputRange: [-swipeThreshold, 0],
  //   outputRange: [1, 0],
  //   extrapolate: 'clamp',
  // });
  // const panResponder = useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => true,
  //     onPanResponderMove: (_, gesture) => {
  //       position.setValue({ x: gesture.dx, y: gesture.dy });
  //       if (gesture.dx < -swipeThreshold) {
  //         setShowIcon(true);
  //       } else {
  //         setShowIcon(false);
  //       };
  //       if (gesture.dx > swipeThreshold) {
  //         setIcon(true);
  //       } else {
  //         setIcon(false);
  //       }
  //     },
  //     onPanResponderRelease: (_, gesture) => {
  //       if (gesture.dx > swipeThreshold) {
  //         trashfile(item.ID);
  //         console.log("trash files");
  //         // Right swipe, delete action
  //         // Perform your delete logic here
  //         resetPosition();
  //       } else if (gesture.dx < -swipeThreshold) {
  //         saveFile(item.ID);
  //         console.log("save File");
  //         // Left swipe, like action
  //         // Perform your like logic here

  //         resetPosition();
  //       } else {
  //         // No significant swipe, reset position
  //         resetPosition();
  //       }
  //     },
  //   })
  // ).current;
  // const resetPosition = () => {
  //   Animated.spring(position, {
  //     toValue: { x: 0, y: 0 },
  //     useNativeDriver: false
  //   }).start();
  // };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
  return (
    <>
      <SafeAreaView
        style={Platform.OS == 'android' ? styles.container : styles.containerIos}>
        <View
          style={{
            height: Platform.OS == 'android' ? '12%' : '8%',
            width: '100%',
            justifyContent: 'center',
            borderRadius: 5,
            marginBottom: 10,
            alignItems: 'center',
            flexDirection: 'row',
            shadowColor: "#000",
            backgroundColor: '#fff',
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 }, // iOS shadow properties
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}>
          <View
            style={{
              height: 40,
              width: '75%',
              borderRadius: 18,
              borderWidth: 1,
              borderColor: Colors.BorderColor,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              onPress={() => getSearchApiCall()}
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.search}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                  marginLeft: 10,
                }}></Image>
            </TouchableOpacity>
            <View style={Styles.phoneInputView}>
              <TextInput
                allowFontScaling={false}
                style={Styles.inputStyle}
                placeholderTextColor={Colors.textColorLight}
                placeholder={'Filters...'}
                returnKeyType="done"
                onChangeText={text => setAddres(text)}
              />
            </View>
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderLeftWidth: 1,
                borderLeftColor: Colors.BorderColor,
              }}>
              <Image
                source={Images.address}
                style={{
                  height: 20,
                  width: 20,
                  resizeMode: 'contain',
                }}></Image>
            </TouchableOpacity>
          </View>
          <View>
            {loading ? (
              <ActivityIndicator size="small" color="blue" />
            ) : (

              <TouchableOpacity
                onPress={() => getNearByApiCall()}
                style={{
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={Images.gps}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                  }}></Image>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{ width: '95%', alignSelf: 'center', height: '8%' }}>
          <FlatList
            data={filterData}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            // onScroll={handleSlideChange}
            // onMomentumScrollEnd={handleSlideChange}
            renderItem={renderFillterItem}
          // extraData={selectedItem}
          />
        </View>
        <View style={{ height: Platform.OS == 'android' ? '74%' : '84%', backgroundColor: "red" }}>

          {/* <DeckSwiper
          cards={homeData}
          // renderCard={(card) => <Item item={card} />}
          onSwiped={(cardIndex) => console.log(cardIndex)}
          onSwipedLeft={(cardIndex) => {
            console.log(cardIndex);
            // Additional functionality for left swipe
            // You can perform any desired actions or update state here
            // Example: setSwipedLeft(true);
          }}
          onSwipedRight={(cardIndex) => {
            console.log(cardIndex, "onSwipedRight");
            // Additional functionality for right swipe
            // You can perform any desired actions or update state here
            // Example: setSwipedRight(true);
          }}
          cardIndex={0}
          backgroundColor="transparent"
          stackSize={1}
          infinite
          animateCardOpacity
          swipeBackCard
        /> */}
        </View>
      </SafeAreaView>
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  bin: {

    width: '90%',
    height: Platform.OS == 'android' ? '10%' : '30%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 15,
    alignItems: 'center',
    zIndex: 99,
    overflow: 'visible',

  },
  containerIos: {
    height: screenHeight,
    width: screenWidth,
    backgroundColor: Colors.white,
  },
  slideOuter: {
    width: screenWidth,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewmain: { height: 300, marginBottom: 20, },
  innerviewmain: { height: 300, marginBottom: 20, },
  slide: { height: 300, marginBottom: 20, borderRadius: 20, marginHorizontal: 12, marginTop: 20 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputStyle: { fontSize: 55, },
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
  slider: {
    width: screenWidth,
    height: screenHeight / 2.7,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  view: {

    width: screenWidth,
    height: Platform.OS == 'android' ? '65%' : '50%',
    marginTop: Platform.OS == 'android' ? 5 : 0,
    justifyContent: 'center',
    alignItems: 'center',

  },

  //fliter
  filter: {
    height: 60,
  },
  rating: {
    marginVertical: 5,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcon: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'visible',
    zIndex: 99,
    position: 'absolute',
    top: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "yellow"
  },
})