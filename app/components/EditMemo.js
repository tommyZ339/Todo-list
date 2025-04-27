import React from 'react';
import {View, TextInput, StyleSheet, Text, ScrollView} from 'react-native';
import {AlertDialog, Button, Divider, HStack, Stack} from 'native-base';
import {updateVersion} from '../stores/MemoVersionMap';
import {screenWidth, screenHeight} from '../stores/Dimensions';
import {MemoList} from '../utils/asyncStorageHandler';
import Header from './Header';
import {EditPageStyles} from '../utils/EditPageStyles';


function EditMemo({navigation, route}) {
	const {itemId, content, colorSetting, langSetting} = route.params;
	const [text, onChangeText] = React.useState(content);
	const [showFix, setShowFix] = React.useState(false);
	const [showDelete, setShowDelete] = React.useState(false);
	const [showComplete, setShowComplete] = React.useState(false);
	const cancelRef = React.useRef(null);

	const [show, setShow] = React.useState(false);
	const [showInvalid, setShowInvalid] = React.useState(false);

	const handleGoBack = () => {
		navigation.goBack();
	};

	const onClose = (t) => {
		setShow(false);
		setShowInvalid(false);
		switch (t) {
			case 1:
				setShowFix(false);
				break;
			case 2:
				setShowDelete(false);
				break;
			case 3:
				setShowComplete(false);
				break;
		}
	};
	return (
		<>
			<Header name={langSetting ? 'Memo Editing' : '编辑速记'} onPress={handleGoBack}/>
			<View
				style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: 'white'}}>
				<ScrollView
					contentContainerStyle={{
						alignItems: 'center',
						justifyContent: 'space-evenly',
						backgroundColor: 'white'
					}}>
					<Text style={[EditPageStyles.formTitle, {marginLeft: 0}]}>{langSetting ? 'Content' : '内容'}</Text>
					<TextInput
						style={styles.input}
						multiline={true}
						onChangeText={onChangeText}
						value={text}
					/>
					<View style={{marginVertical: 20, width: screenWidth - 60}}>
						<HStack justifyContent={'space-evenly'}>
							<Button size='lg' variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'} onPress={async () => {
								if (text === '' || text === undefined) {
									setShowInvalid(true);
									setTimeout(() => {
										setShowInvalid(false);
									}, 1500);
									return;
								}
								await MemoList.editMemo(itemId, text);
								updateVersion(itemId);
								setShowFix(true);
								setTimeout(() => {
									setShowFix(false);
									navigation.goBack();
								}, 1000);
							}}>
								{langSetting ? 'OK' : '确定'}
							</Button>

							<Button size='lg' variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'} onPress={() => {
								setShowDelete(true);
							}}>
								{langSetting ? 'Delete' : '删除'}
							</Button>

							<Button size='lg' variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'} onPress={async () => {
								await MemoList.completeMemo(itemId);
								setShowComplete(true);
								setTimeout(() => {
									setShowComplete(false);
									navigation.goBack();
								}, 1000);
							}}>
								{langSetting ? 'Finish' : '完成该项'}
							</Button>
						</HStack>
					</View>
				</ScrollView>
			</View>

			<AlertDialog leastDestructiveRef={cancelRef} isOpen={showComplete} onClose={() => {
				onClose(3);
			}}>
				<AlertDialog.Content>
					<AlertDialog.Header>{langSetting ? 'Confirm' : '完成'}</AlertDialog.Header>
					<AlertDialog.Body>
						{langSetting ? 'Congrats!' : '事务完成，恭喜！'}
					</AlertDialog.Body>
				</AlertDialog.Content>
			</AlertDialog>

			<AlertDialog leastDestructiveRef={cancelRef} isOpen={showInvalid} onClose={onClose}>
				<AlertDialog.Content>
					<AlertDialog.Header>{langSetting ? 'Error' : '错误'}</AlertDialog.Header>
					<AlertDialog.Body>
						{langSetting ? 'Empty content?' : '不可添加空内容！'}
					</AlertDialog.Body>
				</AlertDialog.Content>
			</AlertDialog>

			<AlertDialog leastDestructiveRef={cancelRef} isOpen={showFix} onClose={() => {
				onClose(1);
			}}>
				<AlertDialog.Content>
					<AlertDialog.Header>{langSetting ? 'Confirm' : '修改'}</AlertDialog.Header>
					<AlertDialog.Body>
						{langSetting ? 'Success editing' : '修改成功！'}
					</AlertDialog.Body>
				</AlertDialog.Content>
			</AlertDialog>

			<AlertDialog leastDestructiveRef={cancelRef} isOpen={showDelete} onClose={() => {
				onClose(2);
			}}>
				<AlertDialog.Content>
					<AlertDialog.CloseButton onPress={() => {
						onClose(2);
					}}/>
					<AlertDialog.Header>{langSetting ? 'Confirm' : '删除'}</AlertDialog.Header>
					<AlertDialog.Body>
						{langSetting ? 'Sure you want to delete it?' : '你确定要删除吗？'}
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button variant='unstyled' colorScheme='coolGray' onPress={() => {
								onClose(2);
							}} ref={cancelRef}>
								{langSetting ? 'Cancel' : '取消'}
							</Button>
							<Button colorScheme='danger' onPress={async () => {
								await MemoList.deleteMemo(itemId);
								onClose(2);
								navigation.goBack();
							}}>
								{langSetting ? 'Yes' : '确认'}
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</>
	);
}


const styles = StyleSheet.create({
	input: {
		height: screenHeight / 1.8,
		width: screenWidth / 1.2,
		margin: 20,
		borderWidth: 3,
		padding: 15,
		borderRadius: 10,
		textAlignVertical: 'top',
	},
	button: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 4,
		elevation: 3,
		backgroundColor: 'skyblue',
	},
	text: {
		fontSize: 16,
		lineHeight: 21,
		fontWeight: 'bold',
		letterSpacing: 0.25,
		color: 'white',
	},
});
export default EditMemo;
