import {Dimensions, Platform, StyleSheet, Text, View} from 'react-native';
import {statusBarHeight, screenHeight, screenWidth} from '../stores/Dimensions';
import {HStack} from 'native-base';
import {Entypo} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {useAsyncResult} from "../utils/hooks";
import {getColorSetting, getEnglishSetting} from "../utils/asyncStorageHandler";

export default function Header(props) {
	const navi = useNavigation();
	const colorSetting = useAsyncResult(getColorSetting, false)
	const langSetting = useAsyncResult(getEnglishSetting, false)

	return props.deepFocus ?
		<View style={[styles.header, {backgroundColor: '#00048c'}]}>
			<HStack space={3}>
				<Entypo name={'chevron-with-circle-left'}
								color={'white'}
								size={28}
								onPress={props.onPress}
								style={styles.icon}/>
				<Text style={[styles.text, {color: 'white'}]}>
					{props.name}
				</Text>
			</HStack>
		</View> :
		<View style={[styles.header, props.homepage ? {
			alignItems: 'center',
			paddingLeft: 0
		} : {}, colorSetting && styles.easycolor,]}>
			{props.homepage ?
				<HStack space={screenWidth / 3}>
					{props.su && <Entypo name={'cog'}
															 color={'black'}
															 size={25}
															 onPress={() => {
																 navi.navigate('setting', {colorSetting: colorSetting, langSetting: langSetting});
															 }}
															 style={styles.homeIcon}/>}
					<Text style={[styles.text, {color: 'black'}]}>
						{props.name}
					</Text>
					{props.su && <Entypo name={'cloud'}
															 color={'black'}
															 size={25}
															 onPress={() => {
																 navi.navigate('sync', {colorSetting: colorSetting, langSetting: langSetting});
															 }}
															 style={styles.homeIcon}/>}
				</HStack> :
				<HStack space={3}>
					<Entypo name={'chevron-with-circle-left'}
									color={'#202020'}
									size={28}
									onPress={props.onPress}
									style={styles.icon}/>
					<Text style={styles.text}>
						{props.name}
					</Text>
				</HStack>}
		</View>;
}

const styles = StyleSheet.create({
	header: {
		height: statusBarHeight + (Platform.OS === 'ios' ? 90 : 40),
		width: screenWidth,
		backgroundColor: '#abf1f1',
		alignItems: 'flex-start',
		paddingLeft: 10,
		borderRadius: 15,
	},

	text: {
		marginTop: statusBarHeight + 8,
		fontSize: 23,
		paddingTop: Platform.OS === 'ios' ? 45 : 0,
		fontFamily: 'ZCOOL'
	},

	icon: {
		paddingLeft: 15,
		marginTop: statusBarHeight + (Platform.OS === 'ios' ? 55 : 8),
	},

	homeIcon: {
		marginTop: statusBarHeight + (Platform.OS === 'ios' ? 55 : 8),
	},

	easycolor: {
		backgroundColor: '#dddddd',
	}
});
