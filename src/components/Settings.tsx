import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import Button from "./Button";
import COLORS from "../constants/colors";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Avatar from "./Avatar";
import {
  fetchUserProfile,
  updateUserAvatar,
  updateUsername,
  updateGameData,
  fetchUserGames,
} from "../util/DatabaseManager";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import TextField from "./input/Text";

interface Props {
  size: number;
  url: string | null;
  onClose: () => void;
}

const Settings = ({ onClose, user }) => {
  const [loading, setLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState([]);
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const [buttonText, setButtonText] = useState("Close");

  useEffect(() => {
    if (user) getProfile();
  }, []);

  // useEffect(() => {
  //   if (avatarUrl) downloadImage(avatarUrl);
  // }, [avatarUrl]);

  async function downloadImage(path: string) {
    if (path !== null) {
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
  }

  async function getProfile() {
    setLoading(true);

    // Load profile data
    await fetchUserProfile(user).then(async ({ data, error }) => {
      if (error) {
        console.error("Error fetching user profile:", error);
      } else {
        await setCurrentUserData(data);
        await setUsername(data.username);
        await downloadImage(data.avatar_url);
      }

      setLoading(false);
    });
  }

  async function uploadAvatar() {
    try {
      setLoading(true);
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 0.5,
        exif: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];

      const manipResult = await ImageManipulator.manipulateAsync(
        image.uri,
        [
          { resize: { width: 200, height: 200 } },
          { crop: { originX: 0.5, originY: 0.5, width: 200, height: 200 } },
        ],
        { compress: 0.5, format: ImageManipulator.SaveFormat.PNG }
      );

      if (manipResult.error) {
        throw new Error(`Image manipulation error: ${manipResult.error}`);
      }

      const arraybuffer = await fetch(manipResult.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = manipResult.uri.split(".").pop().toLowerCase();
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: manipResult.mimeType || "image/*",
        });

      if (uploadError) {
        alert(uploadError.message);
      }

      if (data) {
        console.log("Image uploaded", data.path);
        setAvatarUrl(data.path);
        await updateUserAvatar(user, path);
        await getProfile();
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
      setLoading(false);
    }
  }

  function changedUsername(text: string) {
    setUsername(text);
    if (buttonText !== "Save") setButtonText("Save");
  }

  async function saveClose() {

    if (username !== currentUserData.username) {
      setLoading(true);
      if (username.length > 3 && /[a-zA-Z0-9]/.test(username)) {
        await updateUsername(user, username);
        
        // Load games list
        await fetchUserGames(currentUserData.id).then(async ({ data, error }) => {
          if (error) {
            console.error("Error updating user data:", error);
          } else {
            if (data) {
              data.forEach(async (game) => {
                const columnToUpdate =
                  game.user1 === currentUserData.id ? "user1username" : "user2username";
                const newUsername =
                  game.user1 === currentUserData.id ? username : username;
                // Update games with new username
                try {
                  const { data, error } = await supabase
                    .from("games")
                    .update({
                      [columnToUpdate]: newUsername,
                    })
                    .eq("id", game.id);

                  return { data, error };
                } catch (error) {
                  console.error("Error updating game data:", error);
                  return { data: null, error };
                }
              });
            }
          }
        });

        setLoading(false);
        onClose();
      } else {
        alert(
          "Invalid username. Please enter a username longer than 3 characters and containing at least one letter or number."
        );
        setLoading(false);
        return;
      }
    } else {
      onClose();
    }
  }
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
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              width: "100%",
              gap: 20,
            }}>
            <View
              style={{
                width: "30%",
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
                gap: 15,
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  position: "relative",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={uploadAvatar}
                disabled={uploading}>
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    borderRadius: 200,
                    zIndex: 1,
                  }}>
                  <MaterialCommunityIcons
                    style={{
                      position: "absolute",
                      alignSelf: "center",
                      margin: "auto",
                      zIndex: 1,
                    }}
                    name="camera"
                    size={50}
                    color="white"
                  />
                </View>
                {currentUserData.avatar_url ? (
                  <>
                    <Image
                      source={{ uri: avatarImage }}
                      accessibilityLabel="Avatar"
                      resizeMode="cover"
                      style={{
                        borderRadius: 200,
                        width: "100%",
                        height: "auto",
                        aspectRatio: 1,
                        flexDirection: "row",
                        marginHorizontal: "auto",
                      }}
                    />
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        borderRadius: 200,
                        width: "100%",
                        height: "auto",
                        aspectRatio: 1,
                        flexDirection: "row",
                        marginHorizontal: "auto",
                        backgroundColor: currentUserData.color,
                      }}></View>
                  </>
                )}
              </TouchableOpacity>
              {/*<Button
                color="secondary"
                size="small"
                title={uploading ? "Uploading ..." : "Upload Image"}
                onPress={uploadAvatar}
                disabled={uploading}
                  />*/}
            </View>
            <TextField
              label={"Username"}
              value={username || ""}
              placeholder={undefined}
              onChangeText={(text) => changedUsername(text)}
            />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 10,
              }}>
              <Button
                size="small"
                color="secondary"
                title="Sign Out"
                onPress={() => supabase.auth.signOut()}
              />
              <Button
                size="small"
                color="secondary"
                title="Mute Audio Off"
                onPress={() => null}
              />
            </View>
            <View
              style={{
                height: 2,
                width: "100%",
                backgroundColor: "#000",
                opacity: 0.05,
              }}></View>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                gap: 15,
              }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}>
                <Button
                  color="primary"
                  title={buttonText}
                  onPress={saveClose}
                />
              </View>
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
    backgroundColor: "rgba(0,0,0,0.25)",
    // rgb(255, 193, 90, 0.5)
    zIndex: 10,
    padding: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayInner: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1.0)",
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
    fontSize: 24,
    fontFamily: "Kanit-SemiBold",
    color: COLORS.text,
    textAlign: "center",
  },
});

export default Settings;
