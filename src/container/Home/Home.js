import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
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
  StatusBar,
  SafeAreaView,
} from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {getPoperties} from '../../modules/getPoperties';
import {postRating} from '../../modules/postRating';
import {getFilter} from '../../modules/getFilter';
import {SvgUri} from 'react-native-svg';
import {postUpdateRating} from '../../modules/postUpdateRating';
import {MultiSelect} from 'react-native-element-dropdown';
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
import MapView, {
  Marker,
  Callout,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Collapsible from 'react-native-collapsible';
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
import {useIsFocused} from '@react-navigation/native';
import {propertyChatList} from '../../modules/propertyChats';
import {Picker} from 'react-native-wheel-pick';
import {getAgent} from '../../modules/getAgent';
import { getNotifications } from '../../modules/getNotifications'

const {width} = Dimensions.get('screen');
const Home = () => {
  const isFocused = useIsFocused();
  const [keyboardStatus, setKeyboardStatus] = useState('first');
  useEffect(() => {
    console.log('filterType=====>', filterType);
  }, [filterType]);

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
    setFilterType(2);
    if (keyboardStatus === 'Keyboard Hidden') {
      if (adress.length > 0) {
        const formData = new FormData();
        formData.append('SearchParameters', adress);
        dispatch(getPoperties({type: 2, data: formData, lntLng})).then(res => {
          setHomeData(res.payload.data);
        });
        setKeyboardStatus('first');
        setIsSelected(false);
        setIsSelecteddata_name(false);
        setIsPressed1(false);
        setIsPressed(false);
        setSelectedTabs([]);
        setTermName([]);
      }
    }
  };
  const dispatch = useDispatch();
  const [homeData, setHomeData] = useState([]);
  const [selectedTabs, setSelectedTabs] = useState([]);
  const [selectedTabsMore, setSelectedTabsMore] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [activity, setActivity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adress, setAddres] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [moreFilterData, setMoreFilterData] = useState([]);
  const [termName, setTermName] = useState([]);
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
  const [isSelecteddata_name, setIsSelecteddata_name] = useState(false);
  const [bedroomitem, setBedroomItem] = useState(-1);
  const [bathRoom, setBathRoomItem] = useState(-1);
  const [imageIndex, setImageIndex] = useState(0);
  const [lntLng, setLatLng] = useState({latitude: 0.0, longitude: 0.0});
  const [showMap, setShowMap] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [moreFilter, setMoreFilter] = useState(false);
  const [minSquareFeet, setMinSquareFeet] = useState(['No Min']);
  const [maxSquareFeet, setMaxSquareFeet] = useState(['No Max']);
  const [minPricerange, setMinPricerange] = useState(['No Max']);
  const [maxPriceRange, setMaxPriceRange] = useState(['No Min']);
  const [limitCount, setLimitCount] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isPressed1, setIsPressed1] = useState(false);
  const [isPressed2, setIsPressed2] = useState(false);
  const [mainViewHeight, setMainViewHeight] = useState(0);
  const [topViewHeight, setTopViewHeight] = useState(0);
  const [centerHeight, setCenterHeight] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [zipText, setZipText] = useState();
  const [filterType, setFilterType] = useState(1);
  const ref = useRef();

