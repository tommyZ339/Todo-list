import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native';
import {Text, TouchableOpacity, StyleSheet, View, Platform, ScrollView} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import DatePicker from 'react-native-modern-datepicker';
import {screenWidth} from '../stores/Dimensions';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {MemoList} from '../utils/asyncStorageHandler';
import {AlertDialog, Button} from 'native-base';

export default function DeepFocusPage({navigation, route}) {
	const [setTime, setSetTime] = useState(true);
	const [focusTime, setFocusTime] = useState('');
	const [remainSec, setRemainSec] = useState(0);
	const [showOpt, setShowOpt] = useState(false);
	const [keepFocus, setKeepFocus] = useState(false);
	const [showFinishOpt, setShowFinishOpt] = useState(false);
	const [toComplete, setToComplete] = useState(new Set());
	const [memos, setMemos] = useState(route.params['memos']);
	const cancelRef = useRef(null);
	const langSetting = route.params.langSetting

	const onClose = () => {
		setShowOpt(false);
		setShowFinishOpt(false);
	};

	const handleGoBack = () => {
		if (remainSec > 0) {
			setShowOpt(true);
			return;
		}
		handleComplete();
		navigation.goBack();
	};

	const handleComplete = () => {
		toComplete.forEach(async value => {
			await MemoList.completeMemo(value);
		});
	};

	return (
		<View style={{flex: 1, backgroundColor: '#202020'}}>
			<Header name={(langSetting ? 'Deep Focus - ' : '深度专注 - ') + route.params['title']} onPress={handleGoBack}
							deepFocus={true}/>
			<View style={{flex: 1, justifyContent: 'center'}}>
				{setTime &&
					<View style={{alignItems: 'center'}}>
						<Text style={{
							fontSize: 30,
							fontFamily: 'ZCOOL',
							color: 'white'
						}}>{langSetting ? 'Set Focus Time' : '设定专注时间'}</Text>
						<DatePicker
							mode='time'
							minuteInterval={1}
							style={styles.timePicker}
							options={{
								backgroundColor: '#202020',
								textHeaderColor: '#FFA25B',
								textDefaultColor: '#F6E7C1',
								selectedTextColor: '#fff',
								mainColor: '#F4722B',
								textSecondaryColor: '#D6C7A1',
								borderColor: 'rgba(122, 146, 165, 0.1)',
							}}
							onTimeChange={selectedTime => {
								setFocusTime(selectedTime);
								setSetTime(false);
								setKeepFocus(false);
								const t = [];
								memos.forEach(item => {
									if (!toComplete.has(item['id']))
										t.push(item);
								});
								setMemos(t);
								handleComplete();
							}}
						/>
					</View>
				}

				{!setTime && <View style={{alignItems: 'center'}}>
					{MakeChange(setSetTime, langSetting)}

					{MakeTimer(focusTime, setRemainSec, setShowFinishOpt)}

					<View style={styles.memosContainer}>
						<ScrollView>
							{memos.map((item, id) => {
								return <BouncyCheckbox
									key={id}
									size={25}
									fillColor='red'
									unfillColor='#FFFFFF'
									text={item['content']}
									iconStyle={{borderColor: 'red'}}
									textStyle={{fontFamily: 'ZCOOL', fontSize: 20, marginVertical: 7}}
									onPress={(isChecked) => {
										if (isChecked) {
											setToComplete(toComplete.add(item['id']));
										} else {
											toComplete.delete(item['id']);
											setToComplete(toComplete);
										}
									}}
								/>;
							})}
						</ScrollView>
					</View>

				</View>}

				<AlertDialog leastDestructiveRef={cancelRef} isOpen={showOpt} onClose={() => {
					onClose();
				}}>
					<AlertDialog.Content>
						<AlertDialog.CloseButton onPress={() => {
							onClose();
						}}/>
						<AlertDialog.Header>{langSetting ? 'There\'s still time!' : '时间还在继续！'}</AlertDialog.Header>
						<AlertDialog.Body>
							{langSetting ? 'Sure you want to leave?' : '确定要离开专注模式吗？'}
						</AlertDialog.Body>
						<AlertDialog.Footer>
							<Button.Group space={2}>
								<Button colorScheme='success' onPress={() => {
									onClose();
									handleComplete();
									navigation.goBack();
								}}>
									{langSetting ? 'Yep' : '去意已决'}
								</Button>
								<Button variant='outline' colorScheme='coolGray' onPress={() => {
									onClose();
								}} ref={cancelRef}>
									{langSetting ? 'Stay' : '保持专注'}
								</Button>
							</Button.Group>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog>

				<AlertDialog leastDestructiveRef={cancelRef} isOpen={showFinishOpt && !keepFocus} onClose={() => {
					onClose();
				}}>
					<AlertDialog.Content>
						<AlertDialog.CloseButton onPress={() => {
							onClose();
						}}/>
						<AlertDialog.Header>{langSetting ? 'Great!' : '棒极了！'}</AlertDialog.Header>
						<AlertDialog.Body>
							{langSetting ? 'Now that you\'ve finished your focus time...' : '你已经做到了规定的专注时间。现在要...'}
						</AlertDialog.Body>
						<AlertDialog.Footer>
							<Button.Group space={2}>
								<Button colorScheme='success' onPress={() => {
									onClose();
									setKeepFocus(true);
								}}>
									{langSetting ? 'Keep focus' : '继续专注'}
								</Button>
								<Button variant='outline' colorScheme='coolGray' onPress={() => {
									onClose();
									handleComplete();
									navigation.goBack();
								}} ref={cancelRef}>
									{langSetting ? 'Leave' : '休息一下'}
								</Button>
							</Button.Group>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog>
			</View>
		</View>
	);
}

