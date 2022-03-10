import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './colors';

const STORAGE_KEY = '@toDos';

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

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s));
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
    // }
    setToDos(newToDos);
    await saveToDos(newToDos);
    
    setText('');
  };

  return (
    <View style={styles.container}>
      <StatusBar style='light' /> 
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text 
            style={{ 
              ...styles.btnText, 
              color: working ? 'white' : theme.grey 
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
        <Text 
            style={{ 
              ...styles.btnText, 
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
  btnText: {
    fontSize: 38,
    fontWeight: '600',
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
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
