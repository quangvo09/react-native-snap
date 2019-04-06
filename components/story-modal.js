import React from "react";
import { Dimensions, View, Image, StyleSheet } from "react-native";
import Animated from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Video } from 'expo';

const { width: wWidth, height: wHeight } = Dimensions.get('window');

const {
  and,
  or,
  call,
  set,
  block,
  cond,
  eq,
  lessOrEq,
  add,
  multiply,
  lessThan,
  spring,
  startClock,
  stopClock,
  clockRunning,
  interpolate,
  greaterThan,
  greaterOrEq,
  sub,
  defined,
  Value,
  Clock,
  event,
} = Animated;

function runSpring(value, dest) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    toValue: new Value(0),
    damping: 50,
    mass: 1,
    stiffness: 200,
    overshootClamping: true,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.velocity, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    set(value, state.position),
  ]);
}

function runSpringClose(value, dest) {
  const clock = new Clock();
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    toValue: new Value(0),
    damping: 10,
    mass: 1,
    stiffness: 100,
    overshootClamping: false,
    restSpeedThreshold: 0.01,
    restDisplacementThreshold: 0.01,
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.velocity, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    spring(clock, state, config),
    cond(state.finished, stopClock(clock)),
    set(value, state.position),
  ]);
}

class StoryModal extends React.Component {
  constructor(props) {
    super(props);

    const { x, y, width, height } = props.position;
    this.clock = new Clock();
    this.translateX = new Value(x);
    this.translateY = new Value(y);
    this.transformWidth = new Value(width);
    this.transformHeight = new Value(height);
    this.velocityY = new Value(0);
    this.state = new Value(State.UNDETERMINED);
    this.borderRadius = new Value(10);
    this.onGestureEvent = event([
      { 
        nativeEvent: { 
          translationX: this.translateX, 
          translationY: this.translateY, 
          velocityY: this.velocityY,
          state: this.state
        } 
      }],
      { useNativeDriver: true },
    );
  }

  render() {
    const { 
      onGestureEvent, translateX, translateY, transformWidth, transformHeight
    } = this;
    const { story, position, onRequestClose } = this.props;
    const animationStyle = {
      width: transformWidth,
      height: transformHeight,
      transform: [
        { translateX },
        { translateY },
      ],
      borderRadius: 10
    }
    return (
      <View style={styles.container}>
        <Animated.Code>
          { ()=>
            block([
              cond(eq(this.state, State.UNDETERMINED), runSpring(this.translateX, 0)),
              cond(eq(this.state, State.UNDETERMINED), runSpring(this.translateY, 0)),
              cond(eq(this.state, State.UNDETERMINED), runSpring(this.transformWidth, wWidth)),
              cond(eq(this.state, State.UNDETERMINED), runSpring(this.transformHeight, wHeight)),
              cond(eq(this.state, State.UNDETERMINED), runSpring(this.borderRadius, 0)),
              
              cond(eq(this.state, State.ACTIVE), set(this.borderRadius, 10)),
              cond(eq(this.state, State.ACTIVE), set(this.transformWidth, interpolate(this.translateY, {
                inputRange: [0, wHeight - position.height],
                outputRange: [wWidth, position.width],
              }))),
              cond(eq(this.state, State.ACTIVE), set(this.transformHeight, interpolate(this.translateY, {
                inputRange: [0, wHeight - position.height],
                outputRange: [wHeight, position.height],
              }))),
              
              cond(and(eq(this.state, State.END), lessOrEq(this.velocityY, 0)), [
                runSpring(this.borderRadius, 0),
                runSpring(this.translateX, 0),
                runSpring(this.translateY, 0),
                runSpring(this.transformWidth, wWidth),
                runSpring(this.transformHeight, wHeight),
              ]),
              cond(and(eq(this.state, State.END), greaterThan(this.velocityY, 0)), [
                runSpring(this.borderRadius, 10),
                runSpring(this.translateX, position.x),
                runSpring(this.translateY, position.y),
                runSpring(this.transformWidth, position.width),
                runSpring(this.transformHeight, position.height),
                cond(lessOrEq(this.transformHeight, position.height + 0.5), call([], onRequestClose)),
              ]),
            ])
          }
        </Animated.Code>
        <PanGestureHandler
          activeOffsetY={10}
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onGestureEvent}
        >
          <Animated.View style={animationStyle}>
            { story.video &&
              <Video
                source={story.video}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping
                style={[styles.video]}
              />
            }

            { !story.video &&
              <Animated.Image style={[styles.thumbnail, { borderRadius: this.borderRadius }]} source={story.source} />
            }
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    width: null,
    height: null,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    borderRadius: 5,
  },
});

export default StoryModal;
