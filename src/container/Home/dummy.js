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
import { useSelector, useDispatch } from 'react-redux';
import { getPoperties } from '../../modules/getPoperties';
import { getRating } from '../../modules/getRating';
import { postRating } from '../../modules/postRating';
import { Card, Button } from 'react-native-elements';
import DeckSwiper from 'react-native-deck-swiper';
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

const Home = () => {


  const [currentSlide, setCurrentSlide] = useState(0);
  const [adress, setAddres] = useState('');
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [homeData, setHomeData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPopertiesApiCall();
    getFilterApiCall();
  }, []);
  const getFilterApiCall = () => {
    dispatch(getFilter()).then(response => {
      console.log('res', response.payload);
      setFilterData(response.payload.data);
    });
  };
  const getPopertiesApiCall = () => {
    dispatch(getPoperties()).then(response => {
      console.log('res getPoperties', response.payload);
      setHomeData(response.payload.data);
      console.log(homeData,"data image data")
    });
  };
  const getNearByApiCall = () => {
    setLoading(true);
    dispatch(getNearBy()).then(response => {
      console.log('res', response.payload.data);
      setHomeData(response.payload.data);
    }).
      finally(() => {
        setLoading(false);
      });
  };
  const getSearchApiCall = () => {
    dispatch(getSearch(adress)).then(response => {
      console.log('res', response.payload);
      setHomeData(response.payload.data);
    });
  };


  const handleSlideChange = event => {
    const slideWidth = event.nativeEvent.layoutMeasurement.width;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor(offset / slideWidth);
    setCurrentSlide(index); console.log(selectedItem, "isSelectedisSelectedisSelected");

  };

  const scrollToIndex = index => {
    setIndex(index);
    flatListRef.current.scrollToIndex({ index });
  };


  const handleSwipeFromLeft = id => {
    //Vibration.vibrate(100);
    setData(prevData => prevData.filter(item => item.id !== id));
  };

  const handleSwipeFromRight = id => {
    //Vibration.vibrate(100);
    setData(prevData =>
      prevData.map(item => {
        if (item.id === id) {
          return { ...item, liked: true };
        }
        return item;
      }),
    );
  };


  const onDone = () => {
    navigation.navigate('Tabs', { screen: 'Home' });
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
            }}>
            <SvgUri
              style={{ height: 25, width: 25, resizeMode: 'contain' }}
              uri={item.term_icon_url}
            />
            <Text
              style={{
                fontSize: 12,
                color: isSelected ? Colors.black : Colors.gray,
                marginTop: 5,
                fontWeight: isSelected ? 'bold' : 'normal',
                fontFamily:'Poppins-Regular'
                
              }}>
              {item.term_name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };


  return (

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
          // shadowOffset: {
          //   width: 0,
          //   height: 2,
          // },
          // shadowOpacity: 0.17,
          // // shadowRadius: 3.05,
          // elevation: 1
          backgroundColor: '#fff',
          elevation: 4, // Android shadow property
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
            // backgroundColor:"yellow",


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
          onScroll={handleSlideChange}
          onMomentumScrollEnd={handleSlideChange}
          renderItem={renderFillterItem}
        // extraData={selectedItem}
        />
      </View>
      <View style={{ height: Platform.OS == 'android' ? '74%' : '84%' }}>
        {/* <AppIntroSlider
          renderItem={({ item }) => <Item item={item} />}
          showNextButton={false}
          showPrevButton={false}
          showDoneButton={false}
          data={homeData}
          pagingEnabled={true}
          bottomButton={false}
          activeDotStyle={{ position: 'absolute' }}
          dotStyle={{ position: 'absolute' }}
        /> */}
           <DeckSwiper
        cards={homeData}
        renderCard={(card) => <Item item={card} />}
        onSwiped={(cardIndex) => console.log(cardIndex)}
        onSwipedLeft={(cardIndex) => console.log(cardIndex)}
        onSwipedRight={(cardIndex) => console.log(cardIndex)}
        cardIndex={0}
        backgroundColor="transparent"
        stackSize={1}
        infinite
        animateCardOpacity
        swipeBackCard
      />
      </View>
    </SafeAreaView>
  );
};
const Item = ({ item, onSwipeFromLeft, onSwipeFromRight }) => {
  if (!item || !item.featured_image_src) {
    return null; // or render a placeholder component if needed
  }
  const handleSwipeLeft = () => {
    console.log('Swiped Left');
    // Handle any logic or actions when swiped left
    onSwipeFromLeft();
  };

  const handleSwipeRight = () => {
    console.log('Swiped Right');
    // Handle any logic or actions when swiped right
    onSwipeFromRight();
  };
  console.log(item,"itemrespone")
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = () => { setModalVisible(!modalVisible); };
  const [rating, setRating] = useState(0);
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [review, setReview] = useState('');
  const [text, setText] = useState('')
  const [showIcon, setShowIcon] = useState(false);
  const [Icon, setIcon] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIcon(false);
      setIcon(false)
    }, 2000);

    return () => clearTimeout(timer);
  }, [showIcon]);

  useEffect(() => {
    const icontime = setTimeout(() => {
      setIcon(false)
    }, 2000);

    return () => clearTimeout(icontime);
  }, [Icon]);


  const position = useRef(new Animated.ValueXY()).current;
  const swipeThreshold = 120; // Minimum distance required to trigger a swipe action
  const likeOpacity = position.x.interpolate({
    inputRange: [0, swipeThreshold],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = position.x.interpolate({
    inputRange: [-swipeThreshold, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        if (gesture.dx < -swipeThreshold) {
          setShowIcon(true);
        } else {
          setShowIcon(false);
        };
        if (gesture.dx > swipeThreshold) {
          setIcon(true);
        } else {
          setIcon(false);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > swipeThreshold) {
          trashfile(item.ID);
          console.log("trash files")
          // Right swipe, delete action
          // Perform your delete logic here
          resetPosition();
        } else if (gesture.dx < -swipeThreshold) {
          saveFile(item.ID)
          console.log("save File")
          // Left swipe, like action
          // Perform your like logic here

          resetPosition();
        } else {
          // No significant swipe, reset position
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start();
  };


  const dispatch = useDispatch();
  useEffect(() => {
    getRatingApiCall();
  }, []);
  const getRatingApiCall = () => {
    dispatch(getRating()).then(response => {
      console.log('getRatingData', response.payload);
      setRating(response.payload.data[0]?.photo_wuality_rating);
      setRating(response.payload.data[0]?.description_review_stars);
      setRating(response.payload.data[0]?.price_review_stars);
      setRating(response.payload.data[0]?.interest_review_stars);
      console.log();
    });
  };
  const renderNextButton = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: -40,
          right: -150,
          zIndex: 99,
        }}>
        <Image
          style={{
            height: 20,
            width: 20,
            resizeMode: 'contain',
            tintColor: Colors.white,
            transform: [{ rotate: '-90deg' }],
          }}
          source={Images.downArrow}></Image>
      </View>
    );
  };
  const renderPrevButton = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          position: 'absolute',
          top: -40,
          left: -180,
          zIndex: 99,
        }}>
        <Image
          style={{
            height: 20,
            width: 20,
            resizeMode: 'contain',
            tintColor: Colors.white,
            transform: [{ rotate: '90deg' }],
          }}
          source={Images.downArrow}></Image>
      </View>
    );
  };

  const addReview = async post_id => {
    const id = await AsyncStorage.getItem('userId');

    let formdata = {
      userID:id,
      postid:productId,
      comment_content:review,
      review_title:reviewTitle,
      review_stars:rating,
      photo_quality_rating:rating,
      desc_stars:rating,
      price_stars:rating,
      interest_stars:rating,
      content:review,
      reviewtitle:reviewTitle
    };
    console.log(formdata, "formdataformdata");
    dispatch(postRating(formdata)).then(response => {
      console.log('res', response.payload);
      if (response.payload.success) {
        Alert.alert('Alert', response.payload.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.message);
      }
      // setFilterData(response.payload.data);
    });
  };

  const saveFile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');
    const headers = {
      'Content-Type': 'application/json',
    };
    let data = new FormData();
    data.append('userID', userID);
    data.append('post_id', post_id);
    try {
      var res = await axios.post(
        'https://surf.topsearchrealty.com/webapi/v1/favorites/addremovefavorite.php',
        data,
      );

      console.log('--ppp', res);
      // console.log('--ppp', typeof res.status);

      if (res.status == 200) {
        Alert.alert(res.data.message);
      } else {
        Alert.alert('something went wrong!.');
      }
    } catch (err) {
      console.log('err', err);
    }
  };
  const trashfile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');
    const headers = {
      'Content-Type': 'application/json',
    };
    let data = new FormData();
    data.append('userID', userID);
    data.append('post_id', post_id);
    try {
      var res = await axios.post(
        'https://surf.topsearchrealty.com/webapi/v1/trashlist/addremovetrash.php',
        data,
      );

      console.log('--ppp', res.data);

      if (res.status == 200) {
        console.log('--ppp', res.data);
        Alert.alert(res.data.message);
      } else {
        Alert.alert('something went wrong!.');
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const shareContent = async () => {
    try {
      const result = await Share.share({
        message: 'Check out this awesome app!',
        url: 'https://example.com',
        title: 'My RN App',
      });
      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share operation dismissed');
      }
    } catch (error) {
      console.log(`Error sharing content: ${error.message}`);
    }
  };

  const CardItem = ({ item }) => {
    return (
      <Card>
          <Image
                source={{ uri: item.featured_image_src }} style={styles.slider} />
      </Card>
    );
  };


  return (
    <ScrollView>
      <View style={{ flex: 1 }}>

     <View style={styles.slideOuter}>
        <TouchableOpacity
      style={styles.cardContainer}
    >
      <Image
        source={{ uri: item.featured_image_src }}
        style={
          styles.slider}
      />
    </TouchableOpacity> 

          {/* <Animated.View
            style={[
              position.getLayout(),
              {},
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity >
              <Image
                source={{ uri: item.featured_image_src }} style={styles.slider} />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
            </View>
            <Animated.View style={{ position: 'absolute', top: 20, left: 20, opacity: likeOpacity }}>
              <Image source={Images.deletelike} style={{ height: 245, width: 45,  }} />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', top: 20, right: 20, opacity: nopeOpacity }}>
              <Image source={Images.favlike} style={{ height: 245, width: 45, }} />
            </Animated.View>
          </Animated.View> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            width: '90%',

            height: '10%',
            marginTop: Platform.OS == 'android' ? -10 : 0,
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
                setReviewTitle(item.title)
                toggleModal();
              }}>

              <Image
                source={Images.star}
                style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
            </TouchableOpacity>
            <Text style={{ fontSize: 14, color: Colors.black,
               textAlign: 'center', marginLeft: 5,fontFamily:'Poppins-Regular' }}>
              {item.total_average_rating}
            </Text>
          </View>

          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={() => { }}>
            <Text
              style={{
                fontSize: 18,
                color: Colors.primaryBlue,
                fontWeight: '500',
                fontFamily:'Poppins-Regular'
              }}>
              {item.originallistprice}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => shareContent()}>
            <Image
              source={Images.send}
              style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView >

          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={toggleModal}>
            <View
              style={{
                // marginTop: 40,
                height: '80%',
                width: '100%',
                alignItems: 'center',
                alignContent: 'center',
                backgroundColor: Colors.white,
                position: 'absolute',
                bottom: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                borderWidth: 1,
                borderColor: Colors.gray,
              }}>
              <View
                style={{
                  height: '10%',
                  width: '90%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 10,
                  }}>
                  <Text style={{ fontSize: 12, color: Colors.gray }}></Text>
                </TouchableOpacity>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      height: 5,
                      width: 50,
                      borderRadius: 8,
                      backgroundColor: Colors.gray,
                    }}></TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: Colors.black,
                      marginTop: 10,
                      fontFamily:'Poppins-Regular'
                    }}>
                    Rate and Review
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 10,
                  }}>
                  <Image
                    style={{
                      height: 20,
                      width: 20,
                      resizeMode: 'contain',
                      tintColor: Colors.black,
                      transform: [{ rotate: '45deg' }],
                    }}
                    source={Images.plus}></Image>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: Colors.gray,
                  marginTop: 10,
                  justifyContent: 'center',
                }}></View>
              <View style={{ width: '95%', height: '70%' }}>
                <View style={{ width: '95%', alignSelf: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Text style={{ fontSize: 12, 
                      color: Colors.black,fontFamily:'Poppins-Regular' }}>
                      Photos Quality Rating :
                    </Text>
                    <Rating
                      type="custom"
                      ratingCount={5}
                      imageSize={25}
                      startingValue={rating}
                      ratingBackgroundColor="#c8c7c8"
                      onFinishRating={setRating}
                      style={styles.rating}
                      ratingColor="#ffbe0b"
                    //tintColor="#f1f3f4"
                    />
                  </View>
                </View>

                <View style={{ width: '95%', alignSelf: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 12, color: Colors.black,fontFamily:'Poppins-Regular' }}>
                      Description & Details :
                    </Text>
                    <Rating
                      type="custom"
                      ratingCount={5}
                      imageSize={25}
                      startingValue={rating}
                      ratingBackgroundColor="#c8c7c8"
                      onFinishRating={setRating}
                      style={styles.rating}
                      ratingColor="#ffbe0b"
                    //tintColor="#f1f3f4"
                    />
                  </View>
                </View>
                <View style={{ width: '95%', alignSelf: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 12, color: Colors.black,fontFamily:'Poppins-Regular' }}>
                      Price Of Property :
                    </Text>
                    <Rating
                      type="custom"
                      ratingCount={5}
                      imageSize={25}
                      startingValue={rating}
                      ratingBackgroundColor="#c8c7c8"
                      onFinishRating={setRating}
                      style={styles.rating}
                      ratingColor="#ffbe0b"
                    //tintColor="#f1f3f4"
                    />
                  </View>
                </View>

                <View style={{ width: '95%', alignSelf: 'center' }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={{ fontSize: 12, color: Colors.black,fontFamily:'Poppins-Regular' }}>
                      General Interest in the property :
                    </Text>
                    <Rating
                      type="custom"
                      ratingCount={5}
                      imageSize={25}
                      startingValue={rating}
                      ratingBackgroundColor="#c8c7c8"
                      onFinishRating={setRating}
                      style={styles.rating}
                      ratingColor="#ffbe0b"
                    //tintColor="#f1f3f4"
                    />
                  </View>
                </View>


                <View style={{ height: 20 }}></View>
                <View style={{ width: '95%', alignSelf: 'center' }}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: Colors.black,
                      marginTop: 12,
                      fontFamily:'Poppins-Regular'
                    }}>
                    Review
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 100,
                      marginTop: 10,
                      //justifyContent: 'center',
                    }}>
                    <TextInput
                      // allowFontScaling={false}
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        height: '100%',
                        paddingHorizontal: 12,
                        color: Colors.black,
                        borderWidth: 1,
                        borderColor: Colors.gray,
                        fontSize: 14,
                        // padding: 2,
                        alignItems:"flex-start",
                        alignSelf:"flex-start",
                        verticalAlign:"top",
                        fontFamily:'Poppins-Regular'
                      }}
                      //keyboardType="default"
                      autoCorrect={false}
                      returnKeyType="done"
                      placeholderTextColor={Colors.gray}
                      placeholder='Write a review...'
                      onChangeText={text => setReview(text)}
                    />
                  </View>
                </View>
                <View style={{

                  width: '100%',

                  flexDirection: 'row',
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingHorizontal: 10
                }}>

                  <TouchableOpacity
                    onPress={() => addReview()}
                    // onPress={() => setModalVisible(false)}
                    // onPress={Alert.alert("Hyy")}
                    style={{
                      height: 35,
                      width: '45%',
                      borderRadius: 5,
                      backgroundColor: Colors.PrimaryColor,
                      marginTop: 10,


                      flexDirection: 'row',
                      alignItems: "center",
                      justifyContent: "center"

                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '700',
                        color: Colors.white,
                        fontFamily:'Poppins-Regular'
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>

        <View
          style={{
         
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ViewPropertiy', { data: item, postid:item.ID })}
            style={{ width: '98%', alignSelf: 'center', justifyContent: 'center' }}>
            <Text
              style={{ fontSize: 16, color: Colors.black, 
              textAlign: 'center',fontFamily:'Poppins-Regular' }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            height: '5%',
            marginTop: 30,
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          {item.property_bedrooms != '' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.bed}
                style={{ height: 30, width: 30, resizeMode: 'contain' }}></Image>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black,
                  textAlign: 'center',
                  fontFamily:'Poppins-Regular'
                }}>
                {item.property_bedrooms} {'Beds'}
              </Text>
            </View>
          ) : null}
          {item.bathroomsfull != '' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.bath}
                style={{ height: 30, width: 30, resizeMode: 'contain' }}></Image>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black,
                  textAlign: 'center',
                  fontFamily:'Poppins-Regular'
                }}>
                {item.bathroomsfull} {'Baths'}
              </Text>
            </View>
          ) : null}
          {item.property_size != '' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.measuring}
                style={{ height: 30, width: 30, resizeMode: 'contain' }}></Image>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black,
                  textAlign: 'center',
                  fontFamily:'Poppins-Regular'
                }}>
                {item.property_size}{'sq ft'}
              </Text>
            </View>
          ) : null}
          {item.associationfee != '' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>

              <Text
                style={{
                  fontSize: 20,
                  color: Colors.black,
                  textAlign: 'center',
                }}>
                {"HOA"}
              </Text>
              {/* <Image
              source={Images.hoa}
              style={{height: 25, width: 25, resizeMode: 'contain'}}></Image> */}
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black,
                  marginTop: 6,
                  textAlign: 'center',
                  fontFamily:'Poppins-Regular'
                }}>
                {'$'}{item.associationfee == null ? 0 : item.associationfee}
              </Text>
            </View>
          ) : null}
          {item.property_size != '' ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.tax}
                style={{ height: 28, width: 28, marginTop: 10, resizeMode: 'contain' }}></Image>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.black,
                  textAlign: 'center',
                  fontFamily:'Poppins-Regular'
                }}>
                {'$'}{item.taxannualamount == null ? 0 : item.taxannualamount}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={{
          width: '100%',
          // marginHorizontal:20,
          marginVertical: 20,
          paddingHorizontal: 20,
          flexDirection: 'row',

          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center'
        }}>
          {
            Icon && (
              <View style={{ height: 60, width: 60, borderWidth: 1, borderColor: 'gray', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={Images.fill} style={{ height: 32, width: 30 }} />
              </View>
            )
          }

          {showIcon && (
            <View style={{ flex: 1, flexDirection: 'row-reverse' }}>
              <View style={{ height: 60, width: 60, borderWidth: 1, borderColor: 'gray', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={Images.fillgreen} style={{ height: 35, width: 30, }} />
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>

  );
};
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
  // slide: {
  //   width: screenWidth - 20,
  //   height: 300,
  //   borderRadius: 18,



  // },
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
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default Home;

