import {AlertDialog, Button, HStack, ScrollView, Stack, View} from 'native-base';
import {StyleSheet, Text, TextInput} from 'react-native';
import {screenWidth} from '../stores/Dimensions';
import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-modern-datepicker';


import {PrioritySet} from '../utils/PrioritySet';
import {EventList, getColorSetting} from '../utils/asyncStorageHandler';
import {EditPageStyles} from '../utils/EditPageStyles';
import Header from './Header';
import {useAsyncResult} from "../utils/hooks";

function getStringLength(str) {
	let len = 0;
	for (let i = 0; i < str.length; i++) {
		if (str.charAt(i).match(/[\u4e00-\u9fa5]/g) != null) len += 2;
		else len += 1;
	}
	return len;
}

export default function AddEvent({navigation, route}) {
	const [title, setTitle] = useState('');
	const [note, setNote] = useState('');
	const [open, setPriorityOpen] = useState(false);
	const [value, setPriorityValue] = useState(null);
	const [items, setPriorityItems] = useState(PrioritySet);
	const [show, setShow] = useState(false);

	const [showTitleInvalid, setShowTitleInvalid] = React.useState(false);
	const [showLongTitle, setShowLongTitle] = React.useState(false);
	const [showPriInvalid, setShowPriInvalid] = React.useState(false);
	const [showTimeInvalid, setShowTimeInvalid] = React.useState(false);
	const onClose = () => {
		setShowLongTitle(false);
		setShow(false);
		setShowTitleInvalid(false);
		setShowPriInvalid(false);
		setShowTimeInvalid(false);
	};
	const cancelRef = React.useRef(null);

	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const handleGoBack = () => {
		navigation.goBack();
	};

	const {colorSetting, langSetting} = route.params

	return (
		<>
			<Header name={langSetting ? 'Event Making' : '添加事项'} onPress={handleGoBack}/>
			<ScrollView>
				<Text style={EditPageStyles.formTitle}>{langSetting ? 'Title' : '标题'}</Text>
				<TextInput
					placeholder={langSetting ? 'Up to 10 Chinese characters or 20 English characters' : '最长10个汉字或20个英文字符'}
					style={EditPageStyles.titleInput}
					onChangeText={setTitle}
					value={title}
				/>
				<Text style={EditPageStyles.formTitle}>{langSetting ? 'Priority' : '优先级'}</Text>
				<DropDownPicker
					containerStyle={EditPageStyles.priorityDropDown}
					style={EditPageStyles.priorityInput}
					open={open}
					value={value}
					items={items}
					setOpen={setPriorityOpen}
					setValue={setPriorityValue}
					setItems={setPriorityItems}
					placeholder={''}
				/>

				<Text style={EditPageStyles.formTitle}>{langSetting ? 'Start Time' : '开始时间'}</Text>
				<View style={EditPageStyles.datePickerField}>
					<DatePicker
						onSelectedChange={date => setStartDate(date)}
					/>
				</View>

				<Text style={EditPageStyles.formTitle}>{langSetting ? 'End Time' : '结束时间'}</Text>
				<View style={EditPageStyles.datePickerField}>
					<DatePicker
						onSelectedChange={date => setEndDate(date)}
					/>
				</View>

				<Text style={EditPageStyles.formTitle}>{langSetting ? 'Notes' : '备注'}</Text>
				<TextInput
					style={[EditPageStyles.titleInput, {height: 200, textAlignVertical: 'top',}]}
					onChangeText={setNote}
					multiline={true}
					value={note}
				/>

				<View style={{marginVertical: 20, width: screenWidth - 60, alignSelf: 'center'}}>
					<HStack justifyContent={'space-evenly'}>
						<Button width={screenWidth / 3.3} size='lg' variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'}
										onPress={async () => {
											if (title === '' || title === undefined) {
												setShowTitleInvalid(true);
												setTimeout(() => {
													setShowTitleInvalid(false);
												}, 1500);
												return;
											}
											if (getStringLength(title) > 20) {
												setShowLongTitle(true);
												setTimeout(() => {
													setShowLongTitle(false);
												}, 1500);
												return;
											}
											if (value === null) {
												setShowPriInvalid(true);
												setTimeout(() => {
													setShowPriInvalid(false);
												}, 1500);
												return;
											}
											if (startDate !== '' && endDate !== '' && startDate.localeCompare(endDate) > 0) {
												setShowTimeInvalid(true);
												setTimeout(() => {
													setShowTimeInvalid(false);
												}, 1500);
												return;
											}
											await EventList.add(title, value, route.params['father'], endDate, startDate, note);
											setShow(true);
											setTimeout(() => {
												setShow(false);
												navigation.goBack();
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

				<AlertDialog leastDestructiveRef={cancelRef} isOpen={showTitleInvalid} onClose={onClose}>
					<AlertDialog.Content>
						<AlertDialog.Header>{langSetting ? 'Error' : '错误'}</AlertDialog.Header>
						<AlertDialog.Body>
							{langSetting ? 'A title is needed!' : '未设置标题！'}
						</AlertDialog.Body>
					</AlertDialog.Content>
				</AlertDialog>

				<AlertDialog leastDestructiveRef={cancelRef} isOpen={showLongTitle} onClose={onClose}>
					<AlertDialog.Content>
						<AlertDialog.Header>{langSetting ? 'Error' : '错误'}</AlertDialog.Header>
						<AlertDialog.Body>
							{langSetting ? 'Please limit the title to 10 Chinese characters or 20 English characters!' : '标题请限制在10个汉字或20个英文字符内！'}
						</AlertDialog.Body>
					</AlertDialog.Content>
				</AlertDialog>

				<AlertDialog leastDestructiveRef={cancelRef} isOpen={showPriInvalid} onClose={onClose}>
					<AlertDialog.Content>
						<AlertDialog.Header>{langSetting ? 'Error' : '错误'}</AlertDialog.Header>
						<AlertDialog.Body>
							{langSetting ? 'Priority is needed!' : '未设置优先级！'}
						</AlertDialog.Body>
					</AlertDialog.Content>
				</AlertDialog>

				<AlertDialog leastDestructiveRef={cancelRef} isOpen={showTimeInvalid} onClose={onClose}>
					<AlertDialog.Content>
						<AlertDialog.Header>{langSetting ? 'Error' : '错误'}</AlertDialog.Header>
						<AlertDialog.Body>
							{langSetting ? 'The end time is before the start time!' : '结束时间不可早于开始时间！'}
						</AlertDialog.Body>
					</AlertDialog.Content>
				</AlertDialog>

				<AlertDialog leastDestructiveRef={cancelRef} isOpen={show} onClose={onClose}>
					<AlertDialog.Content>
						<AlertDialog.Header>{langSetting ? 'Confirm' : '确认'}</AlertDialog.Header>
						<AlertDialog.Body>
							{langSetting ? 'Success!' : '添加成功！'}
						</AlertDialog.Body>
					</AlertDialog.Content>
				</AlertDialog>
			</ScrollView>
		</>
	);
}
