import {ScrollView, StyleSheet, View} from 'react-native';
import Event from '../components/Event';
import {useAsyncResult, useAsyncResultForEventSort, useAsyncResultWithDeps} from '../utils/hooks';

import {getEventVersion} from '../stores/EventVersionMap';
import {useNavigation} from '@react-navigation/native';
import AddButtonMainPage from '../components/AddButtonMainPage';
import {Button, HStack, Text} from 'native-base';
import {
	completeEvent,
	deleteEvent,
	EventList,
	fetchAllData,
	getColorSetting, getEnglishSetting,
	MemoList
} from '../utils/asyncStorageHandler';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {useEffect, useMemo, useState} from 'react';
import EmptyContent from '../components/EmptyContent';
import {screenHeight} from '../stores/Dimensions';
import Header from '../components/Header';
import GenFromImageButton from '../components/GenFromImageButton';

export default function EventPage() {
	const [changeCount, setChangeCount] = useState(0);
	const [orderType, setOrderType] = useState('ddl');
	const getFn = orderType === 'ddl' ? () => EventList.getEventsByDDL('1') : () => EventList.getEventsByPri('1');
	const eventSrcs = useAsyncResultWithDeps(getFn, [], [orderType, changeCount]);
	const res = useAsyncResultWithDeps(fetchAllData, [[], []], [changeCount]);
	const fatherSon = res[1];

	const colorSetting = useAsyncResult(getColorSetting, false)
	const langSetting = useAsyncResult(getEnglishSetting, false)

	const handleComplete = async (id) => {
		await completeEvent(id, fatherSon);
		setChangeCount(changeCount + 1);
	};


	const handleDelete = async (id) => {
		await deleteEvent(id, fatherSon);
		setChangeCount(changeCount + 1);
	};

	const navi = useNavigation();

	return (
		<>
			<Header name={langSetting ? 'Events' : '事项'} homepage/>
			<View style={{flexGrow: 1}}>
				{eventSrcs.length !== 0 &&
					<HStack space={2} style={{justifyContent: 'space-evenly', marginVertical: 10}}>
						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<Text style={{fontFamily: 'ZCOOL', fontSize: 17}}>{langSetting ? 'Sort by deadline' : '按截止期递归排序'} </Text>
							<BouncyCheckbox size={25}
															isChecked={orderType === 'ddl'}
															onPress={() => setOrderType('ddl')}
															fillColor='red'
															unfillColor='#FFFFFF'
															disableText={true}
															disableBuiltInState
															iconStyle={{borderColor: 'blue'}}/>
						</View>

						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<BouncyCheckbox size={25}
															isChecked={orderType === 'priority'}
															onPress={() => setOrderType('priority')}
															fillColor='blue'
															unfillColor='#FFFFFF'
															disableText={true}
															disableBuiltInState
															iconStyle={{borderColor: 'red'}}/>
							<Text style={{fontFamily: 'ZCOOL', fontSize: 17}}> {langSetting ? 'Sort by priority' : '按优先期递归排序'}</Text>
						</View>
					</HStack>
				}

				{
					eventSrcs.length === 0 ?
						<EmptyContent content={langSetting ? 'Click \'+\' to make an event!' : '点击加号创建一个事项吧！'}
													height={screenHeight} showImage={true}/> :
						<ScrollView
							contentContainerStyle={styles.home}>
							{eventSrcs.map((event) => {
								const key = event.id + '-' + getEventVersion(event.id);
								return <Event
									key={key}
									event={event}
									colorSetting={colorSetting}
									langSetting={langSetting}
									onComplete={handleComplete}
									onDelete={handleDelete}/>;
							})}
						</ScrollView>
				}
			</View>
			<AddButtonMainPage onPress={() => {
				navi.navigate('addEvent', {father: '1', colorSetting: colorSetting, langSetting: langSetting});
			}}/>
			<GenFromImageButton colorSetting={colorSetting} onPress={() => {
				navi.push('photo');
			}}/>
		</>
	);
}
const styles = StyleSheet.create({
	home: {
		alignItems: 'center',
		justifyContent: 'space-evenly',
		paddingBottom: 120
	},
});
