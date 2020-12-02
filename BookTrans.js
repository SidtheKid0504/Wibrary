// Imports
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import { askAsync } from 'expo-permissions';

// Default Book Trans Class
export default class BookTransaction extends React.Component {
    // Custom Constructor with States
    constructor() {
        super();
        this.state = {
            hasCameraPermission: null,
            scanned: false,
            scanData: '',
            buttonState: "normal"
        }
    }

    getCam = async () => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status === "granted",
            buttonState: "clicked",
            scanned: false
        });
    }

    handleBarCodeScanned = async ({ type, data }) => {
        this.setState({
            scanned: true,
            scanData: data,
            buttonState: "normal"
        })
        alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    render() {
        const hasCameraPermissions = this.state.hasCameraPermission;
        const scan = this.state.scanned;
        const buttonState = this.state.buttonState;

        if (buttonState === "clicked" && hasCameraPermissions) {
            return(
                <BarCodeScanner onBarCodeScanned = {scan ? undefined : this.handleBarCodeScanned}>

                </BarCodeScanner>
            ) 
        } else if (buttonState === "normal"){
            return (
                <View style={styles.container}>
                    <Text style={styles.displayText}>{
                        (hasCameraPermissions === true)? this.state.scanData : 'Request Camera Permission'
                    }</Text>
                    <TouchableOpacity style={styles.scanButton} onpress = {() => {
                        this.getCam;
                    }}>
                        <Text>Scan QR Code</Text>
                    </TouchableOpacity>
                </View>
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
        fontSize: 18,
    },
    ButtonText: {
        textDecorationLine: 'underline',
        fontSize: 18,
        color: '#FFFFFF'
    },
    scanButton: {
        margin: 20,
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#FF0000',
        borderWidth: 3
    }
});