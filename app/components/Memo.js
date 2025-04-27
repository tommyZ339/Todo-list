import {Pressable, StyleSheet, Text} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {screenWidth} from '../stores/Dimensions';
import {getColorSetting} from "../utils/asyncStorageHandler";
import {useAsyncResult} from "../utils/hooks";


export default function Memo(props) {
	const [pressColor, setPressColor] = useState(false);
	const {id, content} = props.data;
	const navi = useNavigation();
	const colorSetting = props.colorSetting
	const langSetting = props.langSetting
	return (
		<Pressable
			style={[
				props.sub ? styles.boxSub : styles.box,
				pressColor && styles.pressedBox,
				colorSetting && styles.easyColor,
			]}
			onPress={() => {
				navi.navigate('edit', {
						itemId: id,
						content: content,
						colorSetting: colorSetting,
						langSetting: langSetting
					}
				);
			}}
			onPressIn={() => setPressColor(true)}
			onPressOut={() => setPressColor(false)}
		>
			<Text style={styles.text}>{content}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	box: {
		backgroundColor: '#ffffc4',
		borderRadius: 15,
		width: screenWidth / 1.3,
		padding: 5,
		//alignItems: "flex-start",
	},

	boxSub: {
		backgroundColor: '#e4f2f6',
		borderRadius: 15,
		width: screenWidth - 110,
		padding: 5,
		paddingHorizontal: 10,
		//alignItems: "flex-start",
	},

	pressedBox: {
		backgroundColor: 'powderblue',
	},

	text: {
		margin: 5,
		fontSize: 15,
	},

	easyColor: {
		backgroundColor: '#dddddd',
	}
});
