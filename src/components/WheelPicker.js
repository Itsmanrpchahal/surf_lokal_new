import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Picker } from 'react-native-wheel-pick';

const WheelPicker = () => {
  return (
    <View>
      <Text>WheelPicker</Text>
      <Picker
  style={{ backgroundColor: 'white', width: 300, height: 215 }}
  selectedValue='item4'
  pickerData={['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7']}
  onValueChange={value => { console.log(value) }}
/>
    </View>
  )
}

export default WheelPicker

const styles = StyleSheet.create({})