import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Colors from '../../utils/Colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { store } from '../../redux/store';
import { TypingAnimation } from 'react-native-typing-animation';
import { AutoScrollFlatList } from 'react-native-autoscroll-flatlist';
import Images from '../../utils/Images';
import AsyncStorage from '@react-native-community/async-storage';
import { pushNotificaton } from '../../modules/pushNotificaton';
import { isRead } from '../../modules/isRead';
import { getChatDetail } from '../../modules/getChatDetail';
import { sendMessage } from '../../modules/sendMessage';
import DatePicker from 'react-native-date-picker';
import DeviceInfo from 'react-native-device-info';
import Loader from '../../components/Loader';
const BookaTour = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const [message, setMessage] = useState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [getMesg, setGetMessg] = useState([]);
  const [userID, setUserID] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const postid = props.route.params;

  useEffect(() => {
 console.log(store.getState().loginUserReducer.loginData)
  }, [])
  

  // useEffect(() => {
  //   getUserID();
  //   if (props?.route?.params?.ID) {
  //     Promise.all([
  //       dispatch(isRead({ID: props?.route?.params?.ID})),
  //       dispatch(getChatDetail({ID: props?.route?.params?.PropID}))
  //         .then(res => {
  //           console.log("getChatDetail======>>", res?.payload?.data.data)
  //           setGetMessg(res?.payload?.data.data);
  //         })
  //         .catch(e => {}),
  //     ]);
  //   }
  // }, []);
  useEffect(() => {
    getChatDetailApiCall()
  }, [])

  const getChatDetailApiCall = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append('propid', postid?.PropID);
    await dispatch(getChatDetail(formData)).then((response) => {
      setGetMessg(response?.payload?.data?.data);
      setLoading(false)
    })
  };

  const getUserID = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserID(id);
  };

  // const getBookTourAPicall = async () => {
  //   const formData = new FormData();
  //   formData.append('propid', postid.post_id);
  //   formData.append('schedule_hour', selectedTime);
  //   formData.append('schedule_day', selectedDate);
  //   formData.append( 'user_mobile', store.getState().loginUser.loginData.metadata.mobile[0], );
  //   dispatch(
  //     sendMessage({

  //       propid: props?.route?.params?.PropID
  //         ? props?.route?.params?.PropID
  //         : postid.post_id,
  //       user2_id: props?.route?.params?.user2_id
  //         ? props?.route?.params?.user2_id
  //         : '',
  //       message:
  //         selectedDate.getDate() +
  //         '/' +
  //         selectedDate.getMonth() +
  //         '/' +
  //         selectedDate.getFullYear() +
  //         ',' +
  //         selectedTime.getHours() +
  //         ':' +
  //         selectedDate.getMinutes(),
  //     }),
  //   )
  //     .then(async res => {
  //       setLoading(false);
  //       setMessage('');
  //       if (res.payload.success) {
  //        await dispatch(getBookTour(formData)).then(response => {

  //         });
  //          await dispatch(
  //           getChatDetail({
  //             ID: props?.route?.params?.PropID
  //               ? props?.route?.params?.PropID
  //               : postid.post_id,
  //           }),
  //         )
  //           .then(res => {
  //             setGetMessg(res?.payload?.data);

  //           })
  //           .catch(e => {});
  //       }
  //     })
  //     .catch(e => {
  //       alert(JSON.stringify(e));
  //     });


  // };



  return (
    <SafeAreaView>
      <View style={{ height: '100%', position: 'relative', paddingBottom: 100 }}>
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomColor: Colors.BorderColor,
            borderBottomWidth: 1,
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 5,

              flexDirection: 'row',
              alignItems: 'center',

              justifyContent: 'flex-start',
              width: 50,
              height: 50,
              shadowColor: 'black',
              shadowOffset: { width: 1, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}
            onPress={() => navigation.goBack()}>
            <Image
              style={{
                width: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
                height: DeviceInfo.getDeviceType() === 'Tablet' ? 57 : 27,
                resizeMode: 'contain',
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                resizeMode: 'contain',
                tintColor: '#D3D3D3',
              }}
              source={Images.leftnewarrow}></Image>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Poppins-Medium',
              color: Colors.black,
            }}>
            Schedule a Tour
          </Text>

        </View>
        <Text
          style={{
            marginLeft: 15,
            marginRight: 13,
            fontSize: 16,
            borderRadius: 16,
            alignSelf: 'flex-start',
            maxWidth: '100%',
            marginTop: 22,
            color: Colors.black,
            fontFamily: 'Poppins-Medium',
          }}>
          Hi! What can I help you with?
        </Text>
        <AutoScrollFlatList
          nestedScrollEnabled={true}
          inverted
          data={getMesg}
          threshold={20}
          renderItem={({ item, index }) => {
            return (
              <View style={{ marginBottom: 5 }}>
                {item.message ===
                  'A Lokal agent will confirm with you within the next 2 hours' ? (
                  <Text
                    style={{

                      fontSize: 16,
                      borderRadius: 16,
                      backgroundColor: "#D3D3D3",
                      alignSelf: 'flex-start',
                      textAlignVertical: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignContent: 'center',
                      maxWidth: '70%',
                      marginLeft: 8,
                      marginRight: 8,
                      paddingHorizontal: 8,
                      minHeight: 50,
                      color: Colors.black,
                    }}>
                    {item.message}
                  </Text>
                ) : (
                  <Text
                    style={{

                      fontSize: 16,
                      borderRadius: 16,
                      backgroundColor:
                        item.user_id === userID
                          ? Colors.white
                          : Colors.surfblur,
                      alignSelf:
                        item.user_id === userID ? 'flex-start' : 'flex-end',
                      textAlignVertical: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignContent:
                        item.user_id === userID ? 'center' : 'center',
                      maxWidth: '70%',
                      marginLeft: 8,
                      marginRight: 8,
                      paddingHorizontal: 8,
                      minHeight: 50,
                      color:
                        item.user_id === userID ? Colors.white : Colors.black,
                      color:
                        item.user_id === userID ? Colors.white : Colors.white,
                    }}>
                    {item.message}
                  </Text>
                )}
              </View>
            );
          }}></AutoScrollFlatList>

        <View
          style={{
            bottom: 10,
            position: 'absolute',
            zIndex: 99,
            left: 0,
            right: 0,
            backgroundColor: Colors.white,
          }}>
          {loading && getMesg?.length > 2 && (
            <Text
              style={{
                padding: 16,
                fontSize: 16,
                borderRadius: 16,
                backgroundColor: Colors.surfblur,

                alignSelf: 'flex-end',
                maxWidth: '70%',
                marginLeft: 8,
                marginRight: 8,
                marginTop: 0,
                color: Colors.white,
              }}>
              {message}
            </Text>
          )}

          {loading && getMesg?.length > 2 && (
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontSize: 12,
                  borderRadius: 16,
                  alignSelf: 'flex-start',
                  maxWidth: '70%',
                  marginLeft: 16,
                  marginTop: 6,
                  color: Colors.black,
                  backgroundColor: Colors.white,
                }}>
                typing
              </Text>
              <TypingAnimation
                dotColor="black"
                dotMargin={3}
                dotAmplitude={2}
                dotSpeed={0.15}
                dotRadius={1}
                dotX={8}
                dotY={0}
                style={{ marginTop: 25, marginLeft: -3 }}
              />
            </View>
          )}

          <View
            style={{
              backgroundColor: Colors.white,
              borderColor: Colors.BorderColor,
              borderWidth: 1,
              borderRadius: 5,
              height: 45,
              margin: 16,
              paddingLeft: 8,
              paddingRight: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
            <TextInput
              style={{
                width: '80%',
                backgroundColor: Colors.white,
                color: Colors.black,
              }}
              placeholder={
                props?.route?.params?.ID === ''
                  ? 'Select Date from Calender'
                  : ' Type here ....'
              }
              placeholderTextColor={Colors.textColorLight}
              fontFamily="Poppins-Regular"
              value={message}
              editable={getMesg?.length <= 2 ? false : true}
              onChangeText={setMessage}
            />
            {props?.route?.params?.ID === '' && (
              <TouchableOpacity
                disabled={getMesg.length < 2 ? false : true}
                onPress={() => {
                  setOpen(true);
                  setDate(new Date());

                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                  }}
                  source={Images.cola}
                />
              </TouchableOpacity>
            )}

            {props?.route?.params?.ID != '' && (
              <TouchableOpacity
                disabled={getMesg?.length > 2 ? false : true}
                onPress={() => {
                  setLoading(true);
                  {
                    dispatch(
                      sendMessage({
                        user_id: props?.route?.params?.user_id
                          ? props?.route?.params?.user_id
                          : userID,
                        propid: props?.route?.params?.PropID
                          ? props?.route?.params?.PropID
                          : postid.PropID,
                        user2_id: props?.route?.params?.user2_id
                          ? props?.route?.params?.user2_id
                          : '',
                        message: message,
                      }),
                    )
                      .then(res => {
                        setLoading(false);
                        setMessage('');
                        if (res.payload.success) {
                          getChatDetailApiCall()
                        }
                      })
                  }
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{
                    height: 25,
                    width: 25,
                    resizeMode: 'contain',
                    tintColor: Colors.primaryBlue,
                  }}
                  source={Images.sendm}
                />
              </TouchableOpacity>
            )}
          </View>
          <DatePicker
            modal
            open={open}
            date={date}
            accessibilityLiveRegion="en"
            minimumDate={new Date()}
            locale="en-GB"
            theme="light"
            mode="datetime"
            onConfirm={
              date => {
                setOpen(false);
                const now = date.toDateString();
                const time = date.getHours() + ':' + date.getMinutes();
                {
                  const formData = new FormData();
                  formData.append(
                    'propid',
                    props?.route?.params?.PropID
                      ? props?.route?.params?.PropID
                      : postid.PropID,
                  );
                  formData.append(
                    'user2_id',
                    props?.route?.params?.user2_id
                      ? props?.route?.params?.user2_id
                      : 18,
                  );
                  formData.append('message', now + ',' + time);
                  dispatch(sendMessage(formData))
                    .then(res => {
                      setLoading(false);
                      setMessage('');
                      if (res.payload.data.success) {
                        getChatDetailApiCall()
                        {
                          const payload={
                           propid: postid?.PropID,
                           schedule_hour:time,
                           schedule_day:now,
                           user_mobile:6202142148
                          }
                         dispatch(pushNotificaton(payload))
                       }
                      }
                    })
                    .catch(e => {
                    });

                }
              }
            }
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BookaTour;

const styles = StyleSheet.create({
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
    height: 12,
    width: 12,
    resizeMode: 'contain',
    tintColor: Colors.black,

  },
});
