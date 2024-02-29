import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import NewButton from "../Button";
import React, { useState, useEffect } from "react";
import Avatar from "../Avatar";
import COLORS from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const ConfirmDialog = ({ user, opponent, onClose }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sfx/dialog.mp3")
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
                  name="transfer-right"
                  size={30}
                  color={COLORS.primary}
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
              Your drawing was sent to juberbacher!
            </Text>
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
});

export default ConfirmDialog;
