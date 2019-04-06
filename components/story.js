import React from "react";
import { Image, Dimensions, StyleSheet, TouchableWithoutFeedback, View } from "react-native";

const { width: wWidth, height: wHeight } = Dimensions.get('window');
const thumbnailWidth = wWidth / 2 - 10 * 2;
const thumbnailHeight = wHeight / 3;

class Story extends React.Component {
  ref = React.createRef();

  measure() {
    return new Promise(resolve => 
      this.ref.current.measureInWindow((x, y, width, height) => {
        resolve({x, y, width, height});
      })
    )
  }

  render() {
    const { story, selected, onSelectStory } = this.props;
    if (selected) return <View style={styles.thumbnail}/>
    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onSelectStory}>
          <Image ref={this.ref} style={styles.thumbnail} source={story.source} />
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8
  },
  thumbnail: {
    width: thumbnailWidth,
    height: thumbnailHeight,
    borderRadius: 10
  }
});

export default Story;
