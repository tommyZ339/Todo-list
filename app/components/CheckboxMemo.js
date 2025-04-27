import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {HStack} from 'native-base';
import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {screenWidth} from '../stores/Dimensions';

export default function CheckBoxMemo(props) {
	const [selected, setSelected] = useState(true);
	const {id, content} = props.data;
	const colorSetting = props.colorSetting
	return (
		<HStack space={3} justifyContent='center'>
			<BouncyCheckbox size={25}
											isChecked={false}
											onPress={data => {
												setSelected(!data);
												if (selected) {
													props.onAdd(id);
												} else {
													props.onDelete(id);
												}
											}}
											fillColor={colorSetting ? 'black' : '#20bdd8'}
											unfillColor={colorSetting ? 'white' : '#d8e1edc0'}
											disableText={true}
											iconStyle={{borderColor: 'black'}}/>
			<TouchableOpacity
				style={[styles.box, colorSetting && styles.easyBox]}>
				<Text style={styles.text}>{content}</Text>
			</TouchableOpacity>
		</HStack>
	);
}

const styles = StyleSheet.create({
	box: {
		margin: 10,
		backgroundColor: '#ffffb7',
		borderRadius: 15,
		width: screenWidth / 1.5,
		padding: 5,
		//alignItems: "flex-start",
	},

	easyBox: {
		backgroundColor: '#dddddd',
	},

	text: {
		margin: 5,
		fontSize: 15,
	}
});
