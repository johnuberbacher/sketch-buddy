import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  Pressable,
  Image,
} from "react-native";
import React, { useState } from "react";
import Nav from "../components/Nav";
import Canvas from "../components/Canvas";
import LetterBoard from "../components/LetterBoard";
import Avatar from "../components/Avatar";
import FlatButton from "../components/FlatButton";
import COLORS from "../constants/colors";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import ConfirmDialog from "../components/ConfirmDialog";

const Draw = ({ route, navigation }) => {
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const { word } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const toggleConfirmDialogVisible = () => {
    setIsConfirmDialogVisible(!isConfirmDialogVisible);
  };

  const submitDrawing = () => {
    console.log("YOOOO")
    toggleConfirmDialogVisible();
  };

  const onConfirmDialog = () => {
    setIsConfirmDialogVisible(false);
    navigation.navigate("Home");
  };

  return (
    <>
      {isConfirmDialogVisible && (
        <ConfirmDialog  onClose={() => onConfirmDialog()} />
      )}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}>
        <Canvas onSubmitDraw={submitDrawing} word={word} />
      </View>
    </>
  );
};

export default Draw;
