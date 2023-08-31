import React, {useState, useEffect} from 'react';
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
  Keyboard,
} from 'react-native';

import StarRating from 'react-native-star-rating-widget';
import SelectDropdown from 'react-native-select-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {getPoperties} from '../../modules/getPoperties';
import {postRating} from '../../modules/postRating';
import {getFilter} from '../../modules/getFilter';
import {SvgUri} from 'react-native-svg';
import {postUpdateRating} from '../../modules/postUpdateRating';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {CheckBox} from 'react-native-elements';

import CardsSwipe from 'react-native-cards-swipe';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

import LottieView from 'lottie-react-native';
import {store} from '../../redux/store';
import {addToFavorite} from '../../modules/addToFavorite';
import {addRemoveTrash} from '../../modules/addRemoveTrash';
import {getRating} from '../../modules/getRating';
import {ScrollView} from 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';
import MapView, {Marker, Callout, PROVIDER_DEFAULT} from 'react-native-maps';
import Collapsible from 'react-native-collapsible';
import {useIsFocused} from '@react-navigation/native';
import {getMoreFilter} from '../../modules/getMoreFilter';
import {useRef} from 'react';
import {getTrash} from '../../modules/getTrash';
import {getFavoriteProperties} from '../../modules/getFavoriteProperties';
import {filterSearch} from '../../modules/filterSearch';
import {getSavedSearch} from '../../modules/getSavedSearch';
import {clearFilter} from '../../modules/clearFilter';
import {getUserScore} from '../../modules/getUserScore';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import GetLocation from 'react-native-get-location';
import Loader from '../../components/Loader';

