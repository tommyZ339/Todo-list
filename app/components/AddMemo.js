import {StyleSheet, Text, TextInput, ScrollView, View} from 'react-native';
import React from 'react';
import {screenHeight, screenWidth} from '../stores/Dimensions';
import {
	Stack,
	Button,
	AlertDialog, HStack
} from 'native-base';
import {getColorSetting, MemoList} from '../utils/asyncStorageHandler';
import Header from './Header';
import {EditPageStyles} from '../utils/EditPageStyles';
import {useAsyncResult} from "../utils/hooks";

function AddMemo({navigation, route}) {
	const [text, onChangeText] = React.useState('');
	const [show, setShow] = React.useState(false);
	const [showInvalid, setShowInvalid] = React.useState(false);
	const onClose = () => {
		setShow(false);
		setShowInvalid(false);
	};
	const cancelRef = React.useRef(null);
	const handleGoBack = () => {
		navigation.goBack();
	};
	const {colorSetting, langSetting} = route.params

	return (
		<>
			<Header name={langSetting ? 'Memo Making' : '添加速记'} onPress={handleGoBack}/>
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: 'white'}}>
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
							<Button width={route.params['type'] === 1 ? screenWidth / 6 : screenWidth / 3.3} size='lg'
											variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'}
											onPress={async () => {
												if (text === '' || text === undefined) {
													setShowInvalid(true);
													setTimeout(() => {
														setShowInvalid(false);
													}, 1500);
													return;
												}
												await MemoList.add(text, route.params['father']);
												setShow(true);
												setTimeout(() => {
													setShow(false);
													navigation.goBack();
												}, 1000);
											}}>
								{langSetting ? 'OK' : '确定'}
							</Button>

							<Button width={route.params['type'] === 1 ? screenWidth / 6 : screenWidth / 3.3} size='lg'
											variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'}
											onPress={() => {
												navigation.goBack();
											}}>
								{langSetting ? 'Cancel' : '取消'}
							</Button>
							{route.params['type'] === 1 &&
								<Button size='lg' variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'} onPress={() => { //记得传入fatherId
									navigation.navigate('moveMemo', {
										fatherId: route.params['father'],
										colorSetting: colorSetting,
										langSetting: langSetting
									});
								}}>
									{langSetting ? 'Move from Memos' : '从Memos转入'}
								</Button>}
						</HStack>
					</View>

					<AlertDialog leastDestructiveRef={cancelRef} isOpen={showInvalid} onClose={onClose}>
						<AlertDialog.Content>
							<AlertDialog.Header>{langSetting ? 'Error' : '错误'}</AlertDialog.Header>
							<AlertDialog.Body>
								{langSetting ? 'Empty content?' : '不可添加空内容！'}
							</AlertDialog.Body>
						</AlertDialog.Content>
					</AlertDialog>

					<AlertDialog leastDestructiveRef={cancelRef} isOpen={show} onClose={onClose}>
						<AlertDialog.Content>
							<AlertDialog.Header>{langSetting ? 'Confirm' : '确定'}</AlertDialog.Header>
							<AlertDialog.Body>
								{langSetting ? 'Success!' : '添加成功！'}
							</AlertDialog.Body>
						</AlertDialog.Content>
					</AlertDialog>
				</ScrollView>
			</View>
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
});

export default AddMemo;
