// Imports
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, Alert, KeyboardAvoidingView} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import { askAsync } from 'expo-permissions';
import firebase from 'firebase'
import db from '../config';

// Default Book Trans Class
export default class BookTransaction extends React.Component {
    // Custom Constructor with States
    constructor() {
        super();
        this.state = {
            hasCameraPermission: null,
            scanned: false,
            buttonState: "normal",
            scanBookID: '',
            scanStudentID: '',
            transactionMessage: ''
        }
    }

    getCam = async (id) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === "granted",
            buttonState: id,
            scanned: false
        });
    }

    handleBarCodeScanned = async ({ type, data }) => {
        const {buttonState} = this.state;
        if (buttonState === "BookID") {
            this.setState({
                scanned: true,
                scanBookID: data,
                buttonState: "normal"
            });
        } else if (buttonState === "StudentID") {
            this.setState({
                scanned: true,
                scanStudentID: data,
                buttonState: "normal"
            });
        }
    };

    handleTransaction = async() => {
        var transactionMessage = "";
        await db.collection("books").doc(this.state.scanBookID).get().
        then((doc)=> {
            var bookInfo = doc.data();
            if (bookInfo.bookAvailable === true) {
                this.initateBookIssue();
                transactionMessage = "Book Issued";
            } else {
                this.initateBookReturn();
                transactionMessage = "Book Returned";
            }
        });
        this.setState({
            transactionMessage: transactionMessage
        })
    }

    initateBookIssue = async() => {
        await db.collection("transactions").add({
            studentID: this.state.scanStudentID,
            bookID: this.state.scanBookID,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactionType: "issue"
        });

        await db.collection("books").doc(this.state.scanBookID).update({
           bookAvailable: false 
        });

        await db.collection("students").doc(this.state.scanStudentID).update({
            numOfBooksIssued: firebase.firestore.FieldValue.increment(1)
        });
        Alert.alert("Book Issued");
        this.setState({
            scanBookID: '',
            scanStudentID: ''
        });
    }

    initateBookReturn = async() => {
        await db.collection("transactions").add({
            studentID: this.state.scanStudentID,
            bookID: this.state.scanBookID,
            date: firebase.firestore.Timestamp.now().toDate(),
            transactionType: "return"
        });

        await db.collection("books").doc(this.state.scanBookID).update({
           bookAvailable: true
        });

        await db.collection("students").doc(this.state.scanStudentID).update({
            numOfBooksIssued: firebase.firestore.FieldValue.increment(-1)
        });
        Alert.alert("Book Returned");
        this.setState({
            scanBookID: '',
            scanStudentID: ''
        });
    }

    render() {
        const hasCameraPermissions = this.state.hasCameraPermission;
        const scan = this.state.scanned;
        const buttonState = this.state.buttonState;

        if (buttonState != "normal" && hasCameraPermissions) {
            return(
                <BarCodeScanner 
                onBarCodeScanned = {scan ? undefined : this.handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
                >
                </BarCodeScanner>
            ) 
        } else if (buttonState === "normal"){
            return (
                <KeyboardAvoidingView style={styles.container} behavior= "padding" enabled>
                    <View>
                        <Image 
                        source=  {require("../assets/booklogo.jpg")}
                        style={{width: 200, height: 200}}
                        />
                        <Text style={styles.displayText}>Wibrary</Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput 
                        placeholder= "Book ID" 
                        style={styles.inputBox}
                        value={this.state.scanBookID}
                        onChangeText = {text => {
                            this.setState({
                                scanBookID: text
                            })
                        }}
                        />
                        <TouchableOpacity style={styles.scanButton} onPress = {
                            ()=> {
                                this.getCam("BookID");
                            }}
                            >
                            <Text style={styles.buttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput 
                        placeholder= "Student ID" 
                        style={styles.inputBox}
                        value={this.state.scanStudentID}
                        onChangeText = {text => {
                            this.setState({
                                scanStudentID: text
                            })
                        }}
                        />
                        <TouchableOpacity style={styles.scanButton} onPress = {
                            ()=> {
                                this.getCam("StudentID");
                            }}>
                            <Text style={styles.buttonText}>Scan</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity style={styles.submitButton} onPress={async () => {
                        this.handleTransaction();
                    }}> 
                    <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                    
                </KeyboardAvoidingView>
            );   
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    displayText: {
        textDecorationLine:'underline',
        fontSize: 30,
        textAlign: 'center'
    },
    buttonText: {
        marginTop: 15,
        textDecorationLine: 'underline',
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center'
    },
    scanButton: {
        width: 100,
        borderRadius: 20,
        backgroundColor: '#0000FF',
        borderWidth: 2
    },
    inputView : {
        flexDirection: 'row',
        margin: 20
    },
    inputBox: {
        width: 200,
        height: 50,
        borderWidth: 2,
        borderRadius: 10,
        fontSize: 20,
    },
    submitButton: {
        backgroundColor: 'red',
        width: 100,
        height: 50
    }
});