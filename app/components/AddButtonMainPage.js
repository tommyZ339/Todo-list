import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useAsyncResult} from "../utils/hooks";
import {getColorSetting} from "../utils/asyncStorageHandler";

export default function AddButtonMainPage(props) {
	const colorSetting = useAsyncResult(getColorSetting, false)
	return (
		<TouchableOpacity style={[styles.press, colorSetting && styles.easyColor]} onPress={props.onPress}>
			<Text style={styles.texts}>+</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	press: {
		position: 'absolute',
		bottom: 100,
		alignSelf: 'center',
		backgroundColor: '#4A225D',
		width: Dimensions.get('screen').width / 3,
		height: 30,
		borderRadius: 10
	},

	texts: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 20,
		color: 'white'
	},

	easyColor: {
		backgroundColor: 'black'
	}
});