useEffect(() => {
  getFilterApicall()
}, [])


  useEffect(() => {
    getPopertiesApiCall({type: 0, data: {limit: limitCount}, lntLng}),
      getTrashApiCall(),
      favlistApi(),
      getSavedApiCall(),
      fetchUserScore();
    setAddres('');
  }, []);
  useEffect(() => {
    if (isFocused) {
      Promise.all[
        new Promise(resolve => {
          const res =
            store.getState().getPopertiesReducer?.getPopertiesData?.data;
          setHomeData(res);
          resolve();
        })
      ];
    }
  }, [isFocused]);

  const getFilterApicall = () => {
    dispatch(getFilter()).then(response => {
      setFilterData(response.payload.data);
    });
  };
  const getPopertiesApiCall = async type => {
    setFilterType(1);
    setLoading(true);
    await dispatch(getPoperties(type));
    typeof store.getState().getPopertiesReducer.getPopertiesData?.data ===
    'object'
      ? store.getState().getPopertiesReducer.getPopertiesData?.data &&
        setHomeData(store.getState().getPopertiesReducer.getPopertiesData?.data)
      : setHomeData([]);
    setLoading(false);
  };

  useEffect(() => {
    dispatch(propertyChatList());
  }, []);
  useEffect(() => {
    setCenterHeight(mainViewHeight - topViewHeight);
  }, [topViewHeight]);

  useEffect(() => {
    if (selectedTabsMore) {
    }
  }, [selectedTabsMore]);
  useEffect(() => {
    if (termName) {
    }
  }, [termName]);

  const handlePress2 = () => {
    setIsPressed2(!isPressed2);
    filtertoggleModal();
  };
  useEffect(() => {
    getAgentApicall();
  }, []);
  const getAgentApicall = () => {
    dispatch(getAgent());
  };
  useEffect(() => {
    dispatch(getNotifications())
  }, [])
  useEffect(() => {
    dispatch(getMoreFilter());
    setMoreFilterData(store.getState().getMoreFilter.getMoreFilterData?.data);
    moreFilterData?.min_square?.map((item, index) => {
      setMinSquareFeet(old => [...old, item.data_name]);
    });
    moreFilterData?.max_square?.map((item, index) => {
      setMaxSquareFeet(old => [...old, item.data_name]);
    });
    moreFilterData?.min_price?.map((item, index) => {
      setMinPricerange(old => [...old, item.data_name]);
    });
    moreFilterData?.max_price?.map((item, index) => {
      setMaxPriceRange(old => [...old, item.data_name]);
    });
  }, [store.getState().getMoreFilter.getMoreFilterData]);




  const fetchUserScore = () => {
    dispatch(getUserScore());
  };

  const clearFilterAPiCall = async () => {
    setFilterType(1);
    setSelectedTabs([]);
    setIsSelected(false);
    setIsSelecteddata_name(false);
    setIsPressed1(false);
    setIsPressed(false);
    setBedroomItem(null);
    setBathRoomItem(null);
    setMinSquareFeet('');
    setMaxSquareFeet('');
    setMinPricerange('');
    setMaxPriceRange('');
    setMoreFilter(false);
    setTermName([]);
    setCities('');
    setFilterModalVisible(false);
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
          closeModal();
          closeFavModal();
          closeTrashModal();
          closeSaveModal();
        } else {
          Animated.spring(slideAnimation, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

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
  const favToggleModal = () => {
    setfavModalVisiable(!favModalVisiable);
  };
  const saveToogleModal = () => {
    setSaveModalVisible(!saveModalVisible);
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
  const slideAnimations = useRef(new Animated.Value(0)).current;

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnimations.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          closeModals();
        } else {
          Animated.spring(slideAnimations, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;
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

  const handleModalAnimations = () => {
    Animated.timing(slideAnimations, {
      toValue: filterModalVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
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
      return link;
    } catch (error) {}
  };
  const handleShare = async ID => {
    const link = await generateLink(ID);
    try {
      Share.share({
        title: 'Please check this property',
        message: link,
        url: link,
      });
    } catch (error) {}
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
        store.getState().getFavoritePropertiesReducer.getFavoritePropertiesData
          .count == 0
      ) {
        favToggleModal();
      } else {
      }
    });
  };
  const getTrashApiCall = async () => {
    await dispatch(getTrash()).then(res => {});
  };
  const trashfile = async post_id => {
    getTrashApiCall();
    const formData = new FormData();
    formData.append('post_id', post_id);

    await dispatch(addRemoveTrash(formData)).then(response => {
      if (store.getState().getTrashReducer.getTrashData.count == 0) {
        trashToggleModal();
      } else {
      }
    });
  };

  const getCurretLocation = () => {
    setFilterType(3);
    setLoading(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    })
      .then(async location => {
        const formData = new FormData();
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);
        dispatch(getPoperties({type: 1, data: '', latLng: formData})).then(
          response => {
            if (response.payload?.data.length < 1) {
              setLoading(false);
              alert(response.payload.message);
            } else {
              setHomeData(response.payload?.data);
              setLoading(false);
            }
          },
        );
      })
      .catch(error => {
        const {code, message} = error;
      });
  };


  const addReview = async () => {
    try {
      setIsAnimating(true);

      const formData = new FormData();
      formData.append('postid', productId.toString());
      formData.append('reviewtitle', reviewTitle);
      formData.append('photo_quality_rating', rating);
      formData.append('desc_stars', rating1);
      formData.append('price_stars', rating2);
      formData.append('interest_stars', rating3);
      formData.append('content', commentContent ? commentContent : '');

      const response = await dispatch(postRating(formData));

      if (response.payload.data.success) {
        setIsAnimating(false);
        toggleModal();
      } else {
        setIsAnimating(false);
        toggleModal();
      }
    } catch (error) {
      setIsAnimating(false);
      console.error('Error submitting review:', error);
    }
  };

  const updateReview = async post_id => {
    try {
      setIsAnimating(true);

      const formData = new FormData();
      formData.append('postid', productId);
      formData.append('comment_content', commentContent ? commentContent : '');
      formData.append('review_title', reviewTitle);
      formData.append('review_stars', rating);
      formData.append('description_review_stars', rating1);
      formData.append('price_review_stars', rating2);
      formData.append('interest_review_stars', rating3);

      dispatch(postUpdateRating(formData)).then(response => {
        if (response.payload.success) {
          setIsAnimating(false);
          toggleModal();
        } else {
          setIsAnimating(false);
          toggleModal();
        }
      });
    } catch (error) {
      setIsAnimating(false);
      console.error('Error submitting review:', error);
    }
  };
  const renderFillterItem = ({item, index}) => {
    const {data_customvalue, term_name} = item;
    const isSelected =
      selectedTabs.filter(i => i === data_customvalue).length > 0;
    const isSelecteddata_name =
      termName.filter(i => i === term_name).length > 0;

    return (
      <TouchableOpacity
        onPress={() => {
          if (isSelected) {
            setSelectedTabs(prev => prev.filter(i => i !== data_customvalue));
          } else {
            setSelectedTabs(prev => [...prev, data_customvalue]);
          }
          if (isSelecteddata_name) {
            setTermName(prev => prev.filter(i => i !== term_name));
          } else {
            setTermName(prev => [...prev, term_name]);
          }
          setIsSelected(true);
          setIsSelecteddata_name(true);
          setSelected(index);
          setActivity(false);
          setLoading(true);
          setAddres('');
          dispatch(
            getPoperties({
              type: 3,
              data: {
                filter_type: filterType,
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
        <View style={styles.filtericoncover}>
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
        <>
          <StatusBar backgroundColor={'#5BB3FF'} />
          <View style={styles.loaderstyle}>
            <Loader />
          </View>
        </>
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
          style={styles.bgcover}>
          <View
            onLayout={({nativeEvent}) => {
              const {x, y, width, height} = nativeEvent.layout;
              setTopViewHeight(height);
            }}>
            <View style={styles.searchuppercover}>
              <View style={styles.searchinnercover}>
                <View style={styles.w85}>
                  <View style={styles.gpscover1}>
                    <TouchableOpacity
                      style={styles.filterstyle1}
                      onPress={() => {
                        setIsPressed(!isPressed);
                        setIsPressed1(false);
                        setIsPressed2(false);
                        filtertoggleModal();
                      }}>
                      <Image
                        source={Images.newfil}
                        style={styles.innerfileter}></Image>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    allowFontScaling={false}
                    placeholderTextColor={'#858383'}
                    fontFamily={'Poppins-Regular'}
                    keyboardType="web-search"
                    returnKeyType="done"
                    value={adress}
                    onSubmitEditing={Keyboard.dismiss}
                    onChangeText={text => setAddres(text)}
                    style={{
                      ...styles.searchinputtextarea,
                    }}
                  />
                </View>
                <View style={styles.searchboarder}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMap(!showMap);
                    }}
                    style={styles.searchborderinner}>
                    <Image
                      source={Images.mapnew1}
                      tintColor={showMap ? Colors.PrimaryColor : Colors.black}
                      style={styles.addressstyle}></Image>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.gpscover}>
                {loading ? (
                  <ActivityIndicator size="small" color="blue" />
                ) : (
                  <TouchableOpacity
                    onPress={async () => {
                      await getCurretLocation();
                      setShowMap(false);
                      setAddres('');
                    }}>
                    <Image source={Images.gps} style={styles.gpsstyle}></Image>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={styles.filterupper}>
              <FlatList
                data={filterData}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderFillterItem}
              />
            </View>

            {isSelected && (
              <View style={styles.filterinner}>
                <View style={styles.filterinnermain}>
                  <TouchableOpacity
                    onPress={() => {
                      getSavedApiCall();
                      setIsPressed1(!isPressed1);
                      setIsPressed(false);
                      const formData = new FormData();
                      formData.append('search_name', termName);
                      dispatch(filterSearch(formData)).then(response => {
                        if (
                          store.getState().getSavedSearchReducer
                            .getSavedSearchData.count == 0
                        ) {
                          saveToogleModal();
                        }
                      });
                    }}
                    style={[
                      styles.rew,
                      {
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        borderColor: '#707070',
                        borderRadius: 10,
                        backgroundColor: 'white',
                      },
                    ]}>
                    <Image
                      source={Images.SaveAlt}
                      style={[styles.filtericonstyle]}
                    />
                    <Text style={[styles.savesearchstyle, {color: 'black'}]}>
                      Save Search
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      clearFilterAPiCall();
                    }}
                    style={[
                      styles.rew,
                      {
                        backgroundColor: isPressed2 ? 'black' : 'white',
                        flexDirection: 'row',
                        backgroundColor: 'white',
                        borderColor: '#707070',
                        borderRadius: 10,
                      },
                    ]}>
                    <Text
                      style={[
                        {
                          color: isPressed2 ? 'white' : 'black',
                        },
                        styles.clearfilterbutton,
                      ]}>
                      Clear filters
                    </Text>
                    <Image
                      source={Images.Broom}
                      style={styles.filtericonstyles}
                    />
                  </TouchableOpacity>
                </View>
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
                      style={styles.cardswipercover}
                      cards={homeData}
                      onNoMoreCards={() => {
                        setHomeData([]);
                      }}
                      renderYep={() => (
                        <View
                          style={[
                            styles.cardinnercover,
                            {height: imageHeight, width: imageWidth},
                          ]}>
                          <View style={styles.cardinner}>
                            <View style={styles.thumpupcover}>
                              <Image
                                source={Images.ThumbUp}
                                style={styles.thumpinnergreen}
                              />
                            </View>
                          </View>
                        </View>
                      )}
                      renderNope={() => (
                        <View
                          style={[
                            styles.redoverlay,
                            {
                              marginLeft: -imageWidth - 10,
                              height: imageHeight,
                              width: imageWidth,
                            },
                          ]}>
                          <View style={styles.redthumbcover}>
                            <View style={styles.redinnercover}>
                              <Image
                                source={Images.deletethumb}
                                style={styles.thumbiconred}
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
                            style={{height: '60%', width: '100%'}}
                            disableGesture={true}
                            index={imageIndex}
                            autoPlay={false}
                            autoplayDelay={3000}
                            data={item?.featured_image_src}
                            refer={index}
                            renderItem={({item1, index}) => (
                              <>
                                <View
                                  onLayout={({nativeEvent}) => {
                                    const {x, y, width, height} =
                                      nativeEvent.layout;
                                    setImageHeight(height);
                                    setImageWidth(width);
                                  }}
                                  style={{
                                    height: '100%',
                                    width: width,
                                    position: 'relative',
                                  }}>
                                  <View style={styles.upperarrowcover}>
                                    {/* <View style={styles.arroescovr}>
                                      <Image
                                        source={Images.next}
                                        style={styles.nextcover}
                                      />

                                      <Image
                                        source={Images.next}
                                        style={styles.nextimage}
                                      />
                                    </View> */}
                                    <TouchableOpacity
                                      disabled={imageIndex > 0 ? false : true}
                                      onPress={() => {
                                        setImageIndex(imageIndex - 1);
                                      }}
                                      style={{
                                        height: '100%',
                                        // width: 30,
                                        // position: 'absolute',
                                        // zIndex:999,
                                        // left: 10,

                                        width: 30,
                                        position: 'relative',
                                        left: 10,
                                      }}>
                                      <View
                                        style={{
                                          height: width,
                                          width: 40,
                                          position: 'absolute',
                                          zIndex: 999,
                                          right: 10,
                                        }}>
                                        <Image
                                          source={Images.nextslide}
                                          style={styles.nextcover}
                                        />
                                      </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      // style={{backgroundColor:'red',zIndex:999,position:'absolute'}}
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
                                        }}>
                                        <Image
                                          source={Images.nextslide}
                                          style={styles.nextimage}
                                        />
                                      </View>
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
                                      style={styles.featuredimage}
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
                          <View style={styles.h40}>
                            {!loading && (
                              <View style={styles.bgcover1}>
                                <View style={styles.uperrtaing}>
                                  <View style={styles.mainrat}>
                                    <TouchableOpacity
                                      style={styles.coverrat}
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
                                      <View style={styles.ratingcover}>
                                        <Image
                                          source={
                                            item.total_average_rating > 0
                                              ? Images.startfill
                                              : Images.star2
                                          }
                                          style={[
                                            {
                                              tintColor:
                                                item.total_average_rating > 0
                                                  ? undefined
                                                  : 'black',
                                            },
                                            styles.ratingimage,
                                          ]}
                                        />
                                        {item.total_average_rating > 0 ? (
                                          <Text style={styles.ratingstyle}>
                                            {Math.round(
                                              item.total_average_rating,
                                            )}
                                          </Text>
                                        ) : null}
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => handleShare(item.ID)}
                                    style={styles.sendcover}>
                                    <Image
                                      source={Images.send}
                                      style={styles.sendbtn}
                                    />
                                  </TouchableOpacity>
                                </View>
                                <KeyboardAvoidingView behavior="padding">
                                  <Modal
                                    transparent={true}
                                    visible={favModalVisiable}
                                    onRequestClose={() => {
                                      setfavModalVisiable(false);
                                    }}>
                                    <View style={[styles.modalContainer1]}>
                                      <TouchableOpacity
                                        activeOpacity={1}
                                        style={[styles.modalOverlay1]}
                                        onPress={() => {
                                          setfavModalVisiable(false);
                                        }}
                                      />
                                      <View
                                        style={[
                                          {
                                            width: '100%',
                                            height: '100%',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                          },
                                          styles.modalaligned,
                                        ]}>
                                        <Animated.View
                                          {...panResponder.panHandlers}
                                          style={[
                                            styles.modalContent1,
                                            {
                                              width: '100%',
                                              backgroundColor: '#f1f1f1',
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
                                          <View style={[styles.modalstart]}>
                                            <View
                                              style={styles.indicator}></View>
                                          </View>

                                          <Text
                                            style={styles.congratulationstxt}>
                                            Congratulations!
                                          </Text>
                                          <Text style={styles.swipedright}>
                                            You swiped right!
                                          </Text>
                                          <Text style={styles.modaldes}>
                                            These properties will be saved in
                                            your Favorites
                                          </Text>

                                          <View style={styles.inermodaltop}>
                                            <LottieView
                                              style={styles.leftarrow2}
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
                                                    'Favorites',
                                                  );
                                                }}>
                                                <Image
                                                  source={Images.ThumbUp}
                                                  style={
                                                    styles.modalthumpup
                                                  }></Image>
                                                <Text style={styles.favtext}>
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
                                    visible={tashModalVisiable}
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
                                        style={[
                                          {
                                            width: '100%',
                                            height: '100%',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                          },
                                        ]}>
                                        <Animated.View
                                          {...panResponder.panHandlers}
                                          style={[
                                            styles.modalContent1,
                                            {
                                              width: '100%',
                                              backgroundColor: '#f1f1f1',
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
                                          <View style={styles.modalstart}>
                                            <View
                                              style={styles.indicator}></View>
                                          </View>
                                          <Text style={styles.wohotxt}>
                                            Woohoo!{' '}
                                          </Text>
                                          <Text style={styles.swipedleft1}>
                                            You swiped left!
                                          </Text>
                                          <Text style={styles.modaldes1}>
                                            These properties will be saved in
                                            the “Recycle Bin” tab inside the
                                            profile menu.
                                          </Text>

                                          <View style={styles.inermodaltop}>
                                            <View
                                              style={{flexDirection: 'column'}}>
                                              <TouchableOpacity
                                                style={styles.modalaligned}
                                                onPress={() => {
                                                  navigation.navigate(
                                                    'MyProfile',
                                                  );
                                                }}>
                                                <Image
                                                  source={Images.newprofile}
                                                  style={
                                                    styles.userimage1
                                                  }></Image>
                                                <Text style={styles.profiletxt}>
                                                  Profile
                                                </Text>
                                              </TouchableOpacity>
                                            </View>

                                            <LottieView
                                              style={styles.leftarrow1}
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
                                    visible={saveModalVisible}
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
                                        style={[
                                          {
                                            width: '100%',
                                            height: '100%',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                          },
                                        ]}>
                                        <Animated.View
                                          {...panResponder.panHandlers}
                                          style={[
                                            styles.modalContent2,
                                            {
                                              width: '100%',
                                              backgroundColor: 'white',
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
                                          <View style={styles.modalstart}>
                                            <View
                                              style={styles.indicator}></View>
                                          </View>
                                          <Text
                                            style={[
                                              styles.savedsearchheadin,
                                              {marginTop: 40},
                                            ]}>
                                            Righteous!
                                          </Text>
                                          <Text
                                            style={[
                                              styles.savedsearchheadin,
                                              {marginBottom: 50},
                                            ]}>
                                            You saved your first search!
                                          </Text>
                                          <Text style={styles.savedsearchdes}>
                                            You can find your Saved Search’s in
                                            the “Saved Search” tab inside the
                                            profile menu. You’ll also receive
                                            emails and push notifications when
                                            new properties are listed.
                                          </Text>

                                          <View style={styles.inermodaltop}>
                                            <View
                                              style={{flexDirection: 'column'}}>
                                              <TouchableOpacity
                                                style={styles.modalaligned}
                                                onPress={() => {
                                                  navigation.navigate(
                                                    'MyProfile',
                                                  );
                                                }}>
                                                <Image
                                                  source={Images.newprofile}
                                                  style={
                                                    styles.userimage
                                                  }></Image>
                                                <Text style={styles.profiletxt}>
                                                  Profile
                                                </Text>
                                              </TouchableOpacity>
                                            </View>

                                            <LottieView
                                              style={styles.leftarrow}
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
                                    visible={gpsModalVisiavle}
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
                                        style={[
                                          {
                                            width: '100%',
                                            height: '100%',
                                            alignItems: 'flex-end',
                                            justifyContent: 'flex-end',
                                          },
                                        ]}>
                                        <Animated.View
                                          {...panResponder.panHandlers}
                                          style={[
                                            styles.modalContent3,
                                            {
                                              width: '100%',
                                              backgroundColor: '#f1f1f1',
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
                                          <View style={styles.modalstart}>
                                            <View
                                              style={styles.indicator}></View>
                                          </View>
                                          <Text style={styles.upperheader}>
                                            Cool Beans!
                                          </Text>
                                          <Text style={styles.headingtops}>
                                            You clicked the geo-lokator!
                                          </Text>
                                          <View style={styles.animationcover}>
                                            <LottieView
                                              style={styles.mapicon}
                                              source={require('../../assets/animations/map.json')}
                                              autoPlay
                                              loop
                                            />
                                          </View>
                                          <Text style={styles.welcomdesc}>
                                            If you are in any neighborhood and
                                            want to see the price or details of
                                            a home without Googling it or
                                            contacting the Realtor®, this will
                                            be an invaluable tool in the search
                                            for your new home
                                          </Text>

                                          <Text style={styles.welcometxt}>
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
                                    visible={modalVisible}
                                    onRequestClose={toggleModal}>
                                    <View style={styles.modalContainer}>
                                      <TouchableOpacity
                                        activeOpacity={1}
                                        style={styles.modalOverlaynew}
                                        onPress={closeModal}
                                      />
                                      <Animated.View
                                        {...panResponder.panHandlers}
                                        style={[
                                          styles.modalContentnew,
                                          {
                                            transform: [
                                              {
                                                translateY:
                                                  slideAnimation.interpolate({
                                                    inputRange: [0, 300],
                                                    outputRange: [0, 300],
                                                    extrapolate: 'clamp',
                                                  }),
                                              },
                                            ],
                                          },
                                        ]}>
                                        <ScrollView
                                          style={styles.bgcover}
                                          showsVerticalScrollIndicator={false}>
                                          <View
                                            style={{
                                              alignItems: 'center',
                                              paddingBottom: 20,
                                            }}>
                                            <View
                                              style={styles.indicator}></View>
                                          </View>
                                          <ScrollView
                                            style={styles.bgcover}
                                            showsVerticalScrollIndicator={
                                              false
                                            }>
                                            <View style={{}}>
                                              <Text style={styles.reviewtxt}>
                                                Rate This Property
                                              </Text>
                                            </View>

                                            <View style={styles.maincov}>
                                              <View
                                                style={[
                                                  styles.labelcover,
                                                  {marginTop: 10},
                                                ]}>
                                                <Text
                                                  style={styles.propertlabel}>
                                                  Photo Quality:
                                                </Text>

                                                <StarRating
                                                  maxStars={5}
                                                  starSize={27}
                                                  enableSwiping
                                                  enableHalfStar
                                                  color={Colors.surfblur}
                                                  rating={rating}
                                                  onChange={value => {
                                                    setRating(value);
                                                  }}
                                                />

                                                <View
                                                  style={{
                                                    width: '70%',
                                                    borderBottomWidth: 1,
                                                    borderBottomColor:
                                                      Colors.BorderColor,
                                                    marginVertical: 15,
                                                  }}></View>
                                              </View>

                                              <View style={styles.labelcover}>
                                                <Text
                                                  style={styles.propertlabel}>
                                                  Description Accuracy:
                                                </Text>

                                                <StarRating
                                                  maxStars={5}
                                                  starSize={27}
                                                  enableSwiping
                                                  enableHalfStar
                                                  color={Colors.surfblur}
                                                  rating={rating1}
                                                  onChange={value => {
                                                    setRating1(value);
                                                  }}
                                                />
                                                <View
                                                  style={{
                                                    width: '70%',
                                                    borderBottomWidth: 1,
                                                    borderBottomColor:
                                                      Colors.BorderColor,
                                                    marginVertical: 15,
                                                  }}></View>
                                              </View>

                                              <View style={styles.labelcover}>
                                                <Text
                                                  style={styles.propertlabel}>
                                                  Price :
                                                </Text>

                                                <StarRating
                                                  maxStars={5}
                                                  starSize={27}
                                                  enableSwiping
                                                  enableHalfStar
                                                  color={Colors.surfblur}
                                                  rating={rating2}
                                                  onChange={value => {
                                                    setRating2(value);
                                                  }}
                                                />
                                                <View
                                                  style={{
                                                    width: '70%',
                                                    borderBottomWidth: 1,
                                                    borderBottomColor:
                                                      Colors.BorderColor,
                                                    marginVertical: 15,
                                                  }}></View>
                                              </View>

                                              <View style={styles.labelcover}>
                                                <Text
                                                  style={styles.propertlabel}>
                                                  Interest in the property:
                                                </Text>

                                                <StarRating
                                                  maxStars={5}
                                                  starSize={27}
                                                  enableSwiping
                                                  enableHalfStar
                                                  color={Colors.surfblur}
                                                  rating={rating3}
                                                  onChange={value => {
                                                    setRating3(value);
                                                  }}
                                                />
                                                <View
                                                  style={{
                                                    width: '70%',
                                                    borderBottomWidth: 1,
                                                    borderBottomColor:
                                                      Colors.BorderColor,
                                                    marginVertical: 15,
                                                  }}></View>
                                              </View>

                                              <View style={styles.reviewcover}>
                                                <Text
                                                  style={styles.propertlabel}>
                                                  My Notes
                                                </Text>
                                                <View
                                                  style={styles.textinputcover}>
                                                  {ratingData?.length > 0 ? (
                                                    <TextInput
                                                      multiline={true}
                                                      style={
                                                        styles.textinputstyle1
                                                      }
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
                                                      style={
                                                        styles.textinputstyle
                                                      }></TextInput>
                                                  )}
                                                </View>
                                              </View>
                                              <View style={styles.btnmaincover}>
                                                {ratingData?.length > 0 ? (
                                                  <View
                                                    style={
                                                      styles.submitbtnmain
                                                    }>
                                                    <TouchableOpacity
                                                      onPress={() =>
                                                        updateReview()
                                                      }
                                                      style={
                                                        styles.submitbtncover
                                                      }>
                                                      <Text
                                                        style={
                                                          styles.submitbtntxt
                                                        }>
                                                        UPDATE
                                                      </Text>
                                                    </TouchableOpacity>
                                                    {isAnimating && (
                                                      <LottieView
                                                        style={
                                                          styles.loaderstyle1
                                                        }
                                                        source={require('../../assets/animations/star.json')}
                                                        autoPlay
                                                        loop
                                                      />
                                                    )}
                                                  </View>
                                                ) : (
                                                  <View
                                                    style={
                                                      styles.submitbtnmain
                                                    }>
                                                    <TouchableOpacity
                                                      onPress={() =>
                                                        addReview()
                                                      }
                                                      style={
                                                        styles.submitbtncover
                                                      }>
                                                      <Text
                                                        style={
                                                          styles.submitbtntxt
                                                        }>
                                                        Save
                                                      </Text>
                                                    </TouchableOpacity>
                                                    {isAnimating && (
                                                      <LottieView
                                                        style={
                                                          styles.loaderstyle1
                                                        }
                                                        source={require('../../assets/animations/star.json')}
                                                        autoPlay
                                                        loop
                                                      />
                                                    )}
                                                  </View>
                                                )}
                                              </View>
                                            </View>
                                          </ScrollView>
                                        </ScrollView>
                                      </Animated.View>
                                    </View>
                                  </Modal>
                                </KeyboardAvoidingView>

                                <Text style={styles.pricetext}>
                                  {item?.property_price}
                                </Text>
                              </View>
                            )}
                            <View style={styles.titlecover}>
                              <Text style={styles.titletext} numberOfLines={1}>
                                {item?.title}
                              </Text>
                            </View>
                            <View style={styles.iconmaincover}>
                              <View style={styles.iconcover}>
                                <Image
                                  source={Images.newbed}
                                  style={styles.newbedstyle}></Image>
                                <Text style={styles.labelicon}>
                                  {item?.property_bedrooms.length > 0
                                    ? item?.property_bedrooms
                                    : 0}
                                  {' Beds'}
                                </Text>
                              </View>
                              <View style={styles.iconcover}>
                                <Image
                                  source={Images.bathtub}
                                  style={styles.bathtubicon}></Image>
                                <Text style={styles.labelicon}>
                                  {item?.bathroomsfull.length > 0
                                    ? item?.bathroomsfull
                                    : 0}

                                  {' Baths'}
                                </Text>
                              </View>
                              <View style={styles.iconcover}>
                                <Image
                                  source={Images.measuringtape}
                                  style={styles.measureicon}></Image>
                                <Text style={styles.labelicon}>
                                  {item?.property_size.length > 1
                                    ? item?.property_size
                                    : 0}
                                  {' SF'}
                                </Text>
                              </View>
                              <View style={styles.iconcover}>
                                <Image
                                  source={Images.hoa2}
                                  style={styles.hoaicon}></Image>
                                <Text style={styles.labelicon}>
                                  {item?.associationfee.length > 1
                                    ? item?.associationfee
                                    : '$' + 0}
                                </Text>
                              </View>
                              <View style={styles.iconcover}>
                                <Image
                                  source={Images.taxnew}
                                  style={styles.taxicon}></Image>
                                <Text style={styles.labelicon}>
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
                  <View style={styles.mapstarthere}>
                    <View style={styles.mapuppercover}>
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
                        style={styles.collapsecover}>
                        <View style={styles.collapsebg}>
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
                    <MapView
                      //  mapType={Platform.OS == "android" ? "none" : "standard"}
                      provider={PROVIDER_DEFAULT}
                      style={styles.map}
                      zoomControlEnabled={true}
                      showsCompass={true}
                      moveOnMarkerPress={true}
                      mapType={mapType}
                      showsMyLocationButton={true}
                      region={{
                        latitude: parseFloat(homeData[0]?.property_latitude),
                        longitude: parseFloat(homeData[0]?.property_longitude),
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                      }}>
                      {homeData?.map(item => {
                        return (
                          <Marker
                            showCallout={true}
                            coordinate={{
                              latitude: parseFloat(item?.property_latitude),
                              longitude: parseFloat(item?.property_longitude),
                            }}>
                            <Image
                              source={Images.locationss}
                              style={styles.locationimage}
                            />
                            <Callout
                              onPress={() => {
                                navigation.navigate('ViewPropertiy', {
                                  ID: item?.ID,
                                });
                              }}
                              style={styles.calloutcover}>
                              <View style={styles.uppercallout}>
                                <Text style={styles.innercallout}>
                                  <Image
                                    style={styles.calloutfeatureimg}
                                    source={{
                                      uri: item?.featured_image_src[0]?.guid,
                                    }}
                                  />
                                </Text>
                                <View style={styles.detailcover}>
                                  <Text style={styles.itemtitle}>
                                    {item?.title}
                                  </Text>
                                  <Text style={styles.propertyprice}>
                                    {item?.property_price}
                                  </Text>
                                  <View style={styles.labelinnercover}>
                                    <Text style={styles.labelinner}>
                                      {item?.property_bedrooms} Beds{' '}
                                    </Text>
                                    <Text style={styles.labelinner}>
                                      {item?.bathroomsfull} Baths{' '}
                                    </Text>
                                    <Text style={styles.labelinner}>
                                      {item?.property_size} SF{' '}
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
              <View style={styles.extendescover}>
                {filterType === 1 ? (
                  <>
                    <Text style={styles.extenddes}>
                      Would you like to extend your search radius by 10 miles?
                    </Text>
                    <View style={styles.extencovermain}>
                      <TouchableOpacity
                        onPress={async () => {
                          setLimitCount(limitCount + 1);
                          await dispatch(
                            getPoperties({
                              type: 0,
                              data: {limit: limitCount + 1},
                            }),
                          ).then(res => {
                            setHomeData(res?.payload?.data);
                          });
                        }}
                        style={styles.extencover}>
                        <Text style={styles.extendtext}>Extend</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.extenddes}>Record not found !</Text>
                    <View style={styles.extencovermain}>
                      <TouchableOpacity
                        onPress={() => {
                          clearFilterAPiCall();
                        }}
                        style={styles.extencover}>
                        <Text style={styles.extendtext}>Clear Filters </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
          <KeyboardAvoidingView behavior="padding">
            <Modal
              transparent={true}
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
                    styles.modalContentch,
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
                  <SafeAreaView>
                    <ScrollView
                      style={{
                        width: '100%',
                        marginTop: 16,
                      }}>
                      <View style={styles.modalcover}>
                        <View style={styles.indicator}></View>
                      </View>

                      <View style={styles.w99}>
                        <View>
                          <Text style={styles.modallabel}>Surf...</Text>
                          <TextInput
                            allowFontScaling={false}
                            placeholderTextColor={'#858383'}
                            fontFamily={'Poppins-Regular'}
                            keyboardType="default"
                            placeholder="Surf by Neighborhood, Zip Code, Address"
                            returnKeyType="done"
                            value={zipText}
                            onSubmitEditing={Keyboard.dismiss}
                            onChangeText={text => {
                              setZipText(text);
                              console.log('textttttt', text);
                            }}
                            style={[
                              styles.searchinputtext,
                              {width: '100%', borderWidth: 1},
                            ]}
                          />

                          <Text style={styles.modallabel}>
                            Choose your city{' '}
                          </Text>
                          <MultiSelect
                            ref={ref}
                            style={[
                              styles.dropdown,
                              {width: '100%', borderWidth: 1},
                            ]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            visibleSelectedItem={true}
                            itemTextStyle={styles.itemTextStyle}
                            placeholderTextColor="red"
                            search
                            data={moreFilterData?.City}
                            labelField="data_name"
                            valueField="data_customvalue"
                            placeholder="All Cities"
                            searchPlaceholder="Search..."
                            value={cities}
                            valuestyle={{color: 'red'}}
                            onChange={async item => {
                              setCities(item);
                              ref.current.close();
                              await dispatch(
                                getPoperties({
                                  type: 3,
                                  data: {
                                    filter_type: filterType,
                                    data_custom_taxonomy: 'property_city',
                                    data_customvalue: item.toString(),
                                  },
                                }),
                              ).then(res => {
                                filtertoggleModal();
                                setHomeData(res.payload.data);
                                refRBSheet.current.close();
                              });
                            }}
                            selectedStyle={styles.selectedStyle}
                          />

                          <View
                            style={{
                              marginBottom: 12,
                              marginTop: 12,
                            }}>
                            <Text style={styles.modallabel}>Bedrooms</Text>
                            <View style={styles.dataupeercover}>
                              <FlatList
                                style={styles.slidervalue}
                                data={moreFilterData?.bedroom}
                                horizontal={true}
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
                                                filter_type: filterType,
                                                data_custom_taxonomy: 'bedroom',
                                                data_customvalue:
                                                  item.data_customvalue,
                                              },
                                            }),
                                          ).then(res => {
                                            setHomeData(res.payload.data);
                                          });
                                      }}>
                                      <View
                                        style={[
                                          {
                                            backgroundColor:
                                              bedroomitem === index
                                                ? Colors.black
                                                : Colors.white,
                                          },
                                          styles.itemdtacover,
                                        ]}>
                                        <Text
                                          style={[
                                            styles.itemdata,
                                            {
                                              color:
                                                bedroomitem === index
                                                  ? Colors.white
                                                  : Colors.black,
                                            },
                                          ]}>
                                          {item?.data_name}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                }}></FlatList>
                            </View>
                          </View>
                          <View>
                            <Text style={styles.modallabel}>Bathrooms</Text>
                            <View style={styles.dataupeercover}>
                              <FlatList
                                data={moreFilterData?.bathroom}
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
                                              filter_type: filterType,
                                              data_custom_taxonomy: 'bathroom',
                                              data_customvalue:
                                                item.data_customvalue,
                                            },
                                          }),
                                        ).then(res => {
                                          setHomeData(res.payload.data);
                                        });
                                      }}>
                                      <View
                                        style={[
                                          {
                                            backgroundColor:
                                              bathRoom === index
                                                ? Colors.black
                                                : Colors.white,
                                          },
                                          styles.itemdtacover,
                                        ]}>
                                        <Text
                                          style={[
                                            {
                                              color:
                                                bathRoom === index
                                                  ? Colors.white
                                                  : Colors.black,
                                            },
                                            styles.itemdata,
                                          ]}>
                                          {item?.data_name}
                                        </Text>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                }}></FlatList>
                            </View>
                          </View>

                          <View>
                            <Text style={[styles.modallabel, {marginTop: 12}]}>
                              Square Feet
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 8,
                              }}>
                              <View
                                style={[
                                  ,
                                  {
                                    width: '48%',
                                    fontSize: 14,
                                    fontFamily: 'Poppins-Regular',
                                    color: Colors.newgray,
                                    borderColor: Colors.BorderColor,
                                    borderRadius: 10,
                                    marginBottom: 8,
                                  },
                                ]}>
                                <Picker
                                  style={{
                                    backgroundColor: 'white',
                                    width: '90%',
                                    height: 180,
                                  }}
                                  selectedValue="No Min"
                                  pickerData={
                                    minSquareFeet ? minSquareFeet : []
                                  }
                                  onValueChange={async value => {
                                    await dispatch(
                                      getPoperties({
                                        type: 3,
                                        data: {
                                          filter_type: filterType,
                                          data_custom_taxonomy: 'min_square',
                                          data_customvalue: value,
                                        },
                                      }),
                                    ).then(res => {
                                      setHomeData(res.payload.data);
                                    });
                                  }}
                                />
                              </View>

                              <View style={[styles.dropdown, {width: '48%'}]}>
                                <Picker
                                  style={{
                                    backgroundColor: 'white',
                                    width: '90%',
                                    height: 180,
                                  }}
                                  selectedValue="No Max"
                                  pickerData={
                                    maxSquareFeet ? maxSquareFeet : []
                                  }
                                  onValueChange={async value => {
                                    await dispatch(
                                      getPoperties({
                                        type: 3,
                                        data: {
                                          filter_type: filterType,
                                          data_custom_taxonomy: 'max_square',
                                          data_customvalue: value,
                                        },
                                      }),
                                    ).then(res => {
                                      setHomeData(res.payload.data);
                                    });
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                          <View>
                            <Text style={[styles.modallabel, {marginTop: 12}]}>
                              Price Range
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 8,
                              }}>
                              <View
                                style={[
                                  ,
                                  {
                                    width: '48%',
                                    fontSize: 14,
                                    fontFamily: 'Poppins-Regular',
                                    color: Colors.newgray,
                                    borderColor: Colors.BorderColor,
                                    borderRadius: 10,
                                    marginBottom: 8,
                                  },
                                ]}>
                                <Picker
                                  style={{
                                    backgroundColor: 'white',
                                    width: '90%',
                                    height: 180,
                                  }}
                                  selectedValue="No Min"
                                  pickerData={
                                    minPricerange ? minPricerange : []
                                  }
                                  onValueChange={async value => {
                                    await dispatch(
                                      getPoperties({
                                        type: 3,
                                        data: {
                                          filter_type: filterType,
                                          data_custom_taxonomy: 'min_price',
                                          data_customvalue: value,
                                        },
                                      }),
                                    ).then(res => {
                                      setHomeData(res.payload.data);
                                    });
                                  }}
                                />
                              </View>

                              <View style={[styles.dropdown, {width: '48%'}]}>
                                <Picker
                                  style={{
                                    backgroundColor: 'white',
                                    width: '90%',
                                    height: 180,
                                  }}
                                  selectedValue="No Max"
                                  pickerData={
                                    maxPriceRange ? maxPriceRange : []
                                  }
                                  onValueChange={async value => {
                                    await dispatch(
                                      getPoperties({
                                        type: 3,
                                        data: {
                                          filter_type: filterType,
                                          data_custom_taxonomy: 'max_price',
                                          data_customvalue: value,
                                        },
                                      }),
                                    ).then(res => {
                                      setHomeData(res.payload.data);
                                    });
                                  }}
                                />
                              </View>
                            </View>
                          </View>
                          <Collapsible collapsed={moreFilter}>
                            <View style={styles.moreffiltercover}>
                              <FlatList
                                data={moreFilterData?.more_filter_data}
                                style={{
                                  alignContent: 'center',
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
                        </View>
                      </View>
                    </ScrollView>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center',
                        alignSelf:'center',
                        width: '100%',
                      height:'25%',
                      top:-35,
                    //  bottom:20
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          clearFilterAPiCall();
                        }}>
                        <Text
                          style={{
                            marginLeft: 10,
                            fontSize:
                              DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 16,
                            top: -35,
                            borderWidth: 1,
                            borderColor: Colors.surfblur,
                            paddingHorizontal: 20,
                            paddingVertical: 6,
                            borderRadius: 20,
                            color: Colors.surfblur,
                            fontFamily: 'Poppins-Regular',
                          }}>
                          Clear Filters
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          setFilterModalVisible(false);
                        }}
                        style={styles.apllycover}>
                        <Text style={styles.applytext}>Apply</Text>
                      </TouchableOpacity>
                    </View>
                  </SafeAreaView>
                </Animated.View>
              </View>
            </Modal>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default Home;

const styles = StyleSheet.create({
  h40: {
    height: '40%',
    paddingTop: 6,
  },
  uperrtaing: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainrat: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverrat: {
    height: 45,
    width: 45,
  },
  ratingstyle: {
    fontSize: 18,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    marginTop: 0,

    position: 'relative',
    left: 8,
  },
  ratingimage: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  ratingcover: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginLeft: 5,
  },
  sendcover: {
    height: 50,
    width: 50,

    alignItems: 'center',
    position: 'relative',
  },
  sendbtn: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  modalaligned: {},
  calloutfeatureimg: {
    height: 80,
    width: 100,
    resizeMode: 'stretch',
  },
  innercallout: {
    position: 'relative',
    height: 100,
    top: -20,
    ...Platform.select({
      ios: {top: 10, left: 5},
    }),
  },
  uppercallout: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginLeft: 20,
    top: -12,
  },
  calloutcover: {
    height: 70,
    alignItems: 'center',
    alignSelf: 'center',
    marginLeft: 20,
    top: -15,
  },
  locationimage: {
    height: 50,
    width: 100,
    resizeMode: 'contain',
  },
  moreffiltercover: {
    alignContent: 'center',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 10,
    fontFamily: 'Poppins-Light',
    color: '#000',
  },
  modalthumpup: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 25,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 25,
    resizeMode: 'contain',
    tintColor: '#000',
  },
  inermodaltop: {
    flexDirection: 'row',
    marginTop: 60,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modaldes1: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 18,
    fontFamily: 'Poppins-Light',
    color: 'black',
    alignItems: 'center',
    flexDirection: 'row',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 26,
    flexWrap: 'wrap',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  swipedleft1: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 26,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    marginBottom: 50,
    textAlign: 'center',
  },
  wohotxt: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 26,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    marginTop: 40,
    textAlign: 'center',
  },
  modaldes: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 18,
    fontFamily: 'Poppins-Light',
    color: 'black',
    alignItems: 'center',
    flexDirection: 'row',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 26,
    flexWrap: 'wrap',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  swipedright: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 26,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    marginBottom: 50,
    textAlign: 'center',
  },
  congratulationstxt: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 26,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    marginTop: 40,
    textAlign: 'center',
  },
  leftarrow1: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 79 : 49,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 79 : 59,
    marginLeft: 10,
    marginTop: 0,
    position: 'relative',
    top: DeviceInfo.getDeviceType() === 'Tablet' ? -15 : -10,
  },
  userimage1: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 25,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 25,
    resizeMode: 'contain',
    tintColor: '#000',
  },
  modalcovermain: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  savedsearchheadin: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 26,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    // marginBottom: 50,
    textAlign: 'center',
  },
  savedsearchdes: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 24 : 18,
    fontFamily: 'Poppins-Light',
    color: 'black',
    alignItems: 'center',
    flexDirection: 'row',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 22,
    flexWrap: 'wrap',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  userimage: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 25,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 25,
    resizeMode: 'contain',
    tintColor: '#000',
  },
  profiletxt: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 20 : 10,
    fontFamily: 'Poppins-Light',
    color: '#000',
  },
  leftarrow: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 79 : 49,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 79 : 59,
    marginLeft: 10,
    marginTop: 0,
    position: 'relative',
    top: DeviceInfo.getDeviceType() === 'Tablet' ? -15 : -10,
  },
  leftarrow2: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 79 : 49,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 79 : 59,
    marginRight: 30,
    transform: [{rotate: '-180deg'}],
    marginTop: 0,
    position: 'relative',
    top: DeviceInfo.getDeviceType() === 'Tablet' ? -15 : -10,
  },
  modalstart: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  upperheader: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 36 : 21,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    marginTop: 40,
    textAlign: 'center',
  },
  headingtops: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 24 : 14,
    fontFamily: 'Poppins-Medium',
    color: Colors.black,
    marginBottom: 0,
    textAlign: 'center',
  },
  animationcover: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  mapicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 200 : 200,
    justifyContent: 'center',
    alignItems: 'center',
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 270 : 270,
  },
  welcomdesc: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 18,
    fontFamily: 'Poppins-Light',
    color: 'black',
    alignItems: 'center',
    flexDirection: 'row',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 22,
    flexWrap: 'wrap',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  propertlabel: {
    fontSize: 17,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    marginBottom: 15,
    textAlign: 'center',
  },
  reviewcover: {
    width: '100%',
    alignSelf: 'center',
    overflow: 'hidden',
    marginTop: 15,
  },
  reviewtxt: {
    fontSize: 21,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.black,
    marginTop: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  textinputcover: {
    width: '100%',
    marginTop: 0,
    flexWrap: 'wrap',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    height: 60,
    width: '100%',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  textinputstyle1: {
    verticalAlign: 'top',
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 12,
    flexWrap: 'wrap',
    color: Colors.newgray,
    fontFamily: 'Poppins-Regular',
    height: 50,
    width: '100%',
  },
  textinputstyle: {
    verticalAlign: 'top',
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    borderRadius: 50,
    paddingHorizontal: 12,
    fontSize: 12,
    flexWrap: 'wrap',
    color: Colors.newgray,
    fontFamily: 'Poppins-Regular',
    height: 50,
    width: '100%',
  },
  btnmaincover: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitbtnmain: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  submitbtncover: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 45,
    width: 100,
    borderRadius: 100,
    backgroundColor: Colors.surfblur,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitbtntxt: {
    fontSize: 17,
    color: Colors.white,
    fontFamily: 'Poppins-SemiBold',
  },
  mapstarthere: {height: '100%', width: width},
  mapuppercover: {
    position: 'absolute',
    zIndex: 99,
    right: 12,
    top: 60,
  },
  collapsebg: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collapsecover: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 12,
  },
  detailcover: {flexWrap: 'wrap', top: -5},
  itemtitle: {
    color: 'black',
    marginLeft: 10,
    fontWeight: '500',
    flexWrap: 'wrap',
  },
  propertyprice: {
    color: Colors.primaryBlue,
    marginLeft: 10,
    fontWeight: '500',
  },
  filterstyle1: {
    position: 'absolute',
    height: 35,
    width: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 6,
  },
  gpscover1: {position: 'relative'},
  labelinnercover: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  labelinner: {
    color: Colors.black,
    marginleft: 10,
    fontWeight: '500',
  },
  extendescover: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  extenddes: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    width: '100%',
    position: 'absolute',
    top: '30%',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 35 : 16,
    paddingHorizontal: 15,
  },
  extencovermain: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  extencover: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 70 : 50,
    width: '100%',
    borderRadius: 100,
    backgroundColor: Colors.PrimaryColor,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  extendtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 14,
    color: Colors.white,
    fontFamily: 'poppins-regular',
  },
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
    borderRadius: 20,
    overflow: 'hidden',

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

    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,

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
    width: DeviceInfo.getDeviceType() === 'Tablet' ? '100%' : '98%',

    height: '100%',
  },
  welcometxt: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 26 : 15,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    width: '100%',
    textAlign: 'center',
    marginTop: 30,
  },
  modalOverlaynew: {
    flex: 1,
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
    maxHeight: '60%',
    width: '96%',

    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
  },
  modalContent2: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
    width: '96%',

    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.2)',
  },
  modalContent3: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '90%',
    width: '96%',

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
  modalContentnew: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '72%',
  },
  modalContentch: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '85%',
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
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.newgray,
    width: '50%',
    borderColor: Colors.BorderColor,
    borderRadius: 10,
    marginBottom: 8,
  },
  dropdowninner: {
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.newgray,
    width: '50%',
    borderColor: Colors.BorderColor,
    borderRadius: 10,
    marginBottom: 8,
    width: '100%',
    height: 60,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 10,
    marginBottom: 25,
  },
  dropdownz: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.newgray,
    width: '100%',
    borderRadius: 2,
    marginBottom: 8,
    width: '100%',
    height: 150,
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
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
    paddingLeft: 10,
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
  labelicon: {
    fontSize: 11,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
  },
  taxicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 27,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 43 : 25,
    marginTop: 0,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  hoaicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 51 : 27,
    marginTop: 0,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  measureicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 45 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 47 : 27,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  bathtubicon: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 44 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 28,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  newbedstyle: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 26,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 39 : 21,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  iconcover: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconmaincover: {
    flexDirection: 'row',
    width: width - 16,
    marginLeft: 8,
    marginRight: 8,
    alignSelf: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  titletext: {
    fontSize: 20,
    color: Colors.black,
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
  },
  titlecover: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  pricetext: {
    fontSize: 32,
    marginTop: -30,
    color: Colors.primaryBlue,
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
  },
  filtericoncover: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
    paddingRight: 10,
    marginBottom: 8,
  },
  loaderstyle: {
    height: '100%',
    width: '100%',
    backgroundColor: '#5BB3FF',
    position: 'absolute',
    zIndex: 99,
    left: 0,
    top: 0,
  },
  loaderstyle1: {
    height: '100%',
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 99,
    left: 0,
    top: 0,
  },
  searchuppercover: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? '100%' : '100%',
    paddingVertical: 15,
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 4,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
  },
  searchinnercover: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 42,
    width: '90%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.BorderColor,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    backgroundColor: Colors.white,
    //paddingTop: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
    shadowColor: '#52006A',
  },
  searchinputtextarea: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
    letterSpacing: 1,
    color: '#000',
    // paddingTop:12,
    position: 'relative',
    marginLeft: 30,
    display: 'flex',
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 45,
  },
  searchinputtext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
    letterSpacing: 1,
    color: '#000',
    position: 'relative',
    marginBottom: 8,
    borderColor: '#EDECED',
    display: 'flex',
    borderWidth: 0.5,
    borderRadius: 10,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 55 : 42,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchboarder: {
    alignItems: 'center',
    width: '15%',
    height: '100%',
    justifyContent: 'center',
    //height: 42,
    position: 'relative',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: Colors.BorderColor,
    position: 'relative',
    top: 0,
  },
  searchborderinner: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressstyle: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    top: 0,
  },
  gpsstyle: {
    resizeMode: 'contain',
  },
  gpscover: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterupper: {
    width: '92%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  filterinner: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  filterinnermain: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  savesearchstyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
  },
  filtericonstyles: {
    marginLeft: 6,
  },
  filtericonstyle: {
    marginRight: 6,
  },
  filtericontext: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
  },
  clearfilterbutton: {
    fontFamily: 'Poppins-Regular',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 12,
  },
  cardswipercover: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  cardinnercover: {
    backgroundColor: 'green',
    paddingHorizontal: 8,
    borderRadius: 15,
    marginLeft: 10,
    overflow: 'hidden',
    position: 'absolute',
    opacity: 0.5,
  },
  cardinner: {
    position: 'absolute',
    height: '92%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumpupcover: {
    backgroundColor: Colors.white,
    height: 50,
    width: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumpinnergreen: {
    height: 25,
    width: 25,
    tintColor: 'green',
  },
  redoverlay: {
    backgroundColor: 'red',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'absolute',
    opacity: 0.5,
  },
  redthumbcover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  redinnercover: {
    backgroundColor: Colors.white,
    height: 50,
    width: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbiconred: {
    height: 25,
    width: 25,
    tintColor: 'red',
  },
  featuredimage: {
    width: '95%',
    height: '100%',

    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 15,
    backgroundColor: 'gray',
    overflow: 'hidden',
  },
  nextimage: {
    height: 25,
    width: 25,
    tintColor: Colors.white,
    position: 'absolute',

    right: 12,
    top: '45%',
    zIndex: 9999,
  },
  nextcover: {
    height: 25,
    width: 25,
    tintColor: Colors.white,
    transform: [{rotate: '-180deg'}],
    position: 'absolute',

    left: 12,
    top: '45%',
    zIndex: 9999,
  },
  arroescovr: {
    opacity: 0,
    position: 'absolute',
    zIndex: 9,
    top: '40%',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  upperarrowcover: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    zIndex: 99,
    position: 'absolute',
  },
  bgcover: {
    height: '100%',
    backgroundColor: Colors.white,
  },
  w85: {width: '85%'},
  modalcover: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 50,
    height: 5,
    backgroundColor: '#bac1c3',
    marginTop: 0,
    justifyContent: 'center',
    borderRadius: 100,
  },
  w99: {
    width: '99%',
  },
  modallabel: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    width: '99%',
    marginBottom: 8,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
  },
  dropdownnew: {
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.newgray,
    width: '50%',
    borderColor: Colors.BorderColor,
    borderRadius: 10,
    marginBottom: 8,
    width: '100%',
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  dropdowntxt: {
    color: Colors.black,
    fontFamily: 'Poppins-Regular',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
  },
  dropdownarrow: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    top: 5,
  },
  arrowcover: {
    width: 20,
    height: 20,
    position: 'relative',
  },
  dropdownoutput: {
    alignContent: 'center',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outputcover: {
    alignContent: 'center',
    width: '100%',
  },
  checkboxcovaer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  checkimg: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 18,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 18,

    resizeMode: 'contain',
  },
  checkboxlabel: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
    color: Colors.black,
    textAlign: 'left',
    backgroundColor: Colors.white,
    padding: 10,
    marginBottom: 8,
    width: '100%',
  },
  selectedcities: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  innercities: {
    alignContent: 'center',
    margin: -6,
  },
  slidervalue: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
  },
  itemdata: {
    fontFamily: 'poppins-regular',
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 18 : 14,
  },
  itemdtacover: {
    width: 70,
    height: 40,
    marginTop: 8,
    marginHorizontal: 3,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.BorderColor,
  },
  dataupeercover: {
    alignContent: 'center',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeicon: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 12,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 12,
    marginLeft: 8,
    marginTop: 2,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  selecteditemcity: {
    margin: 5,
    borderRadius: 20,
    borderWidth: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  applytext: {
    marginLeft: 10,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 16,
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  apllycover: {
    // height: 30,
    // width: 110,
    top: -35,
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 30,
    borderRadius: 100,
    // paddingVertical:8,
    backgroundColor: Colors.surfblur,
    //   // marginTop: 10,
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // top:-35
  },
  applymaincover: {},
  datacustomvalue: {
    color: 'black',
    textAlign: 'left',
  },
  downarrowmain: {
    height: 12,
    width: 12,
  },
  w100: {width: '100%'},
  maincov: {
    width: '100%',
    alignSelf: 'center',
  },
  labelcover: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
