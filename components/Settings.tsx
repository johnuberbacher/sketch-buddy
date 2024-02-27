import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import NewButton from "./NewButton";
import COLORS from "../constants/colors";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

interface Props {
  size: number;
  url: string | null;
  onClose: () => void;
}

const Settings = ({ onClose, user }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const navigation = useNavigation();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarImage, setAvatarImage] = useState("");
  const avatarSize = { height: 500, width: 500 };

  useEffect(() => {
    if (user) getProfile();
  }, []);

  // useEffect(() => {
  //   if (avatarUrl) downloadImage(avatarUrl);
  // }, [avatarUrl]);

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

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log("User profile fetched:");
        console.log(data);
        //  setUsername(data.username);
        await downloadImage(data.avatar_url);
        // setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile(path: string) {
    console.log("Updating profile", user, path);

    try {
      // Update user
      const updateUser = await supabase
        .from("profiles")
        .update({ avatar_url: path })
        .eq("id", user);

      if (updateUser.error) {
        throw new Error(
          `Error updating user ${user}: ${updateUser.error.message}`
        );
      }

      await getProfile();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function uploadAvatar() {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
        allowsMultipleSelection: false, // Can only select one image
        allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
        quality: 1,
        exif: false, // We don't want nor need that data.
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);

      if (!image.uri) {
        throw new Error("No image uri!"); // Realistically, this should never happen, but just in case...
      }

      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/*",
        });

      if (uploadError) {
        //  throw uploadError;
        alert(uploadError.message);
      }

      if (data) {
        console.log("Image uploaded", data.path);
        setAvatarUrl(data.path);
        await updateProfile(data.path);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
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
                width: "50%",
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "center",
                gap: 20,
              }}>
              {avatarImage ? (
                <Image
                  source={{ uri: avatarImage }}
                  accessibilityLabel="Avatar"
                  style={{
                    borderRadius: 200,
                    width: "100%",
                    height: "auto",
                    aspectRatio: 1,
                    flexDirection: "row",
                    marginHorizontal: "auto",
                  }}
                />
              ) : (
                <View
                  style={{
                    borderRadius: 200,
                    width: "100%",
                    height: "auto",
                    aspectRatio: 1,
                    flexDirection: "row",
                    marginHorizontal: "auto",
                    backgroundColor: COLORS.primary,
                  }}></View>
              )}
              <NewButton
                color="secondary"
                title={uploading ? "Uploading ..." : "Upload Image"}
                onPress={uploadAvatar}
                disabled={uploading}
              />
            </View>
            <TextInput
              style={{
                width: "100%",
                color: COLORS.text,
                fontSize: 18,
                fontFamily: "Kanit-Medium",
                paddingHorizontal: 20,
                paddingVertical: 15,
                backgroundColor: "rgba(255,255,255,0.5)",
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.25)",
                borderStyle: "solid",
                borderRadius: 40,
                elevation: 0,
              }}
              placeholderTextColor="rgba(0,0,0,0.5)"
              onChangeText={(text) => null}
              value=""
              placeholder="Username"
              autoCapitalize="none"
            />
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 20,
              }}>
              <NewButton
                color="secondary"
                title="Mute Audio Off"
                onPress={() => null}
              />
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                gap: 20,
              }}>
              <NewButton
                color="secondary"
                title="Sign Out"
                onPress={() => supabase.auth.signOut()}
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
                <NewButton
                  title="Save"
                  color="primary"
                  onPress={() => supabase.auth.signOut()}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                }}>
                <NewButton
                  color="secondary"
                  title="Close"
                  onPress={() => onClose()}
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
