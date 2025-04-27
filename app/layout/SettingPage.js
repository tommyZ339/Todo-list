import {Text, View, StyleSheet, Switch, Image, TouchableOpacity} from 'react-native';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {Divider, HStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import {screenHeight, screenWidth} from '../stores/Dimensions';
import {getColorSetting, getEnglishSetting, updateSetting} from '../utils/asyncStorageHandler';

export default function SettingPage({route}) {
	const navi = useNavigation();

	const [colorEnabled, setColorEnabled] = useState();
	const colorSwitch = () => setColorEnabled(previousState => !previousState);

	const [englishEnabled, setEnglishEnabled] = useState();
	const englishSwitch = () => setEnglishEnabled(previousState => !previousState);

	useEffect(async () => {
		const initialColor = await getColorSetting(), initialEnglish = await getEnglishSetting();
		setColorEnabled(initialColor);
		setEnglishEnabled(initialEnglish);
	}, []);

	const {colorSetting, langSetting} = route.params
	return (
		<View>
			<Header name={langSetting ? 'Setting' : '设置'} onPress={() => {
				navi.navigate('纵览');
			}}/>
			<View style={styles.settingContainer}>
				<HStack style={styles.aSetting}>
					<Text style={styles.settingText}>
						{langSetting ? 'Simple Color Matching Interface' : '简单配色方案'}
					</Text>
					<Switch
						trackColor={{false: '#767577', true: colorSetting ? '#504f5b' : '#81b0ff'}}
						thumbColor={colorEnabled ? (colorSetting ? '#000000cc' : '#f5dd4b') : '#f4f3f4'}
						onValueChange={colorSwitch}
						value={colorEnabled}
						style={styles.switch}
					/>
				</HStack>
				<Divider/>
				<HStack style={styles.aSetting}>
					<Text style={styles.settingText}>
						{langSetting ? 'English' : '英文'}
					</Text>
					<Switch
						trackColor={{false: '#767577', true: colorSetting ? '#504f5b' : '#81b0ff'}}
						thumbColor={englishEnabled ? (colorSetting ? '#000000cc' : '#f5dd4b') : '#f4f3f4'}
						onValueChange={englishSwitch}
						value={englishEnabled}
						style={styles.switch}
					/>
				</HStack>
			</View>
			<HStack justifyContent={'space-evenly'} style={{alignItems: 'center', marginHorizontal: 20}}>
				<View style={styles.logoContainer}>
					<Image
						style={styles.logo}
						source={require('../assets/imgs/vector-logo.png')}
					/>
					<Text style={styles.versionText}>Version: 2.1.0</Text>
				</View>
				<TouchableOpacity style={[styles.confirmButton, styles.dismissButton]} onPress={() => {
					navi.navigate('纵览');
				}}>
					<Text style={styles.buttonText}>{langSetting ? 'Cancel' : '取消'}</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.confirmButton, colorSetting ? {backgroundColor: '#00000077'} : {}]}
													onPress={async () => {
														await updateSetting(colorEnabled, englishEnabled);
														navi.navigate('纵览');
													}}>
					<Text style={styles.buttonText}>{langSetting ? 'OK' : '确认'}</Text>
				</TouchableOpacity>
			</HStack>
		</View>
	);
}

const styles = StyleSheet.create({
	confirmButton: {
		backgroundColor: '#abf1f1',
		padding: 20,
		width: 90,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 15,
	},

	buttonText: {
		fontSize: 18,
	},

	dismissButton: {
		backgroundColor: '#dddddd',
	},

	settingText: {
		fontSize: 22,
		width: screenWidth / 1.5,
	},

	versionText: {
		fontSize: 10,
		color: 'grey',
	},

	logoContainer: {
		width: 100,
		height: 100,
		alignItems: 'center',
		justifyContent: 'center',
	},

	settingContainer: {
		alignItems: 'center',
		height: screenHeight - 200,
	},

	aSetting: {
		alignItems: 'center',
		marginVertical: 20,
		width: screenWidth - 60,
	},

	switch: {
		marginLeft: 10,
	},

	logo: {
		width: 70,
		height: 70,
		resizeMode: 'contain',
	},
});
