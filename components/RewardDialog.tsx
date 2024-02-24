import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import NewButton from "../components/NewButton";
import React, { useState, useEffect } from "react";
import Avatar from "../components/Avatar";
import COLORS from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const RewardDialog = ({ difficulty, onClose }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("./../assets/sfx/reward.mp3")
      );
      await sound.playAsync();
    };

    playSound();
  }, []);

  return (
    <>
      {loading ? (
        <View
          style={{
            paddingVertical: 40,
            height: "100%",
            width: "100%",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : (
        <>
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                gap: 40,
              }}>
              <View
                style={{
                  width: 80,
                }}>
                <Avatar />
              </View>
              <View
                style={{
                  width: 80,
                }}>
                <Avatar />
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 10,
              }}>
              <Text
                style={{
                  width: "100%",
                  height: "auto",
                  fontSize: 20,
                  fontFamily: "Kanit-Bold",
                  color: COLORS.secondary,
                  textAlign: "center",
                  paddingHorizontal: 20,
                  flexWrap: "wrap",
                }}>
                Coins Earned
              </Text>
              <View
                style={{
                  height: "auto",
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingLeft: 5,
                }}>
                {Array.from(
                  {
                    length:
                      difficulty === "easy"
                        ? 1
                        : difficulty === "medium"
                        ? 2
                        : 3,
                  },
                  (_, index) => (
                    <ImageBackground
                      style={{ width: 30, height: 30, marginLeft: -5 }}
                      source={require("../assets/c.png")}
                      resizeMode={"contain"}></ImageBackground>
                  )
                )}
              </View>
            </View>
            <View
              style={{
                width: "100%",
                height: "auto",
                flexDirection: "row",
              }}>
              <NewButton
                color="primary"
                title="Continue"
                onPress={() => {
                  onClose();
                }}
              />
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(33, 33, 33, 0.9)",
    zIndex: 10,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayInner: {
    width: "100%",
    maxWidth: 400,
    marginHorizontal: "auto",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    borderStyle: "solid",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 0,
  },
  overlayTitle: {
    width: "100%",
    color: "white",
    fontSize: 24,
    fontFamily: "Kanit-SemiBold",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
    textAlign: "center",
    marginBottom: 20,
  },
});

export default RewardDialog;
