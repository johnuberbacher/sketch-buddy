import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import React, { useLayoutEffect } from "react";
import Nav from "../components/Nav";
import Canvas from "../components/Canvas";
import LetterBoard from "../components/LetterBoard";
import Button from "../components/Button";
import FlatButton from "../components/FlatButton";
import Avatar from "../components/Avatar";
import COLORS from "../constants/colors";
import { useNavigation } from "@react-navigation/native";

const Guess = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const staticword = "spider";

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}>
      
      <View
        style={{
          height: "auto",
          width: "100%",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          gap: 15,
          backgroundColor: COLORS.primary,
        }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "flex-start",
            gap: 15,
          }}>
          <View
            style={{
              aspectRatio: 1,
              backgroundColor: COLORS.yellow,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <View
              style={{
                width: 40,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Avatar />
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "stretch",
            }}>
            <Text
              selectable={false}
              style={{
                paddingTop: 15,
                fontSize: 16,
                fontFamily: "TitanOne-Regular",
                color: "white",
                textShadowColor: "rgba(0, 0, 0, 0.25)",
                textShadowOffset: { width: 0, height: 3 },
                textShadowRadius: 4,
              }}>
              You are guessing
            </Text>
            <Text
              selectable={false}
              style={{
                paddingBottom: 15,
                fontSize: 16,
                fontFamily: "TitanOne-Regular",
                color: "white",
                textShadowColor: "rgba(0, 0, 0, 0.25)",
                textShadowOffset: { width: 0, height: 3 },
                textShadowRadius: 4,
              }}>
              juberbacher's drawing
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingRight: 15,
          }}>
          <FlatButton />
        </View>
      </View>
      
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}></View>
      <LetterBoard />
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          gap: 10,
          paddingBottom: 10,
          paddingHorizontal: 10,
        }}>
        <Button size="30" color="yellow" title="HELP" onPress={() => {navigation.navigate('Home')}} />
      </View>
    </View>
  );
};

export default Guess;
