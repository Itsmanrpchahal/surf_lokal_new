import {  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity, } from 'react-native'
import React from 'react'
import Images from '../../utils/Images';
import Colors from '../../utils/Colors';
import { ScrollView } from 'react-native-gesture-handler';

const HomeNew = () => {
  return (
    <View>
       <SafeAreaView style={{height:"100%",backgroundColor:"blue",width:"100%"}}>
        <ScrollView style={{flex:1,height:"100%"}}>
          <View style={{justifyContent:"center",width:"100",alignItems:"center"}}>
        <View
              style={{
                height: 40,
                width: '90%',
                borderRadius: 18,
                borderWidth: 1,
                borderColor: Colors.BorderColor,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                
                style={{
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={Images.search}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}></Image>
              </TouchableOpacity>
              <View style={styles.phoneInputView}>
                <TextInput
                  allowFontScaling={false}
                  style={styles.inputStyle}
                  placeholderTextColor={Colors.textColorLight}
                  placeholder={'Filters...'}
                  returnKeyType="done"
                  onChangeText={text => setAddres(text)}
                />
              </View>
              <TouchableOpacity
                style={{
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderLeftWidth: 1,
                  borderLeftColor: Colors.BorderColor,
                }}>
                <Image
                  source={Images.address}
                  style={{
                    height: 20,
                    width: 20,
                    resizeMode: 'contain',
                  }}></Image>
              </TouchableOpacity>
            </View>
            </View>
        </ScrollView>
       </SafeAreaView>
    </View>
  )
}

export default HomeNew;
const styles = StyleSheet.create({

});