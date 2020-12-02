import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import BookTransaction from './screens/BookTrans';
import Search from './screens/Search';

export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  SearchScreen: {screen: Search},
  BookTransactionScreen: {screen: BookTransaction}
});

const AppContainer = createAppContainer(TabNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
