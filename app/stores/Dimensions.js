import {Dimensions, StatusBar} from "react-native";

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;
const statusBarHeight = StatusBar.currentHeight;

export {statusBarHeight, screenHeight, screenWidth};