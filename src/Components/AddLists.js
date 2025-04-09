import React, { useState, useRef, useEffect } from "react";
import { Pressable, StyleSheet, TextInput, View, Text, Keyboard } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { saveLists, getLists } from "../LocalStorage";

const formatDate = () => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2); // Get last two digits
    return `${day}.${month}.${year}`;
};

const AddLists = ({navigationMethod, data}) => {

    const [input, setInput] = useState([{ value : "", completed : false}]);
    const [exists, setExists] = useState(false);
    const inputRefs = useRef([]);

    useEffect(() => {
        if(data?.lists) {
            setInput(data?.lists);
            setExists(true);
        }
    }, [data]);

    const handleNext = (index) => {
        if (index === input.length - 1) {
          setInput([...input, { value : "", completed : false}]);
        } else {
          inputRefs.current[index + 1]?.focus();
        }
    };
    
    const handleChangeText = (text, index) => {
        const updated = [...input];
        updated[index] = { value : text, completed : false};
        setInput(updated);
    };

    const handleKeyPress = ({ nativeEvent }, index) => {
        const isBackspace = nativeEvent.key === 'Backspace';
        const isEmpty = input[index].value === '';
    
        if (isBackspace && isEmpty && input.length > 1) {
          const updated = [...input];
          updated.splice(index, 1);
          setInput(updated);
          setTimeout(() => {
            if (index > 0) {
              inputRefs.current[index - 1]?.focus();
            }
          }, 50);
        }
      };
    
    const handleBlur = (index) => {
        if (input[index].value === '' && input.length > 1) {
          const updated = [...input];
          updated.splice(index, 1);
          setInput(updated);
        }
    };

    const onClickSave = async () => {
        let resp = data;
        let idd  = 0;
        resp.lists = input.filter(obj => obj.value !== "");
        let lists = await getLists('perlists');
        if(exists) {
            const { id, ...newObj } = data;
            idd = id;
            lists[id] = newObj;
        } else {
            resp.timestamp = formatDate();
            lists = [...lists, resp];
        }
        await saveLists('perlists', lists);
        const lists2 = await getLists('perlists');
        navigationMethod("savedlists", exists ? idd : lists2.length-1);
    }

    return(
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => navigationMethod("checklists")}>
                <MaterialIcons name="arrow-back-ios" size={20} color="black" />
                <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            { input[0].value !== "" && <Pressable style={styles.doneButton} onPress={onClickSave}>
                <Text style={styles.doneText}>Save</Text>
            </Pressable>}
            <Text style={styles.listHeader}>{data.title}</Text>
            {
                input.map((value, index) => {
                    return(
                        <View key={index} style={index > 0 ? styles.textView2 : styles.textView}>
                            <View style={{justifyContent : "center", alignItems : 'center', paddingLeft : 20}}>
                                <View style={styles.docView}>
                                    <Ionicons name="document-text" color="white" size={15} />
                                </View>
                            </View>
                            <TextInput 
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={styles.inputView}
                                placeholder="Insert lists's title"
                                value={value.value}
                                onChangeText={(text) => handleChangeText(text, index)}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onBlur={() => handleBlur(index)}
                                onSubmitEditing={() => handleNext(index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                            />
                        </View>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1, 
        backgroundColor : "#ECEEF0"
    },
    backButton : {
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
        position : "absolute",
        top : 20,
        left : 20,
        height : 40,
    },
    cancelText : {
        fontSize : 14,
        color : "black",
    },
    doneButton : {
        backgroundColor : "#0093BB",
        width : 88,
        height : 40,
        borderRadius : 20,
        justifyContent : "center",
        alignItems : "center",
        position : "absolute",
        top : 20,
        right : 20
    },
    doneText : {
        color : '#ffffff',
        fontSize : 14,
        fontFamily : "bold"
    },
    inputView : {
        flex : 1,
        fontSize : 18,
        padding : 10
    },
    listHeader : {
        color : "#000000",
        fontSize : 18,
        fontWeight : "bold",
        marginTop : 70,
        paddingHorizontal : 20
    },
    textView : {
        marginTop : 37,
        flexDirection : "row",
        height : 80,
        borderTopColor : "#d2d4d9",
        borderTopWidth : .5,
        borderBottomColor : "#d2d4d9",
        borderBottomWidth : .5
    },
    textView2 : {
        flexDirection : "row",
        height : 80,
        borderBottomColor : "#d2d4d9",
        borderBottomWidth : .5
    },
    docView : {
        width : 25, 
        height : 25, 
        backgroundColor : "#002646", 
        borderRadius : 30, 
        justifyContent : "center", 
        alignItems : 'center'
    }
})

export default AddLists;
