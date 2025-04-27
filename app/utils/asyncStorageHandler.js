import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
  }
};

const getAttribute = async (key, attribute) => {
  const jsonValue = await AsyncStorage.getItem(key);
  if (!jsonValue) {
    throw new Error('This key doesnt exist' + key);
  }
  const parseValue = JSON.parse(jsonValue);
  const attributeValue = parseValue[attribute];
  if (!attributeValue) {
    return;
  } //这里把0页给扔了！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！导致debug30分钟
  return attributeValue;
};

const queryStorage = (key) => {
  return AsyncStorage.getItem(key).then(JSON.parse);
};

// getAttr(key, 'priority')
// getAttr(key).priority

const fetchAllData = async () => {
  const result = new Map();
  const fatherSonRelation = new Map();
  const keys = await AsyncStorage.getAllKeys();

  for (const key of keys) {
    if (key === 'MemoId' || key === 'EventId' || key === idEnglish || key === idColor)
      continue;
    const jsonValue = await AsyncStorage.getItem(key);
    if (!jsonValue)
      continue;
    const parseValue = JSON.parse(jsonValue);
    const fatherId = parseValue['fatherId'];
    let sons = [];
    if (!fatherSonRelation.has(fatherId)) {
      sons.push(parseValue['id']);
      fatherSonRelation.set(fatherId, sons);
    } else {
      sons = [...fatherSonRelation.get(fatherId), parseValue['id']];
      fatherSonRelation.set(fatherId, sons);
    }
    result.set(key, parseValue);
  }
  return [result, fatherSonRelation]; //一个是所有元素，key是id，value是对象，包括memo和event；第二个是父子关系，key是父亲id，value是孩子id的array
};

const deleteData = async (key) => {
  await AsyncStorage.removeItem(key);
};

const editData = async (key, content) => {
  await AsyncStorage.mergeItem(key, JSON.stringify(content));
};

const idColor = 'ColorSetting', idEnglish = 'EnglishSetting';

const updateSetting = async (colorSetting, englishSetting) => {
  let jsonValue = await AsyncStorage.getItem(idColor);
  let toAdd = {
    ColorSetting: colorSetting,
  };
  if (!jsonValue) {
    await storeData(idColor, toAdd);
  } else {
    await editData(idColor, toAdd);
  }

  jsonValue = await AsyncStorage.getItem(idEnglish);
  toAdd = {
    EnglishSetting: englishSetting,
  };
  if (!jsonValue) {
    await storeData(idEnglish, toAdd);
  } else {
    await editData(idEnglish, toAdd);
  }
};

const getColorSetting = async () => {
  let jsonValue = await AsyncStorage.getItem(idColor);
  return jsonValue === null ? false : JSON.parse(jsonValue)[idColor];
};

const getEnglishSetting = async () => {
  let jsonValue = await AsyncStorage.getItem(idEnglish);
  return jsonValue === null ? false : JSON.parse(jsonValue)[idEnglish];
};

const getEventId = async () => {

  let jsonValue = await AsyncStorage.getItem('EventId');
  let currentCount = 0;
  if (!jsonValue) {
    let toAdd = {
      EventId: currentCount,
    };
    await storeData('EventId', toAdd);
  } else {
    currentCount = JSON.parse(jsonValue)['EventId'] + 1;
    let toAdd = {
      EventId: currentCount,
    };
    await editData('EventId', toAdd);
  }

  return 'e-' + currentCount;
};

const getMemoId = async () => {
  let jsonValue = await AsyncStorage.getItem('MemoId');
  let currentCount = 0;
  if (!jsonValue) {
    let toAdd = {
      MemoId: currentCount,
    };
    await storeData('MemoId', toAdd);
  } else {
    currentCount = JSON.parse(jsonValue)['MemoId'] + 1;
    let toAdd = {
      MemoId: currentCount,
    };
    await editData('MemoId', toAdd);
  }
  return 'm-' + currentCount;
};


const completeData = async (key) => {
  const toComplete = {
    complete: 1
  };
  await AsyncStorage.mergeItem(key, JSON.stringify(toComplete));
};

