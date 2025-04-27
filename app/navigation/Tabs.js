import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Animated, Platform, StatusBar} from 'react-native';
import styled from 'styled-components/native';
import HomeScreen from '../layout/HomePage';
import {MemoPage} from '../layout/MemoPage';
import EventScreen from '../layout/EventPage';
import {Ionicons, Entypo} from '@expo/vector-icons';
import Header from '../components/Header';
import {useAsyncResult} from "../utils/hooks";
import {getColorSetting, getEnglishSetting} from "../utils/asyncStorageHandler";
import {Text} from "native-base";

const Tab = createBottomTabNavigator();
const statusBarHeight = StatusBar.currentHeight;

function BottomTabNavigatorArticle(props) {
	const [focusedTab, setFocusedTab] = useState(1);
	const mappable = [0, 1, 2];
	const colorSetting = useAsyncResult(getColorSetting, false)
	const langSetting = useAsyncResult(getEnglishSetting, false)

	const colors = mappable.map((item, index) => {
		return useState(index === focusedTab ? new Animated.Value(1) : new Animated.Value(0))[0];
	});

	const iconSizes = mappable.map((item, index) => {
		return useState(index === focusedTab ? new Animated.Value(30) : new Animated.Value(15))[0];
	});

	const boxSizes = mappable.map((item, index) => {
		return useState(index === focusedTab ? new Animated.Value(70) : new Animated.Value(50))[0];
	});

	const topMargins = mappable.map((item, index) => {
		return useState(index === focusedTab ? new Animated.Value(-45) : new Animated.Value(-10))[0];
	});

	useEffect(() => {
		colors.forEach((c, index) => {
			let value = focusedTab === index ? 1 : 0;
			Animated.timing(c, {
				toValue: value,
				duration: 200,
				useNativeDriver: false
			}).start();
		});
		iconSizes.forEach((s, index) => {
			let value = focusedTab === index ? 30 : 15;
			Animated.timing(s, {
				toValue: value,
				duration: 200,
				useNativeDriver: false
			}).start();
		});
		boxSizes.forEach((s, index) => {
			let value = focusedTab === index ? 80 : 50;
			Animated.timing(s, {
				toValue: value,
				duration: 200,
				useNativeDriver: false
			}).start();
		});
		topMargins.forEach((s, index) => {
			let value = focusedTab === index ? -45 : -10;
			Animated.timing(s, {
				toValue: value,
				duration: 200,
				useNativeDriver: false
			}).start();
		});
	}, [focusedTab]);

	const bgColorAnimation = (c) => c.interpolate({
		inputRange: [0, 0.3, 0.6, 1],
		outputRange: ['#bcd4ffc0', '#1d75c5', '#181934', '#0073ffc0']
	});

	const TabWrapper = styled.View`
    display: flex;
    flex: 1;
    flex-direction: row;
    align-self: stretch;
    justify-content: center;
    align-content: center;
    padding-top: 5px;
	`;

	const IconWrapper = styled(Animated.View)`
    position: relative;
    width: 70px;
    height: 70px;
    justify-content: center;
    margin-top: -10px;
    border-radius: 10px;
    border: black;
    border-width: 2px;
	`;

	const Icon = styled(Animated.Text)`
    padding: 15px;
    text-align: center;
    color: ${props => props.color};
    font-style: ${props => props.font};
    justify-content: center;
    align-content: center;
	`;

	const pages = [
		{
			comp: MemoPage,
			title: 'Memos',
			icon: 'unread'
		},
		{
			comp: HomeScreen,
			title: '纵览',
			icon: 'text-document-inverted'
		},
		{
			comp: EventScreen,
			title: 'Events',
			icon: 'popup'
		},
	];
	return <Tab.Navigator
		initialRouteName='纵览'
		screenOptions={{
			tabBarActiveTintColor: colorSetting ? 'black' : '#4A225D',
			tabBarInactiveTintColor: 'white',
			tabBarLabelStyle: {
				fontFamily: 'ZCOOL',
				fontSize: 16,
			},
			tabBarStyle: {
				position: 'absolute',
				elevation: 0,
				backgroundColor: colorSetting ? '#dddddd' : '#f2d2d2',
				borderRadius: 15,
				height: Platform.OS === 'ios' ? 90 : 60,
			},
		}}>
		{pages.map((page, index) => (
			<Tab.Screen key={'tab-' + index} name={page.title}
									component={page.comp}
									options={{
										tabBarLabel: getTitleNameOfPage(page.title, langSetting),
										headerShown: false,
										tabBarIcon: ({focused}) => <TabWrapper>
											<Entypo name={page.icon}
															size={35}
															color={focused ? (colorSetting ? 'black' : '#4A225D') : 'white'}/>
										</TabWrapper>
									}}
									listeners={{
										tabPress: () => {
											setFocusedTab(index);
											setTimeout(() => {
												setFocusedTab(-1);
											}, 300);
										},
									}}>
			</Tab.Screen>)
		)}
	</Tab.Navigator>;

}

const getTitleNameOfPage = (title, langSetting) => {
	switch (title) {
		case 'Memos':
			return langSetting ? 'Memos' : '速记'
		case '纵览':
			return langSetting ? 'Overview' : '纵览'
		case 'Events':
			return langSetting ? 'Events' : '事项'
		default:
			return ''
	}
}

export default BottomTabNavigatorArticle;
