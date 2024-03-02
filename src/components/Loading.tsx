import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import COLORS from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

const Loading = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <ActivityIndicator
        size="large"
        color="white"
        style={{ transform: [{ scale: 2 }] }}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    zIndex: 10,
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loading;
