import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import CardsSwipe from 'react-native-cards-swipe';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
import clamp from 'clamp';
import { store } from '../../redux/store';
import { addToFavorite } from '../../modules/addToFavorite';
import { addRemoveTrash } from '../../modules/addRemoveTrash';
import { getRating } from '../../modules/getRating';
import { ScrollView } from 'react-native-gesture-handler';
import Geolocation from '@react-native-community/geolocation';
import MapView, { PROVIDER_GOOGLE, Circle, Marker } from "react-native-maps";
import Collapsible from 'react-native-collapsible';


const { width } = Dimensions.get('screen');
const markers = [{
  title: 'hello',
  coordinates: {
    latitude: 3.148561,
    longitude: 101.652778
  },
},
{
  title: 'hello',
  coordinates: {
    latitude: 3.149771,
    longitude: 101.655449
  },
}]
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
  const [isSelected, setIsSelected] = useState(false)
  const [Icon, setIcon] = useState(false);
  const [bedroomitem, setBedroomItem] = useState(-1)
  const [bathRoom, setBathRoomItem] = useState(-1)
  const [selected, setSelected] = useState([]);
  const [imageIndex, setImageIndex] = useState(0)
  const [binIcon, setBinIcon] = useState(false)
  const [favIcon, setFavIcon] = useState(false)
  const [viewHeight, setViewHeight] = useState(80)
  const [user_ID, setUser_ID] = useState()
  const [lntLng, setLatLng] = useState({ latitude: 0.0, longitude: 0.0 })
  const [showMap, setShowMap] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mapType, setMapType] = useState('satellite')
  useEffect(() => {
    const timer = setTimeout(() => {
      setBinIcon(false);
      setFavIcon(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [binIcon]);

  useEffect(() => {
    getID()

    console.log('store.getState() ==> ', store.getState())
  }, [])

  const getID = async () => {
    const id = await AsyncStorage.getItem('userId')
    setUser_ID(id)
  }

  useEffect(() => {
    const icontime = setTimeout(() => {
      setFavIcon(false);
    }, 1000);

    return () => clearTimeout(icontime);
  }, [favIcon]);

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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const filtertoggleModal = () => {
    setFilterModalVisible(!filterModalVisible);
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

  const savefile = async item => {
    // const userID = await AsyncStorage.getItem('userId');

    let payload = {
      userID: user_ID,
      post_id: item,
    };
    console.log("payload", payload)


    await dispatch(addToFavorite(payload)).then(response => {
      console.log('response.payload ', response.payload)
      if (response.payload.success) {
        // Alert.alert('Alert', response.payload.message);
      } else {
        // Alert.alert('Alert', response.payload.message);
      }
    });
  };

  const trashfile = async post_id => {

    let payload = {
      userID: user_ID,
      post_id: post_id,
    };
    console.log("payload", payload)

    await dispatch(addRemoveTrash(payload)).then(response => {
      if (response.payload.success) {
        // Alert.alert('Alert', response.payload.message);
      } else {
        // Alert.alert('Alert', response.payload.message);
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
  const property = homeData[0];

  useEffect(() => {
    getPopertiesApiCall({ type: 0, data: '', lntLng })
  }, []);

  const getPopertiesApiCall = async type => {
    setLoading(true);
    await dispatch(getPoperties(type));
    typeof store.getState().getPoperties.getPopertiesData?.data === 'object' ?
      store.getState().getPoperties.getPopertiesData?.data &&
      setHomeData(store.getState().getPoperties.getPopertiesData?.data) : setHomeData('')
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
            }}>
            <TouchableOpacity
              onPress={() => getPopertiesApiCall({ type: 2, data: adress, lntLng })}
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
            // marginBottom: 12,
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
            <View style={{ width: '100%', flexDirection: "row", justifyContent: 'space-evenly', marginBottom: 10 }}>
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
                    borderWidth: 1,
                    borderColor: Colors.BorderColor,
                  }}>
                  <ScrollView>
                    <View
                      style={{
                        //s height: '10%',
                        width: '90%',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                      </View>

                      <TouchableOpacity
                        onPress={() => setFilterModalVisible(false)}
                        style={{
                          // flexDirection: 'row',
                          // justifyContent: 'center',
                          // alignItems: 'center',
                          // margin: 10
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


                    <View style={{
                      width: '99%',
                      //  height: '70%'
                      // alignItems: "center",
                      marginHorizontal: 12,

                    }}>


                      <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', width: "99%", marginBottom: 8 }}>Choose your city</Text>
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

                      <View style={{ marginBottom: 12 }}>

                        <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>Bedrooms</Text>
                        <FlatList
                          data={bedRoomData}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity onPress={() => { setBedroomItem(index) }}>
                                <View style={{ width: 70, height: 40, marginTop: 8, marginHorizontal: 3, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.BorderColor, backgroundColor: bedroomitem === index ? Colors.black : Colors.white }}>
                                  <Text style={{ color: bedroomitem === index ? Colors.white : Colors.black }}>{item.label}</Text>
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
                          data={bedRoomData}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          renderItem={({ item, index }) => {
                            return (
                              <TouchableOpacity onPress={() => { setBathRoomItem(index) }}>
                                <View style={{ width: 70, height: 40, marginTop: 8, marginHorizontal: 3, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.BorderColor, backgroundColor: bathRoom === index ? Colors.black : Colors.white }}>
                                  <Text style={{ color: bathRoom === index ? Colors.white : Colors.black }}>{item.label}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                          }}
                        ></FlatList>
                      </View>

                      <View>

                        <Text style={{ color: 'black', fontFamily: 'Poppins-Regular', marginTop: 12 }}>Square Feet</Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>

                          <TextInput
                            style={{ borderWidth: 1, marginHorizontal: 2, width: '49%', borderColor: Colors.BorderColor, borderRadius: 10, padding: 6 }}
                            placeholder='Min Price'
                            keyboardType='numeric'>

                          </TextInput>
                          <TextInput
                            style={{ borderWidth: 1, marginHorizontal: 2, width: '49%', borderColor: Colors.BorderColor, borderRadius: 10, padding: 6 }}
                            placeholder='Max Price'
                            keyboardType='numeric'>

                          </TextInput>
                        </View>
                      </View>
                      <View style={{ marginTop: 12 }}>

                        <Text style={{ color: 'black', fontFamily: 'Poppins-Regular' }}>Price Range</Text>

                        <View style={{ flexDirection: "column", justifyContent: 'space-between', marginTop: 8 }}>

                          <MultiSelect
                            style={{ width: '100%', marginBottom: 10, borderColor: Colors.BorderColor, borderWidth: 1, borderRadius: 10, paddingLeft: 6, paddingRight: 6, paddingTop: 4, paddingBottom: 4, }}
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
                            style={{ width: '100%', borderColor: Colors.BorderColor, borderWidth: 1, borderRadius: 10, paddingLeft: 6, paddingRight: 6, paddingTop: 4, paddingBottom: 4 }}

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
                          style={{
                            height: 55,
                            width: '45%',
                            borderRadius: 100,
                            backgroundColor: Colors.surfblur,
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "center",

                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              // fontWeight: '700',
                              color: Colors.white,
                              fontFamily: "Poppins-Regular",
                            }}>
                            Apply
                          </Text>
                        </TouchableOpacity>

                      </View>

                    </View>
                  </ScrollView>
                </View>

              </Modal>

            </KeyboardAvoidingView>
          </View>
        }
        {
          homeData && !showMap ?
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
                      borderTopLeftRadius: 8, borderTopRightRadius: 8, marginTop: -5, overflow: "hidden", position: "absolute", top: 0
                    }}>
                    <View style={{
                      position: "absolute",
                      height: '100%', width: '100%', alignItems: 'center', justifyContent: "center"
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
                      borderTopLeftRadius: 8, borderTopRightRadius: 8, marginTop: -5, overflow: "hidden"
                    }}>
                    <View style={{
                      position: "absolute",
                      width: "100%", height: '100%', justifyContent: "center", alignItems: 'center'
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
                      //style={{ height: width, width: width - 10, }}
                      index={imageIndex}
                      // autoplay={true}
                      showPagination={false}
                      data={item?.featured_image_src}
                      refer={index}
                      renderItem={({ item1, index }) =>
                      (
                        <>
                          <View
                            style={{
                              height: width, width: width,
                              position: "relative",
                              marginTop: 1
                            }}
                          >
                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", zIndex: 99, top: width / 2.5 }}>
                              {

                                <TouchableOpacity disabled={imageIndex > 0 ? false : true} onPress={() => { setImageIndex(imageIndex - 1) }} >

                                  <Image style={{ height: 30, width: 30, position: "absolute", left: 15 }} source={Images.leftarrow} />
                                </TouchableOpacity>
                              }

                              {
                                <TouchableOpacity disabled={item?.featured_image_src?.length - 1 === imageIndex ? true : favIcon} onPress={() => { setImageIndex(imageIndex + 1) }}>

                                  <Image style={{ height: 30, width: 30, position: "absolute", right: 15 }} source={Images.rightarrow} />
                                </TouchableOpacity>
                              }

                            </View>
                            <TouchableOpacity onPress={() => {
                              navigation.navigate('ViewPropertiy', { item: item.ID })
                            }}>


                              <Image
                                style={{
                                  width: width - 16,
                                  height: width,
                                  borderRadius: 0,
                                  alignSelf: 'center',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  borderRadius: 8, overflow: "hidden"
                                }}
                                source={{ uri: item.featured_image_src[imageIndex].guid }}
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
                        <View
                          style={{
                            width: '100%',
                            alignSelf: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: 12,
                          }}>
                          <Text
                            onPress={() =>
                              navigation.navigate('ViewPropertiy', { item })
                            }
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
                            {item?.bathroomsfull} {'Baths'}
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
                      {item?.property_size != '' ? (
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
                )}
              />
            </View> :
            <View style={{ height: '100%', width: width, marginTop: 10 }}>
              <View style={styles.coverlocation}>
                <Image source={Images.graylocation} style={styles.locationpic}></Image>

              </View>
              <TouchableOpacity style={styles.coverlocation1} onPress={() => { setIsCollapsed(!isCollapsed) }}>
                <Image source={Images.layers} style={styles.locationpic}></Image>

              </TouchableOpacity>
              <Collapsible collapsed={!isCollapsed}>
                <View >
                  <TouchableOpacity onPress={() => { setMapType('satellite') }}><Image tintColor={mapType === 'satellite' ? Colors.PrimaryColor : Colors.placeholderTextColor} source={Images.layers} style={styles.locationpic}></Image></TouchableOpacity>
                  <TouchableOpacity onPress={() => { setMapType('hybrid') }}><Image tintColor={mapType === 'hybrid' ? Colors.PrimaryColor : Colors.placeholderTextColor} source={Images.layers} style={styles.locationpic}></Image></TouchableOpacity>
                  <TouchableOpacity onPress={() => { setMapType('terrain') }}><Image tintColor={mapType === 'terrain' ? Colors.PrimaryColor : Colors.placeholderTextColor} source={Images.layers} style={styles.locationpic}></Image></TouchableOpacity>
                  <TouchableOpacity onPress={() => { setMapType('standard') }}><Image tintColor={mapType === 'standard' ? Colors.PrimaryColor : Colors.placeholderTextColor} source={Images.layers} style={styles.locationpic}></Image></TouchableOpacity>
                </View>

              </Collapsible>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                zoomControlEnabled={true}
                showsCompass={true}
                mapType={mapType}
                showsMyLocationButton={true}
                region={{
                  latitude: parseFloat(markers[0].coordinates.latitude),
                  longitude: parseFloat(markers[0].coordinates.longitude),
                  latitudeDelta: 0.015,
                  longitudeDelta: 0.0121,
                }}
              >

                {
                  markers.map((item) => {
                    return (
                      <Marker coordinate={{ latitude: item.coordinates.latitude, longitude: item.coordinates.longitude }} />
                    )
                  })
                }

                {
                  markers.map((item) => {
                    return (
                      <Circle
                        center={{ latitude: item.coordinates.latitude, longitude: item.coordinates.longitude }}
                        radius={100}
                        fillColor="rgba(255, 0, 0, 0.2)"
                        strokeColor="rgba(255, 0, 0, 0.5)"
                        strokeWidth={2}
                      />
                    )
                  })
                }

              </MapView>
            </View>
        }

      </View>

    </SafeAreaView>
  );
};
export default Home;

const styles = StyleSheet.create({
  locationpic: { resizeMode: "contain", width: 16, height: 16 },

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
    backgroundColor: "rgba(255,255,255,.8)", height: 38, width: 35, position: "absolute", top: 55, zIndex: 99,
    alignItems: "center",
    justifyContent: "center", borderRadius: 3,
    right: 12,
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
    // width: screenWidth,
    // height: 300,Platform.select({
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