const MakeChange = (setSetTime, langSetting) => {
	return <TouchableOpacity style={styles.changeTimeButton} onPress={
		() => {
			setSetTime(true);
		}
	}>
		<Text style={styles.changeTimeText}>
			{langSetting ? 'Change Focus Time' : '修改专注时长'}
		</Text>
	</TouchableOpacity>;
};

const MakeTimer = (countdown, setRemainSec, setShowFinishOpt) => {
	const hours = parseInt(countdown.substr(0, 2));
	const minutes = parseInt(countdown.substr(3, 2));
	const actualSec = 3600 * hours + 60 * minutes;

	const makeRemain = (remain) => {
		useEffect(() => {
			if (remain === 0) {
				setShowFinishOpt(true);
			} else setShowFinishOpt(false);
		});

		const rMinute = Math.floor(remain / 60);
		const rSec = Math.floor(remain % 60);
		return <Text style={styles.countDownText}>
			{rMinute} : {rSec}
		</Text>;
	};

	return <CountdownCircleTimer
		isPlaying
		size={screenWidth - 90}
		duration={actualSec}
		trailColor={'#333333'}
		colors={['#004777', '#F7B801', '#A30000', '#A30000']}
		colorsTime={[actualSec, 2 * actualSec / 3, actualSec / 3, 0]}
	>
		{({remainingTime}) => {
			useEffect(() => {
				setRemainSec(remainingTime);
			});
			return <View>
				<Text style={styles.countDownText}>
					{makeRemain(remainingTime)}
				</Text>
			</View>;
		}
		}
	</CountdownCircleTimer>;
};

const styles = StyleSheet.create({
	changeTimeButton: {
		backgroundColor: 'grey',
		height: 30,
		width: screenWidth / 2,
		borderRadius: 15,
		alignItems: 'center',
		justifyContent: 'center',
		marginVertical: 30,
	},

	changeTimeText: {
		color: 'white',
		fontFamily: 'ZCOOL',
		fontSize: 18
	},

	endButton: {
		width: screenWidth,
		borderRadius: 15,
		backgroundColor: '#00048c',
		height: 80,
		alignItems: 'center',
		justifyContent: 'center'
	},

	endText: {
		color: 'white',
		fontFamily: 'ZCOOL',
		fontSize: 28,
		paddingBottom: Platform.OS === 'ios' ? 15 : 0,
	},

	countDownText: {
		color: 'white',
		fontSize: 60,
		fontWeight: 'bold',
		fontFamily: 'ZCOOL',
	},

	timePicker: {
		backgroundColor: '#202020',
	},

	memosContainer: {
		marginVertical: 30,
		backgroundColor: '#191919',
		padding: 10,
		borderRadius: 15,
		width: screenWidth - 90,
		height: screenWidth / 1.4,
		borderColor: '#111111',
		borderWidth: 3,
	}
});
