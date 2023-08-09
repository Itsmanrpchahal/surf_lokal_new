import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, SafeAreaView } from 'react-native'
import Colors from "../../utils/Colors";
import Images from "../../utils/Images";


const ChatHistory = () => {
    const data = [
        {
            title: 'Title One',
            subtitle: 'Subtitle One',
            date: 'Current Date',
        },
        // Add more items as needed
    ];
    return (
        <SafeAreaView>
            <View style={{ backgroundColor: "#f5f5f5", height: "100%" }}>
                <View style={{ paddingVertical: 10, paddingHorizontal: 13, backgroundColor: Colors.white, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#c9c9c5' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center' }}>
                        <Image
                            style={{
                                width: 14,
                                height: 14,
                                resizeMode: "contain",
                                position: "absolute",
                                left: 0,
                                transform: [{ rotate: '90deg' }]


                            }}
                            source={Images.downArrow}
                        ></Image>

                        <Text style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color: Colors.black, textAlign: "center", width: "100%" }}> Chat History</Text>
                    </View>


                </View>


                <FlatList
                    data={data}
                    renderItem={(item) => {
                        return (
                            <View style={{ padding: 22, height: "100%" }}>
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row', borderBottomColor: Colors.BorderColor, borderBottomWidth: 1, marginBottom: 12, paddingBottom: 12 }}>
                                    <View style={{

                                    }}>
                                        <Text style={{ color: Colors.black, fontFamily: 'Poppins-SemiBold', textTransform: 'capitalize', fontSize: 18, lineHeight: 18 }}>{item.item.title}</Text>
                                        <Text style={{ color: Colors.black, fontFamily: 'Poppins-Medium', textTransform: 'capitalize', fontSize: 15, lineHeight: 18 }}>{item.item.subtitle}</Text>
                                        <Text style={{ color: Colors.black, fontFamily: 'Poppins-Regular', textTransform: 'capitalize', fontSize: 12 }}>{item.item.date}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
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
                                            source={Images.user}
                                        />
                                        <Image
                                            style={{
                                                width: 14,
                                                height: 14,
                                                resizeMode: 'contain',
                                                marginLeft: 12,
                                                transform: [{ rotate: '-90deg' }],
                                            }}
                                            source={Images.downArrow}
                                        />
                                    </View>
                                </View>


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