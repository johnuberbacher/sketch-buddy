import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const ColorPicker = ({ onColorChange }) => {
  const colorArray = [
    {
      dark: "#000000",
      base: "#CCCCCC",
      light: "#FFFFFF",
    },
    {
      dark: "#CC0000",
      base: "#FF0000",
      light: "#FF6666",
    },
    {
      dark: "#CC6600",
      base: "#FF7F00",
      light: "#FFB366",
    },
    {
      dark: "#CCCC00",
      base: "#FFFF00",
      light: "#FFFF99",
    },
    {
      dark: "#00CC00",
      base: "#00FF00",
      light: "#66FF66",
    },
    {
      dark: "#0000CC",
      base: "#0000FF",
      light: "#6666FF",
    },
    {
      dark: "#32004B",
      base: "#4B0082",
      light: "#8A4B82",
    },
  ];
  const [selectedColor, setSelectedColor] = useState(colorArray[0]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onColorChange(color);
  };
  
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#F0F2F2",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        elevation: 5,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#babfc5",
      }}>
      <ScrollView
        style={{
          flexDirection: "row",
        }}
        horizontal={true}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 0,
          }}>
          {colorArray.map((color, index) => (
            <React.Fragment key={index}>
              {/* Dark Color */}
              <TouchableOpacity
                key={color.dark}
                onPress={() => handleColorSelect(color.dark)}
                style={[
                  styles.box,
                  {
                    backgroundColor: color.dark,
                    opacity: selectedColor === color.dark ? 1 : 0.25,
                  },
                ]}
              />
              {/* Base Color */}
              <TouchableOpacity
                key={color.base}
                onPress={() => handleColorSelect(color.base)}
                style={[
                  styles.box,
                  {
                    backgroundColor: color.base,
                    opacity: selectedColor === color.base ? 1 : 0.25,
                  },
                ]}
              />
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "white",
    width: 30,
    height: 30,
    elevation: 2,
    margin: 15,
  },
  buttonBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ColorPicker;
