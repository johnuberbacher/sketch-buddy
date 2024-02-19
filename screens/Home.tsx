import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Nav from "../components/Nav";
import Canvas from "../components/Canvas";
import LetterBoard from "../components/LetterBoard";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import FlatButton from "../components/FlatButton";
import COLORS from "../constants/colors";
import Avatar from "../components/Avatar";
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <>
      <Nav />
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 15,
          width: "100%",
          gap: 20,
          flexDirection: "column",
          maxWidth: 600,
          marginHorizontal: "auto",
        }}>
        <View
          style={{
            paddingTop: 10,
            width: "100%",
            flexDirection: "row",
          }}>
          <Button
            color="green"
            title="Create Game"
            onPress={() => {
              navigation.navigate("Menu");
            }}
          />
        </View>
        <View style={styles.menuOuter}>
          <View style={styles.menu}>
            <View style={styles.menuTitle}>
              <Text selectable={false} style={styles.textYourMove}>
                Your Games
              </Text>
            </View>

            <FlatList
              data={data}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Text>{JSON.stringify(item)}</Text>}
            />
            <View style={styles.menuInner}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 20,
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: "column",
                    width: 65,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Avatar />
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 2,
                  }}>
                  <View
                    style={{
                      elevation: 2,
                      borderRadius: 3,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      backgroundColor: COLORS.blue,
                    }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "900",
                        textAlign: "center",
                      }}
                      selectable={false}>
                      Lv. 4
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 10,
                    }}>
                    <Text selectable={false} style={styles.usernameTitle}>
                      juberbacher
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: COLORS.greenDark,
                      fontSize: 13,
                      fontWeight: "800",
                    }}
                    selectable={false}>
                    Your turn!
                  </Text>
                </View>
              </View>
              <View
                style={{
                  width: "auto",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}>
                <IconButton
                  onPress={() => {
                    navigation.navigate("Type");
                  }}
                  iconName="arrow-right-circle"
                  color="green"
                />
              </View>
            </View>

            <View style={styles.menuInner}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 20,
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: "column",
                    width: 65,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Avatar />
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 2,
                  }}>
                  <View
                    style={{
                      elevation: 2,
                      borderRadius: 3,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      backgroundColor: COLORS.blue,
                    }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "900",
                        textAlign: "center",
                      }}
                      selectable={false}>
                      Lv. 4
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 10,
                    }}>
                    <Text selectable={false} style={styles.usernameTitle}>
                      juberbacher
                    </Text>
                  </View>
                  <Text
                    style={{ color: "gray", fontSize: 13, fontWeight: "800" }}
                    selectable={false}>
                    Waiting...
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.menuInner}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 20,
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: "column",
                    width: 65,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Avatar />
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 2,
                  }}>
                  <View
                    style={{
                      elevation: 2,
                      borderRadius: 3,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      backgroundColor: COLORS.blue,
                    }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "900",
                        textAlign: "center",
                      }}
                      selectable={false}>
                      Lv. 4
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 10,
                    }}>
                    <Text selectable={false} style={styles.usernameTitle}>
                      juberbacher
                    </Text>
                  </View>
                  <Text
                    style={{ color: "gray", fontSize: 13, fontWeight: "800" }}
                    selectable={false}>
                    Waiting...
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.menuInner}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  gap: 20,
                  flex: 1,
                }}>
                <View
                  style={{
                    flexDirection: "column",
                    width: 65,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Avatar />
                </View>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    gap: 2,
                  }}>
                  <View
                    style={{
                      elevation: 2,
                      borderRadius: 3,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      backgroundColor: COLORS.blue,
                    }}>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 10,
                        fontWeight: "900",
                        textAlign: "center",
                      }}
                      selectable={false}>
                      Lv. 4
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 10,
                    }}>
                    <Text selectable={false} style={styles.usernameTitle}>
                      juberbacher
                    </Text>
                  </View>
                  <Text
                    style={{ color: "gray", fontSize: 13, fontWeight: "800" }}
                    selectable={false}>
                    Waiting...
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  menuOuter: {
    borderRadius: 20,
    backgroundColor: "#b8b8b8",
    overflow: "hidden",
    paddingBottom: 10,
    width: "100%",
  },
  menu: {
    width: "100%",
    borderRadius: 20,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#b8b8b8",
  },
  menuInner: {
    width: "100%",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#b8b8b8",
    paddingVertical: 20,
    gap: 20,
  },
  menuTitle: {
    backgroundColor: "#f86134",
    width: "100%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  usernameTitle: {
    color: "",
    fontSize: 20,
    fontWeight: "bold",
  },
  textYourMove: {
    color: "white",
    fontSize: 24,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
    textTransform: "capitalize",
  },
  textHoursAgo: {
    color: "white",
    fontSize: 24,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
    textTransform: "capitalize",
  },
});

export default Home;
