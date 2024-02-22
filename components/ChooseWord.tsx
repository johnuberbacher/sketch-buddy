import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import NewButton from "./NewButton";
import COLORS from "../constants/colors";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";

const ChooseWord = (props) => {
  const [loading, setLoading] = useState(true);
  const [remoteData, setRemoteData] = useState([]);
  const navigation = useNavigation();

  async function fetchWords() {
    try {
      setLoading(true);

      const easyWord = await supabase
        .from("words")
        .select("word, difficulty")
        .eq("difficulty", "easy")
        .limit(1)
        .single();
      const mediumWord = await supabase
        .from("words")
        .select("word, difficulty")
        .eq("difficulty", "medium")
        .limit(1)
        .single();
      const hardWord = await supabase
        .from("words")
        .select("word, difficulty")
        .eq("difficulty", "hard")
        .limit(1)
        .single();

      const data = [easyWord, mediumWord, hardWord];

      if (data.some((item) => item.error && item.status !== 406)) {
        console.error(
          "Error fetching data:",
          data.map((item) => item.error)
        );
        throw new Error("Error fetching data");
      }

      console.log("Data fetched successfully:", data);
      setRemoteData(data);

      // If you want to access individual fields from each word, you can do something like:
      // const easyWordData = easyWord?.data;
      // const mediumWordData = mediumWord?.data;
      // const hardWordData = hardWord?.data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in fetchWords:", error.message);
        alert(error.message);
      }
    } finally {
      setLoading(false);
      console.log("Loading state set to false.");
    }
  }

  const selectWord = (word, reward) => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Draw", params: { word: word, reward: reward } }],
    });
    props.onClose();
  };

  useEffect(() => {
    //  if (session) getProfile();
    fetchWords();
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
          {remoteData.map((word, index) => (
            <View
              key={word.data.word}
              style={{
                width: "100%",
                flexDirection: "row",
              }}>
              <NewButton
                color="primary"
                title={word.data.word}
                reward={index + 1}
                onPress={() => {
                  selectWord(word.data.word, index);
                }}
              />
            </View>
          ))}
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

export default ChooseWord;
