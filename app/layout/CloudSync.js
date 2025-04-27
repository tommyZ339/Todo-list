import {View, Text, TextInput, Switch} from 'react-native';
import {Box, Button, Divider, FormControl, HStack, Input, ScrollView, Stack, WarningOutlineIcon} from 'native-base';
import Header from '../components/Header';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {EditPageStyles} from '../utils/EditPageStyles';
import {screenWidth} from '../stores/Dimensions';
import {EventList} from '../utils/asyncStorageHandler';

export default function CloudSync({route}) {
	const trialUsr = ['username', 'password'];

	const navi = useNavigation();
	const colorSetting = route.params.colorSetting
	const langSetting = route.params.langSetting

	const [showPassword, setShowPassword] = useState(false);
	const onSetShowPassword = () => setShowPassword(c => !c);
	const [showWarning, setShowWarning] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	function Warning(props) {
		return <HStack style={{
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#ffface',
			borderRadius: 10,
			width: screenWidth - 70,
			padding: 7,
			position: 'absolute',
			bottom: 90,
			alignSelf: 'center'
		}}>
			<WarningOutlineIcon size='xs' style={{color: 'red'}}/>
			<Text style={{
				marginLeft: 3,
				color: 'red',
				fontSize: 15,
			}}>{props.prompt}</Text>
		</HStack>;
	}

	return (
		<>
			<Header name={langSetting ? 'Log In' : '登录'} onPress={() => {
				navi.navigate('纵览');
			}}/>
			<View style={{
				flex: 1,
			}}>
				<Box>
					<Text style={EditPageStyles.formTitle}>
						{langSetting ? 'Username' : '用户名'}
					</Text>
					<TextInput
						style={EditPageStyles.titleInput}
						onChangeText={v => {
							setUsername(v);
							setShowWarning(false);
						}}
						value={username}
					/>
				</Box>
				<Box>
					<Text style={EditPageStyles.formTitle}>
						{langSetting ? 'Password' : '密码'}
					</Text>
					<TextInput
						style={EditPageStyles.titleInput}
						secureTextEntry={!showPassword}
						onChangeText={v => {
							setPassword(v);
							setShowWarning(false);
						}}
						value={password}
					/>
					<View style={{
						justifyContent: 'center',
						alignItems: 'flex-end'
					}}>
						<HStack
							style={{
								marginTop: 5,
								marginRight: 30,
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<Text style={{fontSize: 18, fontFamily: 'ZCOOL', marginRight: 10}}>
								{langSetting ? 'Display Password' : '显示密码'}
							</Text>
							<Switch
								trackColor={{false: 'grey', true: 'grey'}}
								thumbColor={showPassword ? 'black' : 'white'}
								onValueChange={onSetShowPassword}
								value={showPassword}
							/>
						</HStack>
					</View>
				</Box>
			</View>
			<View style={{
				position: 'absolute',
				bottom: 50,
				alignSelf: 'center'
			}}>
				{showWarning && <Warning prompt={langSetting ? 'Wrong username or password!' : '用户名或密码错误！'}/>}
				<HStack space={10} justifyContent={'space-evenly'} style={{
					marginVertical: 20,
				}}>
					<Button width={screenWidth / 3.3} size='lg' variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'}
									onPress={() => {
										navi.navigate('纵览');
									}}>
						{langSetting ? 'Cancel' : '取消'}
					</Button>
					<Button width={screenWidth / 3.3} size='lg' variant='subtle' bg={colorSetting ? '#dddddd' : '#645dc45c'} onPress = {() => {
						if (username === trialUsr[0] && password === trialUsr[1]) {
							navi.navigate('syncData', {colorSetting: colorSetting, langSetting: langSetting});
						} else {
							setShowWarning(true);
						}
					}}>
						{langSetting ? 'Log in' : '登录'}
					</Button>
				</HStack>
			</View>
		</>
	);
};
