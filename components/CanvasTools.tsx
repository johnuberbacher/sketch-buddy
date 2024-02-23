import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const CanvasTools = ({
  onStrokeSizeChange,
  onColorChange,
  onEraser,
  onSaveDrawing,
  onClearCanvas,
}) => {
  const strokeArray = [8, 12, 16, 20, 24];
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

  const [isToolbarVisisble, setIsToolbarVisisble] = useState(false);
  const [currentTool, setCurrentTool] = useState("stroke");
  const [selectedStrokeSize, setSelectedStrokeSize] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorArray[0]);

  const selectStrokeColor = (color) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const selectStrokeSize = (stroke: number) => {
    setSelectedStrokeSize(stroke);
    onStrokeSizeChange(stroke);
  };

  const onStrokeTool = () => {
    setCurrentTool("stroke");
    setIsToolbarVisisble(!isToolbarVisisble);
  };

  const onColorPickerTool = () => {
    setCurrentTool("color");
    setIsToolbarVisisble(!isToolbarVisisble);
  };

  const onEraserTool = () => {
    setIsToolbarVisisble(false);
    onEraser();
  };

  const onSaveTool = () => {
    setIsToolbarVisisble(false);
    onSaveDrawing();
  };

  const onTrashTool = () => {
    setIsToolbarVisisble(false);
    onClearCanvas();
  };
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 20,
        }}>
        {isToolbarVisisble ? (
          <View
            style={{
              flex: 1,
              marginBottom: 10,
              position: "absolute",
              left: 20,
              right: 20,
              bottom: "100%",
              zIndex: 3,
              backgroundColor: "rgba(255,255,255,0.95)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,1.0)",
              borderStyle: "solid",
              borderRadius: 40,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 10,
            }}>
            <View
              style={{
                width: "100%",
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-around",
                alignItems: "center",
                padding: 20,
              }}>
              {currentTool === "stroke" ? (
                <>
                  {strokeArray.map((stroke) => (
                    <TouchableOpacity
                      key={stroke}
                      onPress={() => selectStrokeSize(stroke)}
                      style={[
                        styles.box,
                        {
                          borderColor:
                            selectedStrokeSize === stroke
                              ? COLORS.secondary
                              : "#FFFFFF",
                        },
                      ]}>
                      <View
                        style={[
                          styles.stroke,
                          {
                            height: stroke,
                            width: stroke,
                          },
                        ]}></View>
                    </TouchableOpacity>
                  ))}
                </>
              ) : null}
              {currentTool === "color" ? (
                <>
                  {colorArray.map((color, index) => (
                    <>
                      {/* Dark Color */}
                      <TouchableOpacity
                        key={color.dark}
                        onPress={() => selectStrokeColor(color.dark)}
                        style={[
                          styles.box,
                          {
                            backgroundColor: color.dark,
                            opacity: selectedColor === color.dark ? 1 : 0.5,
                            borderColor:
                              selectedColor === color.dark
                                ? COLORS.secondary
                                : "#FFFFFF",
                          },
                        ]}
                      />
                      {/* Base Color */}
                      <TouchableOpacity
                        key={color.base}
                        onPress={() => selectStrokeColor(color.base)}
                        style={[
                          styles.box,
                          {
                            backgroundColor: color.base,
                            opacity: selectedColor === color.base ? 1 : 0.5,
                            borderColor:
                              selectedColor === color.base
                                ? COLORS.secondary
                                : "#FFFFFF",
                          },
                        ]}
                      />
                    </>
                  ))}
                </>
              ) : null}
            </View>
          </View>
        ) : null}
        <TouchableOpacity
          onPress={() => onColorPickerTool()}
          style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="palette-swatch-outline"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onStrokeTool()} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="lead-pencil"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onEraserTool()} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons name="eraser" size={30} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onSaveTool()} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="content-save-outline"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onTrashTool()} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tool: {
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    elevation: 2,
  },
  box: {
    backgroundColor: "black",
    borderRadius: 100,
    borderWidth: 6,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
  stroke: {
    borderRadius: 100,
    backgroundColor: "white",
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

export default CanvasTools;
