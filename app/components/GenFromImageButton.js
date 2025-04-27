import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {screenWidth} from '../stores/Dimensions';
import {Entypo} from '@expo/vector-icons';

export default function GenFromImageButton(props) {
  return (
    <TouchableOpacity style={[styles.press, props.colorSetting && styles.easyPress]} onPress={props.onPress}>
      <Entypo name={'camera'} size={20} style={styles.icon}/>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  press: {
    position: 'absolute',
    bottom: 110,
    right: 35,
    backgroundColor: '#ffce2a',
    width: screenWidth / 7,
    height: screenWidth / 7,
    borderRadius: screenWidth / 14,
    justifyContent: 'center',
  },

  easyPress: {
    backgroundColor: 'white',
    borderStyle: 'dotted',
    borderWidth: 1.5
  },

  icon: {
    alignSelf: 'center',
  }
});
