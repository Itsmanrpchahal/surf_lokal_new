import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  PanResponder,
  Dimensions,
  Platform,
  FlatList,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { getPoperties } from '../../modules/getPoperties';
import { postRating } from '../../modules/postRating';
import { getFilter } from '../../modules/getFilter';
import { SvgUri } from 'react-native-svg';
import { Rating } from 'react-native-ratings';
import { postUpdateRating } from '../../modules/postUpdateRating';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import clamp from 'clamp';
import { store } from '../../redux/store';
import { addToFavorite } from '../../modules/addToFavorite';
import { addRemoveTrash } from '../../modules/addRemoveTrash';
import { getRating } from '../../modules/getRating';

const { width } = Dimensions.get('screen');
const SWIPE_THRESHOLD = 0.25 * width;

const Home = () => {
  const bedRoomData = [
    { label: 'Any', value: 'any' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8+', value: '8' },
  ]
  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
  const dispatch = useDispatch();
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adress, setAddres] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();
  const [productId, setProductId] = useState();
  const [reviewTitle, setReviewTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [showIcon, setShowIcon] = useState(false);
  const [ratingData, setRatingData] = useState([])
  const [isEditing, setIsEditing] = useState(false);
  const [isSelected, setIsSelected] = useState(false)
  const [Icon, setIcon] = useState(false);
  const [bedroomitem, setBedroomItem] = useState(-1)
  const [bathRoom, setBathRoomItem] = useState(-1)
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIcon(false);
      setIcon(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showIcon]);

  useEffect(() => {
    const icontime = setTimeout(() => {
      setIcon(false);
    }, 1000);

    return () => clearTimeout(icontime);
  }, [Icon]);

  useEffect(() => {
    getFilterApicall()
    getRatingApicall()
  }, []);
  const getFilterApicall = () => {
    dispatch(getFilter()).then(response => {
      setFilterData(response.payload.data)
    })
  }
  const getRatingApicall = () => {
    dispatch(getRating()).then(response => {
      setRatingData(response.payload.data)
    })
  }
  const position = useRef(new Animated.ValueXY()).current;
  const swipeThreshold = 120; // Minimum distance required to trigger a swipe action

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const filtertoggleModal = () => {
    // setFilterModalVisible(!filterModalVisible);
  };

  const addReview = async post_id => {
    const id = await AsyncStorage.getItem('userId');
    let formdata = {
      userID: id,
      postid: productId,
      comment_content: review,
      review_title: reviewTitle,
      review_stars: rating,
      photo_quality_rating: rating,
      desc_stars: rating,
      price_stars: rating,
      interest_stars: rating,
      content: review,
      reviewtitle: reviewTitle,
    };
    dispatch(postRating(formdata)).then(response => {
      if (response.payload.success) {
        Alert.alert('Alert', response.payload.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.message);
      }
    });
  };

  const savefile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');

    let payload = {
      userID: userID,
      post_id: post_id,
    };

    await dispatch(addToFavorite(payload)).then(response => {
      if (response.payload.success) {
        // Alert.alert('Alert', response.payload.message);
      } else {
        // Alert.alert('Alert', response.payload.message);
      }
    });
  };

  const trashfile = async post_id => {
    const userID = await AsyncStorage.getItem('userId');

    let payload = {
      userID: userID,
      post_id: post_id,
    };

    await dispatch(addRemoveTrash(payload)).then(response => {
      if (response.payload.success) {
        // Alert.alert('Alert', response.payload.message);
      } else {
        // Alert.alert('Alert', response.payload.message);
      }
    });
  };

  const property = homeData[0];

  useEffect(() => {
    Promise.all[getPopertiesApiCall({ type: 0, data: '' })];
  }, []);

  const getPopertiesApiCall = async type => {
    setLoading(true);
    await dispatch(getPoperties(type));
    store.getState().getPoperties.getPopertiesData?.data &&
      setHomeData(store.getState().getPoperties.getPopertiesData?.data);
    setLoading(false);
  };
  const updateReview = async (post_id) => {
    const id = await AsyncStorage.getItem('userId');
    const formData = new FormData();
    formData.append('userID', id);
    formData.append('postid', productId);
    formData.append('comment_content', review);
    formData.append('review_title', reviewTitle);
    formData.append('review_stars', rating);
    formData.append('description_review_stars', rating);
    formData.append('price_review_stars', rating);
    formData.append('interest_review_stars', rating);
    formData.append('reviewtitle', reviewTitle)
    dispatch(postUpdateRating(formData)).then((response) => {
      if (response.payload.success) {
        Alert.alert('Alert', response.payload.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.message);
      }
    });
  };
  const renderFillterItem = ({ item }) => {
    const isSelected = selectedItem === item.counter_id;

    return (
      <View style={{}}>
        <TouchableOpacity

          onPress={() => {
            setSelectedItem(item.counter_id)
            setIsSelected(true)
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5,
              marginRight: 5,
              // width: 110
              paddingRight: 10
            }}>
            <SvgUri
              height={30}
              width={30}
              uri={item.term_icon_url}

            />
            <Text
              style={{
                fontSize: 12,
                color: isSelected ? Colors.surfblur : Colors.newgray,
                marginTop: 3,
                fontWeight: isSelected ? 'normal' : 'normal',
                fontFamily: 'Poppins-Regular',
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
  }, []);

  useEffect(() => {
    console.log("ICONn", Icon)
    console.log("setIcon", showIcon)
  }, [Icon, showIcon])
  const animation = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const bin = new Animated.Value(0);
  const fav = new Animated.Value(0);


  const _panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        animation.setValue({ x: gesture.dx, y: gesture.dy });
        if (gesture.dx < -swipeThreshold) {
          setShowIcon(true);
          console.log('I am here')
        } else {
          setShowIcon(false);
          console.log('I am where')

        };
        if (gesture.dx > swipeThreshold) {
          setIcon(true);
          console.log('I am here1')

        } else {
          setIcon(false);
          console.log('I am where1')
        }
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
            console.log(
              'right',
              (postID =
                store.getState().getPoperties.getPopertiesData?.data[0].ID),
            );

            savefile(postID);
          } else {
            console.log(
              'left',
              (postID =
                store.getState().getPoperties.getPopertiesData?.data[0].ID),
            );
            trashfile(postID);
          }
        } else {
          Animated.spring(animation, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
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
        style={
          Platform.OS == 'android' ? styles.container : styles.containerIos
        }>
        <View
          style={{
            height: '100%',
          }}>
          <View
            style={{
              width: '100%',
              paddingVertical: 18,
              justifyContent: 'center',
              borderRadius: 5,
              marginBottom: 4,
              alignItems: 'center',
              flexDirection: 'row',
              //shadowColor: '#000',
              backgroundColor: '#fff',
              // elevation: 4,
              // shadowColor: '#000',
              // shadowOffset: { width: 0, height: 2 },
              // shadowOpacity: 0.2,
              // shadowRadius: 4,
            }}>
            <View
              style={{
                height: 50,
                width: '85%',
                borderRadius: 100,
                borderWidth: 1,
                borderColor: Colors.BorderColor,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => getPopertiesApiCall({ type: 2, data: adress })}
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
                    marginLeft: 5,
                  }}></Image>
              </TouchableOpacity>
              <View style={{ width: '65%' }}>
                <TextInput
                  allowFontScaling={false}
                  placeholderTextColor={"#494949"}
                  fontFamily={'Poppins-Regular'}
                  placeholder={'Surf... powered by ChatGPT'}
                  returnKeyType="done"
                  onChangeText={text => setAddres(text)}
                  style={{
                    fontSize: 14,
                    color: '#000',
                    marginLeft: 7,
                    position: "relative",
                    top: 3
                  }}
                />
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <TouchableOpacity
                  style={{
                    height: 50,
                    justifyContent: 'center',
                    borderLeftWidth: 1,
                    borderLeftColor: Colors.BorderColor,
                  }}>
                  <Image
                    source={Images.address}
                    style={{
                      height: 20,
                      width: 20,
                      marginLeft: 8,
                      resizeMode: 'contain',
                    }}></Image>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {loading ? (
                <ActivityIndicator size="small" color="blue" />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    getPopertiesApiCall({ type: 1, data: '' });
                  }}
                  style={{}}>
                  <Image
                    source={Images.gps}
                    style={{
                      height: 25,
                      width: 25,
                      marginLeft: 12,
                      resizeMode: 'contain',
                    }}></Image>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={{
              width: '92%',
              alignSelf: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}>
            <FlatList
              data={filterData}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderFillterItem}
            />
          </View>

          {
            isSelected && <View >
              <View style={{ width: '100%', flexDirection: "row", justifyContent: 'space-evenly' }}>
                {/* <Button title='Saved search'/> */}
                <TouchableOpacity
                  style={[
                    styles.rew,
                    {
                      backgroundColor: 'white',
                      borderColor: 'black',
                    },
                  ]}
                >
                  <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>Save Search</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => filtertoggleModal()}
                  style={[
                    styles.rew,
                    {
                      backgroundColor: 'white',
                      borderColor: 'black',
                    },
                  ]}
                >
                  <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>Filters</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsSelected(false)
                    setSelectedItem(null)
                  }}
                  style={[
                    styles.rew,
                    {
                      backgroundColor: "white",
                      borderColor: 'black',
                    },
                  ]}
                >
                  <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>Clear filters</Text>
                </TouchableOpacity>

              </View>
              <KeyboardAvoidingView >

                <Modal
                  transparent={true}
                  animationType="slide"
                  visible={filterModalVisible}
                  onRequestClose={filtertoggleModal}>
                  <View
                    style={{
                      // marginTop: 40,
                      height: '95%',
                      width: '100%',
                      alignItems: 'center',
                      alignContent: 'center',
                      backgroundColor: Colors.white,
                      position: 'absolute',
                      bottom: 10,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      // borderBottomRightRadius: 20,
                      //borderBottomLeftRadius: 20,
                      borderWidth: 1,
                      borderColor: Colors.gray,

                    }}
                  >
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
                          // marginTop: 10,
                        }}>
                      </View>

                      <TouchableOpacity
                        onPress={() => setFilterModalVisible(false)}
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
                      <Text style={{}}>Choose your city</Text>
                      <MultiSelect
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={data}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Select item"
                        searchPlaceholder="Search..."
                        value={selected}
                        onChange={item => {
                          setSelected(item);
                        }}

                      />
                      <Text style={{}}>Bedrooms</Text>
                      <FlatList
                        data={bedRoomData}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity onPress={() => { setBedroomItem(index) }}>
                              <View style={{ width: 70, height: 40, marginTop: 8, marginHorizontal: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: bedroomitem === index ? Colors.black : Colors.white }}>
                                <Text style={{ color: bedroomitem === index ? Colors.white : Colors.black }}>{item.label}</Text>
                              </View>
                            </TouchableOpacity>
                          )
                        }}
                      >

                      </FlatList>

                      <Text syle={{}}>Bathrooms</Text>
                      <FlatList
                        data={bedRoomData}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                          return (
                            <TouchableOpacity onPress={() => { setBathRoomItem(index) }}>
                              <View style={{ width: 70, height: 40, marginTop: 8, marginHorizontal: 10, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.black, backgroundColor: bathRoom === index ? Colors.black : Colors.white }}>
                                <Text style={{ color: bathRoom === index ? Colors.white : Colors.black }}>{item.label}</Text>
                              </View>
                            </TouchableOpacity>
                          )
                        }}
                      ></FlatList>



                      <Text style={{}}>Square Feet</Text>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <TextInput
                          style={{ borderWidth: 1, width: '47%', borderColor: Colors.black, borderRadius: 10, padding: 6 }}
                          placeholder='Min Price'
                          keyboardType='numeric'>

                        </TextInput>
                        <TextInput
                          style={{ borderWidth: 1, width: '47%', borderColor: Colors.black, borderRadius: 10, padding: 6 }}
                          placeholder='Max Price'
                          keyboardType='numeric'>

                        </TextInput>
                      </View>

                      <Text style={{}}>Price Range</Text>

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>

                        <MultiSelect
                          style={{ width: '47%', borderColor: Colors.black, borderWidth: 1, borderRadius: 10, paddingLeft: 6, paddingRight: 6, paddingTop: 4, paddingBottom: 4 }}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={data}
                          search
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Min Price"
                          searchPlaceholder="Search..."
                          value={selected}
                          onChange={item => {
                            setSelected(item);
                          }}

                        />
                        <MultiSelect
                          style={{ width: '47%', borderColor: Colors.black, borderWidth: 1, borderRadius: 10, paddingLeft: 6, paddingRight: 6, paddingTop: 4, paddingBottom: 4 }}

                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={data}
                          search
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder="Max Price"
                          searchPlaceholder="Search..."
                          value={selected}
                          onChange={item => {
                            setSelected(item);
                          }}

                        />
                      </View>
                      <View style={{

                        width: '100%',

                        flexDirection: 'row',
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingHorizontal: 10
                      }}>

                        <TouchableOpacity
                          // onPress={() => addReview()}
                          onPress={() => setFilterModalVisible(false)}
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
                            }}>
                            Apply
                          </Text>
                        </TouchableOpacity>

                      </View>

                    </View>
                  </View>

                </Modal>
              </KeyboardAvoidingView>
            </View>
          }
          <View
            style={{
              width: '92%',
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: 12,
            }}>
            {homeData
              .slice(0, 2)
              .reverse()
              .map((item, index, items) => {
                const isLastItem = index === items.length - 1;
                const panHandlers = isLastItem
                  ? { ..._panResponder.panHandlers }
                  : {};
                const isSecondToLast = index === items.length - 2;
                const rotate = animation.x.interpolate({
                  inputRange: [-200, 0, 200],
                  outputRange: ['-30deg', '0deg', '30deg'],
                  extrapolate: 'clamp',
                });
                const animatedCardStyles = {
                  transform: [{ rotate }, ...animation.getTranslateTransform()],
                  opacity,
                };
                const cardStyle = animatedCardStyles;
                const nextStyle = isSecondToLast && {
                  transform: [{ scale: scale }],
                  borderRadius: 5,
                };

                return (
                  <>
                    <View style={{ position: 'relative', width: '100%' }}>
                      <Animated.View
                        {...panHandlers}
                        style={[styles.card, cardStyle, nextStyle]}
                        key={item.id}>
                        {/* <View style={styles.marrowcover}>
                          <Text style={styles.leftarrowss}>
                            <Image
                              source={Images.leftarrow}
                              style={{
                                height: 35,
                                width: 35,
                                resizeMode: "contain"
                               
                              }}
                            /></Text>
                          <Text style={styles.rightarrow}> <Image
                            source={Images.rightarrow}
                            style={{
                              height: 35,
                              width: 35,
                              resizeMode: "contain",
                              marginLeft: 12
                             
                            }}
                          /></Text>
                        </View> */}
                        <View>
                          <View style={styles.slidercover}>
                            <Image
                              source={{ uri: property?.featured_image_src }}
                              style={styles.slider}
                            />
                          </View>
                          {
                            Icon && <View
                              style={{
                                backgroundColor: 'rgba(0, 128, 0, .6)',
                                height: '80%',
                                width: '100%',
                                borderRadius: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                                // opacity: fav

                              }}>
                              <View
                                style={{
                                  backgroundColor: Colors.white,
                                  height: 50,
                                  width: 50,
                                  borderRadius: 100,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Image
                                  source={Images.favlike}
                                  style={{
                                    height: 25,
                                    width: 25,
                                    // tintColor: 'transparent',
                                  }}
                                />
                              </View>
                            </View>
                          }
                          {
                            showIcon &&
                            <>
                              <View style={{
                                backgroundColor: 'rgba(255,0,0,0.4)',
                                height: '80%',
                                width: '100%',
                                borderRadius: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'absolute',
                              }} >
                                <View
                                  style={{
                                    backgroundColor: Colors.white,
                                    height: 50,
                                    width: 50,
                                    borderRadius: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>

                                  <Image
                                    source={Images.deletelike}
                                    style={{
                                      height: 25,
                                      width: 25,
                                      tintColor: 'red',
                                    }}
                                  />
                                </View>
                              </View>
                              {/* <Animated.View
                                style={{
                                  backgroundColor: 'rgba(255,0,0,0.4)',
                                  height: '80%',
                                  width: '100%',
                                  borderRadius: 0,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'absolute',
                                  opacity: bin
                                }}>
                                <View
                                  style={{
                                    backgroundColor: Colors.white,
                                    height: 50,
                                    width: 50,
                                    borderRadius: 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Image
                                    source={Images.deletelike}
                                    style={{
                                      height: 25,
                                      width: 25,
                                      tintColor: 'red',
                                    }}
                                  />
                                </View>
                              </Animated.View> */}
                            </>

                          }
                          <View
                            style={{
                              flexDirection: 'row',
                              width: '100%',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              backgroundColor: Colors.white,
                              paddingHorizontal: 12,
                              paddingVertical: 12,
                            }}>
                            <View
                              style={{
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
                                  style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: 'contain',
                                    marginTop: -6,
                                  }}></Image>
                              </TouchableOpacity>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: Colors.black,
                                  textAlign: 'center',
                                  marginLeft: 5,
                                  fontFamily: 'Poppins-SemiBold',
                                }}>
                                {property?.total_average_rating}
                              </Text>
                            </View>
                            <Text
                              onPress={() =>
                                navigation.navigate('ViewPropertiy', { item })
                              }
                              style={{
                                fontSize: 20,
                                color: Colors.primaryBlue,
                                fontWeight: '500',
                                fontFamily: 'Poppins-SemiBold',
                              }}>
                              {property?.property_price}
                            </Text>
                            <TouchableOpacity>
                              <Image
                                source={Images.send}
                                style={{
                                  height: 20,
                                  width: 20,
                                  resizeMode: 'contain',
                                }}
                              />
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
                                  height: '95%',
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
                                <View style={{}}>
                                  <Text
                                    style={{
                                      fontSize: 18,
                                      fontWeight: '700',
                                      color: Colors.black,
                                      marginTop: 10,
                                      marginRight: 180
                                    }}>
                                    Your Review
                                  </Text>
                                  <Text style={{ margin: 10, fontSize: 12, color: 'black' }}>{ratingData[0]?.comment_content}</Text>
                                  {!isEditing && (
                                    <TouchableOpacity
                                      onPress={() => setIsEditing(true)}
                                      style={{ marginTop: 10 }}>
                                      <Text style={{ fontSize: 12, color: 'blue' }}>Edit</Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                                <View style={{ width: '95%', height: '70%' }}>
                                  <View style={{ width: '95%', alignSelf: 'center' }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: 10,
                                      }}>
                                      <Text style={{ fontSize: 12, color: Colors.black, }}>
                                        Photos Quality Rating :
                                      </Text>
                                      <Rating
                                        type="custom"
                                        ratingCount={5}
                                        imageSize={25}
                                        startingValue={ratingData[0]?.photo_wuality_rating
                                        }
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
                                      <Text style={{ fontSize: 12, color: Colors.black }}>
                                        Description & Details :
                                      </Text>
                                      <Rating
                                        type="custom"
                                        ratingCount={5}
                                        imageSize={25}
                                        startingValue={ratingData[0]?.description_review_stars
                                        }
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
                                      <Text style={{ fontSize: 12, color: Colors.black }}>
                                        Price Of Property :
                                      </Text>
                                      <Rating
                                        type="custom"
                                        ratingCount={5}
                                        imageSize={25}
                                        startingValue={ratingData[0]?.price_review_stars
                                        }
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
                                      <Text style={{ fontSize: 12, color: Colors.black }}>
                                        General Interest in the property :
                                      </Text>
                                      <Rating
                                        type="custom"
                                        ratingCount={5}
                                        imageSize={25}
                                        startingValue={ratingData[0]?.interest_review_stars
                                        }
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


                                      {isEditing ? (
                                        <TextInput
                                          style={{
                                            margin: 10,
                                            fontSize: 12,
                                            color: 'black',
                                            borderWidth: 1,
                                            borderColor: 'gray',
                                            borderRadius: 5,
                                            padding: 5,
                                          }}
                                          value={review}
                                          onChangeText={text => setReview(text)}
                                          autoFocus
                                        />
                                      ) : (
                                        <Text style={{ margin: 10, fontSize: 12, color: 'black' }}>
                                          {ratingData[0]?.comment_content}
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                  <View style={{

                                    width: '100%',

                                    flexDirection: 'row',
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    paddingHorizontal: 10
                                  }}>
                                    {isEditing ? (
                                      <TouchableOpacity onPress={() => updateReview()} style={{ marginRight: 10 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.PrimaryColor }}>Update</Text>
                                      </TouchableOpacity>
                                    ) : (

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
                                          }}>
                                          Submit
                                        </Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>

                                </View>
                              </View>

                            </Modal>
                          </KeyboardAvoidingView>

                          <View
                            style={{
                              width: '100%',
                              alignSelf: 'center',
                              justifyContent: 'center',
                              backgroundColor: Colors.white,
                              paddingHorizontal: 12,
                            }}>
                            <Text
                              onPress={() =>
                                navigation.navigate('ViewPropertiy', { item })
                              }
                              style={{
                                fontSize: 15,
                                color: Colors.black,
                                marginBottom: 15,
                                textAlign: 'center',
                                fontFamily: 'Poppins-Medium',
                              }}>
                              {item.title}
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: 'row',
                              width: '100%',
                              backgroundColor: Colors.white,
                              alignSelf: 'center',
                              paddingHorizontal: 15,
                              justifyContent: 'space-between',
                              // position: "absolute",
                              // marginTop: 370
                            }}>
                            {property?.property_bedrooms != '' ? (
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={Images.bed}
                                  style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: 'contain',
                                  }}></Image>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Regular',
                                  }}>
                                  {property?.property_bedrooms} {'Beds'}
                                </Text>
                              </View>
                            ) : null}
                            {property?.bathroomsfull != '' ? (
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={Images.bath}
                                  style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: 'contain',
                                  }}></Image>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Regular',
                                  }}>
                                  {item.bathroomsfull} {'Baths'}
                                </Text>
                              </View>
                            ) : null}
                            {property?.property_size != '' ? (
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={Images.measuring}
                                  style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: 'contain',
                                  }}></Image>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Regular',
                                  }}>
                                  {property?.property_size}
                                  {'sq ft'}
                                </Text>
                              </View>
                            ) : null}
                            {property?.associationfee != '' ? (
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                  }}>
                                  {'HOA'}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: Colors.black,
                                    marginTop: 6,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Regular',
                                  }}>
                                  {item?.associationfee == null
                                    ? 0
                                    : item?.associationfee}{"0"}
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
                                  style={{
                                    height: 20,
                                    width: 20,
                                    marginTop: 0,
                                    resizeMode: 'contain',
                                  }}></Image>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Regular',
                                  }}>
                                  {property?.taxannualamount == null
                                    ? 0
                                    : property?.taxannualamount}
                                </Text>
                              </View>
                            ) : null}
                          </View>
                        </View>
                      </Animated.View>


                    </View>
                  </>
                );
              })}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  marrowcover: {
    width: "100%", flexDirection: "row",
    zIndex: 9,
    top: "30%",
    justifyContent: "space-between", position: "absolute"
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
  viewmain: { height: 300, marginBottom: 20 },
  innerviewmain: { height: 300, marginBottom: 20 },
  slide: {
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
    marginHorizontal: 12,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  // inputStyle: { fontSize: 55, },
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
    width: '100%',
    height: screenHeight / 2,
    borderRadius: 0,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8
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
    backgroundColor: "#0065C4",
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
    height: 'auto',
    backgroundColor: '#fdfdfd',
    position: 'absolute',
    borderRadius: 10,
    paddingBottom: 22,
    marginBottom: 22,
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
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    padding: 10,
  },
  nameText: {
    fontSize: 16,
  },
  animalText: {
    fontSize: 14,
    color: '#757575',
    paddingTop: 5,
  },
  rew: {
    width: 110,
    borderRadius: 8,
    borderWidth: 1,
    // paddingHorizontal:2,
    // backgroundColor: Colors.primaryBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
