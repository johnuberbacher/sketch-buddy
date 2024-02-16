import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  Pressable,
  Image,
} from "react-native";
import React from "react";
import Nav from "../components/Nav";
import Canvas from "../components/Canvas";
import LetterBoard from "../components/LetterBoard";
import Avatar from "../components/Avatar";
import FlatButton from "../components/FlatButton";
import COLORS from "../constants/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";

const Draw = (route, navigation) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { word } = route.params;
  console.log("word:", word);

  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}>
        <Text>{word}</Text>
        <Canvas />
      </View>
    </>
  );
};

export default Draw;
