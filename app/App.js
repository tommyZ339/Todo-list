import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import BottomTabNavigatorArticle from './navigation/Tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditMemo from './components/EditMemo';
import AddMemo from './components/AddMemo';
import { NativeBaseProvider } from 'native-base/src/core/NativeBaseProvider';
import { useFonts } from 'expo-font';
import SubEventScreen from './layout/SubEventPage';
import AddEvent from './components/AddEvent';
import { FinishedMemosScreen } from './layout/FinishedMemoPage';
import EditEvent from './components/EditEvent';
import { MoveMemoPageScreen } from './layout/MoveMemoPage';
import { FinishedEventsScreen } from './layout/FinishedEventPage';
import { LogBox } from 'react-native';
import DeepFocusPage from './layout/DeepFocusPage';
import SettingPage from './layout/SettingPage';
import CloudSync from './layout/CloudSync';
import TakePhotoPage from './layout/TakePhotoPage';
import SyncData from './layout/SyncData';
import ChangePasswordPage from './layout/ChangePasswordPage';


const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff'
  },
};

const App = () => {
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists']);
  }, []);

  const [loaded] = useFonts({
    Coiny: require('./assets/fonts/Coiny-Regular.ttf'),
    ZCOOL: require('./assets/fonts/ZCOOL.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Screen name='bottom' component={BottomTabNavigatorArticle} options={{
            headerShown: false
          }} />
          <Stack.Screen name='edit' component={EditMemo} options={{
            headerShown: false
          }} />
          <Stack.Screen name='addMemo' component={AddMemo} options={{
            headerShown: false
          }} />
          <Stack.Screen name='subEvent' component={SubEventScreen} options={{
            headerShown: false
          }} />
          <Stack.Screen name='addEvent' component={AddEvent} options={{
            headerShown: false
          }} />
          <Stack.Screen name='editEvent' component={EditEvent} options={{
            headerShown: false
          }} />
          <Stack.Screen name='completeMemos' component={FinishedMemosScreen} options={{
            headerShown: false
          }} />
          <Stack.Screen name='completeEvents' component={FinishedEventsScreen} options={{
            headerShown: false
          }} />
          <Stack.Screen name='moveMemo' component={MoveMemoPageScreen} options={{
            headerShown: false
          }} />
          <Stack.Screen name='deepFocus' component={DeepFocusPage} options={{
            headerShown: false
          }} />
          <Stack.Screen name='setting' component={SettingPage} options={{
            headerShown: false
          }} />
          <Stack.Screen name='sync' component={CloudSync} options={{
            headerShown: false
          }} />
          <Stack.Screen name='photo' component={TakePhotoPage} options={{
            headerShown: false
          }} />
          <Stack.Screen name='syncData' component={SyncData} options={{
            headerShown: false
          }} />
          <Stack.Screen name='changePassword' component={ChangePasswordPage} options={{
            headerShown: false
          }} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