const {width} = Dimensions.get('screen');
// const toggleCheckbox = () => {
//   setIsChecked(!isChecked);
// };
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
    updateKeyboard();
  }, [keyboardStatus]);

  const updateKeyboard = async () => {
    if (keyboardStatus === 'Keyboard Hidden') {
      if (adress.length > 0) {
        const formData = new FormData();
        formData.append('SearchParameters', adress);
        console.log('SearchParameters payload', formData);
        dispatch(getPoperties({type: 2, data: formData, lntLng})).then(res => {
          setHomeData(res.payload.data);
        });
        setKeyboardStatus('first');
        setIsSelected(false);
        setIsPressed1(false);
        setIsPressed(false);
        // setSelectedItem(null);
        setSelectedTabs([]);
      }
    }
  };
  const dispatch = useDispatch();
  const [homeData, setHomeData] = useState([]);
  const [selectedTabs, setSelectedTabs] = useState([]);
  const [selectedTabsMore, setSelectedTabsMore] = useState([]);
  // const [selectedMoreCity, setselectedMoreCity] = useState([])
  const [selected, setSelected] = useState(-1);
  const [activity, setActivity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adress, setAddres] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [moreFilterData, setMoreFilterData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [termName, setTermName] = useState(null);
  const [cities, setCities] = useState([]);
  const navigation = useNavigation();
  const [productId, setProductId] = useState();
  const [reviewTitle, setReviewTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [tashModalVisiable, setTrashModalVisiable] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);
  const [gpsModalVisiavle, setGpsModalVisiavle] = useState(false);
  const [favModalVisiable, setfavModalVisiable] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [commentContent, setComentContent] = useState('');
  const [rating, setRating] = useState(0);
  const [rating1, setRating1] = useState(0);
  const [rating2, setRating2] = useState(0);
  const [rating3, setRating3] = useState(0);
  const [ratingData, setRatingData] = useState([]);
  const [isSelected, setIsSelected] = useState(false);
  const [bedroomitem, setBedroomItem] = useState(-1);
  const [bathRoom, setBathRoomItem] = useState(-1);
  const [imageIndex, setImageIndex] = useState(0);
  const [viewHeight, setViewHeight] = useState(80);
  const [user_ID, setUser_ID] = useState();
  const [lntLng, setLatLng] = useState({latitude: 0.0, longitude: 0.0});
  const [showMap, setShowMap] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [isEditing, setIsEditing] = useState(false);
  const [moreFilter, setMoreFilter] = useState(false);
  const [collapsibleStatus, setSetCollapsibleStatus] = useState(true);
  const [maxPriceRange, setMaxPriceRange] = useState();
  const [minPricerange, setMinPricerange] = useState();
  const [minSquareFeet, setMinSquareFeet] = useState();
  const [maxSquareFeet, setMaxSquareFeet] = useState();
  const [bathRoomCount, setBathRoomCount] = useState();
  const [limitCount, setLimitCount] = useState(1);

  const [isPressed, setIsPressed] = useState(false);
  const [isPressed1, setIsPressed1] = useState(false);
  const [isPressed2, setIsPressed2] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [mainViewHeight, setMainViewHeight] = useState(0);
  const [topViewHeight, setTopViewHeight] = useState(0);
  // const [bottomViewHeight, setBottomViewHight] = useState(0)
  const [centerHeight, setCenterHeight] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
    setCenterHeight(mainViewHeight - topViewHeight);
  }, [topViewHeight]);

  useEffect(() => {
  }, [topViewHeight]);

  useEffect(() => {
    getID();
  }, []);

  useEffect(() => {
    if (selectedTabsMore) {
      dispatch(
        getPoperties({
          type: 3,
          data: {
            data_custom_taxonomy: 'more_filter_data',
            data_customvalue: selectedTabsMore.toString(),
          },
        }),
      ).then(res => {
        // setHomeData(res.payload.data);
      });
    }
  }, [selectedTabsMore]);

  const handlePress = () => {
    setIsPressed(!isPressed);
    setIsPressed1(false);
    setIsPressed2(false);
    filtertoggleModal();
  };

  const handlePress2 = () => {
    setIsPressed2(!isPressed2);
    filtertoggleModal();
  };
  const getID = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUser_ID(id);
  };

  const getUserScoreApiCall = () => {
    dispatch(getUserScore()).then(response => {});
  };
  useEffect(() => {
    if (isFocused) {
      Promise.all[
        (getFilterApicall(),
        getTrashApiCall(),
        favlistApi(),
        getSavedApiCall(),
        getMoreFilterApiCall(),
        getPopertiesApiCall({type: 0, data: {limit: limitCount}, lntLng}),
        setAddres(''),
        getUserScoreApiCall())
      ];
    }
  }, [isFocused]);
  const getFilterApicall = () => {
    dispatch(getFilter()).then(response => {
      setFilterData(response.payload.data);
    });
  };
  const getMoreFilterApiCall = () => {
    dispatch(getMoreFilter()).then(response => {
      setMoreFilterData(response.payload.data);
    });
  };
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
          closeFavModal();
          closeTrashModal();
          closeSaveModal();
        } else {
          // Otherwise, reset the animation back to 0
          Animated.spring(slideAnimation, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;
  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  const filtertoggleModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };
  const trashToggleModal = () => {
    setTrashModalVisiable(!tashModalVisiable);
  };
  const saveToogleModal = () => {
    setSaveModalVisible(!saveModalVisible);
  };
  const gpsModal = () => {
    setSaveModalVisible(!saveModalVisible);
  };
  const favToggleModal = () => {
    setfavModalVisiable(!favModalVisiable);
  };
  const closeModals = () => {
    setFilterModalVisible(false);
  };
  const closeTrashModal = () => {
    setTrashModalVisiable(false);
  };
  const closeSaveModal = () => {
    setSaveModalVisible(false);
  };
  const closeFavModal = () => {
    setfavModalVisiable(false);
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
    }),
  ).current;

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

  const generateLink = async ID => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://surflokal.page.link/property?propetyID=${ID}`,
          domainUriPrefix:
            Platform.OS === 'android'
              ? 'https://surflokal.page.link/'
              : 'https://surflokal.page.link',
          android: {
            packageName: 'surf.lokal',
          },
          ios: {
            appStoreId: '123456789',
            bundleId: 'surf.lokal',
          },
          navigation: {
            forcedRedirectEnabled: true,
          },
        },
        dynamicLinks.ShortLinkType.SHORT,
      );
      console.log('link:', link);
      return link;
    } catch (error) {
      console.log('Generating Link Error:', error);
    }
  };
  const handleShare = async ID => {
    const link = await generateLink(ID);
    try {
      Share.share({
        title: 'Please check this property',
        message: link,
        url: link,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
  };

  const getSavedApiCall = () => {
    dispatch(getSavedSearch()).then(response => {});
  };
  const favlistApi = () => {
    dispatch(getFavoriteProperties()).then(res => {});
  };

  const savefile = async item => {
    favlistApi();
    const formData = new FormData();
    formData.append('post_id', item);

    await dispatch(addToFavorite(formData)).then(response => {
      if (
        store.getState().getFavoriteProperties.getFavoritePropertiesData
          .count == 0
      ) {
        favToggleModal();
        // Alert.alert('Alert', response.payload.message);
      } else {
        // favToggleModal()
        // Alert.alert('Alert', response.payload.message);
      }
    });
  };
  const getTrashApiCall = async () => {
    await dispatch(getTrash()).then(res => {});
  };
  const trashfile = async post_id => {
    getTrashApiCall();
    const formData = new FormData();
    // formData.append('userID', user_ID);
    formData.append('post_id', post_id);

    await dispatch(addRemoveTrash(formData)).then(response => {
      if (store.getState().getTrash.getTrashData.count == 0) {
        trashToggleModal();
      } else {
      }
    });
  };

  const getCurretLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async location => {
        console.log('location', location);
        const formData = new FormData();
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);
        console.log('getPopertiesApiCall formData ', formData);
        await getPopertiesApiCall({type: 1, data: '', latLng: formData});
      })
      .catch(error => {
        const {code, message} = error;
      });
  };

  const getPopertiesApiCall = async type => {
    setLoading(true);
    await dispatch(getPoperties(type));
    typeof store.getState().getPoperties.getPopertiesData?.data === 'object'
      ? store.getState().getPoperties.getPopertiesData?.data &&
        setHomeData(store.getState().getPoperties.getPopertiesData?.data)
      : setHomeData([]);
    setLoading(false);
  };
  const addReview = async post_id => {
    const formData = new FormData();
    formData.append('postid', productId.toString());
    formData.append('reviewtitle', reviewTitle);
    formData.append('photo_quality_rating', rating);
    formData.append('desc_stars', rating1);
    formData.append('price_stars', rating2);
    formData.append('interest_stars', rating3);
    formData.append('content', commentContent);

    dispatch(postRating(formData)).then(response => {
      if (response.payload.data.success) {
        Alert.alert('Alert', response.payload.data.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert error', response.payload.data.message);
      }
    });
  };

  const updateReview = async post_id => {
    const formData = new FormData();
    formData.append('postid', productId);
    formData.append('comment_content', commentContent);
    formData.append('review_title', reviewTitle);
    formData.append('review_stars', rating);
    formData.append('description_review_stars', rating1);
    formData.append('price_review_stars', rating2);
    formData.append('interest_review_stars', rating3);
    console.log('postUpdateRating', formData);

    dispatch(postUpdateRating(formData)).then(response => {
      if (response.payload.success) {
        Alert.alert('Alert', response.payload.data.message);
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.data.message);
      }
    });
  };
  const renderFillterItem = ({item, index}) => {
    const {data_custom_taxonomy, data_customvalue} = item;
    const isSelected =
      selectedTabs.filter(i => i === data_customvalue).length > 0;
    return (
      <TouchableOpacity
        onPress={() => {
          if (isSelected) {
            setSelectedTabs(prev => prev.filter(i => i !== data_customvalue));
          } else {
            setSelectedTabs(prev => [...prev, data_customvalue]);
          }
          setIsSelected(true);
          setTermName(item.term_name);
          setSelected(index);
          setActivity(false);
          setLoading(true);
          setAddres('');
          dispatch(
            getPoperties({
              type: 3,
              data: {
                data_custom_taxonomy: item.data_custom_taxonomy,
                data_customvalue: item.data_customvalue,
              },
            }),
          ).then(res => {
            setHomeData(res.payload.data);
          });
          setActivity(true);
          setLoading(false);
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 5,
            marginRight: 5,
            paddingRight: 10,
            marginBottom: 8,
          }}>
          <SvgUri
            height={DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25}
            width={DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25}
            uri={item.term_icon_url}
            fontWeight="bold"
            fill={isSelected ? Colors.PrimaryColor : 'black'}
          />
          <Text
            style={{
              fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,

              color: isSelected ? Colors.darbluec : Colors.newgray,

              fontFamily: isSelected ? 'Poppins-SemiBold' : 'Poppins-Regular',
              borderBottomColor: isSelected ? Colors.darbluec : 'transparent',
              borderBottomWidth: isSelected ? 1 : 0,
            }}>
            {item.term_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <View
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'rgba(0,0,0,.7)',
            position: 'absolute',
            zIndex: 99,
            left: 0,
            top: 0,
          }}>
          <Loader />
        </View>
      ) : null}
      <SafeAreaView
        style={
          Platform.OS == 'android' ? styles.container : styles.containerIos
        }>
        <View
          onLayout={({nativeEvent}) => {
            const {x, y, width, height} = nativeEvent.layout;
            setMainViewHeight(height);
          }}
          style={{
            height: '100%',
            backgroundColor: Colors.white,
          }}>
          <View
            onLayout={({nativeEvent}) => {
              const {x, y, width, height} = nativeEvent.layout;
              setTopViewHeight(height);
            }}>
            <View
              style={{
                width: DeviceInfo.getDeviceType() === 'Tablet' ? '100%' : '100%',
                paddingVertical: 15,
                justifyContent: 'center',
                borderRadius: 5,
                marginBottom: 4,
                alignItems: 'center',
                flexDirection: 'row',
                // backgroundColor: '#fff',
                paddingLeft: 10,
                alignItems: 'center',
              }}>
              <View
                style={{
                  height: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 42,
                  width: '90%',
                  borderRadius: 100,
                  borderWidth: 1,
                  borderColor: Colors.BorderColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  backgroundColor: Colors.white,

                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  elevation: 3,
                  shadowColor: '#52006A',
                }}>
                <View style={{width: '85%'}}>
                  <TextInput
                    allowFontScaling={false}
                    placeholderTextColor={'#858383'}
                    fontFamily={'Poppins-Regular'}
                    keyboardType="web-search"
                    placeholder={'surf lokal...'}
                    returnKeyType="done"
                    value={adress}
                    onSubmitEditing={Keyboard.dismiss}
                    onChangeText={text => setAddres(text)}
                    style={{
                      fontSize:
                        DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
                      letterSpacing: 1,
                      color: '#000',
                      marginLeft: 1,
                      position: 'relative',
                      // top: 3,
                      // width: "85%",
                      marginLeft: 15,
                    }}
                  />
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    width: '15%',
                    height: '100%',
                    justifyContent: 'center',
                    height: 42,
                    position: 'relative',
                    justifyContent: 'center',
                    borderLeftWidth: 1,
                    borderLeftColor: Colors.BorderColor,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMap(!showMap);
                    }}
                    style={{
                      flex: 1,
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={Images.address}
                      tintColor={
                        showMap ? Colors.PrimaryColor : Colors.PrimaryColor
                      }
                      style={{
                        height:
                          DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 20,
                        width:
                          DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        resizeMode: 'contain',
                      }}></Image>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  width: '10%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {loading ? (
                  <ActivityIndicator size="small" color="blue" />
                ) : (
                  <TouchableOpacity
                    onPress={async () => {
                      await getCurretLocation();
                      setShowMap(false);
                      setAddres('');
                    }}>
                    <Image
                      source={Images.gps}
                      style={{
                        height:
                          DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25,
                        width:
                          DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 25,
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
                // backgroundColor: "green"
              }}>
              <FlatList
                data={filterData}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderFillterItem}
              />
            </View>
            {isSelected && (
              <View
                style={{
                  position: 'relative',
                  //backgroundColor:"green",
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 5,
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      getSavedApiCall();
                      setIsPressed1(!isPressed1);
                      setIsPressed(false);
                      const payload = {
                        search_name: termName,
                      };
                      dispatch(filterSearch(payload)).then(response => {
                        if (
                          store.getState().getSavedSearch.getSavedSearchData
                            .count == 0
                        ) {
                          saveToogleModal();
                        } else {
                        }
                      });
                    }}
                    style={[
                      styles.rew,
                      {
                        borderColor: Colors.gray,
                        borderRadius: 10,
                        backgroundColor: isPressed1 ? 'black' : 'white',
                        // backgroundColor: "white",
                        // Change background color on press
                      },
                    ]}>
                    <Text
                      style={{
                        color: isPressed1 ? 'white' : 'black',
                        // color: 'black',

                        // Change text color on press,
                        fontFamily: 'Poppins-Regular',
                        fontSize:
                          DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
                      }}>
                      Save Search
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handlePress}
                    style={[
                      styles.rew,
                      {
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        borderColor: Colors.gray,
                        borderRadius: 10,
                      },
                    ]}>
                    <Image
                      source={Images.filtericon}
                      style={[
                        {
                          height:
                            DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 10,
                          width:
                            DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 10,
                          marginRight: 6,
                        },
                        {tintColor: 'black'},
                      ]}
                    />
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Poppins-Regular',
                        fontSize:
                          DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
                      }}>
                      Filters
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      setSelectedTabs([]);
                      setIsSelected(false);
                      setIsPressed1(false);
                      setIsPressed(false);
                      // setSelectedItem(null);
                      // setCities(null)
                      setBedroomItem(null);
                      setBathRoomItem(null);
                      setMinSquareFeet('');
                      setMaxSquareFeet('');
                      setMinPricerange('');
                      setMaxPriceRange('');
                      setMoreFilter(false);
                      setCities('');
                      {
                        handlePress2;
                      }
                      dispatch(clearFilter());
                      await dispatch(
                        getPoperties({
                          type: 0,
                          data: {limit: limitCount + 1},
                          lntLng,
                        }),
                      ).then(response => {
                        setHomeData(response.payload.data);
                      });
                    }}
                    style={[
                      styles.rew,
                      {
                        backgroundColor: isPressed2 ? 'black' : 'white',
                        borderColor: Colors.gray,
                        borderRadius: 10,
                      },
                    ]}>
                    <Text
                      style={{
                        color: isPressed2 ? 'white' : 'black',
                        fontFamily: 'Poppins-Regular',
                        fontSize:
                          DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
                      }}>
                      Clear filters
                    </Text>
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
                        ]}>
                        <ScrollView
                          style={{
                            width: '99%',
                          }}>
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <View
                              style={{
                                width: 50,
                                height: 5,
                                backgroundColor: '#bac1c3',
                                marginTop: 0,
                                justifyContent: 'center',
                                borderRadius: 100,
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
                              }}></View>
                          </View>
                          <View
                            style={{
                              width: '99%',
                            }}>
                            <View>
                              <Text
                                style={{
                                  color: 'black',
                                  fontFamily: 'Poppins-Regular',
                                  width: '99%',
                                  marginBottom: 8,
                                  fontSize:
                                    DeviceInfo.getDeviceType() === 'Tablet'
                                      ? 18
                                      : 14,
                                }}>
                                Choose your city{' '}
                              </Text>

                              <TouchableOpacity
                                onPress={() => {
                                  setSetCollapsibleStatus(!collapsibleStatus);
                                }}
                                style={[
                                  styles.dropdown,
                                  {
                                    width: '100%',
                                    height: 40,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 12,
                                  },
                                ]}>
                                <Text
                                  style={{
                                    color: Colors.black,
                                    fontFamily: 'Poppins-Regular',
                                    fontSize:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 18
                                        : 14,
                                  }}>
                                  All Cities
                                </Text>
                                <View
                                  style={{
                                    width: 20,
                                    height: 20,
                                    position: 'relative',
                                  }}>
                                  <Image
                                    source={Images.downArrow}
                                    style={{
                                      width: 12,
                                      height: 12,
                                      resizeMode: 'contain',
                                      position: 'absolute',
                                      right: 0,
                                      top: 5,
                                    }}></Image>
                                </View>
                              </TouchableOpacity>
                              <Collapsible
                                collapsed={collapsibleStatus}
                                style={{width: '100%'}}>
                                <View
                                  style={[
                                    styles.dropdownz,
                                    {
                                      width: '100%',
                                      height: 150,
                                      backgroundColor: '#fff',
                                      alignItems: 'center',
                                      flexDirection: 'row',
                                      justifyContent: 'center',
                                      paddingTop: 10,
                                    },
                                  ]}>
                                  <View
                                    style={{
                                      alignContent: 'center',
                                      width: '100%',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    <FlatList
                                      data={moreFilterData?.City}
                                      // data={[1]}
                                      style={{
                                        alignContent: 'center',
                                        width: '100%',
                                      }}
                                      nestedScrollEnabled
                                      renderItem={({item, index}) => {
                                        const {
                                          data_custom_taxonomy,
                                          data_customvalue,
                                        } = item;
                                        const isSelectedMore =
                                          selectedTabsMore.filter(
                                            i => i === data_customvalue,
                                          ).length > 0;
                                        return (
                                          <TouchableOpacity
                                            style={{
                                              width: '100%',
                                              paddingHorizontal: 8,
                                            }}
                                            onPress={async () => {
                                              cities.push(item);
                                              setSetCollapsibleStatus(
                                                !collapsibleStatus,
                                              );
                                              if (isSelectedMore) {
                                                setSelectedTabsMore(prev =>
                                                  prev.filter(
                                                    i => i !== data_customvalue,
                                                  ),
                                                );
                                              } else {
                                                setSelectedTabsMore(prev => [
                                                  ...prev,
                                                  data_customvalue,
                                                ]);
                                              }
                                              console.log(
                                                'selectedTabsMore======>',
                                                selectedTabsMore,
                                              );
                                              //  await dispatch(
                                              //     getPoperties({
                                              //       type: 3,
                                              //       data: {
                                              //         data_custom_taxonomy: 'property_city',
                                              //         data_customvalue: selectedTabsMore,
                                              //       },
                                              //     }),
                                              //   ).then(res => {
                                              //     setHomeData(res.payload.data);
                                              //   });
                                            }}>
                                            <View
                                              style={styles.checkboxContainer}>
                                              <View
                                                style={[
                                                  styles.checkbox,
                                                  isChecked && styles.checked,
                                                ]}>
                                                {isSelectedMore && (
                                                  <Image
                                                    style={{
                                                      width:
                                                        DeviceInfo.getDeviceType() ===
                                                        'Tablet'
                                                          ? 40
                                                          : 18,
                                                      height:
                                                        DeviceInfo.getDeviceType() ===
                                                        'Tablet'
                                                          ? 40
                                                          : 18,

                                                      resizeMode: 'contain',
                                                    }}
                                                    source={
                                                      Images.checkok
                                                    }></Image>
                                                )}
                                              </View>
                                              <Text
                                                style={{
                                                  fontSize:
                                                    DeviceInfo.getDeviceType() ===
                                                    'Tablet'
                                                      ? 18
                                                      : 14,
                                                  color: Colors.black,
                                                  textAlign: 'left',
                                                  backgroundColor: Colors.white,
                                                  padding: 10,
                                                  marginBottom: 8,
                                                  width: '100%',
                                                }}
                                                numberOfLines={1}>
                                                {item?.data_name}
                                              </Text>
                                            </View>
                                          </TouchableOpacity>
                                        );
                                      }}></FlatList>
                                  </View>
                                </View>
                              </Collapsible>
                              {cities.length > 0 ? (
                                <View
                                  style={[
                                    styles.dropdown,
                                    {
                                      width: '100%',
                                      height: 60,
                                      alignItems: 'flex-start',
                                      flexDirection: 'row',
                                      justifyContent: 'flex-start',
                                      padding: 10,
                                    },
                                  ]}>
                                  <View
                                    style={{
                                      // alignContent: 'flex-start',
                                      width: '100%',
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                    }}>
                                    <FlatList
                                      data={cities}
                                      style={{
                                        alignContent: 'center',
                                        margin: -6,
                                      }}
                                      horizontal
                                      nestedScrollEnabled
                                      numColumns={1}
                                      renderItem={({item}) => {
                                        const {
                                          data_custom_taxonomy,
                                          data_customvalue,
                                        } = item;
                                        const isSelectedMore =
                                          selectedTabsMore.filter(
                                            i => i === data_customvalue,
                                          ).length > 0;
                                        return (
                                          <TouchableOpacity
                                            style={{
                                              margin: 5,
                                              borderRadius: 20,
                                              borderWidth: 1,
                                              borderColor: Colors.black,
                                              backgroundColor: isSelectedMore
                                                ? Colors.black
                                                : Colors.white,
                                              padding: 10,
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                            }}
                                            onPress={async () => {
                                              cities.pop(item);
                                              if (isSelectedMore) {
                                                setSelectedTabsMore(prev =>
                                                  prev.filter(
                                                    i => i !== data_customvalue,
                                                  ),
                                                );
                                              } else {
                                                setSelectedTabsMore(prev => [
                                                  ...prev,
                                                  data_customvalue,
                                                ]);
                                              }
                                            }}>
                                            <Text
                                              style={{
                                                color: isSelectedMore
                                                  ? Colors.white
                                                  : Colors.black,
                                                textAlign: 'center',
                                              }}
                                              numberOfLines={1}>
                                              {item?.data_name}
                                            </Text>
                                            <Image
                                              style={{
                                                width:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 40
                                                    : 12,
                                                height:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 40
                                                    : 12,
                                                marginLeft: 8,
                                                marginTop: 2,
                                                resizeMode: 'contain',
                                              }}
                                              source={Images.close}></Image>
                                          </TouchableOpacity>
                                        );
                                      }}></FlatList>
                                  </View>
                                </View>
                              ) : null}

                              <View style={{marginBottom: 12}}>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontFamily: 'Poppins-Regular',
                                    fontSize:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 18
                                        : 14,
                                  }}>
                                  Bedrooms
                                </Text>
                                <View
                                  style={{
                                    alignContent: 'center',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <FlatList
                                    style={{
                                      fontSize:
                                        DeviceInfo.getDeviceType() === 'Tablet'
                                          ? 18
                                          : 14,
                                    }}
                                    data={moreFilterData?.bedroom}
                                    horizontal={true}
                                    // numColumns={4}

                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({item, index}) => {
                                      return (
                                        <TouchableOpacity
                                          onPress={async () => {
                                            setBedroomItem(index),
                                              await dispatch(
                                                getPoperties({
                                                  type: 3,
                                                  data: {
                                                    data_custom_taxonomy:
                                                      'bedroom',
                                                    data_customvalue:
                                                      item.data_customvalue,
                                                  },
                                                }),
                                              ).then(res => {
                                                setHomeData(res.payload.data);
                                              });
                                            // setFilterModalVisible(false);
                                          }}>
                                          <View
                                            style={{
                                              width: 70,
                                              height: 40,
                                              marginTop: 8,
                                              marginHorizontal: 3,
                                              borderRadius: 20,
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              borderWidth: 1,
                                              borderColor: Colors.BorderColor,
                                              backgroundColor:
                                                bedroomitem === index
                                                  ? Colors.black
                                                  : Colors.white,
                                            }}>
                                            <Text
                                              style={{
                                                fontFamily: 'poppins-regular',
                                                fontSize:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 18
                                                    : 14,
                                                color:
                                                  bedroomitem === index
                                                    ? Colors.white
                                                    : Colors.black,
                                              }}>
                                              {item?.data_name}
                                            </Text>
                                          </View>
                                        </TouchableOpacity>
                                      );
                                    }}></FlatList>
                                </View>
                              </View>
                              <View>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontFamily: 'Poppins-Regular',
                                    fontSize:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 18
                                        : 14,
                                  }}>
                                  Bathrooms
                                </Text>
                                <View
                                  style={{
                                    alignContent: 'center',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <FlatList
                                    data={moreFilterData.bathroom}
                                    // numColumns={4}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({item, index}) => {
                                      return (
                                        <TouchableOpacity
                                          onPress={async () => {
                                            setBathRoomItem(index);
                                            setBathRoomCount(item.data_name);
                                            await dispatch(
                                              getPoperties({
                                                type: 3,
                                                data: {
                                                  data_custom_taxonomy:
                                                    'bathroom',
                                                  data_customvalue:
                                                    item.data_customvalue,
                                                },
                                              }),
                                            ).then(res => {
                                              setHomeData(res.payload.data);
                                            });
                                          }}>
                                          <View
                                            style={{
                                              width: 75,
                                              height: 40,
                                              marginTop: 8,
                                              marginHorizontal: 3,
                                              borderRadius: 20,
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              borderWidth: 1,
                                              borderColor: Colors.BorderColor,
                                              backgroundColor:
                                                bathRoom === index
                                                  ? Colors.newgray
                                                  : Colors.white,
                                            }}>
                                            <Text
                                              style={{
                                                fontSize:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 18
                                                    : 14,
                                                fontFamily: 'Poppins-Regular',
                                                color:
                                                  bathRoom === index
                                                    ? Colors.white
                                                    : Colors.newgray,
                                              }}>
                                              {item?.data_name}
                                            </Text>
                                          </View>
                                        </TouchableOpacity>
                                      );
                                    }}></FlatList>
                                </View>
                              </View>

                              <View>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontFamily: 'Poppins-Regular',
                                    marginTop: 12,
                                    fontSize:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 18
                                        : 14,
                                  }}>
                                  Square Feet
                                </Text>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: 8,
                                  }}>
                                  <View
                                    style={[styles.dropdown, {width: '48%'}]}>
                                    <SelectDropdown
                                      data={moreFilterData.min_square}
                                      buttonStyle={styles.dropdown1BtnStyle}
                                      buttonTextStyle={
                                        styles.dropdown1BtnTxtStyle
                                      }
                                      dropdownIconPosition={'right'}
                                      dropdownStyle={
                                        styles.dropdown1DropdownStyle
                                      }
                                      rowStyle={styles.dropdown1RowStyle}
                                      rowTextStyle={styles.dropdown1RowTxtStyle}
                                      search={true}
                                      searchInputStyle={{color: 'black'}}
                                      searchPlaceholder="Search"
                                      searchPlaceHolderColor="black"
                                      searchInputTxtColor="black"
                                      placeholder="Min square"
                                      defaultButtonText="Min square"
                                      renderDropdownIcon={isOpened => {
                                        return (
                                          <Image
                                            source={Images.downArrow}
                                            tintColor={Colors.gray}
                                            style={{
                                              height: 12,
                                              width: 12,
                                            }}></Image>
                                        );
                                      }}
                                      onSelect={async (selectedItem, index) => {
                                        setMinSquareFeet(item.data_name);
                                        await dispatch(
                                          getPoperties({
                                            type: 3,
                                            data: {
                                              data_custom_taxonomy:
                                                'min_square',
                                              data_customvalue:
                                                item.data_customvalue,
                                            },
                                          }),
                                        ).then(res => {
                                          setHomeData(res.payload.data);
                                        });
                                      }}
                                      buttonTextAfterSelection={(
                                        selectedItem,
                                        index,
                                      ) => {
                                        return (
                                          <Text
                                            style={{
                                              color: 'black',
                                              textAlign: 'left',
                                            }}>
                                            {selectedItem?.data_customvalue}
                                          </Text>
                                        );
                                      }}
                                      rowTextForSelection={(item, index) => {
                                        return (
                                          <Text
                                            style={{
                                              color: 'black',
                                              textAlign: 'left',
                                            }}>
                                            {item?.data_customvalue}
                                          </Text>
                                        );
                                      }}
                                    />
                                  </View>

                                  <View
                                    style={[styles.dropdown, {width: '48%'}]}>
                                    <SelectDropdown
                                      data={moreFilterData.max_square}
                                      buttonStyle={styles.dropdown1BtnStyle}
                                      buttonTextStyle={
                                        styles.dropdown1BtnTxtStyle
                                      }
                                      dropdownIconPosition={'right'}
                                      dropdownStyle={
                                        styles.dropdown1DropdownStyle
                                      }
                                      rowStyle={styles.dropdown1RowStyle}
                                      rowTextStyle={styles.dropdown1RowTxtStyle}
                                      search={true}
                                      searchInputStyle={{color: 'black'}}
                                      searchPlaceholder="Search"
                                      searchPlaceHolderColor="black"
                                      searchInputTxtColor="black"
                                      placeholder="Max Square"
                                      defaultButtonText="Max Square"
                                      renderDropdownIcon={isOpened => {
                                        return (
                                          <Image
                                            source={Images.downArrow}
                                            tintColor={Colors.gray}
                                            style={{
                                              height: 12,
                                              width: 12,
                                            }}></Image>
                                        );
                                      }}
                                      onSelect={async (selectedItem, index) => {
                                        setMaxSquareFeet(item.data_name);
                                        await dispatch(
                                          getPoperties({
                                            type: 3,
                                            data: {
                                              data_custom_taxonomy:
                                                'max_square',
                                              data_customvalue:
                                                selectedItem.data_customvalue,
                                            },
                                          }),
                                        ).then(res => {
                                          setHomeData(res.payload.data);
                                        });
                                      }}
                                      buttonTextAfterSelection={(
                                        selectedItem,
                                        index,
                                      ) => {
                                        return (
                                          <Text
                                            style={{
                                              color: 'black',
                                              textAlign: 'left',
                                            }}>
                                            {selectedItem?.data_customvalue}
                                          </Text>
                                        );
                                      }}
                                      rowTextForSelection={(item, index) => {
                                        return (
                                          <Text
                                            style={{
                                              color: 'black',
                                              textAlign: 'left',
                                            }}>
                                            {item?.data_customvalue}
                                          </Text>
                                        );
                                      }}
                                    />
                                  </View>
                                </View>
                              </View>
                              <View style={{marginTop: 12}}>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontFamily: 'Poppins-Regular',
                                    fontSize:
                                      DeviceInfo.getDeviceType() === 'Tablet'
                                        ? 18
                                        : 14,
                                  }}>
                                  Price Range
                                </Text>

                                <View
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 16,
                                    width: '100%',
                                  }}>
                                  <View
                                    style={[styles.dropdown, {width: '48%'}]}>
                                    <SelectDropdown
                                      data={moreFilterData.min_price}
                                      buttonStyle={styles.dropdown1BtnStyle}
                                      buttonTextStyle={
                                        styles.dropdown1BtnTxtStyle
                                      }
                                      dropdownIconPosition={'right'}
                                      dropdownStyle={
                                        styles.dropdown1DropdownStyle
                                      }
                                      rowStyle={styles.dropdown1RowStyle}
                                      rowTextStyle={styles.dropdown1RowTxtStyle}
                                      search={true}
                                      searchInputStyle={{color: 'black'}}
                                      searchPlaceholder="Search"
                                      searchPlaceHolderColor="black"
                                      searchInputTxtColor="black"
                                      placeholder="Min Price"
                                      defaultButtonText="Min Price"
                                      renderDropdownIcon={isOpened => {
                                        return (
                                          <Image
                                            source={Images.downArrow}
                                            tintColor={Colors.gray}
                                            style={{
                                              height: 12,
                                              width: 12,
                                            }}></Image>
                                        );
                                      }}
                                      onSelect={async (selectedItem, index) => {
                                        setMinPricerange(item.data_name);
                                        await dispatch(
                                          getPoperties({
                                            type: 3,
                                            data: {
                                              data_custom_taxonomy: 'min_price',
                                              data_customvalue:
                                                item.data_customvalue,
                                            },
                                          }),
                                        ).then(res => {
                                          setHomeData(res.payload.data);
                                        });
                                      }}
                                      buttonTextAfterSelection={(
                                        selectedItem,
                                        index,
                                      ) => {
                                        return (
                                          <Text
                                            style={{
                                              color: 'black',
                                              textAlign: 'left',
                                            }}>
                                            {selectedItem?.data_customvalue}
                                          </Text>
                                        );
                                      }}
                                      rowTextForSelection={(item, index) => {
                                        return (
                                          <Text
                                            style={{
                                              color: 'black',
                                              textAlign: 'left',
                                            }}>
                                            {item?.data_customvalue}
                                          </Text>
                                        );
                                      }}
                                    />
                                  </View>

                                  <View
                                    style={[styles.dropdown, {width: '48%'}]}>
                                    <SelectDropdown
                                      data={moreFilterData.max_price}
                                      buttonStyle={styles.dropdown1BtnStyle}
                                      buttonTextStyle={
                                        styles.dropdown1BtnTxtStyle
                                      }
                                      dropdownIconPosition={'right'}
                                      dropdownStyle={
                                        styles.dropdown1DropdownStyle
                                      }
                                      rowStyle={styles.dropdown1RowStyle}
                                      rowTextStyle={styles.dropdown1RowTxtStyle}
                                      search={true}
                                      searchInputTxtStyle={{color: '#000000'}}
                                      searchInputStyle={{color: '#000000'}}
                                      searchPlaceholder="Search"
                                      searchPlaceHolderColor="#000000"
                                      searchInputTxtColor="#000000"
                                      placeholder="Max Price"
                                      defaultButtonText="Max Price"
                                      renderDropdownIcon={isOpened => {
                                        return (
                                          <Image
                                            source={Images.downArrow}
                                            tintColor={Colors.gray}
                                            style={{
                                              height: 12,
                                              width: 12,
                                            }}></Image>
                                        );
                                      }}
                                      onSelect={async (selectedItem, index) => {
                                        setMaxPriceRange(item.data_name);
                                        await dispatch(
                                          getPoperties({
                                            type: 3,
                                            data: {
                                              data_custom_taxonomy: 'max_price',
                                              data_customvalue:
                                                item.data_customvalue,
                                            },
                                          }),
                                        ).then(res => {
                                          setHomeData(res.payload.data);
                                        });
                                      }}
                                      buttonTextAfterSelection={(
                                        selectedItem,
                                        index,
                                      ) => {
                                        return (
                                          <Text
                                            style={{
                                              color: 'black',
                                              textAlign: 'left',
                                            }}>
                                            {selectedItem?.data_customvalue}
                                          </Text>
                                        );
                                      }}
                                      rowTextForSelection={(item, index) => {
                                        return (
                                          <Text
                                            style={{
                                              color: 'black',
                                              textAlign: 'left',
                                            }}>
                                            {item?.data_customvalue}
                                          </Text>
                                        );
                                      }}
                                    />
                                  </View>

                                  {/* </View> */}
                                </View>
                              </View>
                              {/* <View style={{ width: '100%', justifyContent: 'center', alignItems: "center" }}>
                            <TouchableOpacity onPress={() => { setMoreFilter(!moreFilter); }}>
                              <Text style={{ color: Colors.white, padding: 10, borderRadius: 25, textAlign: 'center', width: 130, fontSize: 14, fontWeight: 700, backgroundColor: Colors.black, marginVertical: 12, paddingVertical: 15 }}>More Filters</Text>

                            </TouchableOpacity>
                          </View> */}
                              <Collapsible collapsed={moreFilter}>
                                <View
                                  style={{
                                    alignContent: 'center',
                                    width: '100%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <FlatList
                                    data={moreFilterData?.more_filter_data}
                                    style={{
                                      alignContent: 'center',
                                      //margin: -6
                                    }}
                                    nestedScrollEnabled
                                    numColumns={3}
                                    renderItem={({item, index}) => {
                                      const {
                                        data_custom_taxonomy,
                                        data_customvalue,
                                      } = item;
                                      const isSelectedMore =
                                        selectedTabsMore.filter(
                                          i => i === data_customvalue,
                                        ).length > 0;
                                      return (
                                        <TouchableOpacity
                                          style={{
                                            width: '33.33%',
                                            //margin: 5,

                                            //borderWidth: 1,
                                            //borderColor: Colors.black,

                                            // padding: 10,
                                            // marginBottom:8,
                                            paddingHorizontal: 8,
                                          }}
                                          onPress={async () => {
                                            if (isSelectedMore) {
                                              setSelectedTabsMore(prev =>
                                                prev.filter(
                                                  i => i !== data_customvalue,
                                                ),
                                              );
                                            } else {
                                              setSelectedTabsMore(prev => [
                                                ...prev,
                                                data_customvalue,
                                              ]);
                                            }
                                          }}>
                                          <Text
                                            style={{
                                              color: isSelectedMore
                                                ? Colors.white
                                                : Colors.black,
                                              textAlign: 'center',
                                              borderRadius: 20,
                                              borderWidth: 0.8,
                                              borderColor: Colors.gray,
                                              backgroundColor: isSelectedMore
                                                ? Colors.black
                                                : Colors.white,
                                              padding: 10,
                                              marginBottom: 8,
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 18
                                                  : 14,
                                            }}
                                            numberOfLines={1}>
                                            {item?.data_name}
                                          </Text>
                                        </TouchableOpacity>
                                      );
                                    }}></FlatList>
                                </View>
                              </Collapsible>
                              <View
                                style={{
                                  width: '100%',
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                }}>
                                <TouchableOpacity
                                  onPress={async () => {
                                    setFilterModalVisible(false);
                                  }}
                                  style={{
                                    height: 50,
                                    width: 130,
                                    borderRadius: 100,
                                    backgroundColor: Colors.surfblur,
                                    marginTop: 10,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: 40,
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      color: Colors.white,
                                      fontFamily: 'Poppins-Regular',
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
            )}
          </View>

          <View style={{}}>
            {homeData?.length > 0 ? (
              <View
                onLayout={({nativeEvent}) => {
                  const {x, y, width, height} = nativeEvent.layout;
                  setCenterHeight(height);
                }}
                style={{height: centerHeight, width: '100%'}}>
                {!showMap && homeData?.length > 0 ? (
                  <View style={{height: centerHeight, width: '100%'}}>
                    <CardsSwipe
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                      }}
                      // loop={false}
                      cards={homeData}
                      onNoMoreCards={() => {
                        setHomeData([]);
                      }}
                      renderYep={() => (
                        <View
                          style={{
                            height:imageHeight,
                            width: imageWidth,
                            backgroundColor: 'green',
                            paddingHorizontal: 8,
                            borderRadius: 15,
                            marginLeft:10,
                            // marginRight:5,
                            // marginTop: -22,
                            overflow: 'hidden',
                            position: 'absolute',
                          }}>
                          <View
                            style={{
                              position: 'absolute',
                              height: '92%',
                              width: '100%',
                              alignItems: 'center',
                              justifyContent: 'center',
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
                                  tintColor: 'green',
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      )}
                      renderNope={() => (
                        <View
                          style={{
                            marginLeft: -width,
                            height:imageHeight,
                            width: imageWidth,
                            backgroundColor: 'red',
                            paddingHorizontal: 8,
                            borderRadius: 15,
                            // marginLeft:20,
                            overflow: 'hidden',
                            position:'absolute'
                          }}>
                          <View
                            style={{
                              position: 'absolute',
                              width: '100%',
                              height: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
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
                                  tintColor: 'red',
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      )}
                      onSwipedLeft={item => {
                        trashfile(homeData[item].ID);
                      }}
                      onSwipedRight={item => {
                        savefile(homeData[item].ID);
                      }}
                      renderCard={(item, index) => (
                        <View style={[styles.shadowProp, {height: '100%'}]}>
                          <SwiperFlatList
                            style={{height: '60%'}}
                            index={imageIndex}
                            autoPlay={true}
                            autoplayDelay={3000}
                            data={item?.featured_image_src}
                            refer={index}
                            renderItem={({item1, index}) => (
                              <>
                                <View
                                 onLayout={({nativeEvent}) => {
                                  const {x, y, width, height} = nativeEvent.layout;
                                  setImageHeight(height);
                                  setImageWidth(width)
                                }}
                                  style={{
                                    height: '100%',
                                    width: width,
                                    position: 'relative',
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      width: '100%',
                                      zIndex: 99,
                                    }}>
                                    <View
                                      style={{
                                        opacity: 0,
                                        position: 'absolute',
                                        zIndex: 9,
                                        top: '40%',
                                        justifyContent: 'space-between',
                                        width: '100%',
                                        height: '100%',
                                      }}>
                                      <Image
                                        source={Images.next}
                                        style={{
                                          height: 25,
                                          width: 25,
                                          tintColor: Colors.white,
                                          transform: [{rotate: '-180deg'}], // Specify the rotation angle here
                                          position: 'relative',
                                          left: 12,
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          zIndex: 999,
                                        }}
                                      />

                                      <Image
                                        source={Images.next}
                                        style={{
                                          height: 25,
                                          width: 25,
                                          tintColor: Colors.white,
                                          position: 'absolute',
                                          right: 12,
                                        }}
                                      />
                                    </View>
                                    <TouchableOpacity
                                      disabled={imageIndex > 0 ? false : true}
                                      onPress={() => {
                                        setImageIndex(imageIndex - 1);
                                      }}
                                      style={{
                                        height: '100%',
                                        width: 30,
                                        position: 'relative',
                                        left: 10,
                                      }}>
                                      <View
                                        style={{
                                          height: '100%',
                                          width: 40,
                                          position: 'absolute',
                                          zIndex: 999,
                                        }}></View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      disabled={
                                        item?.featured_image_src?.length - 1 ===
                                        imageIndex
                                          ? true
                                          : false
                                      }
                                      onPress={() => {
                                        setImageIndex(imageIndex + 1);
                                      }}>
                                      <View
                                        style={{
                                          height: width,
                                          width: 40,
                                          position: 'absolute',
                                          zIndex: 999,
                                          right: 10,
                                        }}></View>
                                    </TouchableOpacity>
                                  </View>
                                  <TouchableOpacity
                                    style={{height: '100%'}}
                                    onPress={() => {
                                      navigation.navigate('ViewPropertiy', {
                                        ID: item.ID,
                                        from: 'Home',
                                      });
                                    }}>
                                    <Image
                                      style={{
                                        width: '95%',
                                        height: '100%',
                                        borderRadius: 0,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        borderRadius: 15,
                                        backgroundColor: 'gray',
                                        overflow: 'hidden',
                                      }}
                                      source={{
                                        uri: item?.featured_image_src[
                                          imageIndex
                                        ]?.guid,
                                      }}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </>
                            )}
                          />
                          <View
                            style={{
                              height: '40%',
                              paddingTop: 8,
                              // justifyContent: 'space-evenly',
                            }}>
                            {!loading && (
                              <View
                                style={{
                                  marginLeft: 8,
                                  width: "97%",
                                  marginRight: 8,
                                  justifyContent: 'space-evenly',
                                  backgroundColor: Colors.white,
                                }}>
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
                                      style={{
                                        height: 40,
                                        width: 40,
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                      right:15
                                      }}
                                      onPress={() => {
                                        setProductId(item.ID);
                                        setReviewTitle(item.title);
                                        toggleModal();
                                        dispatch(getRating(item.ID)).then(
                                          response => {
                                            setRatingData(
                                              response?.payload?.data,
                                            );
                                            setRating(
                                              response?.payload?.data[0]
                                                ?.photo_wuality_rating,
                                            );
                                            setRating1(
                                              response?.payload?.data[0]
                                                ?.description_review_stars,
                                            );
                                            setRating2(
                                              response?.payload?.data[0]
                                                ?.price_review_stars,
                                            );
                                            setRating3(
                                              response?.payload?.data[0]
                                                ?.interest_review_stars,
                                            );
                                          },
                                        );
                                      }}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          alignSelf: 'center',
                                        }}>
                                        <Image
                                          source={
                                            item.total_average_rating > 0
                                              ? Images.startfill
                                              : Images.star2
                                          }
                                          style={{
                                            height: 22,
                                            width: 22,
                                            resizeMode: 'contain',
                                            tintColor:
                                              item.total_average_rating > 0
                                                ? undefined
                                                : 'black',
                                          }}
                                        />
                                        {item.total_average_rating > 0 ? (
                                          <Text
                                            style={{
                                              fontSize: 18,
                                              color: Colors.black,
                                              fontFamily: 'Poppins-Light',
                                            }}>
                                            {Math.round(
                                              item.total_average_rating,
                                            )}
                                          </Text>
                                        ) : null}
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  <Text
                                    // onPress={() => { navigation.navigate('ViewPropertiy', { ID: item.ID }); }}
                                    style={{
                                      fontSize: 20,
                                      color: Colors.primaryBlue,
                                      fontWeight: '500',
                                      fontFamily: 'Poppins-SemiBold',
                                    }}>
                                    {''}
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => handleShare(item.ID)}
                                    style={{
                                      height: 40,
                                      width: 40,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      bottom:10,
                                     marginRight:20
                                    }}>
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
                                    visible={favModalVisiable}
                                    //visible={true}
                                    onRequestClose={() => {
                                      setfavModalVisiable(false);
                                    }}>
                                    <View style={styles.modalContainer1}>
                                      <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.modalOverlay1}
                                        onPress={() => {
                                          setfavModalVisiable(false);
                                        }}
                                      />
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: '100%',
                                        }}>
                                        <Animated.View
                                          {...panResponder.panHandlers}
                                          style={[
                                            styles.modalContent1,
                                            {
                                              transform: [
                                                {
                                                  translateY:
                                                    slideAnimation.interpolate({
                                                      inputRange: [-300, 0],
                                                      outputRange: [-300, 0],
                                                    }),
                                                },
                                              ],
                                            },
                                          ]}>
                                          <View
                                            style={{
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              marginBottom: 20,
                                            }}>
                                            <View
                                              style={{
                                                width: 50,
                                                height: 5,
                                                backgroundColor: '#bac1c3',
                                                marginTop: 0,
                                                justifyContent: 'center',
                                                borderRadius: 100,
                                              }}></View>
                                          </View>

                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 36
                                                  : 26,
                                              fontFamily: 'Poppins-SemiBold',
                                              color: Colors.black,
                                              marginTop: 40,
                                              textAlign: 'center',
                                            }}>
                                            Congratulations!
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 36
                                                  : 26,
                                              fontFamily: 'Poppins-SemiBold',
                                              color: Colors.black,
                                              marginBottom: 50,
                                              textAlign: 'center',
                                            }}>
                                            You swiped right!
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 26
                                                  : 18,
                                              fontFamily: 'Poppins-Light',
                                              color: 'black',
                                              alignItems: 'center',
                                              flexDirection: 'row',
                                              lineHeight:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 39
                                                  : 26,
                                              flexWrap: 'wrap',
                                              textAlign: 'center',
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              textAlign: 'center',
                                              paddingHorizontal: 16,
                                            }}>
                                            These properties will be saved in
                                            your Favorites
                                            {/* <TouchableOpacity
                                          onPress={() => {
                                            navigation.navigate('RecycleBin');
                                          }}
                                          style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 6,
                                          }}>
                                         
                                        
                                        </TouchableOpacity> */}
                                          </Text>

                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              marginTop: 60,
                                              justifyContent: 'flex-end',
                                              alignItems: 'flex-start',
                                            }}>
                                            <LottieView
                                              style={{
                                                height:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 79
                                                    : 49,
                                                width:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 79
                                                    : 59,
                                                marginRight: 30,
                                                transform: [
                                                  {rotate: '-180deg'},
                                                ],
                                                marginTop: 0,
                                                position: 'relative',
                                                top:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? -15
                                                    : -10,
                                              }}
                                              source={require('../../assets/animations/leftarrow.json')}
                                              autoPlay
                                              loop
                                            />
                                            <View
                                              style={{flexDirection: 'column'}}>
                                              <TouchableOpacity
                                                style={{alignItems: 'center'}}
                                                onPress={() => {
                                                  navigation.navigate(
                                                    'MyFavorites',
                                                  );
                                                }}>
                                                <Image
                                                  source={Images.ThumbUp}
                                                  style={{
                                                    height:
                                                      DeviceInfo.getDeviceType() ===
                                                      'Tablet'
                                                        ? 39
                                                        : 25,
                                                    width:
                                                      DeviceInfo.getDeviceType() ===
                                                      'Tablet'
                                                        ? 39
                                                        : 25,
                                                    resizeMode: 'contain',
                                                    tintColor: '#000',
                                                  }}></Image>
                                                <Text
                                                  style={{
                                                    fontSize:
                                                      DeviceInfo.getDeviceType() ===
                                                      'Tablet'
                                                        ? 20
                                                        : 10,
                                                    fontFamily: 'Poppins-Light',
                                                    color: '#000',
                                                  }}>
                                                  Favorites
                                                </Text>
                                              </TouchableOpacity>
                                            </View>
                                          </View>
                                        </Animated.View>
                                      </View>
                                    </View>
                                  </Modal>
                                </KeyboardAvoidingView>
                                <KeyboardAvoidingView behavior="padding">
                                  <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={tashModalVisiable}
                                    //visible={true}
                                    onRequestClose={() => {
                                      setTrashModalVisiable(false);
                                    }}>
                                    <View style={styles.modalContainer1}>
                                      <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.modalOverlay1}
                                        onPress={() => {
                                          setTrashModalVisiable(false);
                                        }}
                                      />
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: '100%',
                                        }}>
                                        <Animated.View
                                          {...panResponder.panHandlers}
                                          style={[
                                            styles.modalContent1,
                                            {
                                              transform: [
                                                {
                                                  translateY:
                                                    slideAnimation.interpolate({
                                                      inputRange: [-300, 0],
                                                      outputRange: [-300, 0],
                                                    }),
                                                },
                                              ],
                                            },
                                          ]}>
                                          <View
                                            style={{
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              marginBottom: 20,
                                            }}>
                                            <View
                                              style={{
                                                width: 50,
                                                height: 5,
                                                backgroundColor: '#bac1c3',
                                                marginTop: 0,
                                                justifyContent: 'center',
                                                borderRadius: 100,
                                              }}></View>
                                          </View>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 36
                                                  : 26,
                                              fontFamily: 'Poppins-SemiBold',
                                              color: Colors.black,
                                              marginTop: 40,
                                              textAlign: 'center',
                                            }}>
                                            Woohoo!{' '}
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 36
                                                  : 26,
                                              fontFamily: 'Poppins-SemiBold',
                                              color: Colors.black,
                                              marginBottom: 50,
                                              textAlign: 'center',
                                            }}>
                                            You swiped left!
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 26
                                                  : 18,
                                              fontFamily: 'Poppins-Light',
                                              color: 'black',
                                              alignItems: 'center',
                                              flexDirection: 'row',
                                              lineHeight:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 39
                                                  : 26,
                                              flexWrap: 'wrap',
                                              textAlign: 'center',
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              textAlign: 'center',
                                              paddingHorizontal: 16,
                                            }}>
                                            These properties will be saved in
                                            the “Recycle Bin” tab inside the
                                            profile menu.
                                            {/* <TouchableOpacity
                                          onPress={() => {
                                            navigation.navigate('RecycleBin');
                                          }}
                                          style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 6,
                                          }}>
                                         
                                        
                                        </TouchableOpacity> */}
                                          </Text>

                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              marginTop: 60,
                                              justifyContent: 'flex-start',
                                              alignItems: 'flex-start',
                                            }}>
                                            <View
                                              style={{flexDirection: 'column'}}>
                                              <TouchableOpacity
                                                style={{
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}
                                                onPress={() => {
                                                  navigation.navigate(
                                                    'MyProfile',
                                                  );
                                                }}>
                                                <Image
                                                  source={Images.newprofile}
                                                  style={{
                                                    height:
                                                      DeviceInfo.getDeviceType() ===
                                                      'Tablet'
                                                        ? 39
                                                        : 25,
                                                    width:
                                                      DeviceInfo.getDeviceType() ===
                                                      'Tablet'
                                                        ? 39
                                                        : 25,
                                                    resizeMode: 'contain',
                                                    tintColor: '#000',
                                                  }}></Image>
                                                <Text
                                                  style={{
                                                    fontSize:
                                                      DeviceInfo.getDeviceType() ===
                                                      'Tablet'
                                                        ? 20
                                                        : 10,
                                                    fontFamily: 'Poppins-Light',
                                                    color: '#000',
                                                  }}>
                                                  Profile
                                                </Text>
                                              </TouchableOpacity>
                                            </View>

                                            <LottieView
                                              style={{
                                                height:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 79
                                                    : 49,
                                                width:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 79
                                                    : 59,
                                                marginLeft: 10,
                                                marginTop: 0,
                                                position: 'relative',
                                                top:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? -15
                                                    : -10,
                                              }}
                                              source={require('../../assets/animations/leftarrow.json')}
                                              autoPlay
                                              loop
                                            />
                                          </View>
                                        </Animated.View>
                                      </View>
                                    </View>
                                  </Modal>
                                </KeyboardAvoidingView>
                                <KeyboardAvoidingView behavior="padding">
                                  <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={saveModalVisible}
                                    //visible={true}
                                    onRequestClose={() => {
                                      setSaveModalVisible(false);
                                    }}>
                                    <View style={styles.modalContainer1}>
                                      <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.modalOverlay1}
                                        onPress={() => {
                                          setSaveModalVisible(false);
                                        }}
                                      />
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: '100%',
                                        }}>
                                        <Animated.View
                                          {...panResponder.panHandlers}
                                          style={[
                                            styles.modalContent1,
                                            {
                                              transform: [
                                                {
                                                  translateY:
                                                    slideAnimation.interpolate({
                                                      inputRange: [-300, 0],
                                                      outputRange: [-300, 0],
                                                    }),
                                                },
                                              ],
                                            },
                                          ]}>
                                          <View
                                            style={{
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              marginBottom: 20,
                                            }}>
                                            <View
                                              style={{
                                                width: 50,
                                                height: 5,
                                                backgroundColor: '#bac1c3',
                                                marginTop: 0,
                                                justifyContent: 'center',
                                                borderRadius: 100,
                                              }}></View>
                                          </View>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 39
                                                  : 26,
                                              fontFamily: 'Poppins-SemiBold',
                                              color: Colors.black,
                                              marginTop: 40,
                                              textAlign: 'center',
                                            }}>
                                            Righteous!
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 39
                                                  : 26,
                                              fontFamily: 'Poppins-SemiBold',
                                              color: Colors.black,
                                              marginBottom: 50,
                                              textAlign: 'center',
                                            }}>
                                            You saved your first search!
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 24
                                                  : 18,
                                              fontFamily: 'Poppins-Light',
                                              color: 'black',
                                              alignItems: 'center',
                                              flexDirection: 'row',
                                              lineHeight:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 35
                                                  : 22,
                                              flexWrap: 'wrap',
                                              textAlign: 'center',
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              textAlign: 'center',
                                              paddingHorizontal: 16,
                                            }}>
                                            You can find your Saved Search’s in
                                            the “Saved Search” tab inside the
                                            profile menu. You’ll also receive
                                            emails and push notifications when
                                            new properties are listed.
                                            {/* <TouchableOpacity
                                          onPress={() => {
                                            navigation.navigate('RecycleBin');
                                          }}
                                          style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 6,
                                          }}>
                                         
                                        
                                        </TouchableOpacity> */}
                                          </Text>

                                          <View
                                            style={{
                                              flexDirection: 'row',
                                              marginTop: 60,
                                              justifyContent: 'flex-start',
                                              alignItems: 'flex-start',
                                            }}>
                                            <View
                                              style={{flexDirection: 'column'}}>
                                              <TouchableOpacity
                                                style={{
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}
                                                onPress={() => {
                                                  navigation.navigate(
                                                    'MyProfile',
                                                  );
                                                }}>
                                                <Image
                                                  source={Images.newprofile}
                                                  style={{
                                                    height:
                                                      DeviceInfo.getDeviceType() ===
                                                      'Tablet'
                                                        ? 39
                                                        : 25,
                                                    width:
                                                      DeviceInfo.getDeviceType() ===
                                                      'Tablet'
                                                        ? 39
                                                        : 25,
                                                    resizeMode: 'contain',
                                                    tintColor: '#000',
                                                  }}></Image>
                                                <Text
                                                  style={{
                                                    fontSize:
                                                      DeviceInfo.getDeviceType() ===
                                                      'Tablet'
                                                        ? 20
                                                        : 10,
                                                    fontFamily: 'Poppins-Light',
                                                    color: '#000',
                                                  }}>
                                                  Profile
                                                </Text>
                                              </TouchableOpacity>
                                            </View>

                                            <LottieView
                                              style={{
                                                height:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 79
                                                    : 49,
                                                width:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 79
                                                    : 59,
                                                marginLeft: 10,
                                                marginTop: 0,
                                                position: 'relative',
                                                top:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? -15
                                                    : -10,
                                              }}
                                              source={require('../../assets/animations/leftarrow.json')}
                                              autoPlay
                                              loop
                                            />
                                          </View>
                                        </Animated.View>
                                      </View>
                                    </View>
                                  </Modal>
                                </KeyboardAvoidingView>

                                <KeyboardAvoidingView behavior="padding">
                                  <Modal
                                    transparent={true}
                                    animationType="slide"
                                    visible={gpsModalVisiavle}
                                    //visible={true}
                                    onRequestClose={() => {
                                      setGpsModalVisiavle(false);
                                    }}>
                                    <View style={styles.modalContainer1}>
                                      <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.modalOverlay1}
                                        onPress={() => {
                                          setGpsModalVisiavle(false);
                                        }}
                                      />
                                      <View
                                        style={{
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          width: '100%',
                                        }}>
                                        <Animated.View
                                          {...panResponder.panHandlers}
                                          style={[
                                            styles.modalContent1,
                                            {
                                              transform: [
                                                {
                                                  translateY:
                                                    slideAnimation.interpolate({
                                                      inputRange: [-300, 0],
                                                      outputRange: [-300, 0],
                                                    }),
                                                },
                                              ],
                                            },
                                          ]}>
                                          <View
                                            style={{
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              marginBottom: 20,
                                            }}>
                                            <View
                                              style={{
                                                width: 50,
                                                height: 5,
                                                backgroundColor: '#bac1c3',
                                                marginTop: 0,
                                                justifyContent: 'center',
                                                borderRadius: 100,
                                              }}></View>
                                          </View>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 36
                                                  : 21,
                                              fontFamily: 'Poppins-SemiBold',
                                              color: Colors.black,
                                              marginTop: 40,
                                              textAlign: 'center',
                                            }}>
                                            Cool Beans!
                                          </Text>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 24
                                                  : 14,
                                              fontFamily: 'Poppins-Medium',
                                              color: Colors.black,
                                              marginBottom: 0,
                                              textAlign: 'center',
                                            }}>
                                            You clicked the geo-lokator!
                                          </Text>
                                          <View
                                            style={{
                                              width: '100%',
                                              justifyContent: 'center',
                                              alignItems: 'center',
                                              marginBottom: 40,
                                            }}>
                                            <LottieView
                                              style={{
                                                height:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 200
                                                    : 200,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width:
                                                  DeviceInfo.getDeviceType() ===
                                                  'Tablet'
                                                    ? 270
                                                    : 270,
                                              }}
                                              source={require('../../assets/animations/map.json')}
                                              autoPlay
                                              loop
                                            />
                                          </View>
                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 26
                                                  : 18,
                                              fontFamily: 'Poppins-Light',
                                              color: 'black',
                                              alignItems: 'center',
                                              flexDirection: 'row',
                                              lineHeight:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 39
                                                  : 22,
                                              flexWrap: 'wrap',
                                              textAlign: 'center',
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              textAlign: 'center',
                                              paddingHorizontal: 16,
                                            }}>
                                            If you are in any neighborhood and
                                            want to see the price or details of
                                            a home without Googling it or
                                            contacting the Realtor®, this will
                                            be an invaluable tool in the search
                                            for your new home
                                            {/* <TouchableOpacity
                                          onPress={() => {
                                            navigation.navigate('RecycleBin');
                                          }}
                                          style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 6,
                                          }}>
                                         
                                        
                                        </TouchableOpacity> */}
                                          </Text>

                                          <Text
                                            style={{
                                              fontSize:
                                                DeviceInfo.getDeviceType() ===
                                                'Tablet'
                                                  ? 26
                                                  : 15,
                                              fontFamily: 'Poppins-SemiBold',
                                              color: 'black',
                                              width: '100%',
                                              textAlign: 'center',
                                              marginTop: 30,
                                            }}>
                                            You’re Welcome!
                                          </Text>
                                        </Animated.View>
                                      </View>
                                    </View>
                                  </Modal>
                                </KeyboardAvoidingView>
                                <KeyboardAvoidingView>
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
                                                translateY:
                                                  slideAnimation.interpolate({
                                                    inputRange: [-300, 0],
                                                    outputRange: [-300, 0],
                                                  }),
                                              },
                                            ],
                                          },
                                        ]}>
                                        <ScrollView
                                          style={{
                                            width: '100%',
                                            backgroundColor: Colors.white,
                                          }}>
                                          <View
                                            style={{
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                            }}>
                                            <View
                                              style={{
                                                width: 50,
                                                height: 5,
                                                backgroundColor: '#bac1c3',
                                                marginTop: 0,
                                                justifyContent: 'center',
                                                borderRadius: 100,
                                              }}></View>
                                          </View>
                                          <View style={{}}>
                                            <Text
                                              style={{
                                                fontSize: 18,
                                                fontFamily: 'Poppins-SemiBold',
                                                color: Colors.black,
                                                marginTop: 10,
                                                // marginRight: 180
                                              }}>
                                              Your Review
                                            </Text>
                                          </View>
                                          <View style={{width: '100%'}}>
                                            <View
                                              style={{
                                                width: '100%',
                                                alignSelf: 'center',
                                              }}>
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  justifyContent:
                                                    'space-between',
                                                  alignItems: 'center',
                                                  marginTop: 10,
                                                }}>
                                                <Text
                                                  style={{
                                                    fontSize: 12,
                                                    color: Colors.black,
                                                    fontFamily:
                                                      'Poppins-Regular',
                                                  }}>
                                                  Photos :
                                                </Text>

                                                <StarRating
                                                  maxStars={5}
                                                  starSize={22}
                                                  enableSwiping
                                                  enableHalfStar
                                                  color={Colors.surfblur}
                                                  rating={rating}
                                                  onChange={value => {
                                                    setRating(value);
                                                  }}
                                                />
                                              </View>
                                            </View>

                                            <View
                                              style={{
                                                width: '100%',
                                                alignSelf: 'center',
                                              }}>
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  justifyContent:
                                                    'space-between',
                                                  alignItems: 'center',
                                                }}>
                                                <Text
                                                  style={{
                                                    fontSize: 12,
                                                    color: Colors.black,
                                                    fontFamily:
                                                      'Poppins-Regular',
                                                  }}>
                                                  Description Accuracy :
                                                </Text>

                                                <StarRating
                                                  maxStars={5}
                                                  starSize={22}
                                                  enableSwiping
                                                  enableHalfStar
                                                  color={Colors.surfblur}
                                                  rating={rating1}
                                                  onChange={value => {
                                                    setRating1(value);
                                                  }}
                                                />
                                              </View>
                                            </View>
                                            <View
                                              style={{
                                                width: '100%',
                                                alignSelf: 'center',
                                              }}>
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  justifyContent:
                                                    'space-between',
                                                  alignItems: 'center',
                                                }}>
                                                <Text
                                                  style={{
                                                    fontSize: 12,
                                                    color: Colors.black,
                                                    fontFamily:
                                                      'Poppins-Regular',
                                                  }}>
                                                  Price :
                                                </Text>

                                                <StarRating
                                                  maxStars={5}
                                                  starSize={22}
                                                  enableSwiping
                                                  enableHalfStar
                                                  color={Colors.surfblur}
                                                  rating={rating2}
                                                  onChange={value => {
                                                    setRating2(value);
                                                  }}
                                                />
                                              </View>
                                            </View>

                                            <View
                                              style={{
                                                width: '100%',
                                                alignSelf: 'center',
                                              }}>
                                              <View
                                                style={{
                                                  flexDirection: 'row',
                                                  justifyContent:
                                                    'space-between',
                                                  alignItems: 'center',
                                                }}>
                                                <Text
                                                  style={{
                                                    fontSize: 12,
                                                    color: Colors.black,
                                                    fontFamily:
                                                      'Poppins-Regular',
                                                  }}>
                                                  Interest in Property :
                                                </Text>

                                                <StarRating
                                                  maxStars={5}
                                                  starSize={22}
                                                  enableSwiping
                                                  enableHalfStar
                                                  color={Colors.surfblur}
                                                  rating={rating3}
                                                  onChange={value => {
                                                    setRating3(value);
                                                  }}
                                                />
                                              </View>
                                            </View>

                                            <View
                                              style={{
                                                width: '100%',
                                                alignSelf: 'center',
                                                overflow: 'hidden',
                                              }}>
                                              <Text
                                                style={{
                                                  fontSize: 18,
                                                  fontFamily:
                                                    'Poppins-SemiBold',
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
                                                  flexWrap: 'wrap',
                                                  whiteSpace: 'pre-wrap',
                                                  wordWrap: 'break-word',
                                                  height: 100,
                                                  width: '100%',
                                                  flexWrap: 'wrap',
                                                  overflow: 'hidden',
                                                }}>
                                                {ratingData?.length > 0 ? (
                                                  <TextInput
                                                    multiline={true}
                                                    style={{
                                                      verticalAlign: 'top',
                                                      borderWidth: 1,
                                                      borderColor:
                                                        Colors.BorderColor,
                                                      borderRadius: 8,
                                                      paddingHorizontal: 12,
                                                      fontSize: 12,
                                                      flexWrap: 'wrap',
                                                      color: Colors.newgray,
                                                      fontFamily:
                                                        'Poppins-Regular',
                                                      height: 100,
                                                      width: '100%',
                                                    }}
                                                    onChangeText={text =>
                                                      setComentContent(text)
                                                    }
                                                    autoFocus
                                                  />
                                                ) : (
                                                  <TextInput
                                                    onChangeText={text =>
                                                      setComentContent(text)
                                                    }
                                                    multiline={true}
                                                    style={{
                                                      verticalAlign: 'top',
                                                      borderWidth: 1,
                                                      borderColor:
                                                        Colors.BorderColor,
                                                      borderRadius: 8,
                                                      paddingHorizontal: 12,
                                                      fontSize: 12,
                                                      flexWrap: 'wrap',
                                                      color: Colors.newgray,
                                                      fontFamily:
                                                        'Poppins-Regular',
                                                      height: 100,
                                                      width: '100%',
                                                    }}>
                                                    {/* {ratingData[0]?.comment_content}{"000"} */}
                                                  </TextInput>
                                                )}
                                              </View>
                                            </View>
                                            <View
                                              style={{
                                                width: '100%',

                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'flex-end',
                                                //s paddingHorizontal: 10
                                              }}>
                                              {ratingData?.length > 0 ? (
                                                <View
                                                  style={{
                                                    justifyContent: 'flex-end',
                                                    width: '100%',
                                                    alignItems: 'flex-end',
                                                  }}>
                                                  <TouchableOpacity
                                                    onPress={() =>
                                                      updateReview()
                                                    }
                                                    style={{
                                                      height: 50,
                                                      width: '40%',
                                                      borderRadius: 100,
                                                      backgroundColor:
                                                        Colors.surfblur,
                                                      marginTop: 10,
                                                      flexDirection: 'row',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                      marginBottom: 40,
                                                    }}>
                                                    <Text
                                                      style={{
                                                        fontSize: 16,
                                                        // fontWeight: '700',
                                                        color: Colors.white,
                                                        fontFamily:
                                                          'Poppins-Regular',
                                                      }}>
                                                      Update
                                                    </Text>
                                                  </TouchableOpacity>
                                                </View>
                                              ) : (
                                                <View
                                                  style={{
                                                    justifyContent: 'flex-end',
                                                    width: '100%',
                                                    alignItems: 'flex-end',
                                                  }}>
                                                  <TouchableOpacity
                                                    onPress={() => addReview()}
                                                    style={{
                                                      height: 50,
                                                      width: '45%',
                                                      borderRadius: 100,
                                                      backgroundColor:
                                                        Colors.surfblur,
                                                      marginTop: 10,
                                                      flexDirection: 'row',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                      marginBottom: 20,
                                                    }}>
                                                    <Text
                                                      style={{
                                                        fontSize: 16,
                                                        // fontWeight: '700',
                                                        color: Colors.white,
                                                        fontFamily:
                                                          'Poppins-Regular',
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

                                <Text
                                  // onPress={() => { navigation.navigate('ViewPropertiy', { ID: item.ID }); }}
                                  style={{
                                    fontSize: 22,
                                    marginTop: -16,
                                    color: Colors.primaryBlue,
                                    fontWeight: '500',
                                    fontFamily: 'Poppins-Medium',
                                    textAlign: 'center',
                                  }}>
                                  {item?.property_price}
                                </Text>
                              </View>
                            )}
                            <View
                              style={{
                                width: '100%',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 12,
                              }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: Colors.black,
                                  textAlign: 'center',
                                  fontFamily: 'Poppins-Light',
                                }}
                                numberOfLines={1}>
                                {item?.title}
                              </Text>
                            </View>
                            <View
                              style={{
                                top: 0,
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
                                  source={Images.newbed}
                                  style={{
                                    height: 20,
                                    width: 27,
                                    resizeMode: 'contain',
                                  }}></Image>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Light',
                                  }}>
                                  {item?.property_bedrooms.length > 0
                                    ? item?.property_bedrooms
                                    : 0}
                                  {' Beds'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={Images.bathtub}
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
                                    fontFamily: 'Poppins-Light',
                                  }}>
                                  {item?.bathroomsfull.length > 0
                                    ? item?.bathroomsfull
                                    : 0}

                                  {' Baths'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={Images.measuringtape}
                                  style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: 'contain',
                                    marginBottom: 5,
                                  }}></Image>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color: '#000000',
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Light',
                                  }}>
                                  {item?.property_size.length > 1
                                    ? item?.property_size
                                    : 0}
                                  {' sq ft'}
                                </Text>
                              </View>
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={Images.hoa2}
                                  style={{
                                    height: 28,
                                    width: 29,
                                    marginTop: 0,
                                    resizeMode: 'contain',
                                  }}></Image>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: Colors.black,
                                    marginTop: 6,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Light',
                                  }}>
                                  {item?.associationfee.length > 1
                                    ? item?.associationfee
                                    : '$' + 0}
                                </Text>
                              </View>
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <Image
                                  source={Images.taxnew}
                                  style={{
                                    height: 20,
                                    width: 20,
                                    marginTop: 0,
                                    resizeMode: 'contain',
                                    marginBottom: 5,
                                  }}></Image>
                                <Text
                                  style={{
                                    fontSize: 11,
                                    color: Colors.black,
                                    textAlign: 'center',
                                    fontFamily: 'Poppins-Light',
                                  }}>
                                  {item?.taxannualamount.length > 1
                                    ? item?.taxannualamount
                                    : '$' + 0}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}
                    />
                  </View>
                ) : showMap ? (
                  <View style={{height: '100%', width: width}}>
                    {/* <View style={styles.coverlocation}>
                    <Image source={Images.graylocation} style={styles.locationpic}></Image>
  
                  </View> */}
                    <View
                      style={{
                        position: 'absolute',
                        zIndex: 99,
                        right: 12,
                        top: 60,
                      }}>
                      <TouchableOpacity
                        style={styles.coverlocation1}
                        onPress={() => {
                          setIsCollapsed(!isCollapsed);
                        }}>
                        <Image
                          source={Images.layers}
                          style={styles.locationpic}></Image>
                      </TouchableOpacity>
                      <Collapsible
                        collapsed={!isCollapsed}
                        style={{
                          backgroundColor: Colors.white,
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          paddingVertical: 12,
                        }}>
                        <View
                          style={{
                            backgroundColor: Colors.white,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              setMapType('satellite');
                            }}>
                            <Image
                              tintColor={
                                mapType === 'satellite'
                                  ? Colors.PrimaryColor
                                  : Colors.placeholderTextColor
                              }
                              source={Images.satellite}
                              style={styles.locationpic}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setMapType('hybrid');
                            }}>
                            <Image
                              tintColor={
                                mapType === 'hybrid'
                                  ? Colors.PrimaryColor
                                  : Colors.placeholderTextColor
                              }
                              source={Images.hybrid}
                              style={styles.locationpic}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setMapType('terrain');
                            }}>
                            <Image
                              tintColor={
                                mapType === 'terrain'
                                  ? Colors.PrimaryColor
                                  : Colors.placeholderTextColor
                              }
                              source={Images.terrain}
                              style={styles.locationpic}></Image>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setMapType('standard');
                            }}>
                            <Image
                              tintColor={
                                mapType === 'standard'
                                  ? Colors.PrimaryColor
                                  : Colors.placeholderTextColor
                              }
                              source={Images.standard}
                              style={styles.locationpic}></Image>
                          </TouchableOpacity>
                        </View>
                      </Collapsible>
                    </View>
                    <View></View>
                    <MapView
                      provider={PROVIDER_DEFAULT}
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
                      }}>
                      {homeData.map(item => {
                        return (
                          <Marker
                            showCallout={true}
                            coordinate={{
                              latitude: parseFloat(item?.property_latitude),
                              longitude: parseFloat(item?.property_longitude),
                            }}>
                            <Image
                              source={Images.locationss}
                              style={{
                                height: 50,
                                width: 100,
                                resizeMode: 'contain',
                              }}
                            />
                            <Callout
                              onPress={() => {
                                navigation.navigate('ViewPropertiy', {
                                  ID: item.ID,
                                });
                              }}
                              style={{
                                height: 70,
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginLeft: 20,
                                top: -15,
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  alignContent: 'center',
                                  marginLeft: 20,
                                  top: -12,
                                }}>
                                <Text
                                  style={{
                                    position: 'relative',
                                    height: 100,
                                    top: -20,
                                  }}>
                                  <Image
                                    style={{
                                      height: 80,
                                      width: 100,
                                      resizeMode: 'stretch',
                                    }}
                                    source={{
                                      uri: item.featured_image_src[0]?.guid,
                                    }}
                                  />
                                </Text>
                                <View style={{flexWrap: 'wrap', top: -5}}>
                                  <Text
                                    style={{
                                      color: 'black',
                                      marginLeft: 10,
                                      fontWeight: '500',
                                      flexWrap: 'wrap',
                                    }}>
                                    {item.title}
                                  </Text>
                                  <Text
                                    style={{
                                      color: Colors.primaryBlue,
                                      marginLeft: 10,
                                      fontWeight: '500',
                                    }}>
                                    {item.property_price}
                                  </Text>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      marginLeft: 10,
                                    }}>
                                    <Text
                                      style={{
                                        color: Colors.black,
                                        marginleft: 10,
                                        fontWeight: '500',
                                      }}>
                                      {item.property_bedrooms} Beds{' '}
                                    </Text>
                                    <Text
                                      style={{
                                        color: Colors.black,
                                        marginleft: 10,
                                        fontWeight: '500',
                                      }}>
                                      {item.bathroomsfull} Baths{' '}
                                    </Text>
                                    <Text
                                      style={{
                                        color: Colors.black,
                                        marginleft: 10,
                                        fontWeight: '500',
                                      }}>
                                      {item.property_size} sq ft{' '}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </Callout>
                          </Marker>
                        );
                      })}
                    </MapView>
                  </View>
                ) : null}
              </View>
            ) : (
              <View
                style={{
                  height: '100%',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    fontFamily: 'Poppins-Regular',
                    width: '100%',
                    position: 'absolute',
                    top: '30%',
                    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 20,
                  }}>
                  Would you like to extend your search radius by 10 miles?
                </Text>

                <View
                  style={{
                    width: '40%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 30,
                  }}>
                  <TouchableOpacity
                    onPress={async () => {
                      setLimit(limit + 1);
                      await dispatch(
                        getPopertiess({
                          type: 0,
                          limit: limit + 1,
                          ID: store?.getState()?.loginUserReducer?.loginData
                            ?.data?.ID,
                        }),
                      ).then(res => {
                        setHomeData(res.payload.data);
                      });
                    }}
                    style={{
                      height: DeviceInfo.getDeviceType() === 'Tablet' ? 70 : 50,
                      width: '100%',
                      borderRadius: 100,
                      backgroundColor: Colors.PrimaryColor,
                      marginTop: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 40,
                    }}>
                    <Text
                      style={{
                        fontSize:
                          DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 18,
                        color: Colors.white,
                        fontFamily: 'poppins-regular',
                      }}>
                      Extend
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  dropdown1BtnTxtStyle: {
    color: '#444',
    textAlign: 'left',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},

  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.BorderColor,
  },
  locationpic: {
    resizeMode: 'contain',
    width: 16,
    height: 16,
    paddingVertical: 12,
  },

  maincovermap: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    borderRadius: 20, // Set the border radius for the container View
    overflow: 'hidden',
    //backgroundColor: "red",
    marginHorizontal: 16,
    position: 'relative',
  },
  coverlocation: {
    backgroundColor: 'rgba(255,255,255,.8)',
    height: 38,
    width: 35,
    position: 'absolute',
    top: 15,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    right: 12,
    shadowOffset: {width: -2, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  coverlocation1: {
    backgroundColor: 'rgba(255,255,255,.8)',
    height: 38,
    width: 35,
    //position: "absolute", top: 55, zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    // right: 12,
    shadowOffset: {width: -2, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 22,

    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalContainer1: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },

  modalOverlay1: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    width: DeviceInfo.getDeviceType() === 'Tablet' ? '100%' : '98%',
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
  },
  modalContent1: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '100%',
    width: '96%',
    //alignItems: 'center',
    //justifyContent: 'center',
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
  },
  shadowProp: {
    width: '95%',
    alignContent: 'center',
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: Colors.white,
    height: '100%',
  },
  marrowcover: {
    width: '100%',
    flexDirection: 'row',
    zIndex: 9,
    top: '30%',
    justifyContent: 'space-between',
    position: 'absolute',
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
    borderBottomLeftRadius: 8,
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
    marginVertical: 8,
    padding: 0,
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
    // marginLeft: 10,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.newgray,
    width: '50%',
    borderColor: Colors.BorderColor,
    borderRadius: 10,
    marginBottom: 8,
  },

  dropdownz: {
    fontSize: 14,
    //borderBottomWidth: 1,
    fontFamily: 'Poppins-Regular',
    color: Colors.newgray,
    width: '100%',
    //borderBottomColor: Colors.BorderColor,
    borderRadius: 2,
    marginBottom: 8,
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
    color: 'gray',
  },
  selectedStyle: {
    borderRadius: 12,
  },
  itemTextStyle: {
    fontSize: 16,
    color: Colors.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: Colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: Colors.black,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
  },
});
