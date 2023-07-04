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
import clamp from 'clamp';


const { width } = Dimensions.get('screen');
const SWIPE_THRESHOLD = 0.25 * width;

const Home = () => {
  const dispatch = useDispatch();
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adress, setAddres] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const property = homeData[0];
  console.log(property, "propertypropertyproperty");


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
      console.log(homeData,"homedatataatataataat");

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
  useEffect(() => {
    scale.setValue(0.9);
    opacity.setValue(1);
    animation.setValue({ x: 0, y: 0 });
  }, [homeData]);


  const animation = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  const _panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        animation.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (e, { dx, dy, vx, vy }) => {
        let velocity;
        if (vx >= 0) {
          velocity = clamp(vx, 4, 5);
        } else if (vx < 0) {
          velocity = clamp(Math.abs(vx), 4, 5) * -1;
        }
        if (Math.abs(dx) > SWIPE_THRESHOLD) {
          Animated.parallel([
            Animated.spring(animation, {
              toValue: { x: 0, y: 0 },
              friction: 4,
              useNativeDriver: false,
            }),
            Animated.spring(scale, {
              toValue: 0.9,
              friction: 4,
              useNativeDriver: false,
            }),
          ]).start();
          if (velocity > 0) {
            Alert.alert("handle Right Decay")
            // handleRightDecay();
          } else {
            // handleLeftDecay();
            Alert.alert("handle Left Decay")
          }
        } else {
          Animated.spring(animation, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;



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
        
      <View style={{ height:"65%" ,}}>
      {homeData
        .slice(0, 2)
        .reverse()
        .map((item, index, items) => {
          // check if it's top card
          const isLastItem = index === items.length - 1;
          // apply panHandlers if it's top card
          const panHandlers = isLastItem ? { ..._panResponder.panHandlers } : {};
          // check if it's next card
          const isSecondToLast = index === items.length - 2;
          // rotate from -30 degree to +30 degree for swipe distance of -200 to +200
          const rotate = animation.x.interpolate({
            inputRange: [-200, 0, 200],
            outputRange: ['-30deg', '0deg', '30deg'],
            extrapolate: 'clamp',
            // make sure the rotation doesn't go beyong 30 degrees.
          });

          // prepare card styles
          const animatedCardStyles = {
            transform: [{ rotate }, ...animation.getTranslateTransform()],
            opacity,
          };
          const cardStyle = animatedCardStyles
          const nextStyle = isSecondToLast
            && { transform: [{ scale: scale }], borderRadius: 5 }


          return (
            <Animated.View
              {...panHandlers}
              style={[styles.card, cardStyle, nextStyle]}  // apply styles
              key={item.id}>
              <TouchableOpacity >
              <Image
                source={{ uri: property?.featured_image_src }} style={styles.slider} />
            </TouchableOpacity>
            <View style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            width: '100%',
            height: '25%',
            justifyContent: 'space-between',
            alignItems: 'center',
             backgroundColor:"red"
          }}>

            </View>
            {/* <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            width: '90%',
            height: '10%',
            marginRight: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
             <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',

          }}>
            <TouchableOpacity
              onPress={() => {
                setProductId(item.ID);
                setReviewTitle(item.title);
                toggleModal();
              }}>

              <Image
                source={Images.star}
                style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
            </TouchableOpacity>
            <Text style={{
              fontSize: 14, color: Colors.black,
              textAlign: 'center', marginLeft: 5, fontFamily: 'Poppins-Regular'
            }}>
              {property?.total_average_rating}
            </Text>
          </View>
          </View> */}
              {/* <View style={styles.textContainer}> */}
                {/* <Text style={styles.nameText}>{property?.ID}</Text> */}
                {/* <Text style={styles.nameText}>{property?.ID}</Text> */}
              {/* </View> */}
            </Animated.View>
          );
        })}
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
    // width: screenWidth,
    // height: 300,
    // justifyContent: 'center',
    // alignItems: 'center',
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
  cardContainer: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    // overflow: 'hidden',
   // Adjust the margin-bottom as needed to create spacing between cards
    zIndex: 1, 
  },
  card: {
    width: '100%',
    height: 300,
    backgroundColor: '#f4f4f4',
    position: 'absolute',
    borderRadius: 10,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
      web: {
        boxShadow: '0 3px 5px rgba(0,0,0,0.10), 1px 2px 5px rgba(0,0,0,0.10)',
      },
    }),
    borderWidth: 1,
    borderColor: '#FFF',
  },
  imageContainer: {
    flex: 1
  },
  image: {
    width: '100%',
    height: '100%'
  },
  textContainer: {
    padding: 10
  },
  nameText: {
    fontSize: 16,
  },
  animalText: {
    fontSize: 14,
    color: '#757575',
    paddingTop: 5
  }
})