import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native'
import Colors from "../../utils/Colors";
import Images from "../../utils/Images";
import { propertyChatList } from '../../modules/propertyChats'
import { useDispatch } from 'react-redux';
import { url } from "../../config/url";
import { useIsFocused } from "@react-navigation/native";

const ChatHistory = ({ navigation }) => {
    const dispatch = useDispatch();
    const [propertyChat, setPropertyChat] = useState([])
    const isFocused = useIsFocused();


    useEffect(() => {
        if (isFocused) {
            dispatch(propertyChatList()).then((res) => {
                // setPropertyChat(res?.payload?.data)
                if (res?.payload?.success) {
                    setPropertyChat(res?.payload?.data)
                } else {
                    setPropertyChat([])
                }
            }).catch((e) => {
                setPropertyChat([])
                alert('Error ' + e)
            })
        }
    }, [isFocused])

    return (
        <SafeAreaView>
            <View style={{ backgroundColor: "#f5f5f5", height: "100%" }}>
                <View style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    backgroundColor: Colors.white,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderColor: '#c9c9c5'
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: '100%' }}>
                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", position: "absolute", left: 0, justifyContent: "center", top: 3 }} onPress={() => { navigation.goBack() }}>
                            <Image
                                style={{
                                    width: 11,
                                    height: 11,
                                    resizeMode: "contain",
                                    // position: "absolute",
                                    // left: 0,
                                    marginTop: -1,
                                    transform: [{ rotate: '90deg' }]
                                }}
                                source={Images.downArrow}
                            ></Image>
                            <Text style={{
                                fontSize: 14,
                                color: Colors.black,
                                fontFamily: 'Poppins-Regular', marginLeft: 5
                            }}>Back</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color: Colors.black, textAlign: "center" }}> Chat History</Text>
                        <Text style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color: Colors.black, textAlign: "center" }}></Text>

                    </View>


                </View>

                <FlatList
                    data={propertyChat}
                    renderItem={(item) => {
                        return (
                            <View >
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('BookaTour', { ID: item?.item?.chat_id, PropID: item?.item?.ID, user_id: item?.item?.user_id, user2_id: item?.item?.user2_id })
                                }}>
                                    <View style={{
                                        width: '100%',
                                        flexDirection: 'row',
                                        borderBottomColor: Colors.BorderColor,
                                        justifyContent: 'space-between',
                                        borderBottomWidth: 1,

                                    }}>
                                        <View style={{
                                            padding: 16,
                                            maxWidth: '80%',
                                        }}>
                                            {

                                            }
                                            <Text numberOfLines={1} style={{ color: Colors.black, fontFamily: item.item.Is_read === '0' ? 'Poppins-Bold' : 'Poppins-Regular', textTransform: 'capitalize', fontSize: 16, lineHeight: 18 }}>{item?.item?.post_title}</Text>
                                            <Text style={{ color: Colors.black, fontFamily: item.item.Is_read === '0' ? 'Poppins-Bold' : 'Poppins-Medium', textTransform: 'capitalize', fontSize: 15, lineHeight: 18 }}>${item?.item?.property_price}</Text>
                                            <Text style={{ color: Colors.newgray, fontFamily: item.item.Is_read === '0' ? 'Poppins-Bold' : 'Poppins-Regular', textTransform: 'capitalize', fontSize: 12 }}>{item.item.post_date}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                style={{
                                                    height: 40,
                                                    width: 40,
                                                    resizeMode: 'contain',
                                                    borderRadius: 50,
                                                    marginRight: 5,
                                                    borderColor: Colors.surfblur,
                                                    borderWidth: 1,
                                                }}
                                                source={{ uri: item?.item?.image }}
                                            />
                                            <Image
                                                style={{
                                                    width: 14,
                                                    height: 14,
                                                    resizeMode: 'contain',
                                                    marginRight: 12,
                                                    transform: [{ rotate: '-90deg' }],
                                                }}
                                                source={Images.downArrow}
                                            />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => index.toString()}
                />

            </View >

        </SafeAreaView>
    )
}

export default ChatHistory