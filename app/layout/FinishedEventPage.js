import {ScrollView, StyleSheet, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAsyncResult, useAsyncResultWithDeps} from '../utils/hooks';
import {deleteData, deleteEvent, EventList, fetchAllData} from '../utils/asyncStorageHandler';
import {AlertDialog, Button, Text} from 'native-base';
import React, {useState} from 'react';
import {screenWidth} from '../stores/Dimensions';
import EmptyContent from '../components/EmptyContent';
import {getEventVersion} from '../stores/EventVersionMap';
import FinishedItem from '../components/FinishedItem';
import Header from '../components/Header';


function FinishedEventsScreen({route}) {
	const [deleteCount, setDeleteCount] = useState(0);
	const eventsAndKeys = useAsyncResultWithDeps(EventList.getCompleteEvents, [[], []], [deleteCount]);
	const events = eventsAndKeys[0];
	const keys = eventsAndKeys[1];
	const navi = useNavigation();
	const r = useAsyncResult(fetchAllData, []);
	const colorSetting = route.params.colorSetting
	const langSetting = route.params.langSetting

	const handleGoBack = () => {
		navi.goBack();
	};

	const handleDeleteTask = async (id) => {
		await deleteEvent(id, r[1]); // Pay attention here!
		setDeleteCount(deleteCount + 1);
	};

	const [showClear, setShowClear] = React.useState(false);
	const cancelRef = React.useRef(null);
	const onClose = () => {
		setShowClear(false);
	};

	return (

		<>
			<Header name={langSetting ? 'Finished Events' : '已完成的事项'} onPress={handleGoBack}/>
			<View style={styles.container}>
				<ScrollView>
					{events.length === 0 ?
						<EmptyContent content={langSetting ? 'No finished events' : '没有完成项'}/> : events.map((event) => {
							const key = event.id + '-' + getEventVersion(event.id);
							return <FinishedItem key={key}
																	 type={'e'}
																	 data={event}
																	 langSetting={langSetting}
																	 onDelete={handleDeleteTask}/>;
							// <FinishedItem key={key}
							//                      data={event}
							//                      onDelete={handleDeleteTask} />;
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
								await EventList.clearFinishEvents(keys);
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

export {FinishedEventsScreen};
