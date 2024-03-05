import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import COLORS from "../constants/colors";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

const Button = (props) => {
  const [isPressed, setIsPressed] = useState(false);

  const buttonInnerStyle = StyleSheet.flatten([
    styles.buttonInner,
    {
      paddingTop: props.size === "small" ? 5 : 15,
      paddingBottom: props.size === "small" ? 5 : 15,
    },
  ]);

  const buttonTextStyle = StyleSheet.flatten([
    styles.buttonText,
    {
      fontSize: props.size === "small" ? 16 : 20,
      textShadowColor: props.disabled ? "transparent" : "rgba(0, 0, 0, 0.25)",
      color: props.disabled ? "#d8d8d8" : "white",
    },
  ]);

  const coingImageSource = props.disabled
    ? require("../../assets/coin-disabled.png")
    : require("../../assets/coin.png");

  const handlePressIn = async () => {
    setIsPressed(true);
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sfx/click.mp3")
    );
    await sound.playAsync();
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const getColorArray = () => {
    if (props.disabled) {
      return [COLORS.gray, COLORS.grayDark];
    }

    const color = props.color ? COLORS[props.color] : COLORS.secondary;
    const colorDark = props.color
      ? COLORS[props.color + "Dark"]
      : COLORS.secondaryDark;

    return [color, colorDark];
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.buttonOuter}
      disabled={props.disabled || props.selected} // Make the button unclickable/selectable when disabled
      onPress={() => {
        if (props.onPress && !props.disabled) {
          props.onPress();
        }
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <LinearGradient
        style={{ borderRadius: 40 }}
        colors={getColorArray()}
        start={{ x: 0.4, y: 0 }}
        end={{ x: 0.6, y: 1 }}>
        <View style={buttonInnerStyle}>
          <Text selectable={false} style={buttonTextStyle}>
            {props.title}
          </Text>
          {props.reward ? (
            <View style={styles.buttonReward}>
              {Array.from({ length: props.reward }, (_, index) => (
                <ImageBackground
                  key={index}
                  style={{ width: 30, height: 30, marginLeft: -5 }}
                  source={coingImageSource}
                  resizeMode={"contain"}></ImageBackground>
              ))}
            </View>
          ) : null}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonOuter: {
    flex: 1,
    overflow: "hidden",
  },
  buttonInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    textTransform: "capitalize",
    gap: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Kanit-SemiBold",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonReward: {
    flexDirection: "row",
    marginLeft: -15,
  },
});

export default Button;
