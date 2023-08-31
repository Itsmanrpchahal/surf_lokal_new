import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  TextInput,
  FlatList,
  Alert,
  Keyboard,
  RefreshControl,
} from 'react-native';
import 'react-native-gesture-handler';
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import {getSavedSearch} from '../../modules/getSavedSearch';
import {deleteSearch} from '../../modules/deleteSearch';
import {editSearch} from '../../modules/editSearch';
import * as Animatable from 'react-native-animatable';
import {useIsFocused} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const MyFavorites = ({navigation}) => {
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const [apiResponse, setApiResponse] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [address, setAddress] = useState('');
  const [images, setImages] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [updatedParameters, setUpdatedParameters] = useState({});
  const flatListRef = useRef(null);
  const [showNoDataMessage, setShowNoDataMessage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      Promise.all[getSavedApiCall()];
    }
  }, [isFocused]);

  const getSavedApiCall = () => {
    dispatch(getSavedSearch()).then(response => {
      if (response.payload.data === 'Record not found!') {
        setShowNoDataMessage(true);
      } else {
        setImages(response.payload.data);
      }
    });
  };

  const deleteSearchApiCall = async (userId, postId) => {
    const formData = new FormData();
    formData.append('postID', postId);
    dispatch(deleteSearch(formData)).then(response => {
      getSavedApiCall();
    });
  };

  const editSearchApiCall = (userId, postId, updatedParameter) => {
    const formData = new FormData();
    formData.append('searchid', postId);
    formData.append('searchparameters', updatedParameter);

    console.log(formData);
    dispatch(editSearch(formData)).then(response => {
      getSavedApiCall();
    });
  };

  const handleChangeText = (itemId, parameterIndex, text) => {
    setUpdatedParameters(prevState => ({
      ...prevState,
      [itemId]: {
        ...prevState[itemId],
        [parameterIndex]: text,
      },
    }));
  };

  const handleEditPress = item => {
    const parameters = item.search_parameters.split(',');
    const updatedParametersObj = {};
    parameters.forEach((parameter, index) => {
      updatedParametersObj[index] = parameter;
    });

    setEditingItemId(item.ID);
    setUpdatedParameters({
      ...updatedParameters,
      [item.ID]: updatedParametersObj,
    });
    Keyboard.dismiss();
  };

  const handleSavePress = item => {
    const updatedParameterArr = Object.values(updatedParameters[item.ID]);
    const updatedParameter = updatedParameterArr.join(',');

    setEditingItemId(null);
    editSearchApiCall(item.UserID, item.ID, updatedParameter);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getSavedApiCall();
    setRefreshing(false);
  };

  const renderItem = ({item, index}) => {
    const isEditing = item.ID === editingItemId;
    const parameters = item.search_parameters.split(',');

    return (
      <View style={styles.slideOuter}>
        <View style={styles.cover}>
          <View style={styles.innercover}>
            <View>
              {item.propertycity && (
                <Text style={styles.propertycity}>{item.propertycity}</Text>
              )}
            </View>
            <Text style={styles.parametertext}>Parameters:</Text>

            {parameters.map((parameter, parameterIndex) => (
              <TextInput
                key={parameterIndex.toString()}
                value={
                  updatedParameters[item.ID]?.[parameterIndex] ?? parameter
                }
                style={[
                  styles.textinputtext,
                  {
                    height: isEditing
                      ? DeviceInfo.getDeviceType() === 'Tablet'
                        ? 60
                        : 40
                      : DeviceInfo.getDeviceType() === 'Tablet'
                      ? 60
                      : 40,
                    borderColor: isEditing ? Colors.white : Colors.BorderColor,
                    backgroundColor: isEditing ? Colors.gray : Colors.white,
                  },
                ]}
                onChangeText={text => {
                  handleChangeText(item.ID, parameterIndex, text);
                }}
                editable={isEditing}
              />
            ))}

            <View style={styles.buttoncover}>
              {isEditing ? (
                <TouchableOpacity
                  onPress={() => handleSavePress(item)}
                  style={styles.savebuttoncover}>
                  <Text style={styles.savebutton}>Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleEditPress(item)}
                  style={styles.editcover}>
                  <Image
                    style={styles.editicon}
                    source={Images.editing}></Image>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => deleteSearchApiCall(item.UserID, item.ID)}
                style={styles.trashcover}>
                <Image style={styles.trashicon} source={Images.Trash}></Image>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headercover}>
        <TouchableOpacity
          style={styles.leftarrow}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.leftarrowimage}
            source={Images.leftnewarrow}></Image>
        </TouchableOpacity>
        <View style={styles.centercover}>
          <Text style={styles.centertext}>Saved Searches</Text>
        </View>
        <TouchableOpacity
          style={styles.rightarrow}
          onPress={() => navigation.goBack()}>
          <Animatable.Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
      </View>

      {showNoDataMessage ? (
        <View style={styles.nosearchecover}>
          <Text style={styles.searchtext}>No saved searches found!</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          style={{flex: 1}}
          contentContainerStyle={{paddingBottom: 20}}
          data={images}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    position: 'relative',
  },
  slideOuter: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors,
    borderRadius: 18,
  },
  slide: {
    width: screenWidth - 40,
    height: screenHeight / 3,
    borderRadius: 18,
    margin: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'contain',
    flexDirection: 'row',
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
    fontFamily: 'Poppins-Regular',
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
  //fliter
  filter: {
    height: 60,
  },
  screen1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Colors.gray,
  },
  imagedata: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 29 : 19,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 49 : 29,

    resizeMode: 'contain',
  },
  cover: {width: '100%', alignItems: 'center'},
  innercover: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 3,
    marginBottom: 12,
  },
  propertycity: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.textColorDark,
    fontFamily: 'Poppins-Regular',
  },
  parametertext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 25 : 14,
    marginTop: 10,
    color: Colors.textColorLight,
    fontFamily: 'Poppins-Regular',
  },
  textinputtext: {
    color: 'black',

    borderWidth: 1,
    padding: 12,
    borderRadius: 7,
    verticalAlign: 'top',
    marginBottom: 12,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 14,
  },
  trashicon: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 14,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 14,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  trashcover: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 40,
    borderRadius: 40,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 40,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editicon: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 14,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 28 : 14,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  editcover: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 40,
    borderRadius: 40,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 40,
    backgroundColor: Colors.darbluec,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  savebutton: {
    marginHorizontal: 5,
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 22 : 16,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  savebuttoncover: {
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 50 : 40,
    borderRadius: 40,
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 110 : 70,
    backgroundColor: Colors.darbluec,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttoncover: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  headercover: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
  },
  leftarrow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 12,
    justifyContent: 'flex-start',
    top: 13,
    width: 50,
    height: 50,
  },
  leftarrowimage: {
    width: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    height: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 27,
    resizeMode: 'contain',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  centercover: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centertext: {
    fontSize: DeviceInfo.getDeviceType() === 'Tablet' ? 40 : 20,
    color: Colors.black,
    fontFamily: 'Poppins-Light',
    lineHeight: DeviceInfo.getDeviceType() === 'Tablet' ? 42 : 22,
  },
  rightarrow: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  nosearchecover: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchtext: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textColorDark,
    fontFamily: 'Poppins-Regular',
  },
});

export default MyFavorites;
