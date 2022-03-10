import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from './colors';

export default function App() {
  const [working, setWorking] = useState(true);

  const work = () => setWorking(true);
  const travel = () => setWorking(false);

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
});
