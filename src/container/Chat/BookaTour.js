import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from "react";
import Colors from "../../utils/Colors";
import Images from "../../utils/Images";
import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";
import { chat } from "../../modules/chat";
import { TypingAnimation } from 'react-native-typing-animation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Line } from 'react-native-svg';
const BookaTour = () => {
    const navigation = useNavigation();
    const [closeDate, setCloseDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const hideDatePicker = () => {
        setShowDatePicker(false);
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || closeDate;
        setShowDatePicker(false);
        setSelectedDate(currentDate);
        setCloseDate(currentDate);
    };

    return (
        <View style={{ height: "100%", position: 'relative', paddingBottom: 100, }}>
            <View style={{ backgroundColor: Colors.gray, height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewPropertiy')}
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
                    ></Image>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontFamily: 'Poppins-Medium', color: Colors.black }}>
                    Book a Tour
                </Text>
                <TouchableOpacity
                    onPress={() => { setRes([]) }}
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
                    ></Image>
                </TouchableOpacity>

            </View>
            <Text style={{
                marginLeft: 15,
                marginRight: 13, fontSize: 16, borderRadius: 16, alignSelf: 'flex-start', maxWidth: '100%', marginTop: 22, color: Colors.black, fontFamily: "Poppins-Medium",
            }}>When would you like to Schedule...</Text>
            <Text style={{

                fontSize: 16,
                borderRadius: 4,
                backgroundColor: Colors.cream,
                alignSelf: 'flex-end',
                marginLeft: 8,
                marginRight: 8,
                marginTop: 8,
                color: Colors.white,
                // borderWidth: 1,
                // borderColor: Colors.gray,
                // backgroundColor: "green",
                alignItems: "center",
                // lineHeight: 40,
            }}> <TouchableOpacity
                style={styles.datePickerContainer}
                onPress={showDatepicker}
            >
                    <Text style={styles.datePickerText}>

                        <Text style={{ fontSize: 14, }}>{selectedDate ? selectedDate.toDateString() : <Image
                            style={{
                                height: 20,
                                width: 20,
                                resizeMode: "contain",
                                tintColor: Colors.white,
                                marginTop: 12
                            }}
                            source={Images.calendar}
                        ></Image>}</Text>
                    </Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        fontFamily='Poppins-Regular'
                        is24Hour={true}
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </Text>







            <View style={{ bottom: 0, position: 'absolute', zIndex: 99, left: 0, right: 0, backgroundColor: Colors.white }}>
                {
                    <Text style={{
                        padding: 16,
                        fontSize: 16,
                        borderRadius: 16,
                        backgroundColor: Colors.surfblur,
                        alignSelf: 'flex-end',
                        maxWidth: '70%',
                        marginLeft: 8,
                        marginRight: 8,
                        marginTop: 8,
                        color: Colors.white
                    }}>Hello</Text>
                }
                <Text style={{
                    fontSize: 16,

                    marginLeft: 16,
                    color: Colors.black,
                    marginTop: 8,
                    backgroundColor: Colors.white,
                    fontFamily: 'Poppins-Regular'
                }}>Please reply on this chat box</Text>
                {
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{
                            fontSize: 12,
                            borderRadius: 16,
                            alignSelf: 'flex-start',
                            maxWidth: '70%',
                            marginLeft: 16,
                            marginTop: 6,
                            color: Colors.black,
                            backgroundColor: Colors.white,
                            fontFamily: 'Poppins-Regular'
                        }}>Typing</Text>
                        <TypingAnimation
                            dotColor="black"
                            dotMargin={3}
                            dotAmplitude={2}
                            dotSpeed={0.15}
                            dotRadius={1}
                            dotX={8}
                            dotY={0}
                            style={{ marginTop: 15, marginLeft: -3 }}
                        />
                    </View>
                }

                <View style={{
                    backgroundColor: Colors.white,
                    borderColor: Colors.BorderColor,
                    borderWidth: 1, borderRadius: 5,
                    height: 45, margin: 16,
                    paddingLeft: 8, paddingRight: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 8
                }}>
                    <TextInput
                        style={{ width: '90%', backgroundColor: Colors.white, color: Colors.black }}
                        placeholder="Type here ....."
                        placeholderTextColor={Colors.textColorLight}
                        fontFamily="Poppins-Regular">
                    </TextInput>
                    <TouchableOpacity

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
                        ></Image>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}

export default BookaTour;

const styles = StyleSheet.create({
    datePickerText: {
        fontSize: 14,
        color: Colors.white,
        fontFamily: 'Poppins-Regular',
        height: 40,
        width: "100%",
        lineHeight: 35,
        marginTop: 5,
        backgroundColor: Colors.surfblur,
        paddingHorizontal: 12, textAlign: "center", borderRadius: 8
    },
    datePickerContainer: {
        width: '100%',
        //height: 40,
        justifyContent: 'center',
        //borderColor: Colors.BorderColor,
        // borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        fontFamily: 'Poppins-Regular',
        color: Colors.white, borderRadius: 10

    },
})