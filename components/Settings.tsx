import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Button from "../components/Button";

const Settings = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      props.onClose();
    });
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.overlay}>
        <View style={styles.overlayOuter}>
          <View style={styles.overlayInner}>
            <Text selectable={false} style={styles.overlayTitle}>
              Settings
            </Text>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
              }}>
              <View
                style={{
                  width: "100%",
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "strech",
                  gap: 0,
                }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    marginTop: 30,
                  }}>
                  <Button title="Mute" />
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    marginTop: 30,
                  }}>
                  <Button title="Logout" />
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    marginTop: 30,
                  }}>
                  <Button title="Close" onPress={onClose} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
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
    padding: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayOuter: {
    width: "100%",
    maxWidth: 400,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#229f99",
    borderRadius: 15,
    paddingBottom: 15,
    elevation: 10,
  },
  overlayInner: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#2ed3cc",
    borderRadius: 15,
  },
  overlayTitle: {
    width: "100%",
    color: "white",
    fontSize: 30,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Settings;
