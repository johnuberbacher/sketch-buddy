import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Image,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import { supabase } from "../lib/supabase";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Nav from "../components/Nav";
import Canvas from "../components/Canvas";
import LetterBoard from "../components/LetterBoard";
import NewButton from "../components/NewButton";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import FlatButton from "../components/FlatButton";
import COLORS from "../constants/colors";
import Avatar from "../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";

export default function Leaderboard() {
  const [loading, setLoading] = useState(true);
  const [remoteData, setRemoteData] = useState([]);
  const [username, setUsername] = useState("juberbacher");
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigation = useNavigation();

  // fetch games where user1 or user2 === username
  //

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    //  if (session) getProfile();
    getProfile();
  }, []);

  async function getProfile() {
    try {
      setLoading(true);
      console.log("Fetching data from 'games' table...");

      const { data, error, status } = await supabase.from("games").select("*");

      if (error && status !== 406) {
        console.error("Error fetching data:", error);
        throw error;
      }

      if (data) {
        console.log("Data fetched successfully:", data);
        setRemoteData(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in getProfile:", error.message);
        alert(error.message);
      }
    } finally {
      setLoading(false);
      console.log("Loading state set to false.");
    }
  }

  return (
    <>
      <Nav />
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.secondary,
          width: "100%",
          gap: 20,
          flexDirection: "column",
        }}>
        <View
          style={{
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              fontSize: 34,
              fontFamily: "Kanit-Bold",
              color: COLORS.text,
            }}>
            Leaderboard
          </Text>
        </View>
        <View style={styles.menu}>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    padding: 20,
    marginTop: 0,
    gap: 20,
  },
  menuInner: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 20,
    backgroundColor: "#feeede",
    borderRadius: 15,
    gap: 20,
  },
  usernameTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textYourMove: {
    color: "white",
    fontSize: 24,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
    textTransform: "capitalize",
  },
  textHoursAgo: {
    color: "white",
    fontSize: 24,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
    textTransform: "capitalize",
  },
});
