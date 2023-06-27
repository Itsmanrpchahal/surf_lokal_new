import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
  PanResponder,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Alert,
  Button,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { useDispatch } from 'react-redux';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import { postRating } from '../../modules/postRating';
import { useNavigation } from '@react-navigation/native';
import { Rating } from 'react-native-ratings';
import { getPopertiesDetails } from '../../modules/getPopertiesDetails';
import MapView from 'react-native-maps';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const fontSizeRatio = screenHeight / 1000;
const viewSizeRatio = screenHeight / 1000;
const imageSizeRation = screenHeight / 1000;


const renderItem = ({ item }) => {
  return (
    <>
      <View style={{ flex: 1, flexDirection: 'row', alignContent: 'center', marginVertical: 5, justifyContent: 'space-between' }}>
        <View style={{ width: "70%" }}>
          <Text style={{ color: "black" }}>{item.unite_name}</Text>
          <Text style={{ color: "gray" }}>{item.unit_distance}</Text>
        </View>
        <View>
          <Image style={{ height: 15, width: 100, }} source={{ uri: item.image_url }} />
        </View>
      </View>
    </>
  );
};

const ViewPropertiy = props => {
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

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [nearByData, setNearByData] = useState([]);
  const [calData, setCalData] = useState([]);
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const [readmore, setreadmore] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  // const [filterData, setFilterData] = useState([]);

  const [showFullContent, setShowFullContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [weather, setweather] = useState([]);
  const [tax, settax] = useState([]);
  const [walk, setWalk] = useState([]);
  const [showIcon, setShowIcon] = useState(false);
  const [Icon, setIcon] = useState(false)
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
          // trashfile(item.ID);

          console.log("trash files")
          // Right swipe, delete action
          // Perform your delete logic here
          resetPosition();
        } else if (gesture.dx < -swipeThreshold) {
          // Left swipe, like action
          // Perform your like logic here
          // saveFile(item.ID)
          console.log("save File")
          resetPosition();
        } else {
          // No significant swipe, reset position
          resetPosition();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    // Reset the position using Animated.spring or any other animation method
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start();
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

  const postID = props.route.params
  console.log("testing????????????????????????", postID.data)

  const toggleModal = () => {
    setModalVisible(!modalVisible);

    console.log("hhhh")

  };
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [productId, setProductId] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');

  const addReview = async post_id => {
    const id = await AsyncStorage.getItem('userId');
    var formdata = new FormData();
    formdata.append('userID', id);
    formdata.append('postid', productId);
    formdata.append('photo_quality_rating', rating);
    formdata.append('desc_stars', rating);
    formdata.append('price_stars', rating);
    formdata.append('interest_stars', rating);
    formdata.append('content', review);
    formdata.append('reviewtitle', reviewTitle);

    console.log(formdata, "formdataformdata");

    dispatch(postRating(formdata)).then(response => {
      console.log('res', response.payload);
      if (response.payload.success) {
        toggleModal();
      } else {
        toggleModal();
        Alert.alert('Alert', response.payload.message);
      }
      // setFilterData(response.payload.data);
    });
    setModalVisible(!modalVisible);

  };


  useEffect(() => {
    getPopertiesDetailsApiCall();
  }, []);


  const getPopertiesDetailsApiCall = () => {
    console.log("data", postID)
    dispatch(getPopertiesDetails(postID.data.ID)).then(response => {
      console.log("api response", response)
      if (response.payload.data == null) {
        console.log("hello world")
        setLoading(true);
      }
      else {
        setLoading(false)
      }
      setData(response.payload.data);
      console.log(data, "dddddddddddddddddddddd");
      setNearByData(response.payload.data[0].what_is_nearby || []);
      console.log(nearByData, "nearByDatanearByData");
      setCalData(response.payload.data[0].moartage || []);
      // const mapp =data.map((item) => item.moartage[0].moartage_details || []);
      console.log(calData, "calculator")
      setweather(response.payload.data[0].current_weather);
      console.log("checkWeather////////", weather);
      settax(response.payload.data[0].tax_history);
      setWalk(response.payload.data[0].walkscore);
      setMap(response.payload.data[0].address.property_address);
      console.log(map, "map")
    });
  };
  console.log(data, 'show Api data');




  const Details = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.viewstyle}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Property Details
              </Text>
              <Text style={styles.props}>Price: {data.map((item) => item.price)} </Text>
              <Text style={styles.props}>Property Size: {data.map((item) => item.details.property_details.property_size)} sq ft </Text>
              <Text style={styles.props}>Bedrooms: {data.map((item) => item.details.property_details.bedrooms)} </Text>
              <Text style={styles.props}>Year Built : {data.map((item) => item.details.property_details.yearbuilt)} </Text>
              <Text style={styles.props}>Toatl Stories: {data.map((item) => item.details.property_details.storiestotal)} </Text>
              <Text style={styles.props}>Days on Market : </Text>
              <Text style={styles.props}>Garage Spaces:  {data.map((item) => item.details.property_details.garagespaces)}  </Text>
            </View>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Community Details</Text>
              <Text style={styles.props}>Community Name:  {data.map((item) => item.details.community_details.community_name)}  </Text>
              <Text style={styles.props}>HOA Fee: {data.map((item) => item.hoa_fee)}</Text>
              <Text style={styles.props}>HOA Fee Frequency: {data.map((item) => item.associationfeefrequency)}  </Text>
              <Text style={styles.props}>Lot Size: {data.map((item) => item.hoa_fee)}</Text>
              <Text style={styles.props}>Est. Taxes: {data.map((item) => item.details.property_details.taxes)}  </Text>
            </View>
          </View>
        </View>
      </>
    )
  }

  const Featuers = () => {
    return (
      <>
        <ScrollView style={{ paddingHorizontal: 20 }}>
          <View style={styles.address}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Property Features
              </Text>
              <Text style={styles.props}>{data.map((item) => item.features.property_features.join(', '))} </Text>

            </View>
          </View>
        </ScrollView>
      </>
    )
  }
  const Address = () => {

    return (
      <>
        <View style={{height:100,width:"100%"}}>
          <Text>{map?.property_latitude}</Text>
          <Text>{map?.property_latitude}</Text>

          {/* <MapView
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          /> */}
        </View>
      </>
    )
  }
  const NearBy = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.propertyts}>Nearby</Text>
          <View style={styles.address}>
            <FlatList
              data={nearByData}
              keyExtractor={(item) => item.unite_name}
              renderItem={renderItem}
            />
          </View>

        </View>
      </>
    )
  }
  const WalkSco = () => {
    return (
      <>
        <View style={{ height: 200 }}>
          <Text style={styles.propertyt}>Nearby</Text>
          <View style={styles.addresss}>
            <WebView
              source={{ uri: walk?.walkscore_details }}
              onLoad={console.log("loaded")}
              style={{ width: "100%", resizeMode: "contain" }}
            />
          </View>
        </View>
      </>
    )
  }
  const CurrentWeather = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.propertyts}>Current Weather</Text>
          <View style={styles.addresss}>
            <Text style={styles.props}>Location: {weather.location_name}</Text>
            <Text style={styles.props}>Localtime: {weather.location_localtime}</Text>
            <View style={{ flexDirection: "row", alignItems: 'center' }}>
              <Text style={styles.props}>Condition: {weather.condition_text}</Text>
              
              
            </View>
            <Image style={{ height: 40, width: 40, color:"black",backgroundColor:"yellow" }} source={{ uri: weather?.current_condition_icon }} />

            <Text style={styles.props}>Temperature: {weather.current_temp}</Text>
          </View>
        </View>
      </>
    )
  }
  const Calculator = () => {
    return (
      <>
        <View style={{ height: 2200, width: "100%" }}>
          <Text style={styles.propertyt}>Moartage Calculator</Text>
          <View style={styles.addresss}>
            <WebView
              source={{ uri: calData?.moartage_details }}
              onLoad={console.log("loaded")}
            />
          </View>
        </View>
      </>
    )
  }
  const School = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.address}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}> School Rating</Text>
            </View>
          </View>

        </View>
      </>
    )
  }
  const TaxHistory = () => {
    return (
      <>
        <View style={{ paddingHorizontal: 20 }}>
          <View style={styles.address}>
            <View style={{ width: '50%' }}>
              <Text style={styles.property}>Tax History</Text>
              <Text style={styles.props}>Property year tax: {tax.property_year_tax}</Text>
              <Text style={styles.props}>Annual amount: {tax.taxannualamount}</Text>
              <Text style={styles.props}>Taxes: {tax.taxes}</Text>
              <Text style={styles.props}>Tax year: {tax.taxyear}</Text>

            </View>
          </View>

        </View>
      </>
    )
  }
  return (

    <ScrollView style={{}}>

      <SafeAreaView style={{ flex: 1 }}>

        <View style={styles.slideOuter}>

          <Animated.View
            style={[
              position.getLayout(),
              {},
            ]}
            {...panResponder.panHandlers}
          >
            <TouchableOpacity onPress={() => navigation.navigate('ViewPropertiyImage', { data: postID.data })} >
              <Image
                source={{ uri: postID?.data?.featured_image_src }} style={styles.slide} />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.screen}>
                <Image source={Images.downArrow} style={styles.imagedata}></Image>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image source={Images.address} style={styles.addresimage}></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.imgview}>
              <View style={styles.imgg}>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ViewPropertiyImage', { data: postID.data })}>
                <Image source={Images.imageView} style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
              </TouchableOpacity>
            </View>
            <Animated.View style={{ position: 'absolute', top: 20, left: 20, opacity: likeOpacity }}>
              <Image source={Images.deletelike} style={{ height: 45, width: 45, tintColor: 'transparent' }} />
            </Animated.View>
            <Animated.View style={{ position: 'absolute', top: 20, right: 20, opacity: nopeOpacity }}>
              <Image source={Images.favlike} style={{ height: 45, width: 45, tintColor: 'transparent' }} />
            </Animated.View>
          </Animated.View>
        </View>



        <View style={styles.slideOuter}>
          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              marginTop: 20,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                setProductId(postID.data.ID);
                setReviewTitle(postID.data.title)
                toggleModal();
              }}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={Images.star}
                style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.black,
                  textAlign: 'center',
                  marginLeft: 5,
                }}>
                {postID.data.total_average_rating}
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 18,
                color: Colors.primaryBlue,
                fontWeight: '500',
              }}>{postID.data?.property_price}
            </Text>
            <TouchableOpacity>
              <Image
                source={Images.send}
                style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: '80%',
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: 5,
            }}>
            <Text
              style={{ fontSize: 16, color: Colors.black, textAlign: 'center' }}>
              {postID?.data?.title}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              width: '90%',
              marginTop: 10,
              justifyContent: 'space-between',
            }}>
            {postID.data.property_bedrooms != '' ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={Images.bed}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                  }}></Image>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.black,
                    textAlign: 'center',
                    marginLeft: 5,
                  }}>
                  {postID.data.property_bedrooms} {'Beds'}
                </Text>
              </View>
            ) : null}
            {postID.data.bathroomsfull != '' ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={Images.bath}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                  }}></Image>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.black,
                    textAlign: 'center',
                    marginLeft: 5,
                  }}>
                  {postID.data.bathroomsfull} {'Bath'}
                </Text>
              </View>
            ) : null}
            {postID.data.property_size != '' ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Image
                  source={Images.measuring}
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                  }}></Image>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.black,
                    textAlign: 'center',
                    marginLeft: 5,
                  }}>
                  {postID.data.property_size} {'sq ft'}
                </Text>
              </View>
            ) : null}
            {postID.data.associationfee != '' ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',

                  flexDirection: 'row',
                }}>
                <Text style={{ color: "black", fontSize: 13 }}>HOA</Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: Colors.black,
                    textAlign: 'center',
                    marginLeft: 5,
                  }}>
                  {'$'}{postID.data.associationfee == null ? 0 : postID.data.associationfee}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={{ width: '90%', paddingStart: 10, paddingVertical: 10 }}>

          <>

            <Text
              numberOfLines={postID.data.ID == readmore ? 0 : 20}
              style={{
                fontSize: 14,
                flexDirection: 'row',
                color: Colors.black,
                width: '100%',
              }}>
              {typeof postID.data.content.rendered === 'string' ? (
                <>
                  {showFullContent || postID.data.content.rendered.length < 20 ? (
                    postID.data.content.rendered
                  ) : (
                    postID.data.content.rendered.slice(0, 20) + '...    '
                  )}

                </>
              ) : (
                null
              )}
            </Text>
            <TouchableOpacity style={{ justifyContent: "center", alignItems: "center" }}
              onPress={() => setShowFullContent(!showFullContent)}>
              <Text style={{ color: "darkblue", marginTop: 10, fontSize: 16 }}>{showFullContent ? 'Show Less' : 'Read More'}</Text>
            </TouchableOpacity>

          </>

        </View>

        <View style={styles.featuresDetails}>

          <ScrollView horizontal={true} scrollEnabled={true} >
            <View style={{ flexDirection: "row" }}>

              <View style={styles.featuersComtainer}>
                <TouchableOpacity

                  onPress={() => {
                    setSelectedTab(0);
                  }}
                  style={styles.detailsStyle}>
                  <Image
                    source={Images.detail}
                    style={styles.detail}></Image>
                  <Text style={styles.detailText}>Detailas</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.featuersComtainer}>
                <TouchableOpacity

                  onPress={() => {
                    setSelectedTab(1);
                  }}
                  style={styles.detailsStyle}>
                  <Image
                    source={Images.features}
                    style={styles.detail}></Image>
                  <Text style={styles.detailText}>Features</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.featuersComtainer}>
                <TouchableOpacity

                  onPress={() => {
                    setSelectedTab(2);
                  }}
                  style={styles.detailsStyle}>
                  <Image
                    source={Images.address}
                    style={styles.detail}></Image>
                  <Text style={styles.detailText}>Map</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.featuersComtainer}>
                <TouchableOpacity

                  onPress={() => {
                    setSelectedTab(6);
                  }}
                  style={styles.detailsStyle}>
                  <Image
                    source={Images.cal}
                    style={styles.detail}></Image>
                  <Text style={styles.detailText}>Moartage Calculator</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.featuersComtainer}>
                <TouchableOpacity

                  onPress={() => {
                    setSelectedTab(8);
                  }}
                  style={styles.detailsStyle}>
                  <Image
                    source={Images.tax}
                    style={styles.detail}></Image>
                  <Text style={styles.detailText}>Tax History</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.featuersComtainer}>
                <TouchableOpacity

                  onPress={() => {
                    setSelectedTab(3);
                  }}
                  style={styles.detailsStyle}>
                  <Image
                    source={Images.nearBy}
                    style={styles.detail}></Image>
                  <Text style={styles.detailText}>What's Nearby </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.featuersComtainer}>
                <TouchableOpacity

                  onPress={() => {
                    setSelectedTab(7);
                  }}
                  style={styles.detailsStyle}>
                  <Image
                    source={Images.sch}
                    style={styles.detail}></Image>
                  <Text style={styles.detailText}>School Rating</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.featuersComtainer}>
                <TouchableOpacity

                  onPress={() => {
                    setSelectedTab(4);
                  }}
                  style={styles.detailsStyle}>
                  <Image
                    source={Images.walkScrore}
                    style={styles.detail}></Image>
                  <Text style={styles.detailText}> WalkScore</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.featuersComtainer}>
                <TouchableOpacity

                  onPress={() => {
                    setSelectedTab(5);
                  }}
                  style={styles.detailsStyle}>
                  <Image
                    source={Images.cloud}
                    style={styles.detail}></Image>
                  <Text style={styles.detailText}>Current Weather</Text>
                </TouchableOpacity>
              </View>



            </View>

          </ScrollView>
        </View>


        <ScrollView style={{ flex: 1, marginBottom: 90 }}>
          {/* {showFeatures && featuers()}
        {adress && address()}
        {showDetals && Details()}
        {ShowNear && nearBy()} */}

          {selectedTab == 0 ? (<Details />) : selectedTab == 1 ? (<Featuers />) : selectedTab == 2 ? (<Address />) : selectedTab == 3 ? (<NearBy />) : selectedTab == 4 ? (<WalkSco />) : selectedTab == 5 ? (<CurrentWeather />) : selectedTab == 6 ? (<Calculator />) : selectedTab == 7 ? (<School />) : (<TaxHistory />)}


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
        </ScrollView>
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
                    <Text style={{ fontSize: 12, color: Colors.black, }}>
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
                    <Text style={{ fontSize: 12, color: Colors.black }}>
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
                    <Text style={{ fontSize: 12, color: Colors.black }}>
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
                    <Text style={{ fontSize: 12, color: Colors.black }}>
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
                        alignItems: "flex-start",
                        alignSelf: "flex-start",
                        verticalAlign: "top"
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
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>

        <View style={{ bottom: 0, position: 'absolute', backgroundColor: "#fff" }}>

          <View
            style={styles.bottom}>
            <View
              style={styles.rate}>
              <TouchableOpacity
                onPress={() => toggleModal(item.ID, item.title)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <Image
                  source={Images.reviews}
                  style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
                <Text
                  style={styles.ratetext}>
                  Rate Property
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={Images.contactUs}
                  style={{ height: 25, width: 25, resizeMode: 'contain' }}></Image>
                <Text style={styles.call}>Call us  </Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: '50%' }}>
              <TouchableOpacity
                style={styles.book}>
                <Image
                  source={Images.bookTour}
                  style={{ height: 20, width: 20, resizeMode: 'contain' }}></Image>
                <Text
                  style={styles.tour}>
                  Book a tour
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </SafeAreaView>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tour: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    marginLeft: 5,
  },
  call: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
    marginLeft: 5,
  },
  ratetext: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
    marginLeft: 5,
  },
  book: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: Colors.primaryBlue,
    borderRadius: 14,
    height: 40,
    width: '80%',
  },
  rate: {
    justifyContent: 'space-evenly',

    alignItems: 'center',
    alignContent: 'center',
    width: '50%',
    flexDirection: 'row',
  },
  detailsStyle: {
    alignItems: "center",
    justifyContent: 'center',
    // width: 105,
    // paddingHorizontal: 4,
    // backgroundColor:"red"


  },
  detail: {
    height: 27,
    width: 27,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  cloud: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  imagedata: {
    height: 15,
    width: 15,
    resizeMode: 'contain',
    tintColor: Colors.black,
    transform: [{ rotate: '90deg' }],
  },
  addresimage: {
    height: 30,
    width: 25,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  screen: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: Colors.gray,
  },
  slideOuter: {
    width: screenWidth,
    justifyContent: 'center',

    alignItems: 'center',
  },
  imgg: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  property: {
    fontSize: 18,
    color: Colors.black,
    fontWeight: 'bold'
  },
  detailText: {
    fontSize: 10,
    color: Colors.black,
    textAlign: 'center',

    // marginLeft: 5,
    // width
    // width:55
  },
  cloudText: {
    fontSize: 10,
    color: Colors.black,
    textAlign: 'center',
  },
  imgview: {
    flexDirection: 'row',
    width: '90%',
    position: 'absolute',
    bottom: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slide: {
    width: screenWidth,
    height: screenHeight / 4,
    borderRadius: 8,
    alignSelf: 'center',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  bottom: {
    flexDirection: 'row',

    paddingVertical: 17,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    alignItems: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  viewstyle: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    justifyContent: 'center',
  },
  address: {
    width: '100%',

    marginTop: 20,
    justifyContent: 'center',
  },
  addresss: {

    width: '100%',
    justifyContent: 'center',


  },
  props: {
    fontSize: 13,

    color: Colors.black,
    marginTop: 5
  },
  view: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 5,
    justifyContent: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  community: {
    fontSize: 16,
    color: Colors.black,

    fontWeight: '700',
  },
  featuresDetails: {
    flexDirection: 'row',
    width: '100%',

    borderTopWidth: 1,
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    overflow: 'hidden',
  },

  featuersComtainer: {
    // height:20,
    width: 55

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


  rating: {
    marginVertical: 5,
  },
  propertyt: {
    fontSize: 18,
    color: Colors.black,
    marginTop: 20,
    paddingStart: 20,
    fontWeight: 'bold'
  },
  addresss: {  height: 1400 },
  propertyts: {
    fontSize: 18,
    color: Colors.black,
    marginTop: 20,
    fontWeight: 'bold'
  },

});
export default ViewPropertiy;