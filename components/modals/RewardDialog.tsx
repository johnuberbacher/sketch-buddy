import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Button from "../Button";
import React, { useState, useEffect } from "react";
import Avatar from "../Avatar";
import COLORS from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import ProgressBar from "../ProgressBar";

const RewardDialog = ({ user, opponent, difficulty, onClose }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sfx/reward.mp3")
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
                <Avatar user={user} />
              </View>
              <View
                style={{
                  width: 80,
                }}>
                <Avatar user={opponent} />
              </View>
            </View>
            <ProgressBar></ProgressBar>
            <View
              style={{
                width: "100%",
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
                  color: COLORS.secondaryDark,
                  textAlign: "center",
                  paddingHorizontal: 20,
                  flexWrap: "wrap",
                }}>
                Rank Experience
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  maxWidth: 300,
                  marginHorizontal: "auto",
                }}>
                <Text
                  style={{
                    textAlign: "center",
                    minWidth: 40,
                    fontSize: 18,
                    fontFamily: "Kanit-Bold",
                    color: COLORS.text,
                  }}>
                  0
                </Text>
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    height: 20,
                    borderRadius: 15,
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}>
                  <View
                    style={{
                      height: "100%",
                      width: "100%",
                    }}></View>
                </View>
                <Text
                  style={{
                    textAlign: "center",
                    minWidth: 40,
                    fontSize: 18,
                    fontFamily: "Kanit-Bold",
                    color: COLORS.text,
                  }}>
                  100
                </Text>
              </View>
              <Text
                style={{
                  width: "100%",
                  height: "auto",
                  fontSize: 20,
                  fontFamily: "Kanit-Bold",
                  color: COLORS.secondaryDark,
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
                  marginLeft: -10,
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
                      style={{ width: 30, height: 30, marginLeft: 10 }}
                      source={require("../../assets/c.png")}
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
              <Button
                color="primary"
                title="Return Home"
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

const styles = StyleSheet.create({});

export default RewardDialog;
