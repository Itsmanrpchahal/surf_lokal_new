import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  Animated,
  PanResponder,
  FlatList,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Share,
  Keyboard
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
import CardsSwipe from 'react-native-cards-swipe';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import { store } from '../../redux/store';
import { addToFavorite } from '../../modules/addToFavorite';
import { addRemoveTrash } from '../../modules/addRemoveTrash';
import { getRating } from '../../modules/getRating';
import { ScrollView } from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE, Circle, Marker, Callout } from "react-native-maps";
import Collapsible from 'react-native-collapsible';
import { useIsFocused } from '@react-navigation/native';
import { getMoreFilter } from '../../modules/getMoreFilter';
import { useRef } from 'react';
import { getTrash } from '../../modules/getTrash';
import { getFavoriteProperties } from '../../modules/getFavoriteProperties';


const { width } = Dimensions.get('screen');

const Home = () => {
  const isFocused = useIsFocused();

  const [keyboardStatus, setKeyboardStatus] = useState('first');
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    updateKeyboard()

  }, [keyboardStatus])

  const updateKeyboard = async () => {
    if (keyboardStatus === 'Keyboard Hidden') {
      if (adress.length > 0) {
        let payload = {
          userID: user_ID,
          SearchParameters: adress,
        };
        await getPopertiesApiCall({ type: 2, data: payload, lntLng })
        setKeyboardStatus('first')
        setAddres("")
      }
    }
  }
  const dispatch = useDispatch();
  const [homeData, setHomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adress, setAddres] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [moreFilterData, setMoreFilterData] = useState([])
  const [selectedItem, setSelectedItem] = useState(null);
  const [cities, setCities] = useState([])
  const navigation = useNavigation();
  const [productId, setProductId] = useState();
  const [reviewTitle, setReviewTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tashModalVisiable, setTashModalVisiavle] = useState(false)
  const [favModalVisiable, setfavModalVisiable] = useState(false)
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingData, setRatingData] = useState([])
  const [isSelected, setIsSelected] = useState(false)
  const [bedroomitem, setBedroomItem] = useState(-1)
  const [bathRoom, setBathRoomItem] = useState(-1)
  const [imageIndex, setImageIndex] = useState(0)
  const [viewHeight, setViewHeight] = useState(80)
  const [user_ID, setUser_ID] = useState()
  const [lntLng, setLatLng] = useState({ latitude: 0.0, longitude: 0.0 })
  const [showMap, setShowMap] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mapType, setMapType] = useState('standard')
  const [isEditing, setIsEditing] = useState(false)
  const [moreFilter, setMoreFilter] = useState(false)
  const [maxPriceRange, setMaxPriceRange] = useState()
  const [minPricerange, setMinPricerange] = useState()
  const [minSquareFeet, setMinSquareFeet] = useState()
  const [maxSquareFeet, setMaxSquareFeet] = useState()
  const [bathRoomCount, setBathRoomCount] = useState()
  const [bedCount, setBedCount] = useState()

  useEffect(() => {
    getID()
  }, [])

  const getID = async () => {
    const id = await AsyncStorage.getItem('userId')
    setUser_ID(id)
  }

  useEffect(() => {
    if (isFocused) {
      Promise.all[
        getFilterApicall(),
        getRatingApicall(),
        getTrashApiCall(),
        favlistApi(),
        getMoreFilterApiCall(),
        getPopertiesApiCall({ type: 0, data: '', lntLng, })
      ]
    }

  }, [isFocused]);
  const getFilterApicall = () => {
    dispatch(getFilter()).then(response => {
      setFilterData(response.payload.data)
    })
  }
  const getMoreFilterApiCall = () => {
    dispatch(getMoreFilter()).then(response => {
      setMoreFilterData(response.payload.data)
    })
  }
  const getRatingApicall = () => {
    dispatch(getRating()).then(response => {
      setRatingData(response.payload.data)
    })
  }
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        slideAnimation.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // If the swipe distance is greater than 50, close the modal
          closeModal();
        } else {
          // Otherwise, reset the animation back to 0
          Animated.spring(slideAnimation, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const closeModal = () => {
    setModalVisible(false);
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
  const slideAnimations = useRef(new Animated.Value(0)).current;
  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        slideAnimations.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          // If the swipe distance is greater than 50, close the modal
          closeModals();
        } else {
          // Otherwise, reset the animation back to 0
          Animated.spring(slideAnimations, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;
  const filtertoggleModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };
  const trashToggleModal = () => {
    setTashModalVisiavle(!tashModalVisiable)
  }
  const favToggleModal = () => {
    setfavModalVisiable(!favModalVisiable)
  }
  const closeModals = () => {
    setFilterModalVisible(false);
  };
  const closeTrashModal = () => {
    setTashModalVisiavle(false);
  };
  const closeFavModal = () => {
    setfavModalVisiable(false);
  };


  const handleModalAnimations = () => {
    Animated.timing(slideAnimations, {
      toValue: filterModalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    handleModalAnimations();
  }, [filterModalVisible]);

  const handleShare = () => {
    Share.share({
      message: 'Check out this cool article I found!',
      url: 'https://example.com/article',
      title: 'Cool Article',
    });
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
  const favlistApi = () => {
    dispatch(getFavoriteProperties()).then(res => {
      // console.log('favlistApi', store.getState().getFavoriteProperties.getFavoritePropertiesData.count)

    })
  }        // Alert.alert('Aler', response.payload.message);

  const savefile = async item => {
    favlistApi()
    let payload = {
      userID: user_ID,
      post_id: item,
    };
    await dispatch(addToFavorite(payload)).then(response => {
      if (store.getState().getFavoriteProperties.getFavoritePropertiesData.count == 0) {
        favToggleModal()
        // Alert.alert('Alert', response.payload.message);
      } else {
        favToggleModal()
        // Alert.alert('Alert', response.payload.message);
      }
    });
  };
  const getTrashApiCall = async () => {
    await dispatch(getTrash()).then(res => {
      // console.log('getTrashApiCall', store.getState().getTrash.getTrashData.count)
    });

  }
  const trashfile = async post_id => {
    getTrashApiCall()
    let payload = {
      userID: user_ID,
      post_id: post_id,
    };
    // console.log('counttttt2', store.getState().getTrash.getTrashData.count)
    await dispatch(addRemoveTrash(payload)).then(response => {

      if (store.getState().getTrash.getTrashData.count == 0) {
        trashToggleModal()
      } else {
        trashToggleModal()
        // Alert.alert('Alert1');
      }
    });
  };

  const getCurretLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        //getting the Longitude from the location json
        const currentLongitude =
          JSON.stringify(position.coords.longitude);
        const currentLatitude =
          JSON.stringify(position.coords.latitude);
        setLatLng({ latitude: currentLatitude, longitude: currentLongitude })
        await getPopertiesApiCall({ type: 1, data: '', latLng: { latitude: currentLatitude, longitude: currentLongitude } })

      }, (error) => alert(error.message), {
      enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
    }
    );

  }

  const getPopertiesApiCall = async type => {
    setLoading(true);
    await dispatch(getPoperties(type));
    typeof store.getState().getPoperties.getPopertiesData?.data === 'object' ?
      store.getState().getPoperties.getPopertiesData?.data &&
      setHomeData(store.getState().getPoperties.getPopertiesData?.data) : setHomeData([])
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
          onPress={async () => {
            setSelectedItem(item.counter_id)
            setIsSelected(true)
            await getPopertiesApiCall({
              type: 3, data: {
                UserId: user_ID,
                data_custom_taxonomy: item.data_custom_taxonomy,
                data_customvalue: item.data_customvalue
              }, lntLng
            })

          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5,
              marginRight: 5,
              paddingRight: 10,
              marginBottom: 8
            }}>
            <SvgUri
              height={25}
              width={25}
              uri={item.term_icon_url}
              fontWeight="bold"
              fill={isSelected ? Colors.darbluec : "black"}
            />
            <Text
              style={{
                fontSize: 12,

                color: isSelected ? Colors.darbluec : Colors.newgray,

                fontFamily: isSelected ? 'Poppins-SemiBold' : 'Poppins-Regular',
                borderBottomColor: isSelected ? Colors.darbluec : 'transparent',
                borderBottomWidth: isSelected ? 1 : 0,

              }}>
              {item.term_name}
            </Text>
          </View>
        </TouchableOpacity >
      </View >
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }
  return (
    <SafeAreaView
      style={
        Platform.OS == 'android' ? styles.container : styles.containerIos
      }>

      <View
        style={{
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
            backgroundColor: '#fff',
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
              shadowColor: "#000",
              backgroundColor: Colors.white,
              shadowOffset: {
                width: 0,
                height: 3,
              },
              elevation: 3,
              shadowColor: '#52006A',
            }}>
            <View style={{ width: '78%' }}>
              <TextInput
                allowFontScaling={false}
                placeholderTextColor={"#858383"}
                fontFamily={'Poppins-Regular'}
                keyboardType='web-search'
                placeholder={'Surf local...'}
                returnKeyType="done"
                value={adress}
                onSubmitEditing={Keyboard.dismiss}
                onChangeText={text => setAddres(text)}
                style={{
                  fontSize: 12,
                  letterSpacing: 1,
                  color: '#000',
                  marginLeft: 1,
                  position: "relative",
                  top: 3,
                  // backgroundColor:"red",
                  width: '100%',
                  marginLeft: 15
                  // alignItems: "flex-start"
                }}
              />
            </View>
            <View style={{ width: '25%', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => { setShowMap(!showMap) }}
                style={{
                  height: 50,
                  justifyContent: 'center',
                  borderLeftWidth: 1,
                  borderLeftColor: Colors.BorderColor,
                }}>
                <Image
                  source={Images.address}
                  tintColor={showMap ? Colors.PrimaryColor : Colors.black}
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
                onPress={async () => {
                  await getCurretLocation()
                  setShowMap(false)
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
          isSelected &&
          <View >
            <View style={{
              width: '100%', flexDirection: "row",
              justifyContent: 'space-evenly', marginBottom: 10
            }}>
              <TouchableOpacity
                style={[
                  styles.rew,
                  {
                    backgroundColor: 'white',
                    borderColor: Colors.gray,
                    borderRadius: 10
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
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    backgroundColor: 'white',
                    borderColor: Colors.gray,
                    borderRadius: 10

                  },
                ]}
              >
                <Image source={Images.filtericon} style={{ height: 10, width: 10 }} />
                <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>  Filters    </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsSelected(false)
                  setSelectedItem(null)
                  getPopertiesApiCall({ type: 0, data: '', lntLng, })
                }}
                style={[
                  styles.rew,
                  {
                    backgroundColor: "white",
                    borderColor: Colors.gray,
                    borderRadius: 10
                  },
                ]}
              >
                <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>Clear filters</Text>
              </TouchableOpacity>

            </View>

            <KeyboardAvoidingView behavior="padding">

              <Modal
                transparent={true}
                animationType="slide"
                visible={filterModalVisible}
                onRequestClose={filtertoggleModal}>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalOverlay}
                    onPress={closeModals}
                  />
                  <Animated.View
                    {...panResponders.panHandlers}
                    style={[
                      styles.modalContent,
                      {
                        transform: [
                          {
                            translateY: slideAnimations.interpolate({
                              inputRange: [-300, 0],
                              outputRange: [-300, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <ScrollView style={{
                      width: '99%',
                    }}>
                      <View style={{ alignItems: "center", justifyContent: "center" }}>

                        <View
                          style={{
                            width: 50,
                            height: 5,
                            backgroundColor: "#bac1c3",
                            marginTop: 0,
                            justifyContent: 'center',
                            borderRadius: 100
                          }}></View>

                      </View>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          alignItems: 'center',

                        }}>
                        <View
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                        </View>

                      </View>


                      <View style={{
                        width: '99%',
                      }}>

                        <View>
                          <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', width: "99%", marginBottom: 8 }}>Choose your city </Text>

                          <MultiSelect
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            itemTextStyle={styles.itemTextStyle}
                            placeholderTextColor="red"
                            search
                            data={moreFilterData.City}
                            labelField="data_name"
                            valueField="data_customvalue"
                            placeholder="Select item"
                            searchPlaceholder="Search..."
                            value={cities}
                            valuestyle={{ color: "red" }}
                            onChange={async item => {
                              console.log("total item", item)                            // setDataCustomTaxonomy(item)

                              setCities(item);
                              await getPopertiesApiCall({
                                type: 3, data: {
                                  UserId: user_ID,
                                  data_custom_taxonomy: "property_city",
                                  data_customvalue: item.toString(),
                                }, lntLng
                              })
                            }}
                            selectedStyle={styles.selectedStyle}
                          />

                          <View style={{ marginBottom: 12 }}>

                            <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>Bedrooms</Text>
                            <FlatList
                              data={moreFilterData.bedroom}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              renderItem={({ item, index }) => {
                                return (
                                  <TouchableOpacity onPress={() => { setBedroomItem(index), setBedCount(item.data_name) }}>
                                    <View style={{ width: 70, height: 40, marginTop: 8, marginHorizontal: 3, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.BorderColor, backgroundColor: bedroomitem === index ? Colors.newgray : Colors.white }}>
                                      <Text style={{ fontFamily: 'Poppins-Regular', color: bedroomitem === index ? Colors.white : Colors.newgray }}>{item?.data_name}</Text>
                                    </View>
                                  </TouchableOpacity>
                                )
                              }}
                            >

                            </FlatList>
                          </View>
                          <View>


                            <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>Bathrooms</Text>
                            <FlatList
                              data={moreFilterData.bathroom}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              renderItem={({ item, index }) => {
                                return (
                                  <TouchableOpacity onPress={() => {
                                    setBathRoomItem(index)
                                    setBathRoomCount(item.data_name)
                                  }}>
                                    <View style={{ width: 70, height: 40, marginTop: 8, marginHorizontal: 3, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.BorderColor, backgroundColor: bathRoom === index ? Colors.newgray : Colors.white }}>
                                      <Text style={{ fontFamily: 'Poppins-Regular', color: bathRoom === index ? Colors.white : Colors.newgray }}>{item?.data_name}</Text>
                                    </View>
                                  </TouchableOpacity>
                                )
                              }}
                            ></FlatList>
                          </View>

                          <View>

                            <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', marginTop: 12 }}>Square Feet</Text>

                            <View style={{ flexDirection: "column", justifyContent: 'space-between', marginTop: 8 }}>

                              <Dropdown
                                style={{ borderWidth: 1, fontSize: 16, fontFamily: "Poppins-Regular", color: Colors.newgray, width: '100%', height: 50, borderColor: Colors.BorderColor, borderRadius: 10, padding: 6, paddingLeft: 12, marginBottom: 8 }}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                itemTextStyle={styles.itemTextStyle}
                                data={moreFilterData.min_square}
                                search
                                maxHeight={300}
                                labelField="data_name"
                                valueField="data_name"
                                placeholder="Min square"
                                searchPlaceholder="Search..."
                                value={minSquareFeet}
                                onChange={item => {
                                  setMinSquareFeet(item.data_name);
                                }}

                              />
                              <Dropdown
                                style={{ borderWidth: 1, marginBottom: 8, fontSize: 16, fontFamily: "Poppins-Regular", color: Colors.newgray, width: '100%', height: 50, borderColor: Colors.BorderColor, borderRadius: 10, padding: 6, paddingLeft: 12 }}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                itemTextStyle={styles.itemTextStyle}
                                iconStyle={styles.iconStyle}
                                data={moreFilterData.max_square}
                                search
                                maxHeight={300}
                                labelField="data_name"
                                valueField="data_name"
                                placeholder="Max Square"
                                searchPlaceholder="Search..."
                                value={maxSquareFeet}
                                onChange={item => {
                                  setMaxSquareFeet(item.data_name)
                                }}

                              />
                            </View>


                          </View>
                          <View style={{ marginTop: 12 }}>

                            <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>Price Range</Text>

                            <View style={{ flexDirection: "column", justifyContent: 'space-between', marginTop: 8 }}>

                              <Dropdown
                                style={{ borderWidth: 1, fontSize: 16, fontFamily: "Poppins-Regular", color: Colors.newgray, width: '100%', height: 50, borderColor: Colors.BorderColor, borderRadius: 10, padding: 6, paddingLeft: 12, marginBottom: 8 }}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                itemTextStyle={styles.itemTextStyle}
                                data={moreFilterData.min_price}
                                search
                                maxHeight={300}
                                labelField="data_name"
                                valueField="data_name"
                                placeholder="Min Price"
                                searchPlaceholder="Search..."
                                value={minPricerange}
                                onChange={item => {
                                  setMinPricerange(item.data_name)
                                }}

                              />
                              <Dropdown
                                style={{ borderWidth: 1, marginBottom: 8, fontSize: 16, fontFamily: "Poppins-Regular", color: Colors.newgray, width: '100%', height: 50, borderColor: Colors.BorderColor, borderRadius: 10, padding: 6, paddingLeft: 12 }}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                itemTextStyle={styles.itemTextStyle}
                                iconStyle={styles.iconStyle}
                                data={moreFilterData.max_price}
                                search
                                maxHeight={300}
                                labelField="data_name"
                                valueField="data_name"
                                placeholder="Max Price"
                                searchPlaceholder="Search..."
                                value={maxPriceRange}
                                onChange={item => {
                                  setMaxPriceRange(item.data_name);
                                }}

                              />
                            </View>
                          </View>
                          <View style={{ width: '100%', justifyContent: 'center', alignItems: "center" }}>
                            <TouchableOpacity onPress={() => { setMoreFilter(!moreFilter) }}>
                              <Text style={{ color: Colors.white, padding: 10, borderRadius: 25, textAlign: 'center', width: 150, fontSize: 16, fontWeight: 700, backgroundColor: Colors.black }}>More Filters</Text>

                            </TouchableOpacity>
                          </View>
                          <Collapsible collapsed={!moreFilter}>
                            <View style={{
                              alignContent: 'center', width: '100%',
                              justifyContent: 'center', alignItems: 'center'
                            }}>
                              <FlatList
                                data={moreFilterData.more_filter_data}
                                style={{ alignContent: 'center' }}
                                nestedScrollEnabled
                                numColumns={3}
                                renderItem={({ item }) => {
                                  return (
                                    <TouchableOpacity style={{
                                      width: '30%', margin: 5, borderRadius: 20, borderWidth: 1,
                                      borderColor: Colors.black, padding: 10,
                                    }} onPress={() => {

                                    }}>
                                      <Text style={{
                                        color: item.selected ? Colors.white : Colors.black,
                                        textAlign: 'center',
                                        backgroundColor: item.selected ? Colors.black : Colors.white
                                      }} numberOfLines={1}>
                                        {item?.data_name}
                                      </Text>
                                    </TouchableOpacity>
                                  )
                                }}>

                              </FlatList>

                            </View>
                          </Collapsible>
                          <View style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "flex-end",
                            // paddingHorizontal: 10
                          }}>

                            <TouchableOpacity
                              onPress={async () => {
                                // console.log("cities check", dataCustomTaxonomy)
                                await getPopertiesApiCall({
                                  type: 3, data: {
                                    UserId: user_ID,
                                    data_custom_taxonomy: item.data_customvalue,
                                    data_customvalue: cities,
                                  }, lntLng
                                })
                                // console.log("okk", cities, maxPriceRange, minPricerange, maxSquareFeet, minSquareFeet, bathRoomCount, bedCount)
                              }}
                              style={{
                                height: 50,
                                width: '40%',
                                borderRadius: 100,
                                backgroundColor: Colors.surfblur,
                                marginTop: 10,
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 40

                              }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: Colors.white,
                                  fontFamily: "Poppins-Regular",
                                }}>
                                Apply
                              </Text>
                            </TouchableOpacity>

                          </View>
                        </View>
                      </View>

                    </ScrollView>

                  </Animated.View>
                </View>
              </Modal>

            </KeyboardAvoidingView>

          </View>
        }
        {
          !showMap && homeData.length != 0 ?

            <View style={{ height: width, width: width, marginTop: 10 }}>
              <CardsSwipe style={{
                position: "relative", width: "100%",
                height: "100%", overflow: "hidden"
              }}
                cards={homeData}
                loop={true}
                renderYep={() => (
                  <View
                    style={{
                      top: 0,
                      marginLeft: 8,
                      height: width - (viewHeight - 22), width: width, backgroundColor: "green", paddingHorizontal: 8,
                      borderRadius: 15, marginTop: -5, overflow: "hidden", position: "absolute", top: 0
                    }}>
                    <View style={{
                      position: "absolute",
                      height: '92%', width: '100%', alignItems: 'center', justifyContent: "center"
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
                          source={Images.ThumbUp}
                          style={{
                            height: 25,
                            width: 25,
                            tintColor: "green",
                          }}
                        />
                      </View>
                    </View>
                  </View>
                )}

                renderNope={() =>

                  <View
                    style={{
                      marginLeft: -width,
                      marginRight: 8,
                      height: width - (viewHeight - 22), width: width, backgroundColor: "red", paddingHorizontal: 8,
                      borderRadius: 15, marginTop: -5, overflow: "hidden"
                    }}>
                    <View style={{
                      position: "absolute",
                      width: "100%", height: '92%', justifyContent: "center", alignItems: 'center'
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
                          source={Images.deletethumb}
                          style={{
                            height: 25,
                            width: 25,
                            tintColor: "red",
                          }}
                        />
                      </View>
                    </View>
                  </View>

                }
                onSwipedLeft={(item) => {
                  trashfile(homeData[item].ID)
                }}
                onSwipedRight={(item) => { savefile(homeData[item].ID) }}
                renderCard={(item, index) => (
                  <View style={styles.shadowProp}>
                    <SwiperFlatList
                      index={imageIndex}
                      autoPlay={true}
                      autoplayDelay={3000}
                      data={item?.featured_image_src}
                      refer={index}
                      renderItem={({ item1, index }) =>
                      (
                        <>
                          <View style={{ height: width, width: width, position: "relative", marginTop: 1 }}>
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", zIndex: 99, }}>

                              <TouchableOpacity disabled={imageIndex > 0 ? false : true} onPress={() => { setImageIndex(imageIndex - 1) }}
                                style={{ height: "100%", width: 30, backgroundColor: "red", position: "relative", left: 10 }} >
                                <View style={{ height: width, width: 40, position: "absolute", zIndex: 999, }}>
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity disabled={item?.featured_image_src?.length - 1 === imageIndex ? true : false} onPress={() => {
                                setImageIndex(imageIndex + 1)
                                { console.log("Image test", item.featured_image_src[imageIndex].guid) }
                              }}>
                                <View style={{ height: width, width: 40, position: "absolute", zIndex: 999, right: 10, }}>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={{ position: "absolute", zIndex: 9, top: "40%", justifyContent: "space-between", width: "100%" }}>
                              <Image
                                source={Images.next}
                                style={{
                                  height: 25,
                                  width: 25,
                                  tintColor: Colors.white,
                                  transform: [{ rotate: '-180deg' }], // Specify the rotation angle here
                                  position: "relative",
                                  left: 12
                                }}
                              />
                              <Image
                                source={Images.next}
                                style={{
                                  height: 25,
                                  width: 25,
                                  tintColor: Colors.white,
                                  position: "absolute",
                                  right: 12
                                }}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate('ViewPropertiy', { item })
                              }}>
                              <Image
                                style={{
                                  width: width - 16,
                                  height: "92%",
                                  borderRadius: 0,
                                  alignSelf: 'center',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  borderRadius: 15,

                                  overflow: "hidden"
                                }}
                                source={{ uri: item?.featured_image_src[imageIndex]?.guid }}
                              />
                            </TouchableOpacity>

                          </View>
                        </>
                      )
                      }
                    />

                    {
                      !loading &&
                      <View style={{
                        marginTop: -6,
                        marginLeft: 8,
                        width: width - 16,
                        marginRight: 8, paddingTop: 8, height: 80, backgroundColor: Colors.white
                      }} >
                        <View
                          style={{
                            flexDirection: 'row',
                            width: width - 16,
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingHorizontal: 12,
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
                              {item?.total_average_rating}
                            </Text>
                          </View>
                          <Text
                            onPress={() => { navigation.navigate('ViewPropertiy', { item }) }}
                            style={{
                              fontSize: 20,
                              color: Colors.primaryBlue,
                              fontWeight: '500',
                              fontFamily: 'Poppins-SemiBold',
                            }}>
                            {item?.property_price}
                          </Text>
                          <TouchableOpacity onPress={() => handleShare()}>
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
                        <KeyboardAvoidingView behavior="padding">
                          <Modal
                            transparent={true}
                            animationType="slide"
                            visible={tashModalVisiable}
                            onRequestClose={closeTrashModal}>
                            <View style={styles.modalContainer}>
                              <TouchableOpacity
                                activeOpacity={1}
                                style={styles.modalOverlay}
                                onPress={closeModal}
                              />
                              <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                                <Animated.View
                                  {...panResponder.panHandlers}
                                  style={[
                                    styles.modalContent,
                                    {
                                      transform: [
                                        {
                                          translateY: slideAnimation.interpolate({
                                            inputRange: [-300, 0],
                                            outputRange: [-300, 0],
                                          }),
                                        },
                                      ],
                                    },
                                  ]}
                                >
                                  <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 20 }}>

                                    <View
                                      style={{
                                        width: 50,
                                        height: 5,
                                        backgroundColor: "#bac1c3",
                                        marginTop: 0,
                                        justifyContent: 'center',
                                        borderRadius: 100
                                      }}></View>

                                  </View>
                                  <Text style={{ fontFamily: 'Poppins-Regular', color: 'black', alignItems: "center", flexDirection: "row", lineHeight: 26 }}>You're on your way to locating your dream home.  You can review, rate, comment and dispose of your Favorited  properties by tapping on your Favorites below</Text>

                                  <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 10, marginTop: 20 }}>

                                    <Image
                                      source={Images.downThumb}
                                      style={{
                                        height: 70,
                                        width: 70,
                                        tintColor: "red",
                                        resizeMode: 'contain',
                                      }}></Image></View>

                                </Animated.View>
                              </View>
                            </View>
                          </Modal>
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView behavior="padding">
                          <Modal
                            transparent={true}
                            animationType="slide"
                            visible={favModalVisiable}
                            onRequestClose={closeFavModal}>
                            <View style={styles.modalContainer}>
                              <TouchableOpacity
                                activeOpacity={1}
                                style={styles.modalOverlay}
                                onPress={closeModal}
                              />
                              <View style={{ alignItems: "center", justifyContent: "center", width: "100%" }}>
                                <Animated.View
                                  {...panResponder.panHandlers}
                                  style={[
                                    styles.modalContent,
                                    {
                                      transform: [
                                        {
                                          translateY: slideAnimation.interpolate({
                                            inputRange: [-300, 0],
                                            outputRange: [-300, 0],
                                          }),
                                        },
                                      ],
                                    },
                                  ]}
                                >
                                  <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                    <View
                                      style={{
                                        width: 50,
                                        height: 5,
                                        backgroundColor: "#bac1c3",
                                        marginTop: 0,
                                        justifyContent: 'center',
                                        borderRadius: 100
                                      }}></View>
                                  </View>
                                  <Text style={{ fontFamily: 'Poppins-Regular', color: 'black', alignItems: "center", flexDirection: "row", lineHeight: 26 }}>Congrats on your first surf swipe left! If you decide to change your mind, you can find this property in your Recycle Bin
                                    <TouchableOpacity ><Text style={{ color: Colors.surfblur, fontFamily: 'Poppins-Regular', paddingHorizontal: 6, marginTop: -20, position: "relative", top: 8 }}>(hyperlinked)</Text></TouchableOpacity>
                                    located in your Profile.  I'm here 24/7 if you need my assistance.  </Text>
                                  <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                                    <Image
                                      source={Images.ThumbUp}
                                      style={{
                                        height: 70,
                                        width: 70,
                                        tintColor: "green",
                                        resizeMode: 'contain',
                                      }}></Image></View>
                                </Animated.View>
                              </View>
                            </View>
                          </Modal>
                        </KeyboardAvoidingView>
                        <KeyboardAvoidingView >

                          <Modal
                            transparent={true}
                            animationType="slide"
                            visible={modalVisible}
                            onRequestClose={toggleModal}>
                            <View style={styles.modalContainer}>
                              <TouchableOpacity
                                activeOpacity={1}
                                style={styles.modalOverlay}
                                onPress={closeModal}
                              />
                              <Animated.View
                                {...panResponder.panHandlers}
                                style={[
                                  styles.modalContent,
                                  {
                                    transform: [
                                      {
                                        translateY: slideAnimation.interpolate({
                                          inputRange: [-300, 0],
                                          outputRange: [-300, 0],
                                        }),
                                      },
                                    ],
                                  },
                                ]}
                              >
                                <ScrollView style={{ width: "100%" }}>
                                  <View style={{ alignItems: "center", justifyContent: "center" }}>

                                    <View
                                      style={{
                                        width: 50,
                                        height: 5,
                                        backgroundColor: "#bac1c3",
                                        marginTop: 0,
                                        justifyContent: 'center',
                                        borderRadius: 100
                                      }}></View>


                                  </View>
                                  <View style={{}}>
                                    <Text
                                      style={{
                                        fontSize: 18,
                                        fontFamily: "Poppins-SemiBold",
                                        color: Colors.black,
                                        marginTop: 10,
                                        // marginRight: 180
                                      }}>
                                      Your Review
                                    </Text>
                                    <Text style={{ fontSize: 12, flexWrap: "wrap", color: Colors.newgray, fontFamily: "Poppins-Regular", }}>{ratingData[0]?.comment_content}</Text>
                                    {!isEditing && (
                                      <TouchableOpacity
                                        onPress={() => setIsEditing(true)}
                                        style={{ marginTop: 10 }}>
                                        <Text style={{ fontSize: 12, color: Colors.darbluec, fontFamily: "Poppins-Regular" }}>Edit</Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                  <View style={{ width: '100%', }}>
                                    <View style={{ width: '100%', alignSelf: 'center' }}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          marginTop: 10,
                                        }}>
                                        <Text style={{ fontSize: 12, color: Colors.black, fontFamily: "Poppins-Regular" }}>
                                          Photos Quality Rating :
                                        </Text>
                                        <Rating
                                          type="custom"
                                          ratingCount={5}
                                          imageSize={18}
                                          startingValue={ratingData[0]?.photo_wuality_rating
                                          }
                                          ratingBackgroundColor="#c8c7c8"
                                          onFinishRating={setRating}
                                          style={styles.rating}
                                          ratingColor={Colors.surfblur}
                                        //tintColor="#f1f3f4"
                                        />
                                      </View>
                                    </View>

                                    <View style={{ width: '100%', alignSelf: 'center' }}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}>
                                        <Text style={{ fontSize: 12, color: Colors.black, fontFamily: "Poppins-Regular" }}>
                                          Description & Details :
                                        </Text>
                                        <Rating
                                          type="custom"
                                          ratingCount={5}
                                          imageSize={18}
                                          startingValue={ratingData[0]?.description_review_stars
                                          }
                                          ratingBackgroundColor="#c8c7c8"
                                          onFinishRating={setRating}
                                          style={styles.rating}
                                          ratingColor={Colors.surfblur}
                                        //tintColor="#f1f3f4"
                                        />
                                      </View>
                                    </View>
                                    <View style={{ width: '100%', alignSelf: 'center' }}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}>
                                        <Text style={{ fontSize: 12, color: Colors.black, fontFamily: "Poppins-Regular" }}>
                                          Price Of Property :
                                        </Text>
                                        <Rating
                                          type="custom"
                                          ratingCount={5}
                                          imageSize={18}
                                          startingValue={ratingData[0]?.price_review_stars
                                          }
                                          ratingBackgroundColor="#c8c7c8"
                                          onFinishRating={setRating}
                                          style={styles.rating}
                                          ratingColor={Colors.surfblur}
                                        //tintColor="#f1f3f4"
                                        />
                                      </View>
                                    </View>

                                    <View style={{ width: '100%', alignSelf: 'center' }}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                        }}>
                                        <Text style={{ fontSize: 12, color: Colors.black, fontFamily: "Poppins-Regular" }}>
                                          General Interest in the property :
                                        </Text>
                                        <Rating
                                          type="custom"
                                          ratingCount={5}
                                          imageSize={18}
                                          startingValue={ratingData[0]?.interest_review_stars
                                          }
                                          ratingBackgroundColor="#c8c7c8"
                                          onFinishRating={setRating}
                                          style={styles.rating}
                                          ratingColor={Colors.surfblur}
                                        //tintColor="#f1f3f4"
                                        />
                                      </View>
                                    </View>



                                    <View style={{ width: '100%', alignSelf: 'center', overflow: "hidden" }}>
                                      <Text
                                        style={{
                                          fontSize: 18,
                                          fontFamily: "Poppins-SemiBold",
                                          color: Colors.black,
                                          marginTop: 10,
                                          // marginRight: 180
                                        }}>
                                        Review
                                      </Text>
                                      <View
                                        style={{
                                          width: '100%',
                                          //height: 100,
                                          marginTop: 0,
                                          //justifyContent: 'center',
                                          flexWrap: "wrap",
                                          whiteSpace: "pre-wrap",
                                          wordWrap: "break-word", height: 100, width: "100%", flexWrap: "wrap", overflow: "hidden"
                                        }}>


                                        {isEditing ? (
                                          <TextInput
                                            multiline={true}
                                            style={{
                                              verticalAlign: "top",
                                              borderWidth: 1, borderColor: Colors.BorderColor, borderRadius: 8, paddingHorizontal: 12,
                                              fontSize: 12, flexWrap: "wrap", color: Colors.newgray, fontFamily: "Poppins-Regular", height: 100,
                                              width: "100%"
                                            }}
                                            value={review}
                                            onChangeText={text => setReview(text)}
                                            autoFocus
                                          />
                                        ) : (
                                          <TextInput

                                            multiline={true}
                                            style={{
                                              verticalAlign: "top",
                                              borderWidth: 1, borderColor: Colors.BorderColor, borderRadius: 8, paddingHorizontal: 12,
                                              fontSize: 12, flexWrap: "wrap", color: Colors.newgray, fontFamily: "Poppins-Regular", height: 100,
                                              width: "100%"

                                            }}>
                                            {ratingData[0]?.comment_content}
                                          </TextInput>
                                        )}
                                      </View>
                                    </View>
                                    <View style={{

                                      width: '100%',

                                      flexDirection: 'row',
                                      alignItems: "center",
                                      justifyContent: "flex-end",
                                      //s paddingHorizontal: 10
                                    }}>
                                      {isEditing ? (
                                        <View style={{
                                          justifyContent: "flex-end", width: '100%',
                                          alignItems: "flex-end",
                                        }}>
                                          <TouchableOpacity onPress={() => updateReview()} style={{
                                            height: 50,
                                            width: '40%',
                                            borderRadius: 100,
                                            backgroundColor: Colors.surfblur,
                                            marginTop: 10,
                                            flexDirection: 'row',
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginBottom: 40
                                          }}>
                                            <Text style={{
                                              fontSize: 16,
                                              // fontWeight: '700',
                                              color: Colors.white,
                                              fontFamily: "Poppins-Regular",
                                            }}>Update</Text>
                                          </TouchableOpacity>
                                        </View>
                                      ) : (

                                        <View style={{
                                          justifyContent: "flex-end", width: '100%',
                                          alignItems: "flex-end",
                                        }}>
                                          <TouchableOpacity
                                            onPress={() => addReview()}
                                            style={{
                                              height: 50,
                                              width: '45%',
                                              borderRadius: 100,
                                              backgroundColor: Colors.surfblur,
                                              marginTop: 10,
                                              flexDirection: 'row',
                                              alignItems: "center",
                                              justifyContent: "center",
                                              marginBottom: 20

                                            }}>
                                            <Text
                                              style={{
                                                fontSize: 16,
                                                // fontWeight: '700',
                                                color: Colors.white,
                                                fontFamily: "Poppins-Regular",
                                              }}>
                                              Submit
                                            </Text>
                                          </TouchableOpacity>
                                        </View>
                                      )}
                                    </View>

                                  </View>
                                </ScrollView>
                              </Animated.View>
                            </View>
                          </Modal>

                        </KeyboardAvoidingView>

                        <View
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 12,
                          }}>
                          <Text

                            style={{
                              fontSize: 15,
                              color: Colors.black,
                              textAlign: 'center',
                              fontFamily: 'Poppins-Medium',
                            }}>
                            {item?.title}
                          </Text>
                        </View>
                      </View>
                    }

                    <View
                      style={{
                        flexDirection: 'row',
                        width: width - 16,
                        marginLeft: 8,
                        marginRight: 8,
                        alignSelf: 'center',
                        paddingHorizontal: 15,
                        backgroundColor: 'white',
                        justifyContent: 'space-between',
                      }}>
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
                          {item?.property_bedrooms.length > 0 ? item?.property_bedrooms : 0}
                          {' Beds'}
                        </Text>
                      </View>
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
                          {item?.bathroomsfull.length > 0 ? item?.bathroomsfull : 0}

                          {' Baths'}
                        </Text>
                      </View>
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
                          {item?.property_size.length > 1 ? item?.property_size : 0}{" sq ft"}
                        </Text>
                      </View>
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
                          {item?.associationfee.length > 1 ? item?.associationfee : "$" + 0}
                        </Text>
                      </View>
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
                          {item?.taxannualamount.length > 1 ? item?.taxannualamount : "$" + 0}

                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View> : showMap ?
              <View style={{ height: '100%', width: width, marginTop: 10 }}>
                <View style={styles.coverlocation}>
                  <Image source={Images.graylocation} style={styles.locationpic}></Image>

                </View>
                <View style={{ position: "absolute", zIndex: 99, right: 12, top: 60 }}>
                  <TouchableOpacity style={styles.coverlocation1} onPress={() => { setIsCollapsed(!isCollapsed) }}>
                    <Image source={Images.layers} style={styles.locationpic}></Image>

                  </TouchableOpacity>
                  <Collapsible collapsed={!isCollapsed} style={{ backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", position: "relative", paddingVertical: 12 }}>
                    <View style={{ backgroundColor: Colors.white, alignItems: "center", justifyContent: "center", }}>
                      <TouchableOpacity onPress={() => { setMapType('satellite') }}><Image tintColor={mapType === 'satellite' ? Colors.PrimaryColor : Colors.placeholderTextColor} source={Images.satellite} style={styles.locationpic}></Image></TouchableOpacity>
                      <TouchableOpacity onPress={() => { setMapType('hybrid') }}><Image tintColor={mapType === 'hybrid' ? Colors.PrimaryColor : Colors.placeholderTextColor} source={Images.hybrid} style={styles.locationpic}></Image></TouchableOpacity>
                      <TouchableOpacity onPress={() => { setMapType('terrain') }}><Image tintColor={mapType === 'terrain' ? Colors.PrimaryColor : Colors.placeholderTextColor} source={Images.terrain} style={styles.locationpic}></Image></TouchableOpacity>
                      <TouchableOpacity onPress={() => { setMapType('standard') }}><Image tintColor={mapType === 'standard' ? Colors.PrimaryColor : Colors.placeholderTextColor} source={Images.standard} style={styles.locationpic}></Image></TouchableOpacity>
                    </View>
                  </Collapsible>
                </View>
                <View>
                </View>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  zoomControlEnabled={true}
                  showsCompass={true}
                  moveOnMarkerPress={true}
                  mapType={mapType}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  region={{
                    latitude: parseFloat(homeData[0].property_latitude),
                    longitude: parseFloat(homeData[0].property_longitude),
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                >
                  {
                    homeData.map((item) => {
                      return (
                        <Marker
                          showCallout={true}
                          coordinate={{ latitude: parseFloat(item?.property_latitude), longitude: parseFloat(item?.property_longitude) }}>
                          <Image source={Images.lot} style={{ height: 50, width: 100, resizeMode: 'contain' }} />
                          <Callout onPress={() => { navigation.navigate('ViewPropertiy', { item }) }}
                            style={{
                              height: 70, alignItems: "center", alignSelf: "center",
                              marginLeft: 20, top: -15,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginLeft: 20, top: -12,
                              }}>

                              <Text style={{
                                position: "relative", height: 100,
                                top: -20
                              }}>
                                <Image style={{ height: 80, width: 100, resizeMode: "stretch", }} source={{ uri: homeData[0]?.featured_image_src[0]?.guid }} />
                              </Text>
                              <View style={{ flexWrap: "wrap", top: -5 }}>
                                <Text style={{ color: 'black', paddingHorizontal: 10, fontWeight: '500', }}>{homeData[0].title}</Text>
                                <Text style={{ color: Colors.surfblur, paddingHorizontal: 10, fontWeight: '500', }}>{homeData[0].property_price}</Text>
                                <View style={{ flexDirection: 'row', paddingHorizontal: 10, }}>
                                  <Text style={{ color: Colors.black, marginleft: 10, fontWeight: '500', }}>{homeData[0].property_bedrooms} Beds  </Text>
                                  <Text style={{ color: Colors.black, marginleft: 10, fontWeight: '500', }}>{homeData[0].bathroomsfull} Baths  </Text>
                                  <Text style={{ color: Colors.black, marginleft: 10, fontWeight: '500', }}>{homeData[0].property_size} sq ft  </Text>
                                </View>
                              </View>

                            </View>
                          </Callout>
                        </Marker>
                      )
                    })
                  }
                </MapView>
              </View> : null
        }

      </View>

    </SafeAreaView>
  );
};
export default Home;

const styles = StyleSheet.create({
  locationpic: {
    resizeMode: "contain", width: 16, height: 16,
    paddingVertical: 12
  },

  maincovermap: {
    justifyContent: "center", alignItems: "center",
    flex: 1,
    borderRadius: 20, // Set the border radius for the container View
    overflow: 'hidden',
    //backgroundColor: "red",
    marginHorizontal: 16, position: "relative"
  },
  coverlocation: {
    backgroundColor: "rgba(255,255,255,.8)", height: 38, width: 35, position: "absolute", top: 15, zIndex: 99,
    alignItems: "center",
    justifyContent: "center", borderRadius: 3,
    right: 12,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  coverlocation1: {
    backgroundColor: "rgba(255,255,255,.8)", height: 38, width: 35,
    //position: "absolute", top: 55, zIndex: 99,
    alignItems: "center",
    justifyContent: "center", borderRadius: 3,
    // right: 12,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 22,

    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center", justifyContent: "center",
    width: "98%",
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '100%',
    width: "96%",
    alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
  },
  shadowProp: {
    marginTop: 50,
    width: "100%",
    alignContent: 'center',
  },
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
    android: {
      elevation: 1,
    },
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
    height: 200,
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
    backgroundColor: Colors.primaryBlue,
  },
  cardContainer: {
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
    //  width: 110,
    borderRadius: 8,
    paddingHorizontal: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    paddingVertical: 4,
    marginHorizontal: 6,
  },
  dropdown: {
    // margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    width: "100%",
    marginBottom: 12
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
    color: "gray"
  },
  selectedStyle: {
    borderRadius: 12,
  },
  itemTextStyle: {
    fontSize: 16,
    color: Colors.black
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.black
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: Colors.black
  },
});