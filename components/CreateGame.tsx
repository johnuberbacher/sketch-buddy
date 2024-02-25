import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Alert,
  RefreshControl,
} from "react-native";
import NewButton from "../components/NewButton";
import React, { useState, useEffect } from "react";
import Avatar from "../components/Avatar";
import COLORS from "../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { supabase } from "../lib/supabase";

const CreateGame = ({ currentUserData, onClose, onPlayGame }) => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [usersData, setUsersData] = useState([]);

  async function fetchData() {
    setLoading(true);
    try {
      // Load users
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, rank");

      if (error) {
        throw new Error(`Error fetching users data: ${error.message}`);
      }

      const sortedData = data.sort((a, b) => b.rank - a.rank);

      setUsersData(sortedData);
    } catch (error) {
      console.error("Error fetching users data:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const createNewGame = async (opponent) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("games")
        .upsert([
          {
            user1: currentUserData.id,
            user1username: currentUserData.username,
            user2: opponent.id,
            user2username: opponent.username,
            turn: currentUserData.id,
            action: "draw",
            word: null,
            difficulty: null,
            streak: 0,
          },
        ])
        .select()
        .limit(1)
        .single();

      if (error) {
        throw new Error(`Error creating game: ${error.message}`);
      }

      onPlayGame(data);
    } catch (error) {
      console.error("Error creating game:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("./../assets/sfx/dialog.mp3")
      );
      await sound.playAsync();
    };
    // playSound();
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <View
          style={{
            paddingVertical: 40,
            height: "100%",
            width: "100%",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : (
        <>
          <View
            style={{
              width: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}>
            <View
              style={{
                maxHeight: 400,
                width: "100%",
                flexDirection: "row",
                gap: 20,
              }}>
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  width: "100%",
                  flexDirection: "column",
                  gap: 20,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>
                {usersData.map((user) => (
                  <View key={user.id} style={styles.menuInner}>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        gap: 10,
                        flex: 1,
                      }}>
                      <View
                        style={{
                          width: 60,
                        }}>
                        <Avatar level={user.rank} />
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
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: 10,
                          }}>
                          <Text selectable={false} style={styles.usernameTitle}>
                            {user.username}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 40,
                        width: "auto",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}>
                      <NewButton
                        title="PLAY"
                        size="small"
                        onPress={() => {
                          createNewGame(user);
                        }}
                        color="green"
                      />
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                width: "100%",
                height: "auto",
                flexDirection: "row",
              }}>
              <NewButton
                color="primary"
                title="Back"
                onPress={() => {
                  onClose();
                }}
              />
            </View>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menuInner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#feeede",
    borderRadius: 15,
    gap: 20,
  },
  usernameTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: COLORS.text,
  },
});

export default CreateGame;
