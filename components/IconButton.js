import { TouchableHighlight, View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import COLORS from "../constants/colors";
import { Audio } from "expo-av";
import { Feather } from "@expo/vector-icons";

const Button = (props) => {
  const baseColor = COLORS[props.color] || COLORS.red;
  const darkColor = COLORS[`${props.color}Dark`] || COLORS.redDark;
  const [isPressed, setIsPressed] = useState(false);

  const {
    iconName = "settings",
    iconSize = 30,
    iconLibrary = "Feather",
  } = props;

  // Manually handle different icon libraries
  let IconComponent;
  switch (iconLibrary) {
    case "Feather":
      IconComponent = Feather;
      break;
    // Add more cases for other icon libraries if needed

    default:
      IconComponent = Feather; // Default to Feather if no valid icon library is provided
      break;
  }

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
    isPressed && !props.selected && styles.buttonInnerPressed, // Apply pressed styles only if not selected
    props.selected && styles.buttonInnerSelected,
    {
      backgroundColor: props.selected ? props.selected : baseColor,
    },
  ]);

  const buttonOuterStyles = StyleSheet.flatten([
    styles.buttonOuter,
    isPressed && !props.selected && styles.buttonOuterPressed, // Apply pressed styles only if not selected
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
          props.onPress(); // Call the onPress handler from the parent component
        }
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <View style={buttonInnerStyles}>
        <IconComponent
          name={iconName}
          size={iconSize}
          color="white"
          style={{ position: "relative", zIndex: 1 }}
        />
        <IconComponent
          name={iconName}
          size={iconSize}
          color="rgba(0, 0, 0, 0.25)"
          style={{ paddingTop: 6, position: "absolute", zIndex: 0 }}
        />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonOuter: {
    flex: 1,
    backgroundColor: "#b93109",
    paddingBottom: 2.5,
    borderRadius: 15,
    elevation: 2,
  },
  buttonOuterPressed: {
    flex: 1,
    backgroundColor: "#b93109",
    paddingBottom: 2.5,
    borderRadius: 15,
    elevation: 2,
  },
  buttonInner: {
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#f86134",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: -5,
    textTransform: "capitalize",
  },
  buttonInnerPressed: {
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#f86134",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
    textTransform: "uppercase",
  },
});

export default Button;
