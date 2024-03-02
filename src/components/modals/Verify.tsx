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
  
  const Verify = ({ onClose }) => {
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
              
            </View>
          </>
        )}
      </>
    );
  };
  
  const styles = StyleSheet.create({
  });
  
  export default Verify;
  