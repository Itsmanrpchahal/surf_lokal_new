import React, { useState, useEffect, useRef } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  PanResponder,
  Platform,
  Animated,
  ScrollView,
  Dimensions,
  PickerIOS
} from "react-native";
import Colors from "../../utils/Colors";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
// import { getProperties } from "../../modules/getProperties";
import { getSearchhistory } from "../../modules/getSearchHistory";
import { useSelector, useDispatch } from "react-redux";
import Activity from "../../components/Activity";
import { getFilter } from "../../modules/getFilter";
import { store } from "../../redux/store";
import CardsSwipe from 'react-native-cards-swipe';
import { SvgUri } from 'react-native-svg';
import { getPopertiess } from "../../modules/getPopertiess";
import { useIsFocused } from '@react-navigation/native';
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { getMoreFilter } from "../../modules/getMoreFilter";
import { clearFilter } from "../../modules/clearFilter";
import { Picker } from 'react-native-wheel-pick';
import RBSheet from "react-native-raw-bottom-sheet";

const Properties = () => {
  const navigation = useNavigation();
  const refRBSheet = useRef();

  const [search, setSearch] = useState("");
  const [cities, setCities] = useState([])
  const [homeData, setHomeData] = useState([])
  const [historyData, setHistoryData] = useState([]);
  const dispatch = useDispatch();
  const [activity, setActivity] = useState(false);
  const [searchView, setSearchView] = useState(true);
  const [tabs, setTabs] = useState([]);
  const [filterBtn, setFilterBtn] = useState(-1)
  const isFocused = useIsFocused();
  const [selected, setSelected] = useState(-1)
  const [bedroomitem, setBedroomItem] = useState(-1)
  const [bathRoom, setBathRoomItem] = useState(-1)
  const [maxPriceRange, setMaxPriceRange] = useState()
  const [minPricerange, setMinPricerange] = useState()
  const [minSquareFeet, setMinSquareFeet] = useState([])
  const [maxSquareFeet, setMaxSquareFeet] = useState([])
  const [bedCount, setBedCount] = useState()
  const [bathCount, setBathCount] = useState()
  const [moreFilterData, setMoreFilterData] = useState({})
  const [selectedTabs, setSelectedTabs] = useState([]);
  const [selectedMoreFilters, setSelectedMoreFilters] = useState([]);
  const { width, height } = Dimensions.get('screen')
  const [swipeSelected, setSwipeSelected] = useState([])
  const [limit, setLimit] = useState(1)
  const [mainViewHeight, setMainViewHeight] = useState(0)
  const [topViewHeight, setTopViewHeight] = useState(0)
  const [bottomViewHeight, setBottomViewHight] = useState(0)
  const [centerHeight, setCenterHeight] = useState(0)

  useEffect(() => {
    setCenterHeight(mainViewHeight - (topViewHeight + bottomViewHeight + 60))
  }, [topViewHeight, bottomViewHeight])

  useEffect(() => {
    if (isFocused) {
      setMinSquareFeet([])
      setMaxSquareFeet([])
      setActivity(true)
      Promise.all[
        filterTabs(), getAllProperties()]
    }
  }, [isFocused])

  const filterTabs = async () => {
    setActivity(true)
    await dispatch(getFilter()).then((res) => {

      setTabs(res.payload.data)
    })
    // setActivity(false)
  }

  const renderFillterItem = ({ item, index }) => {
    const { data_custom_taxonomy, data_customvalue } = item
    const isSelected = selectedTabs.filter((i) => i === data_customvalue).length > 0; // checking if the item is already selected

    return (
      <View style={{}}>
        <TouchableOpacity
          onPress={() => {
            if (isSelected) {
              setSelectedTabs((prev) => prev.filter((i) => i !== data_customvalue));
            } else {
              setSelectedTabs(prev => [...prev, data_customvalue])
            }
            setSelected(index)
            setActivity(true)
            dispatch(getPopertiess({
              type: 3, data: {
                data_custom_taxonomy: item.data_custom_taxonomy,
                data_customvalue: item.data_customvalue
              },
              limit: limit,
              ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID
            })).then((res) => {
              setHomeData(res.payload.data)
            })
            setActivity(false)
          }}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: 5,
              marginRight: 5,
              paddingRight: 10,
              marginBottom: 8,

              // borderBottomColor: isSelected ? Colors.PrimaryColor : 'transparent',
              // borderBottomWidth: isSelected ? 2 : 0,
            }}>
            <SvgUri
              height={25}
              width={25}
              uri={item.term_icon_url}
              fontWeight="bold"
              fill={isSelected ? Colors.PrimaryColor : "black"}
            />
            <Text
              style={{
                fontSize: 12,
                textAlign: 'center',
                color: isSelected ? Colors.PrimaryColor : Colors.placeHolderTextColor,
                fontFamily: isSelected ? 'poppins-bold' : 'poppins-regular',

              }}>
              {item.term_name}
            </Text>
          </View>
        </TouchableOpacity >
      </View >
    );
  };

  const renderMoreFilter = ({ item }) => {
    const { data_custom_taxonomy, data_customvalue } = item
    const isSelected = selectedMoreFilters.filter((i) => i === data_customvalue).length > 0; // checking if the item is already selected

    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between",width:'33.33%',paddingHorizontal:5 }} >
        <TouchableOpacity style={{
          margin: 5, borderRadius: 20, borderWidth: 1,
          borderColor: Colors.black, padding: 10,
          backgroundColor: isSelected ? Colors.black : Colors.white,
          minWidth: 70,
          width:'100%',
        }} onPress={async () => {
          if (isSelected) {
            setSelectedMoreFilters((prev) => prev.filter((i) => i !== data_customvalue));
          } else {
            setSelectedMoreFilters(prev => [...prev, data_customvalue])
          }
          await dispatch(getPopertiess({
            type: 3, data: {
              data_custom_taxonomy: "min_price",
              data_customvalue: item.data_customvalue,
            },
            ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID,
            limit: limit,
          })).then((res) => {
            setHomeData(res.payload.data)
          })
          // setFilterModalVisible(false)
        }}>
          <Text style={{
            color: isSelected ? Colors.white : Colors.black,
            textAlign: 'center',
            backgroundColor: isSelected ? Colors.black : Colors.white
          }} numberOfLines={1}>
            {item?.data_name}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const getAllProperties = async () => {
    setActivity(true)
    Promise.all([dispatch(getMoreFilter()).then((res) => {
      setMoreFilterData(res.payload.data)
      setMinSquareFeet(old => [...old, 'No Min'])
      setMaxSquareFeet(old => [...old, 'No Max'])

      res?.payload?.data?.min_square?.map((item, index) => {
        setMinSquareFeet(old => [...old, item.data_name])
      })

      res?.payload?.data?.max_square?.map((item, index) => {
        setMaxSquareFeet(old => [...old, item.data_name])
      })

    }), dispatch(getPopertiess({ type: 0, limit: limit, ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID, limit: limit, })).then((res) => {
      setHomeData(res.payload.data)
    }), dispatch(getFilter())]).then((res) => {
      setActivity(false)
    }).catch((e) => {
      setActivity(false)
    })
    setActivity(false)
  };

  return (
    <View style={{ flex: 1 }}>
      {
        activity ? <View style={{ height: '100%', width: '100%', backgroundColor: 'rgba(0,0,0,.2)', position: 'absolute', zIndex: 99, left: 0, top: 0 }
        }>
          <Activity />
        </View > : null
      }
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.PrimaryColor }}>
        <View
          onLayout={({ nativeEvent }) => {
            const { x, y, width, height } = nativeEvent.layout
            setMainViewHeight(height)
          }}
          style={{
            height: '100%',
            backgroundColor: Colors.white,
          }}
        >
          <View onLayout={({ nativeEvent }) => {
            const { x, y, width, height } = nativeEvent.layout
            setTopViewHeight(height)
          }}>
            <View
              style={{
                height: 40,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: Colors.PrimaryColor,
                position: "relative",
                zIndex: 99
              }}
            >
              <TouchableOpacity
                onPress={() => (
                  navigation.navigate("Home"), setSearchView(true), setSearch("")
                )}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 10,
                }}
              >
                <Image
                  style={{
                    height: 15,
                    width: 15,
                    resizeMode: "contain",
                    tintColor: Colors.white,
                  }}
                  source={require("../../assets/images/back/back.png")}
                ></Image>
                {/* <Text style={{ fontSize: 15, color: Colors.white }}>Back</Text> */}
              </TouchableOpacity>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: Colors.white }}
              >
                Properties
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AddProperties")}
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "100%",
                marginTop: 16,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <View
                style={{
                  width: '92%',
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}>
                <FlatList
                  data={tabs}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderFillterItem}
                />
              </View>
            </View>
          </View>
          {
            <View style={{
              width: '100%', flexDirection: "row",
              justifyContent: 'space-evenly', marginBottom: 10
            }}>
              <TouchableOpacity
                onPress={() => { setFilterBtn(0) }}
                style={[
                  styles.rew,
                  {
                    width: '30%',
                    flexDirection: 'row',
                    backgroundColor: filterBtn === 0 ? Colors.PrimaryColor : 'white',
                    borderColor: filterBtn === 0 ? Colors.white : Colors.gray,
                    borderWidth: 2,
                    borderRadius: 10
                  },
                ]}
              >
                <Image source={require('../../assets/images/send/send.png')} style={{ height: 10, width: 10, tintColor: filterBtn === 0 ? 'white' : 'black' }} />

                <Text style={{ color: filterBtn === 0 ? 'white' : 'black', fontFamily: 'poppins-regular', fontSize: 10, marginLeft: 5 }}>Send Selected Properties</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setFilterBtn(1), refRBSheet.current.open() }}
                style={[
                  styles.rew,
                  {
                    width: '30%',

                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    backgroundColor: filterBtn === 1 ? Colors.PrimaryColor : 'white',
                    borderColor: filterBtn === 1 ? Colors.white : Colors.gray,
                    borderWidth: 2,
                    borderRadius: 10

                  },
                ]}
              >
                <Image source={require('../../assets/images/filtericon/filtericon.png')} style={{ height: 10, width: 10, tintColor: filterBtn === 1 ? 'white' : 'black' }} />
                <Text style={{ color: filterBtn === 1 ? 'white' : 'black', fontFamily: 'poppins-regular', fontSize: 10, marginLeft: 5 }}>Filters    </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setFilterBtn(2)
                }}
                style={[
                  styles.rew,
                  {
                    width: '30%',

                    flexDirection: 'row',
                    backgroundColor: filterBtn === 2 ? Colors.PrimaryColor : 'white',
                    borderColor: filterBtn === 2 ? Colors.white : Colors.gray,
                    borderWidth: 2,
                    borderRadius: 10
                  },
                ]}
              >
                <Image source={require('../../assets/images/send/send.png')} style={{ height: 10, width: 10, tintColor: filterBtn === 2 ? 'white' : 'black' }} />

                <Text style={{ color: filterBtn === 2 ? 'white' : 'black', fontFamily: 'poppins-regular', fontSize: 10, marginLeft: 5 }}>Send Seacrh</Text>
              </TouchableOpacity>
            </View>
          }
          <View style={{ marginTop: -10, height: centerHeight }}>
            {
              homeData.length === 0 ?
                <View style={{ marginTop: '50%', width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <Text style={{ fontSize: 14, color: 'black', textAlign: "center", paddingHorizontal: 16 }}>Would you like to extend your search radius by 10 miles?</Text>
                  <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 30
                  }}>

                    <TouchableOpacity
                      onPress={async () => {
                        setLimit(limit + 1)
                        await dispatch(getPopertiess({ type: 0, limit: limit + 1, ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID })).then((res) => {
                          setHomeData(res.payload.data)
                        })
                      }}
                      style={{
                        height: 50,
                        width: '40%',
                        borderRadius: 100,
                        backgroundColor: Colors.PrimaryColor,
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
                          fontFamily: "poppins-regular",
                        }}>
                        Extend
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                :
                <CardsSwipe
                  cards={homeData}
                  onSwipedLeft={() => { }}
                  loop={false}
                  onSwipedRight={(item) => {
                    const newTodo1 = homeData[item].ID
                    setSwipeSelected([...swipeSelected, newTodo1])
                  }}
                  containerStyle={[styles.shadowProp, { flex: 1 }]}
                  renderCard={(item) =>
                  (
                    <View style={{
                      height: '95%', width: Platform.OS === 'web' ? '40%' : '90%', margin: 10, borderColor: Colors.boderColor,
                      borderWidth: 2, borderRadius: 15
                    }}>
                      <TouchableOpacity onPress={() => {
                        navigation.navigate("PropertiesDetails", { id: item.ID })
                      }}>
                        <View>
                          <View style={{ height: '60%', width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16, backgroundColor: 'white', overflow: 'hidden' }}>
                            <Image style={{ height: '100%', width: '100%', borderRadius: 16 }} source={{ uri: item?.featured_image_src && item?.featured_image_src[0]?.guid }}></Image>
                          </View>
                          <View style={{
                            backgroundColor: Colors.white, height: '40%', borderBottomLeftRadius: 16, borderBottomRightRadius: 16,
                            alignItems: "center", justifyContent: "space-between", flexDirection: "column", paddingVertical: 22
                          }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 12,
                                //  marginTop: 10
                              }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}>
                                <TouchableOpacity
                                  onPress={() => {
                                    // setProductId(item.ID);
                                    // setReviewTitle(item.title);
                                    // toggleModal();
                                  }}>
                                  <Image
                                    source={require('../../assets/images/star/star.png')}
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
                                    fontFamily: 'poppins-bold',
                                  }}>
                                  {item?.total_average_rating}

                                </Text>
                              </View>
                              <Text
                                onPress={() => { }}
                                style={{
                                  fontSize: 20,
                                  color: Colors.primaryBlue,
                                  // fontWeight: '500',
                                  fontFamily: 'poppins-bold',
                                }}>
                                {item?.property_price}

                              </Text>
                              <TouchableOpacity onPress={() => { }}>
                                <Image
                                  source={require('../../assets/images/send/send.png')}
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
                                // margin: 10
                              }}>
                              <Text

                                style={{
                                  fontSize: 15,
                                  color: Colors.black,
                                  textAlign: 'center',
                                  fontFamily: 'poppins-regular',
                                }}>
                                {item?.title}
                              </Text>
                            </View>
                            <View style={{
                              //  flex:1,
                              flexDirection: "row",
                              borderBottomLeftRadius: 16, borderBottomRightRadius: 16
                            }}>

                              <View
                                style={{
                                  flexDirection: 'row',
                                  width: '100%',
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
                                    source={require("../../assets/images/bed/bed.png")}
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
                                      fontFamily: 'poppins-regular',
                                    }}>
                                    {item?.property_bedrooms?.length > 0 ? item?.property_bedrooms : 0}
                                    {' Beds'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Image
                                    source={require("../../assets/images/bath/bath.png")}
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
                                      fontFamily: 'poppins-regular',
                                    }}>
                                    {item?.bathroomsfull?.length > 0 ? item?.bathroomsfull : 0}

                                    {' Baths'}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Image
                                    source={require("../../assets/images/measuring/measuring.png")}
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
                                      fontFamily: 'poppins-regular',
                                    }}>
                                    {item?.property_size?.length > 1 ? item?.property_size : 0}{" sq ft"}
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
                                      fontFamily: 'poppins-regular',
                                    }}>
                                    {item?.associationfee?.length > 1 ? item?.associationfee : "$" + 0}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}>
                                  <Image
                                    source={require("../../assets/images/tax/tax.png")}
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
                                      fontFamily: 'poppins-regular',
                                    }}>
                                    {item?.taxannualamount?.length > 1 ? item?.taxannualamount : "$" + 0}

                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )
                  }
                />
            }
          </View>

          <View
            onLayout={({ nativeEvent }) => {
              const { x, y, width, height } = nativeEvent.layout
              setBottomViewHight(height)
            }}
            style={{
              flexDirection: 'row', marginBottom: 10, justifyContent: "space-evenly",
              alignItems: 'center',
              position: "absolute", bottom: 0, left: 0, right: 0
            }}>

            <TouchableOpacity style={{ width: 100, alignItems: "center", justifyContent: "center", flex: 1 }} onPress={() => {
              setSwipeSelected(swipeSelected.slice(0, -1))
            }}>
              <Image style={{ height: 23, width: 30, }} source={require('../../assets/images/undo/undo.png')}></Image>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 100, alignItems: "center", justifyContent: "center", flex: 1 }} onPress={async () => {
              setSelectedTabs([])
              setSelectedMoreFilters([])
              Promise[(dispatch(getPopertiess({ type: 0, ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID, limit: limit, })).then((res) => {
                setHomeData(res.payload.data)
              }), dispatch(clearFilter()))]

            }}>
              <Image style={{ height: 27, width: 27 }} source={require('../../assets/images/clearfilter/clearfilter.png')}></Image>

            </TouchableOpacity>
          </View>
        </View >
      </SafeAreaView >
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly
        height={height - 50}
        keyboardAvoidingViewEnabled
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          },
          draggableIcon: {
            backgroundColor: Colors.gray
          }
        }}
      >
        <ScrollView>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',

            }}>

            <View>
              <View
                style={{
                  width: '100%',
                  justifyContent: 'center',
                }}>
                <Text style={{ color: 'black', fontFamily: 'poppins-regular', width: "99%", marginBottom: 8 }}>Choose your city </Text>
                <MultiSelect
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={styles.itemTextStyle}
                  placeholderTextColor="red"
                  search
                  data={moreFilterData?.City}
                  visibleSelectedItem
                  labelField="data_name"
                  valueField="data_customvalue"
                  placeholder="Select City"
                  searchPlaceholder="Search..."
                  value={cities}
                  valuestyle={{ color: "red" }}
                  onChange={async item => {
                    setCities(item)
                    await dispatch(getPopertiess({
                      type: 3, data: {
                        data_custom_taxonomy: "property_city",
                        data_customvalue: item[item.length - 1],
                      },
                      ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID,
                      limit: limit,
                    })).then((res) => {
                      setHomeData(res.payload.data)
                    })
                    refRBSheet.current.close()
                  }}
                  selectedStyle={styles.selectedStyle}
                />
                <View style={{ marginBottom: 12 }}>

                  <Text style={{ color: 'black', fontFamily: 'poppins-regular' }}>Bedrooms</Text>
                  <FlatList
                    data={moreFilterData?.bedroom}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity onPress={async () => {
                          setBathRoomItem(index),
                            setBathCount(item.title),
                            await dispatch(getPopertiess({
                              type: 3, data: {
                                data_custom_taxonomy: "bedroom",
                                data_customvalue: item.data_customvalue,
                              },
                              ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID,
                              limit: limit,
                            })).then((res) => {
                              setHomeData(res.payload.data)
                            })
                          refRBSheet.current.close()
                        }}>
                          <View style={{ width: 70, height: 40, marginTop: 8, marginHorizontal: 3, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.boderColor, backgroundColor: bathRoom === index ? Colors.black : Colors.white }}>
                            <Text style={{ fontFamily: 'poppins-regular', color: bathRoom === index ? Colors.white : Colors.black }}>{item?.data_name}</Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }}
                  >

                  </FlatList>
                </View>

                <View style={{ marginBottom: 12 }}>

                  <Text style={{ color: 'black', fontFamily: 'poppins-regular' }}>Bathrooms</Text>
                  <FlatList
                    data={moreFilterData?.bathroom}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity onPress={async () => {
                          setBedroomItem(index), setBedCount(item.title),
                            await dispatch(getPopertiess({
                              type: 3, data: {
                                data_custom_taxonomy: "bathroom",
                                data_customvalue: item.data_customvalue,
                              },
                              ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID,
                              limit: limit,
                            })).then((res) => {
                              setHomeData(res.payload.data)
                            })
                          refRBSheet.current.close()
                        }}>
                          <View style={{ width: 70, height: 40, marginTop: 8, marginHorizontal: 3, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.boderColor, backgroundColor: bedroomitem === index ? Colors.black : Colors.white }}>
                            <Text style={{ fontFamily: 'poppins-regular', color: bedroomitem === index ? Colors.white : Colors.black }}>{item?.data_name}</Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }}
                  >

                  </FlatList>
                </View>
              </View>
              <Text style={{ color: 'black', backgroundColor: 'white', width: '100%', zIndex: 9, fontFamily: 'poppins-regular', marginTop: 12, position: 'relative' }}>Square Feet</Text>
              <View style={{ flexDirection: "column", justifyContent: 'space-between', marginTop: 8 }}>

                <Dropdown
                  style={{ borderWidth: 1, fontSize: 16, fontFamily: "poppins-regular", color: Colors.newgray, width: '100%', height: 50, borderColor: Colors.boderColor, borderRadius: 10, padding: 6, paddingLeft: 12, marginBottom: 8 }}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  itemTextStyle={styles.itemTextStyle}
                  data={moreFilterData?.min_square}
                  search
                  maxHeight={300}
                  labelField="data_name"
                  valueField="data_customvalue"
                  placeholder="Min square"
                  searchPlaceholder="Search..."
                  value={minSquareFeet}
                  onChange={async item => {
                    setMinSquareFeet(item.data_name);
                    await dispatch(getPopertiess({
                      type: 3, data: {
                        data_custom_taxonomy: "min_square",
                        data_customvalue: item.data_customvalue,
                      },
                      ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID,
                      limit: limit,
                    })).then((res) => {
                      setHomeData(res.payload.data)
                    })
                    setFilterModalVisible(false);
                  }}

                />
                <Dropdown
                  style={{ borderWidth: 1, marginBottom: 8, fontSize: 16, fontFamily: "poppins-regular", color: Colors.newgray, width: '100%', height: 50, borderColor: Colors.boderColor, borderRadius: 10, padding: 6, paddingLeft: 12 }}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  itemTextStyle={styles.itemTextStyle}
                  iconStyle={styles.iconStyle}
                  data={moreFilterData?.max_square}
                  search
                  maxHeight={300}
                  labelField="data_name"
                  valueField="data_customvalue"
                  placeholder="Max Square"
                  searchPlaceholder="Search..."
                  value={maxSquareFeet}
                  onChange={async item => {
                    setMaxSquareFeet(item.data_name)
                    await dispatch(getPopertiess({
                      type: 3, data: {
                        data_custom_taxonomy: "max_square",
                        data_customvalue: item.data_customvalue,
                      },
                      ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID,
                      limit: limit,
                    })).then((res) => {
                      setHomeData(res.payload.data)
                    })
                    setFilterModalVisible(false);
                  }}

                />
              </View>


              <View style={{ marginTop: 12 }}>

                <Text style={{ color: 'black', fontFamily: 'poppins-regular' }}>Price Range</Text>

                <View style={{ flexDirection: "column", justifyContent: 'space-between', marginTop: 8 }}>

                  <Dropdown
                    style={{ borderWidth: 1, fontSize: 16, fontFamily: "poppins-regular", color: Colors.newgray, width: '100%', height: 50, borderColor: Colors.boderColor, borderRadius: 10, padding: 6, paddingLeft: 12, marginBottom: 8 }}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    iconStyle={styles.iconStyle}
                    itemTextStyle={styles.itemTextStyle}
                    data={moreFilterData?.min_price}
                    search
                    maxHeight={300}
                    labelField="data_name"
                    valueField="data_customvalue"
                    placeholder="Min Price"
                    searchPlaceholder="Search..."
                    value={minPricerange}
                    onChange={async item => {
                      setMinPricerange(item.data_name)
                      await dispatch(getPopertiess({
                        type: 3, data: {
                          data_custom_taxonomy: "min_price",
                          data_customvalue: item.data_customvalue,
                        },
                        ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID,
                        limit: limit,
                      })).then((res) => {
                        setHomeData(res.payload.data)
                      })
                      refRBSheet.current.close()
                    }}

                  />
                  <Dropdown
                    style={{ borderWidth: 1, marginBottom: 8, fontSize: 16, fontFamily: "poppins-regular", color: Colors.newgray, width: '100%', height: 50, borderColor: Colors.boderColor, borderRadius: 10, padding: 6, paddingLeft: 12 }}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    itemTextStyle={styles.itemTextStyle}
                    iconStyle={styles.iconStyle}
                    data={moreFilterData?.max_price}
                    search
                    maxHeight={300}
                    labelField="data_name"
                    valueField="data_customvalue"
                    placeholder="Max Price"
                    searchPlaceholder="Search..."
                    value={maxPriceRange}
                    onChange={async item => {
                      setMaxPriceRange(item.data_name);
                      await dispatch(getPopertiess({
                        type: 3, data: {
                          data_custom_taxonomy: "max_price",
                          data_customvalue: item.data_customvalue,
                        },
                        ID: store?.getState()?.loginUserReducer?.loginData?.data?.ID,
                        limit: limit,
                      })).then((res) => {
                        setHomeData(res.payload.data)
                      })
                      refRBSheet.current.close()
                    }}

                  />
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: "row", justifyContent:'space-between'}}>
                <FlatList
                  data={moreFilterData?.more_filter_data}
                  keyExtractor={item => item.id}
                  renderItem={renderMoreFilter}
                  numColumns={3}
                >
                </FlatList>

              </View>
              <View style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: "center",
                justifyContent: "flex-end",
                // paddingHorizontal: 10
              }}>

                <TouchableOpacity
                  onPress={async () => {
                  }}
                  style={{
                    height: 50,
                    width: '40%',
                    borderRadius: 100,
                    backgroundColor: Colors.PrimaryColor,
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
                      fontFamily: "poppins-regular",
                    }}>
                    Apply
                  </Text>
                </TouchableOpacity>

              </View>
            </View>

          </View>
        </ScrollView>
      </RBSheet>
    </View>

  );
};

export default Properties;


const styles = StyleSheet.create({
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
  dropdown: {
    // margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.boderColor,
    width: "100%",
    marginBottom: 12
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '100%',
    width: "100%",
    alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center", justifyContent: "center",
    width: "100%",
    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.2)",
  },
  rew: {
    //  width: 110,
    borderRadius: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.placeHolderTextColor,
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  shadowProp: {
    shadowOffset: { width: -2, height: 4 },
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: "relative",
    zIndex: 99,

  },
})