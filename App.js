/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Checklists from './src/Screens/Checklists';
import AddNew from './src/Components/AddNew';
import PreDepartureDocuments from './src/Screens/PreDepartureDocuments';
import AddLists from './src/Components/AddLists';
import SavedLists from './src/Components/SavedLists';
import store from './src/Redux/store';
import { Provider } from 'react-redux';
import { getPreDoc, savePreDoc } from './src/LocalStorage';
import { preDepartureDoc } from './src/Constants/constants';

function App(){

  const [currentScreen, setCurrentScreen] = useState("checklists");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPreDoc();
      if(data.length === 0) {
        await savePreDoc(preDepartureDoc);
        console.log("Added initial PreDeparture");
      }
    }
    fetchData();
    setLoading(false);
  }, []);

  const navigationMethod = (item, item2) => {
    setData(item2);
    setCurrentScreen(item);
  }

  if(loading) return null;

  return (
    <Provider store={store}>
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        {
          currentScreen === "checklists" ? 
            <Checklists navigationMethod={navigationMethod} /> : 
          currentScreen === "predepdoc" ? 
            <PreDepartureDocuments navigationMethod={navigationMethod} /> :
          currentScreen === "addlists" ? 
            <AddLists navigationMethod={navigationMethod} data={data} /> :
          currentScreen === "savedlists" ? 
            <SavedLists navigationMethod={navigationMethod} id={data} /> : 
            <AddNew navigationMethod={navigationMethod} />
        }
      </View>
    </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor : "#ffffff"
  },
  sectionContainer : {
    flex : 1,
    // paddingTop : 40
  }
});

export default App;
