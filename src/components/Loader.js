import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';

interface Iprops {
  loading: Boolean;
}
const Loader = ({loading}: Iprops) => {
  return loading ? (
    <View style={styles.container}>
      <ActivityIndicator size={'small'} color={Colors.PrimaryColor} />
    </View>
  ) : null;
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
