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

const Avatar = ({ level }) => {
  const image = { uri: "https://avatars.githubusercontent.com/u/5966499?v=4" };
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={{
        flexDirection: "column",
        width: "100%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
      {level !== "null" && (
        <View
          style={{
            position: "absolute",
            bottom: -5,
            right: -5,
            zIndex: 1,
            width: "auto",
            height: "auto",
            borderRadius: 6,
            borderWidth: 4,
            borderColor: "white",
            borderStyle: "solid",
          }}>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Kanit-Bold",
              textAlign: "center",
              color: "white",
              borderRadius: 5,
              backgroundColor: COLORS.primary,
              paddingHorizontal: 5,
              minWidth: 18,
            }}
            selectable={false}>
            {level}
          </Text>
        </View>
      )}
      <View style={styles.buttonInner}>
        <ImageBackground
          source={image}
          resizeMode="cover"
          style={styles.image}></ImageBackground>
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
    aspectRatio: 1,
  },
  buttonInner: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