const GetMostImminentDDL = async (fatherId, fatherSon) => {
  let MostImminent = await getAttribute(fatherId, 'ddl');
  if (fatherSon.has(fatherId)) {
    const sons = fatherSon.get(fatherId);
    await Promise.all(sons.map(async son => {
      const complete = (await queryStorage(son)).complete;
      if (son[0] === 'e' && complete === 0) {
        let subImminent = await GetMostImminentDDL(son, fatherSon);
        MostImminent = MostImminent.localeCompare(subImminent) < 0 ? MostImminent : subImminent;
      }
    }));
  }
  return MostImminent;
};

const MostDDL = async (id) => {
  const res = await fetchAllData();
  const fatherSon = res[1];
  return await GetMostImminentDDL(id, fatherSon);
};

const GetMostPri = async (fatherId, fatherSon) => {
  let MostPri = await getAttribute(fatherId, 'priority');
  if (fatherSon.has(fatherId)) {
    const sons = fatherSon.get(fatherId);
    await Promise.all(sons.map(async son => {
      if (son[0] === 'e') {
        const complete = (await queryStorage(son)).complete;
        if (complete === 0) {
          let subMostPri = await GetMostPri(son, fatherSon);
          MostPri = Math.max(subMostPri, MostPri);
        }
      }
    }));
  }

  return MostPri;
};

const MostPri = async (id) => {
  const res = await fetchAllData();
  const fatherSon = res[1];
  return await GetMostPri(id, fatherSon);
};

const calculateProgress = (fatherId, allData, fatherSon) => { // string, map, map ,后两个可以在外层调用fetchalldata得到
  let total = 0;
  let completeMemos = 0;
  const totalAndComplete = [];
  if (fatherSon.has(fatherId)) {
    const sons = fatherSon.get(fatherId);
    sons.map(son => {
      if (son[0] === 'e') {
        const sonRes = calculateProgress(son, allData, fatherSon);
        total += sonRes[0];
        completeMemos += sonRes[1];
      } else if (son[0] === 'm') {
        total += 1;
        const value = allData.get(son);
        if (value['complete'] === 1) {
          completeMemos += 1;
        }
      }
    });
  }
  totalAndComplete.push(total);
  totalAndComplete.push(completeMemos);
  return totalAndComplete; // an array for example [3,1] 意思是总共三个任务和一个已完成的，数组元素应该是number类型。
};

const ProgressPercentile = async (id) => {
  const res = await fetchAllData();
  const allData = res[0];
  const fatherSon = res[1];
  const res2 = calculateProgress(id, allData, fatherSon);
  return res2[0] === 0 ? 0 : res2[1] / res2[0];
};

const deleteEvent = async (fatherId, fatherSon) => {
  if (fatherSon.has(fatherId)) {
    const sons = fatherSon.get(fatherId);
    sons.map(async (son) => {
      if (son[0] === 'e') {
        await deleteEvent(son, fatherSon);
      }
      await deleteData(son);
    });
  }
  await deleteData(fatherId);
};

const completeEvent = async (fatherId, fatherSon) => {
  if (fatherSon.has(fatherId)) {
    const sons = fatherSon.get(fatherId);
    sons.map(async (son) => {
      if (son[0] === 'e') {
        await completeEvent(son, fatherSon);
      }
      await completeData(son);
    });
  }
  await completeData(fatherId);
};

const moveMemos = async (setOfId, fatherId) => {
  const toChange = {
    fatherId: fatherId
  };
  for (let item of setOfId) {
    await editData(item, toChange);
  }
};

const generateEventByImage = async () => {
  const res = ['1 实验内容', '2 以太网链路层帧格式分析', '3 交换机的MAC地址表和端口聚合', '4 VLAN的配置与分析', '5 广域网数据链路层协议', '6 设计型实验', '预习报告'];
  let title = '图片导入';
  await EventList.add(title, null,'1', '', '', '');
  //generate memos according to res
  let curNum = 0
  let jsonValue = await AsyncStorage.getItem('EventId');
  if (!jsonValue) {
    curNum = 0;
  } else {
    curNum = JSON.parse(jsonValue)['EventId'];
  }
  //获取最新的eventid作为memo的父亲
  let fid = "e-" + curNum;
  for (const content of res){
    await MemoList.add(content, fid, 0)
  }
  //add event and memos into "database" await storeData(generateKey, toAdd);
}

