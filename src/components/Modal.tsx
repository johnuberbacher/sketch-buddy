import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
  ScrollView,
} from "react-native";
import COLORS from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

const Modal = ({ props, title, children }) => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      props.onClose();
    });
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <ImageBackground
        style={{
          flex: 1,
          width: "100%",
          height: "auto",
          maxWidth: 500,
          padding: 20,
          marginHorizontal: "auto",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        blurRadius={50}
        resizeMode="cover">
        <View style={styles.overlayInner}>
          <Text selectable={false} style={styles.overlayTitle}>
            {title}
          </Text>
          <View
            style={{
              width: "100%",
              height: 2,
              backgroundColor: "#000",
              opacity: 0.05,
            }}></View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: "auto",
            }}>
            <View
              style={{
                width: "100%",
                height: "auto",
              }}>
              <ScrollView
                contentContainerStyle={{
                  height: "auto",
                  padding: 0,
                  gap: 20,
                }}>
                <>{children}</>
              </ScrollView>
            </View>
          </View>
        </View>
      </ImageBackground>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 10,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayInner: {
    width: "100%",
    height: "auto",
    padding: 20,
    gap: 20,
    backgroundColor: "rgba(255,255,255,1.0)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1.0)",
    borderStyle: "solid",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 2,
  },
  overlayTitle: {
    width: "100%",
    fontSize: 24,
    fontFamily: "Kanit-SemiBold",
    color: COLORS.text,
    textAlign: "center",
    paddingTop: 5,
    paddingHorizontal: 10,
    lineHeight: 30,
  },
});

export default Modal;
