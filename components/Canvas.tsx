import React, { useLayoutEffect, useState, useRef } from "react";
import { Svg, Path } from "react-native-svg";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import ColorPicker from "./ColorPicker";
import Button from "./Button";
import NewButton from "./NewButton";
import CanvasTools from "./CanvasTools";
import Avatar from "./Avatar";
import FlatButton from "./FlatButton";
import COLORS from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const Canvas = ({ onSubmitDraw, word }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const startPointRef = useRef({ x: 0, y: 0 });
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedStrokeSize, setSelectedStrokeSize] = useState(8);
  const [eraserActive, setEraserActive] = useState(false);
  const navigation = useNavigation();
  const viewShotRef = useRef<ViewShot>(null);
  const staticword = word;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const smoothPath = (path) => {
    if (path.length < 2) return path;

    return path.reduce((acc, point, i, arr) => {
      if (i === 0) {
        return [`M${point.x},${point.y}`];
      }

      const prevPoint = arr[i - 1];
      const midPoint = {
        x: (point.x + prevPoint.x) / 2,
        y: (point.y + prevPoint.y) / 2,
      };

      return [
        ...acc,
        `Q${prevPoint.x},${prevPoint.y} ${midPoint.x},${midPoint.y}`,
      ];
    }, []);
  };

  const handleGestureEvent = ({ nativeEvent }) => {
    const { x, y } = nativeEvent;

    setCurrentPath((prevPath) => [...prevPath, { x, y }]);
  };

  const handleGestureStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.BEGAN) {
      startPointRef.current = { x: nativeEvent.x, y: nativeEvent.y };
      setCurrentPath([{ x: nativeEvent.x, y: nativeEvent.y }]);
    } else if (nativeEvent.state === State.END) {
      setPaths((prevPaths) => [
        ...prevPaths,
        {
          path: smoothPath(currentPath),
          color: selectedColor ? selectedColor : "#000000",
          strokeSize: eraserActive ? 12 : selectedStrokeSize,
        },
      ]);
      setCurrentPath([]);
    }
  };

  const handleGestureEnd = () => {
    // null
  };

  const handleStrokeSizeChange = (stroke) => {
    if (!eraserActive) {
      setSelectedStrokeSize(stroke);
    }
  };

  const handleColorChange = (color) => {
    if (!eraserActive) {
      setSelectedColor(color);
    }
  };

  const handleClearCanvas = () => {
    setPaths([]);
  };

  const handleSaveDrawing = async () => {
      try {
        const uri = await viewShotRef.current.capture();
        const fileUri = `${FileSystem.documentDirectory}capturedImage.png`;
        await FileSystem.moveAsync({
          from: uri,
          to: fileUri,
        });
        await MediaLibrary.saveToLibraryAsync(uri);
        console.log('Image saved:', fileUri);
      } catch (error) {
        console.error('Error capturing and saving image:', error);
      }
    };

  const submitDrawing = () => {
    onSubmitDraw();
    console.log("made it here");
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
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
          <View style={{ padding: 10, backgroundColor: COLORS.secondary }}>
            <View
              style={{
                flexDirection: "column",
                height: "100%",
                flex: 1,
                width: "auto",
                aspectRatio: 1,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}>
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: -3,
                  zIndex: 1,
                  elevation: 1,
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                  }}
                  selectable={false}>
                  🇺🇸
                </Text>
              </View>
              <Avatar />
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "stretch",
            }}>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <Text
                selectable={false}
                style={{
                  paddingTop: 15,
                  fontSize: 16,
                  fontFamily: "Kanit-Regular",
                  color: "white",
                  textShadowColor: "rgba(0, 0, 0, 0.25)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}>
                You are drawing
              </Text>
              <Text
                selectable={false}
                style={{
                  textTransform: "uppercase",
                  paddingTop: 15,
                  fontSize: 16,
                  fontFamily: "Kanit-SemiBold",
                  color: "white",
                  textShadowColor: "rgba(0, 0, 0, 0.25)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                }}>
                {" "}
                {staticword}
              </Text>
            </View>
            <Text
              selectable={false}
              style={{
                paddingBottom: 15,
                fontSize: 16,
                fontFamily: "Kanit-Regular",
                color: "white",
                textShadowColor: "rgba(0, 0, 0, 0.25)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              }}>
              for juberbacher
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

      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1 }}
        style={{ flex: 1, height: "100%" }}>
        <View style={styles.container}>
          <GestureHandlerRootView style={{ flex: 1, width: "100%" }}>
            <PanGestureHandler
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={handleGestureStateChange}
              onEnded={handleGestureEnd}
              style={{ flex: 1, height: "100%" }}>
              <Svg style={styles.svgContainer}>
                {paths.map((pathObject, pathIndex) => (
                  <Path
                    key={pathObject + pathIndex}
                    d={pathObject.path.join(" ")}
                    stroke={eraserActive ? "#fff" : pathObject.color}
                    strokeWidth={pathObject.strokeSize}
                    strokeLinecap="round"
                    fill="none"
                  />
                ))}
                {currentPath.length > 1 && (
                  <Path
                    d={smoothPath(currentPath).join(" ")}
                    stroke={eraserActive ? "#fff" : selectedColor}
                    strokeWidth={eraserActive ? 12 : selectedStrokeSize}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </Svg>
            </PanGestureHandler>
          </GestureHandlerRootView>
        </View>
      </ViewShot>

      <ColorPicker onColorChange={handleColorChange} />
      <CanvasTools
        onSaveDrawing={handleSaveDrawing}
        onClearCanvas={handleClearCanvas}
        onStrokeSizeChange={handleStrokeSizeChange}
      />

      <View
        style={{
          height: "auto",
          width: "100%",
          padding: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "stretch",
          gap: 20,
        }}>
        <NewButton color="secondary" title="Continue" onPress={submitDrawing} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  svgContainer: {
    height: "100%",
    width: "100%",
  },
});

export default Canvas;
