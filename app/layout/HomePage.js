import { StyleSheet, Text, TouchableOpacity, TouchableOpacityComponent, View } from 'react-native';
import { screenHeight, screenWidth } from '../stores/Dimensions';
import { useAsyncResult } from '../utils/hooks';
import { Button, HStack, ScrollView } from 'native-base';
import { makeRandomColor } from '../components/Event';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { EventList, getColorSetting, getEnglishSetting, MemoList } from '../utils/asyncStorageHandler';
import { getMemoVersion } from '../stores/MemoVersionMap';
import EmptyContent from '../components/EmptyContent';
import Header from '../components/Header';


export default function HomeScreen(props) {
  const navi = useNavigation();
  const colorSetting = useAsyncResult(getColorSetting, false);
  const langSetting = useAsyncResult(getEnglishSetting, false);

  return (
    <>
      {!props.demo && <Header name={langSetting ? 'Menu' : '纵览'} homepage su />}
      <View style={styles.mainContainer}>
        <View style={[styles.memoSpace, colorSetting && styles.easyMemoSpace]}>
          <Text style={styles.title}>
            {langSetting ? 'Memos' : '速记'}
          </Text>
          {makeHomeMemos(navi, colorSetting, langSetting)}
        </View>

        <View style={[styles.eventSpace, colorSetting && styles.easyMemoSpace]}>
          <Text style={styles.title}>
            {langSetting ? 'Events' : '事项'}
          </Text>
          {makeHomeEvents(navi, colorSetting, langSetting)}
        </View>

        <HStack space={2} style={styles.buttonHolder}>
          {makeButton(props.demo ? (langSetting ? 'Clear' : '清空') : (langSetting ? 'Done Memos' : '已完成的速记'), colorSetting, () => {
            navi.navigate(props.demo ? '纵览' : 'completeMemos', {colorSetting: colorSetting, langSetting: langSetting});
          })}

          {makeButton(props.demo ? (langSetting ? 'Sync' : '同步') : (langSetting ? 'Done Events' : '已完成的事项'), colorSetting, () => {
            navi.navigate(props.demo ? '纵览' : 'completeEvents', {colorSetting: colorSetting, langSetting: langSetting});
          })}
        </HStack>

        {props.demo && <TouchableOpacity onPress={() => {
          navi.navigate('changePassword', {colorSetting: colorSetting, langSetting: langSetting});
        }} style={{
          width: screenWidth - 60,
          backgroundColor: 'grey',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          borderRadius: 15,
          marginTop: 10,
        }}>
          <Text style={{
            fontFamily: 'ZCOOL',
            fontSize: 20,
          }}>
            {langSetting ? 'Change Password' : '修改密码'}
          </Text>
        </TouchableOpacity> }
      </View>
    </>
  );
}

const makeButton = (title, colorSetting, onPress) => {
  return (
    <Button width={screenWidth / 2.5} size={'lg'} variant={'subtle'} borderRadius={15} onPress={onPress}
            bg={colorSetting ? '#dddddd' : '#e1a679'}>
      <Text style={{fontFamily: 'ZCOOL', fontSize: 20}}>{title}</Text>
    </Button>
  );
};

const makeHomeMemos = (navi, colorSetting, langSetting) => {
  const memos = useAsyncResult(() => MemoList.getMemos('0'), []);
  return <ScrollView contentContainerStyle={styles.memosScrollView}>
    {memos.length === 0 ? makeCreateButton(langSetting ? 'Go make a memo!' : '去创建一个速记吧！', () => {
        navi.navigate('Memos');
      }) :
      memos.map((memo) => {
        const key = memo.id + '-' + getMemoVersion(memo.id);
        return <TouchableOpacity key={key} style={[styles.homeMemo, colorSetting && styles.easyColor]} onPress={() => {
          navi.navigate('Memos');
        }}>
          <Text style={styles.memoFont}>{memo['content']}</Text>
        </TouchableOpacity>;
      })}
  </ScrollView>;
};

const makeHomeEvents = (navi, colorSetting, langSetting) => {
  const events = useAsyncResult(() => EventList.getEvents('1'), []);
  return <ScrollView contentContainerStyle={styles.eventScrollView}>
    {events.length === 0 ? makeCreateButton(langSetting ? 'Go make an event!' : '去创建一个事项吧！', () => {
        navi.navigate('Events');
      }) :
      events.map((event) => {
        return <LinearGradient key={'-' + Math.random() * 1000}
                               start={{x: 0, y: 0}}
                               end={{x: 1, y: 1}}
                               colors={colorSetting ? ['#dddddd', '#dddddd'] : makeRandomColor()}
                               style={[styles.homeEvent,]}>
          <TouchableOpacity onPress={() => {
            navi.navigate('Events');
          }}>
            <Text style={styles.eventFont}>{event['title']}</Text>
          </TouchableOpacity>
        </LinearGradient>;
      })}
  </ScrollView>;
};

const makeCreateButton = (content, onPress) => {
  return <TouchableOpacity style={styles.createButton} onPress={onPress}>
    <EmptyContent content={content} height={screenHeight / 2.9} />
  </TouchableOpacity>;
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  memoSpace: {
    height: screenHeight / 2.9,
    width: screenWidth - 40,
    backgroundColor: '#fff1ff',
    padding: 10,
    borderRadius: 15,
  },

  easyMemoSpace: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'black'
  },


  createButton: {
    height: screenHeight / 4,
    width: screenWidth - 80,
    justifyContent: 'center',
    alignSelf: 'center',
  },

  eventSpace: {
    marginTop: 20,
    height: screenHeight / 3.4,
    width: screenWidth - 40,
    flexGrow: 0.5,
    backgroundColor: '#fff1ff',
    padding: 10,
    borderRadius: 15,
  },


  title: {
    fontFamily: 'ZCOOL',
    fontSize: 30,
  },

  memosScrollView: {
    alignItems: 'center',
  },

  homeMemo: {
    backgroundColor: '#bcfff7',
    marginTop: 10,
    width: screenWidth - 64,
    padding: 3,
    paddingLeft: 10,
    borderRadius: 15,
  },

  easyColor: {
    backgroundColor: '#dddddd'
  },

  memoFont: {
    fontSize: 16,
    padding: 10,
  },

  homeEvent: {
    height: 50,
    width: screenWidth / 2.5,
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eventFont: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  eventScrollView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },

  buttonHolder: {
    width: screenWidth - 60,
    marginTop: 10,
    justifyContent: 'space-evenly',
  },
});
