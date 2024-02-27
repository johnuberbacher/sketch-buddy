import { TouchableHighlight, View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import COLORS from "../constants/colors";
import { Audio } from "expo-av";

const LetterButton = (props) => {
  const baseColor = COLORS[props.color] || COLORS.primary;
  const darkColor = COLORS[`${props.color}Dark`] || COLORS.primaryDark;

  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = async () => {
    setIsPressed(true);
    const { sound } = await Audio.Sound.createAsync(
      require("./../assets/sfx/sfx01.mp3")
    );
    await sound.playAsync();
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };
  const buttonInnerStyles = StyleSheet.flatten([
    styles.buttonInner,
    {
      backgroundColor: props.selected ? props.selected : baseColor,
    },
    isPressed && !props.selected && styles.buttonInnerPressed,
    props.selected && styles.buttonInnerSelected,
  ]);

  return (
    <TouchableHighlight
      activeOpacity={1.0}
      style={buttonInnerStyles}
      disabled={props.selected}
      onPress={() => {
        if (props.onPress) {
          props.onPress();
        }
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Text selectable={false} style={{ ...styles.buttonText }}>
        {!props.selected ? props.title : ''}
      </Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonInner: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    flexShrink: 1,
    elevation: 2,
  },
  buttonInnerPressed: {
    backgroundColor: COLORS.primary,
  },
  buttonInnerSelected: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "lightgray",
    aspectRatio: 1,
    width: "100%",
    height: "100%",
    flexShrink: 1,
    elevation: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontFamily: "Kanit-SemiBold",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textTransform: "capitalize",
  },
});

export default LetterButton;
