import {
  ImageBackground,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import COLORS from "../constants/colors";
import { Audio } from "expo-av";

const image = { uri: "https://avatars.githubusercontent.com/u/5966499?v=4" };

const Avatar = (props) => {
  return (
    <View style={styles.buttonInner}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={styles.image}>
      <Text style={{ ...styles.buttonText }}>{props.title}</Text></ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  buttonInner: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    aspectRatio: 1,
    width: "100%",
    height: "auto",
    textTransform: "capitalize",
    aspectRatio: 1,
    borderColor: "white",
    borderWidth: 2,
    elevation: 1,
    overflow: "hidden",
  },
});

export default Avatar;
