import React, { useEffect, useState } from "react";
import {
    View, Text, TouchableOpacity, Image, TextInput, SafeAreaView, StyleSheet, Animatable,
    PanResponder,
} from "react-native";
import Colors from "../../utils/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { chat } from "../../modules/chat";
import { store } from '../../redux/store';
import { TypingAnimation } from "react-native-typing-animation";
import { AutoScrollFlatList } from "react-native-autoscroll-flatlist";
import Images from "../../utils/Images";
import AsyncStorage from '@react-native-community/async-storage';
import { getBookTour } from "../../modules/getBookTour";
import { bookChat } from "../../modules/bookChat";
import { isRead } from "../../modules/isRead"
import { getChatDetail } from "../../modules/getChatDetail"
import { sendMessage } from "../../modules/sendMessage";
import DatePicker from 'react-native-date-picker'
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const BookaTour = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [message, setMessage] = useState();
    const [bookData, setBookData] = useState([])
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState([]);
    const [getMesg, setGetMessg] = useState([])
    const [userID, setUserID] = useState()
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const postid = props.route.params


    useEffect(() => {

        getUserID()
        if (props?.route?.params?.ID) {
            Promise.all([dispatch(isRead({ ID: props?.route?.params?.ID })),
            dispatch(getChatDetail({ ID: props?.route?.params?.PropID })).then((res) => {
                setGetMessg(res?.payload?.data)
            }).catch((e) => {

            })])

        }
    }, [])

    const getUserID = async () => {
        const id = await AsyncStorage.getItem('userId');
        setUserID(id)
    }

    const getBookTourAPicall = async () => {
        const id = await AsyncStorage.getItem('userId');
        const formData = new FormData();
        formData.append("propid", postid.post_id)
        formData.append('schedule_hour', selectedTime)
        formData.append('schedule_day', selectedDate)
        formData.append('user_mobile', store.getState().loginUser.loginData.metadata.mobile[0])
        // console.log('forndata',JSON.stringify(store.getState().loginUser.loginData.metadata.mobile[0]))
        // const formData = {
        //     user_id: id,
        //     propid: postid.post_id,
        //     schedule_hour: selectedTime,
        //     schedule_day: selectedDate,
        //     user_mobile: store.getState()?.loginUser?.loginData?.metadata?.mobile[0]
        // }
        console.log('logodata', formData)
        dispatch(sendMessage({
            // user_id: props?.route?.params?.user_id ? props?.route?.params?.user_id : userID,
            propid: props?.route?.params?.PropID ? props?.route?.params?.PropID : postid.post_id,
            user2_id: props?.route?.params?.user2_id ? props?.route?.params?.user2_id : '',
            message: selectedDate.getDate() + '/' + selectedDate.getMonth() + '/' + selectedDate.getFullYear() + ',' + selectedTime.getHours() + ':' + selectedDate.getMinutes()
        })).then((res) => {
            setLoading(false)
            setMessage('')
            if (res.payload.success) {
                dispatch(getChatDetail({ ID: props?.route?.params?.PropID ? props?.route?.params?.PropID : postid.post_id })).then((res) => {
                    setGetMessg(res?.payload?.data)
                    dispatch(getBookTour(formData)).then((response) => {
                        console.log("getBookTour response ", response)
                    });
                }).catch((e) => {
                })
            }
        }).catch((e) => {
            alert(JSON.stringify(e))
        })


        //     dispatch(getBookTour(formData)).then(response => {
        //       setBookData(response);
        // console.log('booktour',response)

        //     });
    }


    return (
        <SafeAreaView>
            <View style={{ height: "100%", position: "relative", paddingBottom: 100 }}>
                <View
                    style={{
                        // backgroundColor: Colors.gray,
                        height: 50,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        borderBottomColor: Colors.BorderColor,
                        borderBottomWidth: 1
                    }}
                >
                    <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            position: "absolute",
                            right: 10,
                            top: 2,

                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40,
                            width: 40,
                            borderRadius: 100,
                            backgroundColor: Colors.gray,
                        }}
                        onPress={() => navigation.goBack()}  >
                        <Image
                            source={Images.whiteclose}
                            style={styles.imagedata}
                            animation="flipInY"
                        />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: "Poppins-Medium",
                            color: Colors.black,
                        }}
                    >
                        Schedule a Showing
                    </Text>
                    <TouchableOpacity
                        onPress={() => {
                            setRes([]);
                        }}
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginRight: 10,
                        }}
                    >
                        {/* <Image
                            style={{
                                height: 25,
                                width: 25,
                                resizeMode: "contain",
                                tintColor: Colors.black,
                            }}
                            source={Images.reload}
                        /> */}
                    </TouchableOpacity>
                </View>
                <Text
                    style={{
                        marginLeft: 15,
                        marginRight: 13,
                        fontSize: 16,
                        borderRadius: 16,
                        alignSelf: "flex-start",
                        maxWidth: "100%",
                        marginTop: 22,
                        color: Colors.black,
                        fontFamily: "Poppins-Medium",
                    }}
                >
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

                                {
                                    item.message === 'A Lokal agent will confirm with you within the next 2 hours' ? <Text
                                        style={{
                                            // padding: 8,
                                            fontSize: 16,
                                            borderRadius: 16,
                                            backgroundColor: Colors.white,
                                            alignSelf: "flex-start",
                                            textAlignVertical: 'center',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            alignContent: 'center',
                                            maxWidth: "70%",
                                            marginLeft: 8,
                                            marginRight: 8,
                                            paddingHorizontal: 8,
                                            minHeight: 50,
                                            color: Colors.black,
                                        }}
                                    >
                                        {item.message}
                                    </Text> :
                                        <Text
                                            style={{
                                                // padding: 8,
                                                fontSize: 16,
                                                borderRadius: 16,
                                                backgroundColor: item.user_id === userID ? Colors.surfblur : Colors.white,
                                                alignSelf: item.user_id === userID ? "flex-end" : "flex-start",
                                                textAlignVertical: 'center',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                alignContent: item.user_id === userID ? 'center' : 'center',
                                                maxWidth: "70%",
                                                marginLeft: 8,
                                                marginRight: 8,
                                                paddingHorizontal: 8,
                                                minHeight: 50,
                                                color: item.user_id === userID ? Colors.white : Colors.black,
                                            }}
                                        >
                                            {item.message}
                                        </Text>
                                }


                            </View>
                        )
                    }}
                >

                </AutoScrollFlatList>



                <View
                    style={{
                        bottom: 10,
                        position: "absolute",
                        zIndex: 99,
                        left: 0,
                        right: 0,
                        backgroundColor: Colors.white,
                    }}
                >
                    {loading && getMesg?.length > 2 && (
                        <Text
                            style={{
                                padding: 16,
                                fontSize: 16,
                                borderRadius: 16,
                                backgroundColor: Colors.surfblur,

                                alignSelf: "flex-end",
                                maxWidth: "70%",
                                marginLeft: 8,
                                marginRight: 8,
                                marginTop: 0,
                                color: Colors.white,
                            }}
                        >
                            {message}
                        </Text>
                    )}

                    {loading && getMesg?.length > 2 && (
                        <View style={{ flexDirection: "row" }}>
                            <Text
                                style={{
                                    fontSize: 12,
                                    borderRadius: 16,
                                    alignSelf: "flex-start",
                                    maxWidth: "70%",
                                    marginLeft: 16,
                                    marginTop: 6,
                                    color: Colors.black,
                                    backgroundColor: Colors.white,
                                }}
                            >
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
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 8,
                        }}
                    >
                        <TextInput
                            style={{ width: "80%", backgroundColor: Colors.white, color: Colors.black }}
                            placeholder={props?.route?.params?.ID === '' ? 'Select Date from Calender' : ' Type here ....'}
                            placeholderTextColor={Colors.textColorLight}
                            fontFamily="Poppins-Regular"
                            value={message}
                            editable={getMesg?.length <= 2 ? false : true}
                            onChangeText={setMessage}
                        />
                        {
                            props?.route?.params?.ID === '' && <TouchableOpacity
                                disabled={getMesg?.length < 2 ? false : true}
                                onPress={() => {
                                    setOpen(true)
                                    setDate(new Date())

                                }} style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                <Image
                                    style={{
                                        height: 25,
                                        width: 25,
                                        resizeMode: "contain",
                                    }}
                                    source={Images.cola}
                                />
                            </TouchableOpacity>
                        }


                        {
                            props?.route?.params?.ID != '' &&
                            <TouchableOpacity
                                disabled={getMesg?.length > 2 ? false : true}
                                onPress={() => {

                                    setLoading(true);
                                    {
                                        dispatch(sendMessage({
                                            user_id: props?.route?.params?.user_id ? props?.route?.params?.user_id : userID,
                                            propid: props?.route?.params?.PropID ? props?.route?.params?.PropID : postid.PropID,
                                            user2_id: props?.route?.params?.user2_id ? props?.route?.params?.user2_id : '',
                                            message: message
                                        })).then((res) => {
                                            setLoading(false)
                                            setMessage('')
                                            if (res.payload.success) {
                                                dispatch(getChatDetail({ ID: props?.route?.params?.PropID ? props?.route?.params?.PropID : postid.PropID })).then((res) => {
                                                    setGetMessg(res?.payload?.data)
                                                }).catch((e) => {

                                                })
                                            }
                                        }).catch((e) => {
                                            alert(JSON.stringify(e))
                                        })
                                    }

                                }}
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    style={{
                                        height: 25,
                                        width: 25,
                                        resizeMode: "contain",
                                        tintColor: Colors.primaryBlue,
                                    }}
                                    source={Images.sendm}
                                />
                            </TouchableOpacity>
                        }


                    </View>
                    <DatePicker
                        modal
                        open={open}
                        date={date}
                        accessibilityLiveRegion="en"
                        // androidVariant='iosClone'
                        minimumDate={new Date()}
                        locale="en-GB"
                        theme="light"
                        mode="datetime"
                        onConfirm={(date) => {
                            setOpen(false)
                            const now = date.toDateString()
                            const time = date.getHours() + ":" + date.getMinutes()

                            setLoading(true);
                            {
                                const formData = new FormData();
                                formData.append('propid', props?.route?.params?.PropID ? props?.route?.params?.PropID : postid.PropID);
                                formData.append('user2_id', props?.route?.params?.user2_id ? props?.route?.params?.user2_id : 18);
                                formData.append('message',  now + "," + time);
                                console.log(formData)
                                dispatch(sendMessage(formData)).then((res) => {
                                    setLoading(false)
                                    setMessage('')
                                    if (res.payload?.data.success) {
                                        dispatch(getChatDetail({ propid:props?.route?.params?.PropID})).then((res) => {
                                            setGetMessg(res?.payload?.data)
                                        }).catch((e) => {

                                        })
                                    }
                                }).catch((e) => {
                                    alert(JSON.stringify(e))
                                })
                            }
                        }}
                        onCancel={() => {
                            setOpen(false)
                        }}
                    />
                </View>


                {/* {isDatePickerVisible && (
                    <DateTimePicker
                        value={selectedDate}
                        display="default"
                    // onChange={handleDateSelection}
                    />
                )}

                {isTimePickerVisible && (
                    <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        is24Hour={false}
                        display="default"
                        // onChange={handleTimeSelection}
                    />
                )} */}
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
        // transform: [{ rotate: '90deg' }],
    },
});