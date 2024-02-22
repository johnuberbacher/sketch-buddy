import {
  ImageBackground,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import React, { useState } from "react";
import COLORS from "../constants/colors";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";

const Avatar = (props) => {
  const image = { uri: "https://avatars.githubusercontent.com/u/5966499?v=4" };
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={{
        flexDirection: "column",
        width: 55,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
      {isWeb ? (
        <View
          style={{
            position: "absolute",
            bottom: -3,
            right: -3,
            zIndex: 1,
            elevation: 1,
            backgroundColor: COLORS.secondary,
            borderRadius: 5,
            paddingHorizontal: 5,
            borderWidth: 4,
            borderColor: "white",
            borderStyle: "solid",
          }}>
          <Text
            style={{
              marginTop: -8,
              fontSize: 16,
              textAlign: "center",
            }}
            selectable={false}>
            🇺🇸
          </Text>
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            bottom: -3,
            right: -3,
            zIndex: 1,
            elevation: 1,
          }}>
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
            }}
            selectable={false}>
            🇺🇸
          </Text>
        </View>
      )}
      <View style={styles.buttonInner}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <Text style={{ ...styles.buttonText }}>{props.title}</Text>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
    elevation: 0,
  },
  buttonInner: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    aspectRatio: 1,
    width: "100%",
    height: "auto",
    textTransform: "capitalize",
    borderColor: "white",
    borderWidth: 5,
    overflow: "hidden",
    elevation: 0,
  },
});

export default Avatar;
