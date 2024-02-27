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
import COLORS from "../constants/colors";

const Nav = ({ onToggleSettings }) => {
  return (
    <>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}>
        <View style={{ borderWidth: 0 }}>
          <FlatButton onPress={() => onToggleSettings()} />
        </View>
        <View style={{ width: 40, borderWidth: 0 }}>
          <Avatar level="null" />
        </View>
      </View>
    </>
  );
};

export default Nav;
