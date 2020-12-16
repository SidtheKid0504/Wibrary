import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Search extends React.Component {
    render() {
        return(
            <View style={styles.container}>
                <Text style={styles.displayText}>Search For Student</Text>
            </View>
        )
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
    }
});