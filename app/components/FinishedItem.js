import {AlertDialog, Button, Center, DeleteIcon, HStack} from 'native-base';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {screenWidth} from '../stores/Dimensions';
import React from 'react';

export default function FinishedItem(props) {
	let {id, content} = props.data;
	if (props.type === 'e')
		content = props.data.title;
	const [showDelete, setShowDelete] = React.useState(false);
	const cancelRef = React.useRef(null);
	const langSetting = props.langSetting

	return (
		<HStack space={3} justifyContent='center'>
			<TouchableOpacity
				style={styles.box}>
				<Text style={styles.text}>{content}</Text>
			</TouchableOpacity>
			<Center>
				<DeleteIcon
					size={30}
					onPress={() => {
						setShowDelete(true);
					}}/>
			</Center>
			<AlertDialog leastDestructiveRef={cancelRef} isOpen={showDelete} onClose={() => {
				setShowDelete(false);
			}}>
				<AlertDialog.Content>
					<AlertDialog.CloseButton onPress={() => {
						setShowDelete(false);
					}}/>
					<AlertDialog.Header>{langSetting ? 'Delete' : '删除'}</AlertDialog.Header>
					<AlertDialog.Body>
						{langSetting ? 'Sure you want to delete it?' : '你确定要删除吗？'}
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button variant='unstyled' colorScheme='coolGray' onPress={() => {
								setShowDelete(false);
							}} ref={cancelRef}>
								{langSetting ? 'Cancel' : '取消'}
							</Button>
							<Button colorScheme='danger' onPress={async () => {
								await props.onDelete(id);
								setShowDelete(false);
							}}>
								{langSetting ? 'Yes' : '确认'}
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</HStack>
	);


}

const styles = StyleSheet.create({
	box: {
		margin: 10,
		backgroundColor: 'silver',
		borderRadius: 15,
		width: screenWidth / 1.5,
		padding: 5,
		//alignItems: "flex-start",
	},

	closeButton: {
		margin: 10,
		padding: 5,
		width: screenWidth / 6,
	},

	text: {
		margin: 5,
		fontSize: 15,
	}
});
