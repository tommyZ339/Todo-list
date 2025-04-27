import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { screenHeight, screenWidth } from '../stores/Dimensions';
import { HStack } from 'native-base';
import RecognizeText from '../recognition/recongition';
import { generateEventByImage } from '../utils/asyncStorageHandler';

export default function TakePhotoPage() {
  const [hasPermission, setHasPermission] = useState(null);
  const navi = useNavigation();

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.back}>
        <HStack justifyContent={'space-evenly'} style={styles.buttonStack}>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            navi.goBack();
          }}>
            <Entypo size={25} name={'chevron-thin-left'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.takeButton} onPress={async () => {
            await generateEventByImage();
            navi.goBack();
          }} />
          <TouchableOpacity style={styles.albumButton} onPress={() => {
            navi.goBack();
          }}>
            <Entypo size={25} name={'images'} />
          </TouchableOpacity>
        </HStack>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonStack: {
    flex: 1,
    bottom: screenHeight / 30,
  },
  backButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginLeft: 20,
    borderRadius: screenWidth / 12,
    width: screenWidth / 6,
    height: screenWidth / 6,
    backgroundColor: '#20dbd8',
    opacity: 0.8,
    borderWidth: 8,
  },
  takeButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: screenWidth / 10,
    width: screenWidth / 4.5,
    height: screenWidth / 4.5,
    backgroundColor: 'red',
    opacity: 0.8,
    borderWidth: 10,
  },
  albumButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginRight: 20,
    borderRadius: screenWidth / 12,
    width: screenWidth / 6,
    height: screenWidth / 6,
    backgroundColor: '#20dbd8',
    opacity: 0.8,
    borderWidth: 8,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
