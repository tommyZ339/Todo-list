import Header from '../components/Header';
import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { EditPageStyles } from '../utils/EditPageStyles';
import { Box, Button, HStack, WarningOutlineIcon } from 'native-base';
import { screenWidth } from '../stores/Dimensions';
import { useNavigation } from '@react-navigation/native';

export default function ChangePasswordPage({route}) {
  const langSetting = route.params.langSetting;
  const colorSetting = route.params.constructorl
  const [old, setOld] = useState('');
  const [now, setNow] = useState('');
  const [retype, setRetype] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const navi = useNavigation();

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
      <Header name={langSetting ? 'Change Password' : '修改密码'} onPress={() => {
        navi.navigate('纵览');
      }}/>
      <Box>
        <Text style={EditPageStyles.formTitle}>
          {langSetting ? 'Old Password' : '旧密码'}
        </Text>
        <TextInput
          secureTextEntry
          style={EditPageStyles.titleInput}
          onChangeText={v => {
            setShowWarning(false);
            setOld(v)
          }}
          value={old}
        />
      </Box>
      <Box>
        <Text style={EditPageStyles.formTitle}>
          {langSetting ? 'New Password' : '新密码'}
        </Text>
        <TextInput
          secureTextEntry
          style={EditPageStyles.titleInput}
          onChangeText={v => {
            setShowWarning(false);
            setNow(v)
          }}
          value={now}
        />
      </Box>
      <Box>
        <Text style={EditPageStyles.formTitle}>
          {langSetting ? 'Retype New Password' : '重新输入新密码'}
        </Text>
        <TextInput
          secureTextEntry
          style={EditPageStyles.titleInput}
          onChangeText={v => {
            setShowWarning(false);
            setRetype(v)
          }}
          value={retype}
        />
      </Box>
      <View style={{
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center'
      }}>
        {showWarning && <Warning prompt={langSetting ? 'Wrong old password or the retype don\'t match!' : '旧密码错误或者重输不一致！'}/>}
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
            if (old !== 'password' || now !== retype || now === '') {
              setShowWarning(true);
            } else {
              navi.navigate('syncData', {colorSetting: colorSetting, langSetting: langSetting});
            }
          }}>
            {langSetting ? 'Confirm' : '确认'}
          </Button>
        </HStack>
      </View>
    </>
  )
}
