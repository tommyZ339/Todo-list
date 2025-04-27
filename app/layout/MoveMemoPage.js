import {useAsyncResult, useAsyncResultWithDeps} from '../utils/hooks';
import {getColorSetting, MemoList, moveMemos} from '../utils/asyncStorageHandler';
import {AlertDialog, Button, HStack, ScrollView, Stack} from 'native-base';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {getMemoVersion} from '../stores/MemoVersionMap';
import UnfinishedMemo from '../components/UnfinishedMemo';
import AddButtonMainPage from '../components/AddButtonMainPage';
import {StyleSheet, View} from 'react-native';
import Header from '../components/Header';
import CheckBoxMemo from '../components/CheckboxMemo';
import {useRef, useState} from 'react';
import EmptyContent from '../components/EmptyContent';
import {screenHeight, screenWidth} from '../stores/Dimensions';


function MoveMemoPageScreen({navigation, route}) {
	const memosAndKeys = useAsyncResult(MemoList.getUnfinishedMemos, [[], []]);
	const memos = memosAndKeys[0];
	const toAddId = new Set();
	const [show, setShow] = useState(false);
	const onClose = () => setShow(false);
	const cancelRef = useRef(null);
	const fatherId = route.params['fatherId'];
	const colorSetting = route.params.colorSetting
	const langSetting = route.params.langSetting

	const handleAdd = (id) => {
		toAddId.add(id);
	};

	const handleDelete = (id) => {
		toAddId.delete(id);
	};

	const handleGoBack = () => {
		navigation.goBack();
	};

	return (
		<>
			<Header name={langSetting ? 'Transfer Memos' : '转入速记'} onPress={handleGoBack}/>
			<ScrollView
				contentContainerStyle={styles.container}>
				{memos.length === 0 ?
					<EmptyContent content={langSetting ? 'No memo available' : '还没有可用的速记'} height={screenHeight}/> :
					memos.map((memo) => {
						const key = memo.id + '-' + getMemoVersion(memo.id);
						return <CheckBoxMemo key={key}
																 data={memo}
																 colorSetting={colorSetting}
																 langSetting={langSetting}
																 onAdd={handleAdd}
																 onDelete={handleDelete}/>;
					})}
			</ScrollView>

			<View style={{marginVertical: 20, width: screenWidth - 60, alignSelf: 'center'}}>
				<HStack justifyContent={'space-evenly'}>
					<Button width={screenWidth / 3.3} size='lg' variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'}
									onPress={async () => {
										await moveMemos(toAddId, fatherId);
										setShow(true);
										setTimeout(() => {
											setShow(false);
											navigation.navigate('subEvent', {
												father: fatherId,
												colorSetting: colorSetting,
												langSetting: langSetting
											});
										}, 1000);
									}}>
						{langSetting ? 'OK' : '确定'}
					</Button>

					<Button width={screenWidth / 3.3} size='lg' variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'}
									onPress={() => {
										navigation.goBack();
									}}>
						{langSetting ? 'Cancel' : '取消'}
					</Button>
				</HStack>
			</View>
			<AlertDialog leastDestructiveRef={cancelRef} isOpen={show} onClose={onClose}>
				<AlertDialog.Content>
					<AlertDialog.Header>{langSetting ? 'Confirm' : '确定'}</AlertDialog.Header>
					<AlertDialog.Body>
						{langSetting ? 'Transfer success!' : '转移成功！'}
					</AlertDialog.Body>
				</AlertDialog.Content>
			</AlertDialog>
		</>

	);

}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexGrow: 1,
		paddingBottom: 180,
	},
});

export {MoveMemoPageScreen};
