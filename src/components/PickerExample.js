import { StyleSheet, Text, View } from 'react-native'
import React,{useState} from 'react'
import {Picker} from '@react-native-picker/picker';

const PickerExample = () => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  return (
    <View>
      <Text>PickerExample</Text>
      <Picker
  selectedValue={selectedLanguage}
  onValueChange={(itemValue, itemIndex) =>
    setSelectedLanguage(itemValue)
  }>
  <Picker.Item label="Java" value="java" />
  <Picker.Item label="JavaScript" value="js" />
   </Picker>
    </View>
  )
}

export default PickerExample

const styles = StyleSheet.create({})