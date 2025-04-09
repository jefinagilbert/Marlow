import React, {useEffect, useState} from "react";
import { Pressable, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SwipeRow } from 'react-native-swipe-list-view';
import LinearGradient from 'react-native-linear-gradient';
import { departureHeaders } from "../Constants/constants";
import { getPreDoc, savePreDoc } from "../LocalStorage";


const donePng = require("../Assets/Images/done.png");

const PreDepartureDocuments = ({navigationMethod}) => {

    const [activeTab, setActiveTab] = useState("STCW National");
    const [preData, setPreData] = useState([]);
    const [count, setCount] = useState(0);
    const [openModal, setOpenModal] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
      const data = await getPreDoc();
      setPreData(data);
      setCount(0);
      data.forEach(item => {
        if(item.completed !== "no" || item.submitted)
        setCount(prev => prev+1);
      })
    }

    const toggleCompleted = async (id, status) => {
        const updatedDocs = preData.map(doc => {
          if (doc.id === id) {
            return {
              ...doc,
              completed: status
            };
          }
          return doc;
        });
        await savePreDoc(updatedDocs);
        fetchData();
        if(status === "yes") {
            setOpenModal("modal2");
            setTimeout(() => setOpenModal(""), 1500);
        }
    }

    const handleSubmit = async () => {
        setOpenModal("modal2");
        const updatedDocs = preData.map(doc => {
            if (doc.id === 1) {
              return {
                ...doc,
                submitted : true
              };
            }
            return doc;
          });
          await savePreDoc(updatedDocs);
          fetchData();
          setTimeout(() => setOpenModal(""), 1500);
    }

    if(openModal === "modal1") {
        return(
            <View style={styles.modalContainer}>
                <View style={styles.messageBox}>
                    <View style={styles.msSectionOne}>
                        <Text style={styles.msText}>Have you informed your Manning Agency that this document is ready?</Text>
                    </View>
                    <View style={styles.msSectionTwo}>
                        <Pressable onPress={() => setOpenModal("")} style={styles.msSectionThree}>
                            <Text style={styles.msText2}>No</Text>
                        </Pressable>
                        <Pressable style={styles.msSectionThree} onPress={handleSubmit}>
                            <Text style={styles.msText2}>Yes</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        )
    }

    if(openModal === "modal2") {
        return(
            <View style={styles.modalContainer}>
                <Image source={donePng} style={{width : 100, height : 100}} />
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <View style={styles.statusBar}>
                <Pressable style={styles.backIcon} onPress={() => navigationMethod("checklists")}>
                    <MaterialIcons name="arrow-back-ios" size={22} color="black" />
                </Pressable>
                <Text style={styles.headerText}>Pre-Departure Documents List</Text>
            </View>
            <View style={styles.sectionTwo}>
                <Text style={styles.textOne}>{Math.round((count / preData?.length) * 100)}% completed</Text>
                <View style={styles.linearGradientBox}>
                    <LinearGradient
                        colors={['#005AA5', '#0091BA', '#85C9BF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.gradientBox, {width : `${Math.round((count / preData?.length) * 100)}%`}]}
                    />
                </View>
            </View>
            <View style={styles.sectionThree}>
                <ScrollView 
                    contentContainerStyle={styles.sectionFour} horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        departureHeaders.map((item, index) => {
                            return(
                                <TouchableOpacity 
                                    key={index} 
                                    onPress={() => setActiveTab(item.title)}
                                    style={activeTab === item.title ? styles.tabActive : styles.tabInactive}
                                >   
                                    {item.important && <AntDesign name="exclamationcircleo" color="red" size={12} />}
                                    <Text style={activeTab === item.title ? styles.tabActiveText : styles.tabInactiveText}>{item.title}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
            <ScrollView contentContainerStyle={styles.sectionFive}>
                <Text style={styles.textTwo}>
                    Items should only be ticked off once the corresponding original paper document has been added to your Blue Pouch in preparation for departure.
                </Text>
                <Text style={styles.textThree}>
                    Pending
                </Text>
                <View style={{width : "100%"}}>
                    {
                        preData.map((item, index) => {
                            if(item.completed === "yes" || item.completed === "skip") return;
                            if(item.type === "skip") {
                                return(
                                    <SwipeRow key={index} rightOpenValue={-150} disableRightSwipe>
                                        <View style={styles.rowBack2}>
                                            <TouchableOpacity style={styles.deleteButton2} onPress={() => toggleCompleted(item.id, "yes")}>
                                                <AntDesign name="checkcircleo" size={20} color="white" />
                                                <Text style={styles.deleteText}>Done</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.deleteButton3} onPress={() => toggleCompleted(item.id, "skip")}>
                                                <AntDesign name="minuscircleo" size={20} color="white" />
                                                <Text style={styles.deleteText}>Skip</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.rowFront}>
                                            <View style={styles.sectionSix}>
                                                <View style={item.type === "attention" ? styles.sectionSix : styles.sectionNine}>
                                                {item.type === "mandatory" ? <AntDesign name="exclamationcircleo" color="red" size={24} /> :
                                                    <Ionicons name="document-text" color="white" size={15} />}
                                                </View>
                                            </View>
                                            <View style={styles.sectionSeven}>
                                                <View style={{flexDirection : "column"}}>
                                                    <Text style={styles.textFour}>{item.title}</Text>
                                                    <Text style={styles.textFour}>{item.docNumber}</Text>
                                                    <Text style={[styles.textFour, {position : "absolute", right : 10}]}>{item.type === "skip" && "(Optional)"}</Text>
                                                </View>
                                                <View style={styles.sectionEight}>
                                                    <Text style={styles.textFive}>Issue date: {item.issueDate}</Text>
                                                    <Text style={styles.textFive}>Exp. date: {item.expDate}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </SwipeRow>
                                )
                            } else {
                                return(
                                    <SwipeRow key={index} rightOpenValue={-75} disableRightSwipe disableLeftSwipe={item.submitted}>
                                        <View style={styles.rowBack}>
                                            <TouchableOpacity style={styles.deleteButton} onPress={() => item.type === "attention" ? setOpenModal("modal1") : toggleCompleted(item.id, "yes")}>
                                                <AntDesign name="checkcircleo" size={20} color="white" />
                                                <Text style={[styles.deleteText, item?.submitted && {color : "#AAAAAA"}]}>{item.type === "attention" ? "Submitted" : "Done"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.rowFront}>
                                            <View style={styles.sectionSix}>
                                                <View style={item.type === "attention" ? styles.sectionSix : styles.sectionNine}>
                                                {item.type === "attention" ? item?.submitted ? 
                                                <MaterialCommunityIcons name="clock-time-nine" size={24} color="#005AA5" />
                                                :  <AntDesign name="exclamationcircleo" color="red" size={24} /> :
                                                    <Ionicons name="document-text" color="white" size={15} />}
                                                </View>
                                            </View>
                                            <View style={styles.sectionSeven}>
                                                <View style={{flexDirection : "column"}}>
                                                    <Text style={[styles.textFour, item?.submitted && {color : "#AAAAAA"}]}>{item.title}</Text>
                                                    <Text style={[styles.textFour, item?.submitted && {color : "#AAAAAA"}]}>{item.docNumber}</Text>
                                                    <Text style={[styles.textFour, {position : "absolute", right : 10}, item?.submitted && {color : "#AAAAAA"}]}>{item.type === "skip" && "(Optional)"}</Text>
                                                </View>
                                                <View style={styles.sectionEight}>
                                                    <Text style={[styles.textFive, item?.submitted && {color : "#AAAAAA"}]}>Issue date: {item.issueDate}</Text>
                                                    <Text style={[styles.textFive, item?.submitted && {color : "#AAAAAA"}]}>Exp. date: {item.expDate}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </SwipeRow>
                                )
                            }
                        })
                    }
                </View>
                <Text style={styles.textThree}>
                    Completed
                </Text>
                <View style={{width : "100%"}}>
                    {
                        preData.map((item, index) => {
                            if(item.completed === "no") return;
                            return(
                                <SwipeRow key={index} rightOpenValue={-75} disableRightSwipe>
                                    <View style={styles.rowBack}>
                                        <TouchableOpacity style={styles.deleteButton4} onPress={() => toggleCompleted(item.id, "no")}>
                                            <Entypo name="circle" size={20} color="white" />
                                            <Text style={styles.deleteText}>Uncheck</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.rowFront}>
                                        <View style={styles.sectionSix}>
                                            <View style={styles.sectionNine}>
                                            {item.completed === "skip" ? <AntDesign name="minus" color="white" size={24} /> :
                                                <MaterialIcons name="done" color="white" size={15} />}
                                            </View>
                                        </View>
                                        <View style={styles.sectionSeven}>
                                            <View style={{flexDirection : "column"}}>
                                                <Text style={[styles.textFour, {color : "#AAAAAA"}]}>{item.title}</Text>
                                                <Text style={[styles.textFour, {color : "#AAAAAA"}]}>{item.docNumber}</Text>
                                                <Text style={[styles.textFour, {position : "absolute", right : 10, color : "#AAAAAA"}]}>{item.type === "skip" && "(Optional)"}</Text>
                                            </View>
                                            <View style={styles.sectionEight}>
                                                <Text style={[styles.textFive, {color : "#AAAAAA"}]}>Issue date: {item.issueDate}</Text>
                                                <Text style={[styles.textFive, {color : "#AAAAAA"}]}>Exp. date: {item.expDate}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </SwipeRow>
                            )
                        })
                    }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        paddingTop : 20
    },
    modalContainer : {
        flex : 1,
        backgroundColor : "#002646",
        justifyContent : "center",
        alignItems : "center",
    },
    messageBox : {
        width : 248,
        height : 168,
        backgroundColor : "white",
        borderRadius : 6
    },
    statusBar : {
        flexDirection : "row",
        justifyContent : "center",
        alignItems : "center",
        paddingHorizontal : 20,
    },
    headerText : {
        fontSize : 18,
        fontWeight : "bold",
        color : "black"
    },
    backIcon : {
        position : "absolute",
        left : 20
    },
    sectionTwo : {
        flexDirection : "column",
        marginTop : 20,
        paddingHorizontal : 20
    },
    linearGradientBox : {
        width : "100%",
        height : 8,
        borderWidth : 1,
        borderColor : "#ECEEF0",
        marginTop : 8,
        borderRadius : 30,
        borderStyle : "dotted"
    },
    gradientBox: {
        height : "100%",
        borderRadius : 30
    },
    textOne : {
        fontSize : 12,
        color : "black",
        fontWeight : "400",
        textAlign : "right"
    },
    sectionThree : {
        width : "100%",
        marginTop : 30,
        paddingHorizontal : 20,
    },
    percentText : {
        position : "absolute",
        fontWeight : "600",
        fontSize : 14,
        color : "black"
    },
    sectionFour : {
        height : "100%"
    },
    tabActive : {
        paddingHorizontal : 6,
        borderBottomColor : "#005AA5",
        borderBottomWidth : 2,
        marginHorizontal : 8,
        justifyContent : "center",
        alignItems : "center",
        flexDirection : "row",
        paddingBottom : 5
    },
    tabInactive : {
        paddingHorizontal : 6,
        marginHorizontal : 8,
        justifyContent : "center",
        alignItems : "center",
        flexDirection : "row",
        paddingBottom : 5
    },
    tabActiveText : {
        color : "#005AA5",
        fontSize : 14,
        marginLeft : 5,
        fontWeight : "bold"
    },
    tabInactiveText : {
        color : "#8FAABF",
        fontSize : 14,
        fontWeight : "bold"
    },
    sectionFive : {
        backgroundColor : "#ECEEF0",
        width : "100%",
        marginTop : 20,
        paddingVertical : 20
    },
    textTwo : {
        textAlign : "left",
        fontSize : 12,
        color : "black",
        fontStyle : "italic",
        paddingHorizontal : 20,
    },
    textThree : {
        color : "black",
        fontSize : 14,
        fontWeight : "bold",
        marginTop : 20,
        paddingHorizontal : 20,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
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
        width : 75,
        height : "100%",
        backgroundColor: '#002646',
        padding: 10,
        alignItems : "center",
        justifyContent : "center"
    },
    deleteButton2: {
        backgroundColor: '#4F9B90',
        padding: 10,
        width : 75,
        height : "100%",
        alignItems : "center",
        justifyContent : "center"
    },
    deleteButton3: {
        backgroundColor: '#002646',
        padding: 10,
        width : 75,
        height : "100%",
        alignItems : "center",
        justifyContent : "center"
    },
    deleteButton4: {
        backgroundColor: '#4F9B90',
        padding: 10,
        width : 75,
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
        borderBottomColor : "#C7CBCE",
        borderBottomWidth : .5
    },
    sectionSix : {
        width : 30,
        justifyContent : 'center',
        alignItems : "center"
    },
    sectionSeven : {
        flex : 1,
        justifyContent : 'center',
        paddingHorizontal : 15
    },
    sectionEight : {
        width : "100%",
        flexDirection : "row",
        justifyContent : "space-between",
        marginTop : 6
    },
    textFour : {
        fontSize : 12,
        color : "black",
    },
    textFive : {
        color : "#707070",
        fontSize : 12
    },
    sectionNine : {
        width : 25, 
        height : 25, 
        backgroundColor : "#002646", 
        borderRadius : 30, 
        justifyContent : "center", 
        alignItems : 'center'
    },
    msSectionOne : {
        height : 128,
        width : "100%",
        justifyContent : "center",
        alignItems : "center",
        paddingHorizontal : 50
    },
    msText : {
        fontSize : 16,
        fontWeight : "bold",
        color : "black",
        textAlign : "center"
    },
    msSectionTwo : {
        height : 40,
        width : "100%",
        flexDirection : "row"
    },
    msSectionThree : {
        width : "50%",
        height : "100%",
        justifyContent : "center",
        alignItems : "center",
        borderTopColor : "#C7CBCE",
        borderTopWidth : .5,
        borderRightColor : "#C7CBCE",
        borderRightWidth : .5
    },
    msText2 : {
        fontSize : 16,
        fontWeight : "500",
        color : "#002646",
        textAlign : "center"
    }
});

export default PreDepartureDocuments;