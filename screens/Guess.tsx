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
import NewButton from "../components/NewButton";

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
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.secondary,
      }}>
      <View
        style={{
          width: "100%",
          height: "auto",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 20,
          gap: 20,
        }}>
        <View
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 20,
          }}>
          <View
            style={{
              paddingLeft: 20,
              backgroundColor: COLORS.secondary,
              width: 100,
            }}>
            <Avatar />
          </View>
          <View
            style={{
              flex: 1,
              paddingLeft: 30,
              paddingRight: 20,
              paddingVertical: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopStartRadius: 40,
              borderBottomStartRadius: 40,
              backgroundColor: COLORS.primary,
              shadowColor: "rgba(0, 0, 0, 0.5)",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
              elevation: 10,
            }}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: 0,
              }}>
              <Text
                selectable={false}
                style={{
                  fontSize: 14,
                  fontFamily: "Kanit-Regular",
                  color: "white",
                  opacity: 0.75,
                  lineHeight: 18,
                  textShadowColor: "rgba(0, 0, 0, 0.25)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}>
                You are guessing
              </Text>
              <Text
                selectable={false}
                style={{
                  textTransform: "uppercase",
                  fontSize: 30,
                  fontFamily: "Kanit-SemiBold",
                  color: "white",
                  lineHeight: 36,
                  textShadowColor: "rgba(0, 0, 0, 0.25)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}>
                {staticword}
              </Text>
              <Text
                selectable={false}
                style={{
                  fontSize: 14,
                  fontFamily: "Kanit-Regular",
                  color: "white",
                  opacity: 0.75,
                  lineHeight: 14,
                  textShadowColor: "rgba(0, 0, 0, 0.25)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}>
                drawing!
              </Text>
            </View>
            <FlatButton />
          </View>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}>
        <View
          style={{
            aspectRatio: 1,
            width: "100%",
            height: "auto",
            backgroundColor: "#fff",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}></View>

        <View
          style={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderTopStartRadius: 40,
            borderTopEndRadius: 40,
            padding: 20,
            shadowColor: "rgba(0, 0, 0, 0.5)",
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            elevation: 10,
          }}>
          <LetterBoard />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
            }}>
            <NewButton
              title="Help"
              onPress={() => {
                navigation.navigate("Home");
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Guess;
