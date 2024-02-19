import { TouchableHighlight, View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import COLORS from "../constants/colors";
import { Audio } from 'expo-av';


const LetterButton = (props) => {
  const baseColor = COLORS[props.color] || COLORS.red;
  const darkColor = COLORS[`${props.color}Dark`] || COLORS.redDark;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = async () => {
    setIsPressed(true);
    const { sound } = await Audio.Sound.createAsync(
      require('./../assets/sfx/sfx01.mp3')
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
  
  const buttonOuterStyles = StyleSheet.flatten([
    styles.buttonOuter,
    isPressed && !props.selected && styles.buttonOuterPressed,
    props.selected && styles.buttonOuterSelected,
    {
      backgroundColor: props.selected ? props.selected : darkColor,
    },
  ]);
  
  return (
    <TouchableHighlight
      activeOpacity={1.0}
      style={buttonOuterStyles}
      disabled={props.selected}
      onPress={() => {
        if (props.onPress) {
          props.onPress();
        }
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={buttonInnerStyles}>
        <Text selectable={false} style={{ ...styles.buttonText }}>{props.title}</Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonOuter: {
    flex: 1,
    backgroundColor: "#b93109",
    borderRadius: 15,
    elevation: 2,
  },
  buttonOuterPressed: {
    flex: 1,
    backgroundColor: "#b93109",
    borderRadius: 15,
    elevation: 2,
  },
  buttonOuterSelected: {
    flex: 1,
    backgroundColor: "#b93109",
    borderRadius: 15,
    elevation: 2,
  },
  buttonInner: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#f86134",
    marginTop: -10,
    marginBottom: 10,
    aspectRatio: 1,
  },
  buttonInnerPressed: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#f86134",
    marginTop: -3,
    marginBottom: 3,
    aspectRatio: 1,
  },
  buttonInnerSelected: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#9da8ae",
    marginTop: -3,
    marginBottom: 3,
    aspectRatio: 1,
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
