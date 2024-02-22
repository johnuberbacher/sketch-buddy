import {
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect } from "react";
import COLORS from "../constants/colors";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

const Button = (props) => {
  const [isPressed, setIsPressed] = useState(false);
  const [sound, setSound] = useState();

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
      fontSize: props.size === "small" ? 18 : 20,
    },
  ]);

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

  const getColorArray = () => {
    const color = props.color ? COLORS[props.color] : COLORS.secondary;
    const colorDark = props.color
      ? COLORS[props.color + "Dark"]
      : COLORS.secondaryDark;

    return [color, colorDark];
  };

  return (
    <TouchableHighlight
      activeOpacity={0.9}
      style={styles.buttonOuter}
      disabled={props.selected}
      onPress={() => {
        if (props.onPress) {
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
                  style={{ width: 30, height: 30, marginLeft: -10 }}
                  source={require("../assets/c.png")}
                  resizeMode={"contain"}></ImageBackground>
              ))}
            </View>
          ) : null}
        </View>
      </LinearGradient>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonOuter: {
    flex: 1,
    borderRadius: 40,
    elevation: 1,
    overflow: "hidden",
  },
  buttonInner: {
    borderRadius: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 15,
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
  },
});

export default Button;
