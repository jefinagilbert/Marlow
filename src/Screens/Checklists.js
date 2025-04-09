import React, {useEffect, useRef, useState} from "react";
import { Pressable, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { SwipeRow } from 'react-native-swipe-list-view';
import { getLists, saveLists, getPreDoc } from "../LocalStorage";

const Checklists = ({navigationMethod}) => {

    const [lists, setLists] = useState([]);
    const rowRefs = useRef({});
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const resp = await getLists("perlists");
        setLists(resp);
        const data = await getPreDoc();
        let add = 0;
        data.forEach(item => {
            if(item.completed !== "no" || item.submitted)
            add += 1;
        });
        setPercentage(Math.round((add / data?.length) * 100));
    }

    const handleDelete = (index) => {
        rowRefs.current[index]?.closeRow();
        setTimeout(async () => {
            const updatedLists = [...lists];
            updatedLists.splice(index, 1);
            setLists(updatedLists);
            await saveLists("perlists", updatedLists);
        }, 200); 
    };

    return(
        <View style={styles.container}>
            <View style={styles.statusBar}>
                <Pressable style={styles.backIcon}>
                    <MaterialIcons name="arrow-back-ios" size={22} color="black" />
                </Pressable>
                <Text style={styles.headerText}>Checklists</Text>
            </View>
            <View style={styles.sectionTwo}>
                <Text style={styles.textOne}>Pre-Departure Documents List</Text>
                <Text style={styles.textTwo}>List of all required documents for your upcoming assignment</Text>
            </View>
            <Pressable style={styles.sectionThree} onPress={() => navigationMethod("predepdoc")}>
                <View style={styles.sectionFive}>
                    <View style={styles.sectionFour}>
                        <AnimatedCircularProgress
                            size={40}
                            width={2}
                            fill={percentage}
                            rotation={360}
                            tintColor="#042875"
                            onAnimationComplete={() => console.log('onAnimationComplete')}
                            backgroundColor="#ffffff" />
                            <Text style={styles.percentText}>{percentage}%</Text>
                    </View>
                    <Text style={styles.textThree}>Review List</Text>
                </View>
                <MaterialIcons name="arrow-forward-ios" size={15} color="#c9c7c7" />
            </Pressable>
            <View style={styles.sectionTwo}>
                <Text style={styles.textOne}>My Checklists</Text>
                <Text style={styles.textTwo}>Create your own personal checklist</Text>
            </View>
            <ScrollView contentContainerStyle={{paddingBottom : 30}} showsVerticalScrollIndicator={false}>
                {
                    lists?.map((item, index) => {
                        return(
                            <SwipeRow 
                                ref={(ref) => {
                                    if (ref && !rowRefs.current[index]) {
                                        rowRefs.current[index] = ref;
                                    }
                                }}
                                key={index} style={{marginTop : 10}} rightOpenValue={-75} disableRightSwipe
                            >
                                <View style={styles.rowBack}>
                                    <TouchableOpacity style={styles.deleteButton} 
                                        onPress={() => handleDelete(index)}
                                    >
                                        <MaterialCommunityIcons name="delete" size={20} color="white" />
                                        <Text style={styles.deleteText}>DELETE</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.rowFront}>
                                    <View>
                                        <Text style={styles.textFour}>{item.title}</Text>
                                        <Text style={styles.textFive}>Date created: {item.timestamp}</Text>
                                        <Text style={styles.textFive}>Last item added: {item.lists[0].value}</Text>
                                    </View>
                                    <Pressable onPress={() => navigationMethod("savedlists", index)}>
                                        <MaterialIcons name="arrow-forward-ios" size={15} color="#c9c7c7" />
                                    </Pressable>
                                </View>
                            </SwipeRow>
                        )
                    })
                }
            </ScrollView>
            <View style={styles.sectionSeven}>
                <Pressable 
                    onPress={() => navigationMethod("addnew")}
                    style={{padding : 4, backgroundColor : "#e3e9ff", borderRadius : 30}}>
                    <Ionicons name="add-circle" color="#042875" size={45} />
                </Pressable>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        padding : 20,
        backgroundColor : "#ECEEF0"
    },
    statusBar : {
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center"
    },
    headerText : {
        fontSize : 18,
        fontWeight : "bold",
        color : "black"
    },
    backIcon : {
        position : "absolute",
        left : 0
    },
    sectionTwo : {
        flexDirection : "column"
    },
    textOne : {
        fontSize : 16,
        color : "black",
        fontWeight : "500",
        marginTop : 25
    },
    textTwo : {
        fontSize : 14,
        color : "black",
        fontStyle : "italic",
        marginTop : 2
    },
    sectionThree : {
        backgroundColor : "white",
        width : "100%",
        height : 80,
        flexDirection : "row",
        justifyContent : "space-between",
        alignItems : "center",
        borderRadius : 7,
        shadowColor: "#0000000F",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        marginTop : 10,
        paddingHorizontal : 10
    },
    textThree : {
        color : "black",
        fontSize : 15,
        marginLeft : 20
    },
    percentText : {
        position : "absolute",
        fontWeight : "600",
        fontSize : 14,
        color : "black"
    },
    sectionFour : {
        justifyContent : 'center',
        alignItems : "center"
    },
    sectionFive : {
        flexDirection : "row",
        alignItems : "center",
    },
    textFour : {
        color : "black",
        fontSize : 15,
    },
    textFive : {
        fontSize : 13,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#E6767F',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 15,
        borderRadius: 15,
      },
      deleteButton: {
        backgroundColor: '#E6767F',
        padding: 10,
        borderRadius: 5,
        alignItems : "center"
      },
      deleteText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      rowFront: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 80,
        justifyContent: 'center',
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        overflow: 'hidden',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems : "center"
      },
      title: {
        fontSize: 16,
      },
      sectionSeven : {
        position : "absolute",
        right : 20,
        bottom : 40
      }
});

export default Checklists;