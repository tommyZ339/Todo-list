import {Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import convertPriority from '../utils/PriorityConvert';
import {screenWidth} from '../stores/Dimensions';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {AlertDialog, Button, HStack} from 'native-base';
import {EventList, getColorSetting, MemoList, MostDDL, MostPri, ProgressPercentile} from '../utils/asyncStorageHandler';
import {useAsyncResult} from '../utils/hooks';
import * as Progress from 'react-native-progress';

export default function Event(props) {
	const navi = useNavigation();
	const id = props.event['id'];
	const [showOpt, setShowOpt] = useState(false);
	const cancelRef = React.useRef(null);
	const mostPri = useAsyncResult(() => MostPri(id), []);
	const mostDDL = useAsyncResult(() => MostDDL(id), '');
	const progressPercentile = useAsyncResult(() => ProgressPercentile(id), 0);
	const colorSetting = props.colorSetting
	const langSetting = props.langSetting
	const onClose = () => {
		setShowOpt(false);
	};
	return (
		<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}}
										colors={colorSetting ? ['#dddddd', '#dddddd'] : makeRandomColor()}
										style={[props.sub ? [styles.touchAreaSub, styles.touchAreaMarginSub] : [styles.touchArea, styles.touchAreaMargin], colorSetting && styles.easyEvent]}>
			<TouchableOpacity
				style={styles.touchArea}
				onPress={() => {
					navi.push('subEvent', {
						father: id,
						colorSetting: props.colorSetting,
						langSetting: props.langSetting
					});
				}}
				onLongPress={() => {
					setShowOpt(true);
				}}
			>
				{makeInfo(props.event['title'], props.event['priority'], props.event['ddl'], mostPri, mostDDL, progressPercentile, langSetting)}
			</TouchableOpacity>
			<AlertDialog leastDestructiveRef={cancelRef} isOpen={showOpt} onClose={() => {
				onClose();
			}}>
				<AlertDialog.Content>
					<AlertDialog.CloseButton onPress={() => {
						onClose();
					}}/>
					<AlertDialog.Header>{langSetting ? 'Options' : '选项'}</AlertDialog.Header>
					<AlertDialog.Body>
						{langSetting ? 'Please press the buttons below as you wish' : '请按下方按键选择你想要进行的操作'}
					</AlertDialog.Body>
					<AlertDialog.Footer>
						<Button.Group space={2}>
							<Button colorScheme='success' onPress={async () => {
								await props.onComplete(id);
								onClose();
							}}>
								{langSetting ? 'Finish' : '完成'}
							</Button>
							<Button colorScheme='info' onPress={() => {
								onClose();
								navi.push('editEvent', {
									id: id,
									current: props.event,
									colorSetting: props.colorSetting,
									langSetting: props.langSetting
								});
							}}>
								{langSetting ? 'Edit' : '编辑'}
							</Button>
							<Button colorScheme='danger' onPress={async () => {
								await props.onDelete(id);
								onClose();
							}}>
								{langSetting ? 'Delete' : '删除'}
							</Button>
							<Button variant='outline' colorScheme='coolGray' onPress={() => {
								onClose();
							}} ref={cancelRef}>
								{langSetting ? 'Cancel' : '取消'}
							</Button>
						</Button.Group>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog>
		</LinearGradient>
	);
}

const colors = [
	'#0eff96',
	'#c1ff5d',
	'#fffb77',
	'#fffaaf',
	'#08d2ff',
	'#ff7cf4',
	'#ffb69d',
	'#fffb89',
	'#f8b7bb',
	'#9acbff',
	'#1effff',
	'#fffba3',
	'#ddc8ff',
];

const makeCountDown = (deadline, langSetting) => {
	if (deadline === '' || deadline === undefined) {
		return langSetting ? 'Unspecified' : '未指定';
	}


	const n = new Date().getTime();
	const t = new Date(
		deadline.substr(0, 4),
		deadline.substr(5, 2) - 1,
		deadline.substr(8, 2),
		deadline.substr(11, 2),
		deadline.substr(14, 2),
	).getTime();

	const distance = t - n;

	// Time calculations for days, hours, minutes and seconds
	const days = Math.floor(distance / (1000 * 60 * 60 * 24));
	const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

	return minutes < 0 ? (langSetting ? 'Expired' : '已过期限') :
		(days === 0 ? '' : (days.toString() + (langSetting ? 'd' : '天'))) +
		(hours === 0 ? '' : (hours.toString() + (langSetting ? 'h' : '时'))) +
		minutes.toString() + (langSetting ? 'm' : '分');
};

const makeInfo = (name, priority, deadline, mostPri, mostDDL, progress, langSetting) => {
	return <View style={styles.eventInfo}>
		<Text style={styles.eventName}>
			{name}
		</Text>
		<HStack space={2} justifyContent={'space-evenly'}>
			<View>
				<View style={{padding: 2}}>
					<Text style={{fontSize: 15}}>
						{(langSetting ? 'Countdown: ' : '倒计时：') + makeCountDown(deadline, langSetting)}
					</Text>
					<Text style={{fontSize: 15}}>
						{(langSetting ? 'Priority: ' : '优先级：') + convertPriority(priority)}
					</Text>
				</View>
			</View>
			<View style={{justifyContent: 'center', marginLeft: 1}}>
				<Progress.Circle
					color={'#202020'}
					borderWidth={0.6}
					size={36}
					progress={progress}
					showsText={true}
					textStyle={{fontSize: 10}}
				/>
			</View>
		</HStack>
		<View style={{
			backgroundColor: 'rgba(233, 233, 233, 0.55)',
			padding: 2,
			paddingHorizontal: 30,
			borderRadius: 10,
			margin: 4
		}}>
			<Text style={{fontSize: 10}}>
				{(langSetting ? 'Most important: ' : '包含的最高优先级：') + convertPriority(mostPri)}
			</Text>
			<Text style={{fontSize: 10}}>
				{(langSetting ? 'Most imminent: ' : '包含的最短倒计时：') + makeCountDown(mostDDL, langSetting)}
			</Text>
		</View>
	</View>;
};

function makeRandomColor() {
	const index = Math.floor(Math.random() * colors.length);
	let index2 = Math.floor(Math.random() * colors.length);
	const index3 = Math.floor(Math.random() * colors.length);
	while (index2 === index || index2 === index3) {
		index2 = Math.floor(Math.random() * colors.length);
	}
	return [colors[index], colors[index2], colors[index3]];
}

const styles = StyleSheet.create(
	{
		touchArea: {
			height: 120,
			width: screenWidth - 20,
			borderRadius: 10,
			alignItems: 'center',
			justifyContent: 'center',
		},

		touchAreaMargin: {
			marginTop: 8,
			marginBottom: 1
		},

		touchAreaSub: {
			height: 120,
			width: screenWidth - 80,
			borderRadius: 10,
			alignItems: 'center',
			justifyContent: 'center',
		},

		touchAreaMarginSub: {
			marginTop: 10,
		},

		eventInfo: {
			alignItems: 'center',
		},

		eventName: {
			fontSize: 22,
			fontWeight: '900'
		},

	}
);

export {makeRandomColor};
