import AsyncStorage from '@react-native-community/async-storage';

const storeData = async (key, value) => {
	try {
		await AsyncStorage.setItem(key, value);
	}catch(e) {
		console.warn(e);
	}
}

const getData = async (key) => {
	try {
		return await AsyncStorage.getItem(key);
	} catch(e) {
		console.warn(e);
	}
}

export {
    storeData,
    getData
}