import { View, ImageBackground, Text, StyleSheet } from "react-native";
import Button from "../components/Button";
import React, { useLayoutEffect } from "react";
import COLORS from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

const Landing = (props) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.overlay}>
      <View style={styles.overlayOuter}>
        <View style={styles.overlayInner}>
          <Text selectable={false} style={styles.overlayTitle}>
            Play Now!
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
                style={{ width: "100%", flexDirection: "row", marginTop: 30 }}>
                <Button
                  title="Github Login"
                  onPress={() => {
                    navigation.navigate("Home");
                  }}
                />
              </View>
              <View
                style={{ width: "100%", flexDirection: "row", marginTop: 30 }}>
                <Button
                  title="Facebook Login"
                  onPress={() => {
                    navigation.navigate("Draw");
                  }}
                />
              </View>
              <View
                style={{ width: "100%", flexDirection: "row", marginTop: 30 }}>
                <Button title="Leaderboard" />
              </View>
              <View
                style={{ width: "100%", flexDirection: "row", marginTop: 30 }}>
                <Button title="Quit" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.blue,
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
    elevation: 5,
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

export default Landing;
