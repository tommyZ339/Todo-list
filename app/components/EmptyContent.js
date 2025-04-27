import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { screenHeight, screenWidth } from '../stores/Dimensions';

let height = screenHeight;

function EmptyContent(props) {
  height = props.height;

  return (
    <View style={styles.content}>
      {props.showImage && <Image
        style={styles.image}
        source={require('../assets/imgs/ticktick.jpg')}
      />}
      <Text style={styles.paragraph}>
        {props.content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    height: height / 1.4,
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  paragraph: {
    marginVertical: 10,
    textAlign: 'center',
    color: '#cccccc',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'ZCOOL'
  },
  image: {
    flex: 1,
    width: screenWidth,
    opacity: 0.7,
    resizeMode: 'contain'
  }
});

export default EmptyContent;
