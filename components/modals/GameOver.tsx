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

const GameOver = ({ user, opponent, onClose }) => {
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
                gap: 20,
              }}>
              <View
                style={{
                  width: 80,
                }}>
                <Avatar user={user} />
              </View>
              <View style={{}}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={30}
                  color={COLORS.red}
                />
              </View>
              <View
                style={{
                  width: 80,
                }}>
                <Avatar user={opponent} />
              </View>
            </View>
            <Text
              style={{
                width: "100%",
                height: "auto",
                fontSize: 18,
                fontFamily: "Kanit-Regular",
                color: COLORS.text,
                textAlign: "center",
                paddingHorizontal: 20,
                flexWrap: "wrap",
              }}>
              Your streak has ended.
            </Text>
            <Text
              style={{
                width: "100%",
                height: "auto",
                fontSize: 18,
                marginTop: -20,
                fontFamily: "Kanit-Regular",
                color: COLORS.text,
                textAlign: "center",
                paddingHorizontal: 20,
                flexWrap: "wrap",
              }}>
              Try again!
            </Text>
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

const styles = StyleSheet.create({
});

export default GameOver;
