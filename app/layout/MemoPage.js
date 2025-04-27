import {ScrollView, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAsyncResult, useAsyncResultWithDeps} from '../utils/hooks';
import {getMemoVersion} from '../stores/MemoVersionMap';
import AddButtonMainPage from '../components/AddButtonMainPage';
import {getColorSetting, getEnglishSetting, MemoList} from '../utils/asyncStorageHandler';
import EmptyContent from '../components/EmptyContent';
import UnfinishedMemo from '../components/UnfinishedMemo';
import {useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {screenHeight} from '../stores/Dimensions';
import Header from '../components/Header';


function MemoPage() {
	const [completeCount, setCompleteCount] = useState(0);
	const memosAndKeys = useAsyncResultWithDeps(MemoList.getUnfinishedMemos, [[], []], [completeCount]);
	const memos = memosAndKeys[0];
	const navi = useNavigation();
	const handleComplete = async (id) => {
		await MemoList.completeMemo(id);
		setCompleteCount(completeCount + 1);
	};
	const colorSetting = useAsyncResult(getColorSetting, false)
	const langSetting = useAsyncResult(getEnglishSetting, false)
	// AsyncStorage.clear();
	// console.log('AsyncStorage Cleared!!!');

	return (
		<>
			<Header name={langSetting ? 'Memos' : '速记'} homepage/>
			{
				memos.length === 0 ?
					<EmptyContent content={langSetting ? 'Click \'+\' to make a memo!' : '点击加号创建一个速记吧！'} height={screenHeight}
												showImage={true}/> :
					<ScrollView
						contentContainerStyle={styles.container}>
						{memos.map((memo) => {
							const key = memo.id + '-' + getMemoVersion(memo.id);
							return <UnfinishedMemo key={key}
																		 data={memo}
																		 colorSetting={colorSetting}
																		 langSetting={langSetting}
																		 onComplete={handleComplete}/>;
						})}
					</ScrollView>
			}
			<AddButtonMainPage onPress={() => {
				navi.navigate('addMemo', {father: '0', colorSetting: colorSetting, langSetting: langSetting});
			}}/>
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

export {MemoPage};