const EventList = {
  async add(title,
            priority = 0,
            fatherId = '1',
            ddl = '',
            startAt = '',
            note = '',) {
    const generateKey = await getEventId();
    const toAdd = {
      id: generateKey,
      title: title,
      complete: 0,
      priority: priority,
      fatherId: fatherId,
      ddl: ddl,
      startAt: startAt,
      note: note,
      progress: 0
    };
    await storeData(generateKey, toAdd);
  },

  async getEventById(id) {
    const a = await fetchAllData();
    const r = a[0];
    for (const [key, value] of r) {
      if (key[0] === 'e' && value['id'] === id) {
        return value;
      }
    }
  },

  async getEventAttribute(key, attribute) {
    const attributeArray = ['id', 'title', 'complete', 'priority', 'fatherId', 'ddl', 'startAt', 'note', 'progress'];
    if (attributeArray.indexOf(attribute) === -1) {
      throw new Error('bad event attribute!');
    }
    return await getAttribute(key, attribute);
  },

  //if in the top page, fatherId = 1;
  async getEvents(fatherId) { // unfinished
    const resArray = await fetchAllData();
    const res = resArray[0];
    const data = [];
    for (const [key, value] of res) {
      if (key[0] === 'e' && value['fatherId'] === fatherId && value['complete'] === 0) {
        data.push(value);
      }
    }
    return data;
  },

  async getCompletedEvents(fatherId) {
    const resArray = await fetchAllData();
    const res = resArray[0];
    const data = [];
    for (const [key, value] of res) {
      if (key[0] === 'e' && value['fatherId'] === fatherId && value['complete'] === 1) {
        data.push(value);
      }
    }
    return data;
  },

  //if in the top page, fatherId = 1;
  async getEventsByDDL(fatherId) {
    let resArray = await fetchAllData();
    const res = resArray[0];
    const fatherSon = resArray[1];
    //由小到大排列
    let tmpKeysDDL = new Map();
    for (const [key, value] of res) {
      if (key[0] === 'e' && value['fatherId'] === fatherId && value['complete'] === 0) {
        const t = await GetMostImminentDDL(value.id, fatherSon);
        tmpKeysDDL.set(key, t);
      }
    }
    let KeysDDL = Array.from(tmpKeysDDL);
    KeysDDL.sort((a, b) => {
      if (a[1] === undefined) return 1;
      if (b[1] === undefined) return -1;
      return a[1].localeCompare(b[1]);
    });
    let data = [];
    for (let tmp of KeysDDL) {
      data.push(res.get(tmp[0]));
    }
    return data;
  },

  //if in the top page, fatherId = 1;
  async getEventsByPri(fatherId) {
    let resArray = await fetchAllData();
    const res = resArray[0];
    const fatherSon = resArray[1];
    //由大到小排列
    let tmpKeysPri = new Map();
    for (const [key, value] of res) {
      if (key[0] === 'e' && value['fatherId'] === fatherId && value['complete'] === 0) {
        const t = await GetMostPri(value['id'], fatherSon);
        tmpKeysPri.set(key, t);
      }
    }
    let KeysPri = Array.from(tmpKeysPri);
    KeysPri.sort((a, b) => {
      return b[1] - a[1];
    });
    let data = [];
    for (let tmp of KeysPri) {
      data.push(res.get(tmp[0]));
    }
    return data;
  },

  async getCompleteEvents() { // finishevent模块专用
    const keys = await AsyncStorage.getAllKeys();
    const completeEvents = [];
    const completeKeys = [];
    for (const key of keys) {
      const jsonValue = await AsyncStorage.getItem(key);
      if (!jsonValue)
        continue;
      const parseValue = JSON.parse(jsonValue);
      if (key === 'MemoId' || key === 'EventId' || key === idEnglish || key === idColor)
        continue;
      if (parseValue['id'][0] === 'e' && parseValue['complete'] === 1) {
        completeEvents.push(parseValue);
        completeKeys.push(key);
      }
    }
    return [completeEvents, completeKeys];
  },

  async edit(id, title, priority, ddl, startAt, note) {
    const toEdit = {
      title: title,
      priority: priority,
      ddl: ddl,
      startAt: startAt,
      note: note
    };
    await editData(id, toEdit);
  },


  async clearFinishEvents(keys) {
    if (keys.length > 0) {
      await AsyncStorage.multiRemove(keys);
    }
  },
};

