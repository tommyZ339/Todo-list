import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useAsyncResult} from "../utils/hooks";
import {getColorSetting} from "../utils/asyncStorageHandler";

export default function AddButtonSubEventPage(props) {
	const colorSetting = props.colorSetting
	return (
		<TouchableOpacity style={[styles.press, colorSetting && styles.easyPress]} onPress={props.onPress}>
			<Text style={styles.texts}>{props.prompt}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	press: {
		alignSelf: 'center',
		justifyContent: 'center',
		backgroundColor: '#FFB11B',
		width: Dimensions.get('screen').width / 7,
		height: 25,
		borderRadius: 10
	},

	easyPress: {
		backgroundColor: 'black'
	},

	texts: {
		fontFamily: 'ZCOOL',
		textAlign: 'center',
		fontSize: 20,
		color: 'white',
	}
});
