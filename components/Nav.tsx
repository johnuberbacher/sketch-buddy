import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  ImageBackground,
  Text,
  StyleSheet,
} from "react-native";
import Avatar from "../components/Avatar";
import FlatButton from "../components/FlatButton";
import Button from "./Button";
import Settings from "./Settings"; 
import COLORS from "../constants/colors";

const Nav = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const toggleSettingsVisibility = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };

  return (
    <>
      {isSettingsVisible && (
        <Settings onClose={() => setIsSettingsVisible(false)} />
      )}
      <View
        style={{
          width: "100%",
          backgroundColor: COLORS.primary,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 20,
          paddingHorizontal: 15,
          paddingVertical: 15,
          elevation: 5,
        }}>
        <View
          style={{
            width: "100%",
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 15,
          }}>
          <View style={{ width: 40 }}>
            <Avatar />
          </View>
          <Text selectable={false}
            style={{
              width: "100%",
              color: "white",
              fontSize: 20,
              fontFamily: "TitanOne-Regular",
              textShadowColor: "rgba(0, 0, 0, 0.25)",
              textShadowOffset: { width: 0, height: 3 },
              textShadowRadius: 4,
            }}>
            Blue_93
          </Text>
        </View>
        <View style={{ width: 40 }}>
          <FlatButton onPress={toggleSettingsVisibility} />
        </View>
      </View>
    </>
  );
};

export default Nav;
