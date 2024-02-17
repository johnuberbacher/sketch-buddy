import { TouchableHighlight, View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import COLORS from "../constants/colors";
import { Audio } from "expo-av";

const Button = (props) => {
  const baseColor = COLORS[props.color] || COLORS.red;
  const darkColor = COLORS[`${props.color}Dark`] || COLORS.redDark;
  const [isPressed, setIsPressed] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const handlePressIn = async () => {
    setIsPressed(true);
    const { sound } = await Audio.Sound.createAsync(
      require("./../assets/sfx/sfx01.mp3")
    );
    setSound(sound);
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
      height: props.buttonSize || 60,
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
        <Text selectable={false} style={styles.buttonText}>
          {props.title}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonOuter: {
    flex: 1,
    backgroundColor: "#b93109",
    paddingBottom: 10,
    borderRadius: 15,
    elevation: 2,
  },
  buttonOuterPressed: {
    flex: 1,
    backgroundColor: "#b93109",
    paddingBottom: 3,
    borderRadius: 15,
    elevation: 2,
  },
  buttonOuterSelected: {
    flex: 1,
    backgroundColor: "#636d6f",
    paddingBottom: 3,
    borderRadius: 15,
    elevation: 2,
  },
  buttonInner: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#f86134",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    height: 70,
    marginTop: -10,
    textTransform: "capitalize",
  },
  buttonInnerPressed: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#f86134",
    height: 70,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: -3,
  },
  buttonInnerSelected: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#9da8ae",
    height: 70,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: -3,
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
