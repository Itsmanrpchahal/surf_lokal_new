import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, SafeAreaView } from "react-native";
import Colors from "../../utils/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { chat } from "../../modules/chat";
import { store } from '../../redux/store';
import { TypingAnimation } from "react-native-typing-animation";
import { AutoScrollFlatList } from "react-native-autoscroll-flatlist";
import Images from "../../utils/Images";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from '@react-native-community/async-storage';
import {getBookTour} from "../../modules/getBookTour";
import {bookChat} from "../../modules/bookChat";

const BookaTour = (props) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [message, setMessage] = useState();
    const[bookData,setBookData] =useState([])
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [res, setRes] = useState([]);
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setTimePickerVisible] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const postid = props.route.params
    useEffect(() => {
        if (route.params?.initialMessage && route.params?.agentReply) {
            const initialMessage = route.params.initialMessage;
            const agentReply = route.params.agentReply;
            setRes([
                { type: 1, message: initialMessage },
                { type: 0, message: agentReply },
            ]);
        }
    }, [route.params?.initialMessage, route.params?.agentReply]);

    useEffect(()=>{
        // alert(JSON.stringify(props?.route?.params?.ID))
    },[])
    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, "0");
        const date = now.getDate().toString().padStart(2, "0");
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        const dateTimeString = `${year}-${month}-${date} ${hours}:${minutes}`;
        return dateTimeString;
    };


    useEffect(()=>{
    },[])
    const getBookTourAPicall = async () => {
        const id = await AsyncStorage.getItem('userId');
        // const formData =new FormData ();
        // formData.append("propid",postid.post_id)
        // formData.append('schedule_hour',selectedTime)
        // formData.append('schedule_day',selectedDate)
        // formData.append('user_mobile', store.getState().loginUser.loginData.metadata.mobile[0])
        // console.log('forndata',JSON.stringify(store.getState().loginUser.loginData.metadata.mobile[0]))
      const formData  ={
        user_id:id,
        propid:postid.post_id,
        schedule_hour:selectedTime,
        schedule_day:selectedDate,
        user_mobile:  store.getState().loginUser.loginData.metadata.mobile[0]
      }
        // console.log('logodata',formData)
        dispatch(getBookTour(formData)).then((response) => {
            console.log("getBookTour response ",response)
          });
       
    //     dispatch(getBookTour(formData)).then(response => {
    //       setBookData(response);
    // console.log('booktour',response)
    
    //     });
      }
    const handleDateSelection = async (event, selectedDate) => {
        const currentDate = selectedDate || new Date();
        setSelectedDate(currentDate);
       
        setDatePickerVisible(false);
        // console.log('jfhjfjfj', selectedDate)
        setMessage(""); 
        setTimeout(() => {
           setTimePickerVisible(true)
        },300)

      
    };

    const handleTimeSelection = (event, selectedTime) => {
        const currentDate = selectedTime || new Date();
        setSelectedTime(currentDate);
        setTimePickerVisible(false)
        console.log('jfhjfjfj11', selectedTime)
        setMessage(""); 
        const updatedRes = res.map((item) => {
            if (item.type === 0) {
                return {
                    ...item,
                    message: selectedDate.toDateString() +" , "+new Date(selectedTime).getHours() +":"+new Date(selectedTime).getMinutes(),
                };
            }
            return item;
        });

        const initialReply = {
            type: 1,
            message: "A Lokal agent will confirm with you within the next 2 hours",
        };
        setRes([...updatedRes, initialReply]);
      getBookTourAPicall()

    };

    return (
     <SafeAreaView>
           <View style={{ height: "100%", position: "relative", paddingBottom: 100 }}>
            <View
                style={{
                    backgroundColor: Colors.gray,
                    height: 50,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        height: 25,
                        width: 25,
                        borderRadius: 100,
                        flexDirection: "row",
                        justifyContent: "center",
                        backgroundColor: Colors.surfblur,
                        alignItems: "center",
                        marginLeft: 10,
                    }}
                >
                    <Image
                        style={{
                            height: 10,
                            width: 10,
                            resizeMode: "contain",
                            tintColor: Colors.white,
                        }}
                        source={Images.whiteclose}
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 18,
                        fontFamily: "Poppins-Medium",
                        color: Colors.black,
                    }}
                >
                    Book A Tour
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
                    <Image
                        style={{
                            height: 25,
                            width: 25,
                            resizeMode: "contain",
                            tintColor: Colors.black,
                        }}
                        source={Images.reload}
                    />
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
                data={res}
                threshold={20}
                renderItem={({ item }) => {
                    return (
                        <View>
                            <TouchableOpacity style={{}}
                                onPress={() => {
                                    if (item.type === 0) {
                                        // Show date picker for agent's reply
                                        setDatePickerVisible(true);
                                    }
                                }}
                            >
                                <Text
                                    style={{
                                       // padding: 8,
                                        fontSize: 16,
                                        borderRadius: 16,
                                        backgroundColor: item.type === 0 ? Colors.surfblur : Colors.white,
                                        alignSelf: item.type === 0 ? "flex-end" : "flex-start",
                                     textAlignVertical:item ===0 ?'center': res[1]?.message?.props?.source ? null : 'center',
                                        alignItems:'center',
                                        justifyContent:'center',
                                        alignContent:item.type===0 ? 'center'  : 'center',
                                        maxWidth: "70%",
                                        marginLeft: 8,
                                        marginRight: 8,
                                        paddingHorizontal:8,
                                        minHeight:50,
                                        color: item.type === 0 ? Colors.white : Colors.black,
                                    }}
                                >
                                    {item.message}
                                </Text>
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: 12,
                                    marginLeft: item.type === 0 ? 8 : 16,
                                    marginRight: item.type === 0 ? 16 : 8,
                                    // marginBottom: 8,
                                    alignSelf: item.type === 0 ? "flex-end" : "flex-start",
                                    color: Colors.gray,
                                }}
                            >
                                {item.date}
                            </Text>
                        </View>
                    );
                }}
            />

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
                {loading && (
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
                            marginTop:0,
                            color: Colors.white,
                        }}
                    >
                        {message}
                    </Text>
                )}
          
                {loading && (
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
                        style={{ width: "90%", backgroundColor: Colors.white, color: Colors.black }}
                        placeholder="Type here ....."
                        placeholderTextColor={Colors.textColorLight}
                        fontFamily="Poppins-Regular"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setLoading(true);
                            dispatch(bookChat({ message: "i want to know somthink about site" }))
                                .then((ress) => {
                                    setLoading(false);

                                    const newTodo1 = {
                                        type: 0,
                                        message: message,
                                        date: getCurrentDateTime(),
                                    };
                                    const newTodo = {
                                        type: 1,
                                        message: ress.payload.data.text,
                                        date: getCurrentDateTime(),
                                    };
                                    setMessage("");
                                    setRes([...res, newTodo1, newTodo]);
                                })
                                .catch((e) => {
                                    alert("Error ==> " + JSON.stringify(e));
                                });
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
                </View>
            </View>

            {isDatePickerVisible && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateSelection}
                />
            )}
            
            {isTimePickerVisible && (
                <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={handleTimeSelection}
                />
            )}
        </View>
     </SafeAreaView>
    );
};

export default BookaTour;