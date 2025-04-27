import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAsyncResultWithDeps} from '../utils/hooks';
import {getMemoVersion} from '../stores/MemoVersionMap';
import {MemoList} from '../utils/asyncStorageHandler';
import {AlertDialog, Button, Text} from 'native-base';
import React, {useState} from 'react';
import FinishedItem from '../components/FinishedItem';
import Header from '../components/Header';
import {screenWidth} from '../stores/Dimensions';
import EmptyContent from '../components/EmptyContent';


function FinishedMemosScreen({route}) {
	const [deleteCount, setDeleteCount] = useState(0);
	const memosAndKeys = useAsyncResultWithDeps(MemoList.getCompleteMemos, [[], []], [deleteCount]);
	const memos = memosAndKeys[0];
	const keys = memosAndKeys[1];
	const navi = useNavigation();
	const colorSetting = route.params.colorSetting
	const langSetting = route.params.langSetting

	const handleGoBack = () => {
		navi.goBack();
	};

	const handleDeleteTask = async (id) => {
		await MemoList.deleteMemo(id);
		setDeleteCount(deleteCount + 1);
	};


	const [showClear, setShowClear] = React.useState(false);
	const cancelRef = React.useRef(null);
	const onClose = () => {
		setShowClear(false);
	};

	return (
		<>
			<Header name={langSetting ? 'Finished Memos' : '已完成的速记'} onPress={handleGoBack}/>
			<View style={styles.container}>
				<ScrollView>
					{memos.length === 0 ?
						<EmptyContent content={langSetting ? 'No finished memos' : '没有完成项'}/> : memos.map((memo) => {
							const key = memo.id + '-' + getMemoVersion(memo.id);
							return <FinishedItem key={key}
																	 type={'m'}
																	 data={memo}
																	 colorSetting={colorSetting}
																	 langSetting={langSetting}
																	 onDelete={handleDeleteTask}/>;
						})}
				</ScrollView>
			</View>

			<Button
				style={[styles.press, colorSetting && styles.easyPress]}
				size='lg'
				onPress={() => {
					setShowClear(true);
				}}
			>
				<Text style={styles.texts}>{langSetting ? 'Clear' : '清空'}</Text>
			</Button>

			<AlertDialog leastDestructiveRef={cancelRef} isOpen={showClear} onClose={() => {
				onClose();
			}}>
				<AlertDialog.Content>
					<AlertDialog.CloseButton onPress={() => {
						onClose();
					}}/>
					<AlertDialog.Header>{langSetting ? 'Confirm' : '清空'}</AlertDialog.Header>
					<AlertDialog.Body>
						{langSetting ? 'Sure you want to clear all of them?' : '你确定要清空已完成的事务吗？'}
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button variant='unstyled' colorScheme='coolGray' onPress={() => {
								onClose();
							}} ref={cancelRef}>
								{langSetting ? 'Cancel' : '取消'}
							</Button>
							<Button colorScheme='danger' onPress={async () => {
								await MemoList.clearFinishMemos(keys);
								onClose();
								navi.goBack();
							}}>
								{langSetting ? 'Yes' : '确定'}
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
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
	press: {
		position: 'absolute',
		bottom: 50,
		flex: 1,
		alignSelf: 'center',
		backgroundColor: '#660907',
		width: screenWidth / 3,
		height: 60,
		borderRadius: 10
	},

	easyPress: {
		backgroundColor: '#000000ac',
		borderWidth: 2,
		borderStyle: 'solid'
	},

	texts: {
		textAlign: 'center',
		textAlignVertical: 'center',
		fontSize: 20,
		color: 'white'
	}
});


/*
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={showDelete} onClose={() => {
                onClose(2)
            }}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton onPress={() => {
                        onClose(2)
                    }}/>
                    <AlertDialog.Header>删除</AlertDialog.Header>
                    <AlertDialog.Body>
                        你确定要删除吗？
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2}>
                            <Button variant="unstyled" colorScheme="coolGray" onPress={() => {
                                onClose(2)
                            }} ref={cancelRef}>
                                取消
                            </Button>
                            <Button colorScheme="danger" onPress={async () => {
                                await MemoList.deleteMemo(itemId);
                                onClose(2)
                                navigation.goBack()
                            }}>
                                确认
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
            */
export {FinishedMemosScreen};
