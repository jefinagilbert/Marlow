import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AddNew = ({navigationMethod}) => {


    const [input, setInput] = useState("");

    return(
        <View style={styles.container}>
            <Pressable style={styles.backButton} onPress={() => navigationMethod("checklists")}>
                <MaterialIcons name="arrow-back-ios" size={25} color="black" />
            </Pressable>
            { input !== "" && <Pressable style={styles.doneButton} onPress={() => navigationMethod("addlists", { title : input })}>
                <Text style={styles.doneText}>Done</Text>
            </Pressable>}
            <TextInput 
                style={styles.inputView}
                placeholder="Insert lists's title"
                value={input}
                onChangeText={(val) => setInput(val)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1, 
        backgroundColor : "#002646AA",
        padding : 20
    },
    backButton : {
        backgroundColor : "white",
        width : 40,
        height : 40,
        borderRadius : 30,
        alignItems : "center",
        justifyContent : "center",
        paddingLeft : 10
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
        backgroundColor : "white",
        width : "100%",
        borderRadius : 7,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        height : 80,
        marginTop : 67,
        fontSize : 18,
        padding : 10
    }
})

export default AddNew;