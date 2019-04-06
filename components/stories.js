import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Story from "./story";
import StoryModal from './story-modal';
import { SafeAreaView } from 'react-navigation';
import { BlurView } from 'expo';

class Stories extends React.Component {
  state = {
    selectedStory: null,
    selectedIndex: -1,
    position: null
  };

  constructor(props) {
    super(props);

    this.storyRefs = props.stories.map(() => React.createRef());
  }

  onSelectStory = async (selectedStory, selectedIndex) => {
    const position = await this.storyRefs[selectedIndex].current.measure();
    this.setState({
      selectedStory,
      selectedIndex,
      position
    });
  }

  onRequestClose = () => {
    this.setState({
      selectedStory: null,
      selectedIndex: -1
    });
  }

  render() {
    const { stories } = this.props;
    const { onSelectStory, onRequestClose } = this;
    const { selectedStory, selectedIndex, position } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={styles.container}
          bounces={false}
          showsHorizontalScrollIndicator={false}
        >
          <SafeAreaView style={styles.content}>
            {stories.map((story, index) => (
              <Story
                key={story.id}
                ref={this.storyRefs[index]}
                {...{ story }}
                onSelectStory={() => onSelectStory(story, index)}
                selected={selectedIndex === index}
              />
            ))}
          </SafeAreaView>
        </ScrollView>
        { selectedStory && (
          <StoryModal story={selectedStory} {...{ position, onRequestClose }}/>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  }
});

export default Stories;
