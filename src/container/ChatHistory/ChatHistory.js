import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, SafeAreaView, StyleSheet } from 'react-native'
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
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        width: '100%',
                        position: 'relative',
                        // height: 45,
                        alignItems: 'center',
                        paddingVertical: 12,
                        borderBottomColor: Colors.gray,
                        borderBottomWidth: 1,
                        paddingTop: 16,
                        marginBottom: 16,
                        backgroundColor: Colors.white
                    }}>
              <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            position: 'absolute',
            left: 12,
            justifyContent: 'center',
            // top: 12,
            top: 13
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              width:27,
              height: 27,
              resizeMode: 'contain',
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              resizeMode:"contain",
              tintColor:"#8B8787"
            }}
            source={Images.leftnewarrow}></Image>
     
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: Colors.black,
              fontFamily: 'Poppins-Light',
              lineHeight: 22,
            }}>
         Chat History
          </Text>
     
        </View>
        <TouchableOpacity
          style={{
            position:"absolute",
    right:10,
    top:15
          }}

          onPress={() => navigation.goBack()}>

          <Image
            source={Images.menu}
            style={styles.imagedata}
            animation="flipInY"
          />
        </TouchableOpacity>
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

                                            <Text numberOfLines={1} style={{ color: Colors.black, fontFamily: item.item.Is_read === '0' ? 'Poppins-Medium' : 'Poppins-Medium', textTransform: 'capitalize', fontSize: 16, lineHeight: 18 }}>{item?.item?.post_title}</Text>
                                            <Text style={{ color: Colors.black, fontFamily: item.item.Is_read === '0' ? 'Poppins-Bold' : 'Poppins-SemiBold', textTransform: 'capitalize', fontSize: 15, lineHeight: 18 }}>${item?.item?.property_price}</Text>
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
        height:19,
        width: 29,
        resizeMode: 'contain',
       
      },
});


