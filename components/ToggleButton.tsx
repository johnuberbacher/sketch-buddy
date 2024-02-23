import { TouchableHighlight, View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import COLORS from "../constants/colors";
import { Audio } from "expo-av";

const LetterButton = (props) => {
  const baseColor = COLORS[props.color] || COLORS.red;
  const darkColor = COLORS[`${props.color}Dark`] || COLORS.redDark;
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
    isPressed && !props.selected && styles.buttonInnerPressed,
    props.selected && styles.buttonInnerSelected,
    {
      backgroundColor: props.selected ? props.selected : baseColor,
    },
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
        {props.title}
      </Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonInner: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#f86134",
    aspectRatio: 1,
    width: "auto",
    height: "auto",
    padding: 15,
  },
  buttonInnerPressed: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#000000",
    aspectRatio: 1,
    width: "auto",
    height: "auto",
    padding: 15,
  },
  buttonInnerSelected: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#000000",
    aspectRatio: 1,
    width: "auto",
    height: "auto",
    padding: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
    textTransform: "capitalize",
  },
});

export default LetterButton;
