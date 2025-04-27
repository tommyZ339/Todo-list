import Header from '../components/Header';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View } from 'native-base';
import Event from '../components/Event';
import { Text } from 'react-native';
import HomeScreen from './HomePage';

export default function SyncData({route}) {
  const langSetting = route.params.langSetting;
  const navi = useNavigation();

  return (
    <>
      <Header name={langSetting ? 'Log Out' : '登出'} onPress={() => {
        navi.navigate('纵览');
      }}/>
      <View>
        <HomeScreen demo />
      </View>
    </>

  )
}
