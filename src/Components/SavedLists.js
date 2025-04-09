import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getLists, saveLists } from "../LocalStorage";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { SwipeRow } from 'react-native-swipe-list-view';

const SavedLists = ({navigationMethod, id}) => {

    const [data, setData] = useState({});
    const [todoCount, setTodoCount] = useState(0);
    const [compCount, setCompCount] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        setCompCount(0);
        setTodoCount(0);
        const lists = await getLists('perlists');
        console.log("Lists", lists[id]);
        lists[id].lists.forEach(item => {
            if(item.completed) {
                setCompCount(prev => prev+1);
            } else {
                setTodoCount(prev => prev+1);
            }
        })
        setData(lists[id]);
    }

    const handleUncheck = async (index) => {
        let lists = await getLists('perlists');
        lists[id].lists[index].completed = false;
        await saveLists("perlists" ,lists);
        fetchData();
    }

    const handleCheck = async (index) => {
        let lists = await getLists('perlists');
        lists[id].lists[index].completed = true;
        await saveLists("perlists" ,lists);
        fetchData();
    }

    const handleDelete = async (index) => {
        try {
            let lists = await getLists('perlists');
            if (lists[id] && Array.isArray(lists[id].lists)) {
              lists[id].lists.splice(index, 1);
            }
            await saveLists("perlists", lists);
            fetchData();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    }

    return(
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => navigationMethod("checklists")}>
                <MaterialIcons name="arrow-back-ios" size={20} color="black" />
                <Text style={styles.cancelText}>Lists</Text>
            </Pressable>
            <Pressable style={styles.doneButton} onPress={() => navigationMethod("addlists", {...data, id})}>
                <Text style={styles.doneText}>Edit List</Text>
            </Pressable>
            <Text style={styles.listHeader}>{data.title}</Text>
            { todoCount > 0 && <View style={{width : "100%", paddingTop : 30}}>       
                <Text style={styles.textHeader}>To-do</Text>
            {
                data?.lists?.map((item, index) => {
                    if(item.completed) return;
                    return(
                        <SwipeRow key={index} rightOpenValue={-160} disableRightSwipe>
                            <View style={styles.rowBack2}>
                                <TouchableOpacity style={styles.deleteButton3} onPress={() => handleDelete(index)}>
                                    <MaterialCommunityIcons name="delete" size={20} color="white" />
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton2} onPress={() => handleCheck(index)}>
                                    <AntDesign name="checkcircleo" size={20} color="white" />
                                    <Text style={styles.deleteText}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.rowFront}>
                                <View style={styles.sectionSix}>
                                    <Ionicons name="document-text" color="white" size={15} />
                                </View>
                                <View style={styles.sectionSeven}>
                                    <Text style={styles.textFour}>{item.value}</Text>
                                </View>
                            </View>
                        </SwipeRow>
                    )
                })
            }
            </View>}
            { compCount > 0 && <View style={{width : "100%", paddingTop : 30}}>       
                <Text style={styles.textHeader}>Completed tasks</Text>
            {
                data?.lists?.map((item, index) => {
                    if(!item.completed) return;
                    return(
                        <SwipeRow key={index} rightOpenValue={-75} disableRightSwipe>
                            <View style={styles.rowBack}>
                                <TouchableOpacity style={styles.deleteButton} 
                                    onPress={() => handleUncheck(index)}
                                >
                                    <Entypo name="circle" size={20} color="white" />
                                    <Text style={styles.deleteText}>Uncheck</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.rowFront}>
                                <View style={styles.sectionSix}>
                                    <Ionicons name="document-text" color="white" size={15} />
                                </View>
                                <View style={styles.sectionSeven}>
                                    <Text style={styles.textFour}>{item.value}</Text>
                                </View>
                            </View>
                        </SwipeRow>
                    )
                })
            }
            </View>}
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
        borderColor : "#0093BB",
        borderWidth : 1,
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
        color : '#0093BB',
        fontSize : 14,
        fontFamily : "bold"
    },
    inputView : {
        flex : 1,
        padding : 10,
        justifyContent : "center"
    },
    inputText : {
        fontSize : 18,
    },
    listHeader : {
        color : "#000000",
        fontSize : 18,
        fontWeight : "bold",
        marginTop : 70,
        paddingHorizontal : 20
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#ECEEF0',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    rowBack2: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    deleteButton: {
        backgroundColor: '#4F9B90',
        padding: 10,
        height : "100%",
        alignItems : "center",
        justifyContent : "center",
        width : 75
    },
    deleteButton2: {
        backgroundColor: '#4F9B90',
        padding: 10,
        width : 80,
        height : "100%",
        alignItems : "center",
        justifyContent : "center"
    },
    deleteButton3: {
        backgroundColor: '#E6767F',
        padding: 10,
        width : 80,
        height : "100%",
        alignItems : "center",
        justifyContent : "center"
    },
    deleteText: {
        color: '#fff',
        fontWeight: '500',
    },
    rowFront: {
        backgroundColor : "#ECEEF0",
        height: 80,
        overflow: 'hidden',
        flexDirection: 'row',
        paddingLeft : 20,
        alignItems : 'center',
        borderBottomColor : "#d2d4d9",
        borderBottomWidth : .5
    },
    sectionSix : {
        backgroundColor: '#002646',
        width : 30,
        height : 30,
        borderRadius : 30,
        justifyContent : 'center',
        alignItems : "center"
    },
    sectionSeven : {
        flex : 1,
        justifyContent : 'center',
        paddingHorizontal : 15
    },
    textHeader : {
        fontSize : 14,
        fontWeight : "600",
        color : "black",
        paddingHorizontal : 20
    }
})

export default SavedLists;