import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppLoading, Asset } from 'expo';

import Discovery from './components/discovery';
import { stories } from './common/constants';

export default class App extends React.Component {
  state = {
    isReady: false
  }

  async componentDidMount() {
    const promises = stories.map(s => Promise.all([
      Asset.loadAsync(s.source),
      s.video ? Asset.loadAsync(s.video) : undefined,
    ]));
    await Promise.all(promises)
    this.setState({ isReady: true });
  }
  
  render() {
    if (!this.state.isReady) return <AppLoading />

    return (
      <View style={styles.container}>
        <Discovery />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
