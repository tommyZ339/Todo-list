import {AlertDialog, Button, HStack, ScrollView, Stack, TextArea, View} from 'native-base';
import {StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import {screenWidth} from '../stores/Dimensions';
import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import DatePicker from 'react-native-modern-datepicker';

import {EventList} from '../utils/asyncStorageHandler';
import {PrioritySet} from '../utils/PrioritySet';
import {EditPageStyles} from '../utils/EditPageStyles';
import Header from './Header';

export default function EditEvent({navigation, route}, props) {
	const {id, current, colorSetting, langSetting} = route.params;

	const [title, setTitle] = useState(current['title']);
	const [note, setNote] = useState(current['note']);
	const [open, setPriorityOpen] = useState(false);
	const [value, setPriorityValue] = useState(current['priority']);
	const [items, setPriorityItems] = useState(PrioritySet);
	const [show, setShow] = useState(false);

	const [showTitleInvalid, setShowTitleInvalid] = React.useState(false);
	const [showPriInvalid, setShowPriInvalid] = React.useState(false);
	const [showTimeInvalid, setShowTimeInvalid] = React.useState(false);
	const onClose = () => {
		setShow(false);
		setShowTitleInvalid(false);
		setShowPriInvalid(false);
		setShowTimeInvalid(false);
	};
	const cancelRef = React.useRef(null);

	const [startDate, setStartDate] = useState(current['startAt']);
	const [endDate, setEndDate] = useState(current['ddl']);

	const [showStartTimeChanger, setShowStartTimeChanger] = useState(false);
	const [showEndTimeChanger, setShowEndTimeChanger] = useState(false);

	const handleGoBack = () => {
		navigation.goBack();
	};

	return (
		<>
			<Header name={langSetting ? 'Event Editing' : '编辑事项'} onPress={handleGoBack}/>
			<ScrollView>
				<Text style={EditPageStyles.formTitle}>{langSetting ? 'Title' : '标题'}</Text>
				<TextInput
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
				{!showStartTimeChanger && timePrompt(startDate, setShowStartTimeChanger, langSetting)}
				{showStartTimeChanger && <View style={EditPageStyles.datePickerField}>
					<DatePicker
						selected={startDate}
						onSelectedChange={date => setStartDate(date)}
					/>
				</View>}

				<Text style={EditPageStyles.formTitle}>{langSetting ? 'End Time' : '结束时间'}</Text>
				{!showEndTimeChanger && timePrompt(endDate, setShowEndTimeChanger, langSetting)}
				{showEndTimeChanger && <View style={EditPageStyles.datePickerField}>
					<DatePicker
						onSelectedChange={date => setEndDate(date)}
					/>
				</View>}

				<Text style={EditPageStyles.formTitle}>{langSetting ? 'Notes' : '备注'}</Text>
				<TextInput
					style={[EditPageStyles.titleInput, {height: 200}]}
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
											await EventList.edit(id, title, value, endDate, startDate, note);
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
							{langSetting ? 'Success!' : '编辑成功！'}
						</AlertDialog.Body>
					</AlertDialog.Content>
				</AlertDialog>
			</ScrollView>
		</>
	);
}

const timePrompt = (current, call, langSetting) => {
	return <HStack space={2} justifyContent={'space-evenly'}>
		<Text style={EditPageStyles.timePrompt}>
			<Text style={{color: 'grey'}}> {langSetting ? 'Current ' : '当前设置为'} < /Text>
			<Text
				style={{color: '#8a6bbe'}}>{current === '' ? (langSetting ? 'Unspecified    ' : '未指定日期             ') : current}</Text>
		</Text>
		<TouchableOpacity onPress={() => call(true)} style={EditPageStyles.timeChangeButton}>
			<Text style={{textAlign: 'center', fontWeight: 'bold'}}>{langSetting ? 'Edit' : '修改'}< /Text>
		</TouchableOpacity>
	</HStack>;
};
