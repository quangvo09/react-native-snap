import React from "react";
import { View, StyleSheet } from "react-native";
import Stories from './stories';
import { stories } from '../common/constants';

class Discovery extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Stories {... { stories }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Discovery;
