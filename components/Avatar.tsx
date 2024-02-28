import {
  ImageBackground,
  TouchableHighlight,
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import COLORS from "../constants/colors";
import { supabase } from "../lib/supabase";

const Avatar = ({ user }) => {
  const image = { uri: "https://avatars.githubusercontent.com/u/5966499?v=4" };
  const isWeb = Platform.OS === "web";
  const [avatarImage, setAvatarImage] = useState("");

  useEffect(() => {
    if (user.avatar_url) {
      const fetchData = async () => {
        await downloadImage(user.avatar_url);
      };
      fetchData();
    }
  }, [user.avatar_url]);

  async function downloadImage(path: string) {
    try {
      const response = await supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      if (!response.data) {
        alert("Error downloading image");
      }

      setAvatarImage(response.data.publicUrl);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error downloading image: ", error.message);
      }
    }
  }

  return (
    <View
      style={{
        flexDirection: "column",
        width: "100%",
        height: "auto",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "transparent",
      }}>
      {user.level && (
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
            {user.level}
          </Text>
        </View>
      )}
      <View style={styles.buttonInner}>
        {user.avatar_url ? (
          <ImageBackground
            source={{ uri: avatarImage }}
            resizeMode="cover"
            style={styles.image}></ImageBackground>
        ) : null}
        {!user.avatar_url && user.username ? (
          <View
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: user.color
            }}>
            <Text
              style={{
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                width: "100%",
                height: "auto",
                color: "white",
                fontSize: 20,
                fontFamily: "Kanit-SemiBold",
              }}>
              {user.username.slice(0, 1)}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    elevation: 0,
    aspectRatio: 1,
    backgroundColor: "transparent",
  },
  buttonInner: {
    width: "100%",
    height: "auto",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 100,
    aspectRatio: 1,
    textTransform: "capitalize",
    borderColor: "white",
    borderWidth: 5,
    overflow: "hidden",
    elevation: 0,
  },
});

export default Avatar;
