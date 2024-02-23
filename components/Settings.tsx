import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
} from "react-native";
import NewButton from "../components/NewButton";
import COLORS from "../constants/colors";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

const Settings = ({ session }: { session: Session }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    //   if (session) getProfile();
  }, [session]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const onClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      props.onClose();
    });
  };

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.overlay}>
        <ImageBackground
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          blurRadius={50}
          resizeMode="cover">
          <View style={styles.overlayInner}>
            <Text selectable={false} style={styles.overlayTitle}>
              Settings
            </Text>
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: "#000",
                opacity: 0.05,
              }}></View>
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
                }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                  }}>
                  <NewButton title="Mute" />
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    marginTop: 20,
                  }}>
                  <NewButton
                    title="Logout"
                    onPress={() => supabase.auth.signOut()}
                  />
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    marginTop: 20,
                  }}>
                  <NewButton title="Close" onPress={() => onClose()} />
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
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
