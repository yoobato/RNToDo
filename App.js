import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './colors';

const STORAGE_KEY = '@toDos';

// TODO: Code Challenge
// TODO: (1) Work, Travel 중에 종료된 곳에서 시작 (AsyncStorage
// TODO: (2) TODO Completed 추가 (아이콘 추가)
// TODO: (3) TODO Text 수정 기능 추가 (아이콘 추가, 수정하는 동안 TextInput으로 교체해서 보여주자?)

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState('');
  const [toDos, setToDos] = useState({});

  useEffect(() => {
    loadToDos();
  }, []);

  const work = () => setWorking(true);
  const travel = () => setWorking(false);

  const onChangeText = (payload) => setText(payload);

  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      // TODO: Saving Error
      console.error(e);
    }
  };

  // TODO: ToDo 로딩하는 동안 ActivityIndicator 추가
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      if (s) {
        setToDos(JSON.parse(s));
      }
    } catch (e) {
      // TODO: Reading Error
      console.error(e);
    }
  };

  const addToDo = async () => {
    if (text === '') {
      return;
    }

    // 새로운 ToDo를 추가할 때, toDos state를 직접 수정할 수 없다.
    // 따라서, Object.assign을 써서 두 개의 Object를 합친 새로운 Object를 만든다.
    // ToDo object는 현재 일시를 key로 갖고, text와 working을 value로 가진다.
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text, working }
    });
    // 아래처럼 ES6 문법을 사용할 수도 있다.
    // const newToDos = {
    //   ...toDos,
    //   [Date.now()]: {text, work: working},
    // };
    setToDos(newToDos);
    await saveToDos(newToDos);
    
    setText('');
  };

  const deleteToDo = (key) => {
    if (Platform.OS === 'web') {
      const ok = confirm('Do you want to delete this To Do?');
      if (ok) {
        const newToDos = { ...toDos };
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
      }
    } else {
      Alert.alert('Delete To Do?', 'Are you sure?', [
        { text: 'Cancel' },
        {
          text: "I'm sure",
          onPress: async () => {
            const newToDos = { ...toDos };
            // 아직 state가 되지 않았기 때문에 mutate 가능
            delete newToDos[key];

            setToDos(newToDos);
            await saveToDos(newToDos);
          },
          style: 'destructive',   // iOS Only
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='light' /> 
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text 
            style={{ 
              fontSize: 38,
              fontWeight: '600',
              color: working ? 'white' : theme.grey 
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
        <Text 
            style={{ 
              fontSize: 38,
              fontWeight: '600',
              color: !working ? 'white' : theme.grey 
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput 
        style={styles.input} 
        returnKeyType='done'
        placeholder={working ? 'Add a To Do' : 'Where do you want to go?'}
        value={text}
        onChangeText={onChangeText}
        onSubmitEditing={addToDo}
      />
      <ScrollView>
        {Object.keys(toDos).map(key => (
          toDos[key].working === working ? (
            <View key={key} style={styles.toDo}>
              <Text style={styles.toDoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name='trash' size={18} color={theme.grey} />
              </TouchableOpacity>
            </View>
          ) : null
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },
  input: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
