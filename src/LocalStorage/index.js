import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveLists = async (key, arrayData) => {
  try {
    const jsonValue = JSON.stringify(arrayData);
    await AsyncStorage.setItem(key, jsonValue);
    console.log('Array saved');
  } catch (e) {
    console.error('Error saving array:', e);
  }
};

export const getLists = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading array:', e);
      return [];
    }
};

export const savePreDoc = async (arrayData) => {
  try {
    const jsonValue = JSON.stringify(arrayData);
    await AsyncStorage.setItem("predoc", jsonValue);
    console.log('Array saved');
  } catch (e) {
    console.error('Error saving array:', e);
  }
};

export const getPreDoc = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("predoc");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Error reading array:', e);
      return [];
    }
};