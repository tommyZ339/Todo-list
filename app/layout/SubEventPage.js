import {HStack, ScrollView, TextArea, View} from 'native-base';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {getEventVersion} from '../stores/EventVersionMap';
import {screenHeight, screenWidth} from '../stores/Dimensions';
import Memo from '../components/Memo';
import {
	completeEvent,
	deleteEvent,
	EventList,
	fetchAllData, getColorSetting,
	MemoList
} from '../utils/asyncStorageHandler';
import {useAsyncResult, useAsyncResultWithDeps} from '../utils/hooks';
import Event from '../components/Event';
import AddButtonSubEventPage from '../components/AddButtonSubEventPage';
import UnfinishedMemo from '../components/UnfinishedMemo';
import {useState} from 'react';
import Header from '../components/Header';

export default function SubEventScreen({navigation, route}) {
	const {father, colorSetting, langSetting} = route.params;
	const [changeCount, setChangeCount] = useState(0);
	const subEvents = useAsyncResultWithDeps(() => EventList.getEventsByDDL(father), [], ['ddl', changeCount]);
	const subMemos = useAsyncResultWithDeps(() => MemoList.getMemos(father), [[], []], [changeCount]);


	const res = useAsyncResultWithDeps(fetchAllData, [[], []], [changeCount]);
	const fatherSon = res[1];

	const fatherTitle = useAsyncResult(() => EventList.getEventAttribute(father, 'title'), []);
	const fatherNote = useAsyncResult(() => EventList.getEventAttribute(father, 'note'), []);

	const handleGoBack = () => {
		navigation.goBack();
	};

	const handleComplete = async (id) => {
		await completeEvent(id, fatherSon);
		setChangeCount(changeCount + 1);
	};

	const handleDelete = async (id) => {
		await deleteEvent(id, fatherSon);
		setChangeCount(changeCount + 1);
	};

	const hasNote = fatherNote !== '' && fatherNote !== undefined;

	return (
		<>
			<Header name={fatherTitle} onPress={handleGoBack}/>
			<View style={styles.main}>
				{(fatherNote !== '' && fatherNote !== undefined) &&
					<View style={[styles.noteContainer, styles.mainContainer]}>
						<ScrollView contentContainerStyle={{padding: 10}}>
							<Text style={{fontFamily: 'ZCOOL', fontSize: 18}}>{fatherNote}</Text>
						</ScrollView>
					</View>
				}
				{makeTitle(fatherTitle, langSetting ? 'Events' : '事项', navigation, father, langSetting, colorSetting)}
				<View
					style={[styles.eventsContainer, colorSetting && styles.easyBackground, styles.mainContainer, {height: hasNote ? screenHeight / 4.5 : screenHeight / 3.2}]}>
					<ScrollView>
						{subEvents.map((event, id) => {
							const key = id + '-' + getEventVersion(id);
							return <Event key={key}
														event={event}
														sub={true}
														fatherSon={fatherSon}
														colorSetting={colorSetting}
														langSetting={langSetting}
														onComplete={handleComplete}
														onDelete={handleDelete}/>;
						})}
					</ScrollView>
				</View>

				{makeTitle(fatherTitle, langSetting ? 'Memos' : '速记', navigation, father, langSetting, colorSetting)}
				<View style={[styles.memosContainer, colorSetting && styles.easyBackground, styles.mainContainer]}>
					<ScrollView>
						{subMemos.map((memo, id) => {
							const key = id + '-' + getEventVersion(id);
							return <UnfinishedMemo key={key} data={memo} sub={true} colorSetting={colorSetting}
																		 langSetting={langSetting}
																		 onComplete={handleComplete}/>;
						})}
					</ScrollView>
				</View>

				<TouchableOpacity style={[styles.goBackButton, colorSetting && styles.easyGoBack]} onPress={() => {
					navigation.push('deepFocus', {memos: subMemos, title: fatherTitle, langSetting: langSetting});
				}}>
					<Text style={styles.texts}>{langSetting ? 'Start Deep Focus' : '进入深度专注'}</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}

const makeTitle = (fatherName, type, navigation, fatherId, langSetting, colorSetting) => {
	return <HStack space={2} justifyContent={'space-evenly'}>
		<Text style={styles.title}>
			{(langSetting ? '' : '其中的') + type}
		</Text>
		<AddButtonSubEventPage colorSetting={colorSetting} prompt={'+'} onPress={() => {
			navigation.push(type === 'Events' || type === '事项' ? 'addEvent' : 'addMemo', {
				father: fatherId,
				type: 1,
				colorSetting: colorSetting,
				langSetting: langSetting
			}); // type=1表示是从subevent里来的，type=2表示是从memopage来的
		}}/>
	</HStack>;
};

const styles = StyleSheet.create({
	main: {
		flex: 1
	},

	mainContainer: {
		alignSelf: 'center',
		alignItems: 'center',
		width: screenWidth / 1.16,
		borderRadius: 13,
	},

	noteContainer: {
		marginTop: 10,
		height: screenHeight / 13.8,
		backgroundColor: '#f5eaff',
	},

	eventsContainer: {
		backgroundColor: '#fff6e1',
	},

	easyBackground: {
		backgroundColor: 'white',
		borderWidth: 2,
		borderStyle: 'solid'
	},

	memosContainer: {
		height: screenHeight / 2.7,
		backgroundColor: '#ffffb2',
	},

	title: {
		margin: 10,
		marginRight: 40,
		fontWeight: 'bold',
		fontFamily: 'ZCOOL',
		fontSize: 22,
	},

	titleFather: {
		color: 'blue',
	},

	goBackButton: {
		position: 'absolute',
		bottom: 0,
		flex: 1,
		alignSelf: 'center',
		backgroundColor: '#82877c',
		width: Dimensions.get('screen').width,
		height: 60,
		borderRadius: 10,
	},

	easyGoBack: {
		backgroundColor: '#000000cc'
	},

	texts: {
		textAlign: 'center',
		paddingTop: 10,
		fontSize: 23,
		color: 'white',
		fontFamily: 'ZCOOL',
	}
});