const MemoList = {

  async add(str, fatherId = '0', complete = 0) {  //quick memo模块下的memo模块的father用0占位
    const generateKey = await getMemoId();
    const toAdd = {
      id: generateKey,
      content: str,
      fatherId: fatherId,
      complete: complete   //complete 0表示未完成，1表示已完成
    };
    await storeData(generateKey, toAdd);
  },


  async editMemo(id, str) {
    const toAdd = {
      content: str,
    };

    await editData(id, toAdd);
  },

  async completeMemo(id) {
    await completeData(id);
  },

  async deleteMemo(id) {
    await deleteData(id);
  },

  //if in the top page, fatherId = '0';
  async getMemos(fatherId) {
    const resArray = await fetchAllData();
    const res = resArray[0];
    const data = [];
    for (const [key, value] of res) {
      if (key[0] === 'm' && value['complete'] === 0 && value['fatherId'] === fatherId) {
        data.push(value);
      }
    }
    return data;
  },

  //if in the top page, fatherId = '0';
  async getCompletedMemos(fatherId) {
    const resArray = await fetchAllData();
    const res = resArray[0];
    const data = [];
    for (const [key, value] of res) {
      if (key === 'MemoId' || key === 'EventId' || key === idColor || key === idEnglish)
        continue;
      if (key[0] === 'm' && value['complete'] === 1 && value['fatherId'] === fatherId) {
        data.push(value);
      }
    }
    return data;
  },

  async getCompleteMemos() { //finishmemo模块专用
    const keys = await AsyncStorage.getAllKeys();
    const completeMemos = [];
    const completeKeys = [];
    for (const key of keys) {
      const jsonValue = await AsyncStorage.getItem(key);
      if (!jsonValue)
        continue;
      const parseValue = JSON.parse(jsonValue);
      if (key === 'MemoId' || key === 'EventId' || key === idColor || key === idEnglish)
        continue;
      if (parseValue['id'][0] === 'm' && parseValue['complete'] === 1) {
        completeMemos.push(parseValue);
        completeKeys.push(key);
      }
    }
    return [completeMemos, completeKeys];
  },

  async getUnfinishedMemos(fatherId = '0') { // unfinishedmemo
    const keys = await AsyncStorage.getAllKeys();
    const unfinishedMemos = [];
    const unfinishedKeys = [];
    for (const key of keys) {
      const jsonValue = await AsyncStorage.getItem(key);
      if (!jsonValue)
        continue;
      const parseValue = JSON.parse(jsonValue);
      if (key === 'MemoId' || key === 'EventId' || key === idColor || key === idEnglish)
        continue;
      if (parseValue['id'][0] === 'm' && parseValue['complete'] === 0 && parseValue['fatherId'] === fatherId) {
        unfinishedMemos.push(parseValue);
        unfinishedKeys.push(key);
      }
    }
    return [unfinishedMemos, unfinishedKeys];
  },

  async clearFinishMemos(keys) {
    if (keys.length > 0) {
      await AsyncStorage.multiRemove(keys);
    }
  }
};

export {
  storeData,
  updateSetting,
  getColorSetting,
  getEnglishSetting,
  fetchAllData,
  deleteData,
  MostPri,
  MostDDL,
  ProgressPercentile,
  editData,
  completeData,
  calculateProgress,
  deleteEvent,
  completeEvent,
  moveMemos,
  generateEventByImage,
  EventList,
  MemoList
};
