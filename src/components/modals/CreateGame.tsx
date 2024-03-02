import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import Button from "../Button";
import React, { useState, useEffect } from "react";
import Avatar from "../Avatar";
import COLORS from "../../constants/colors";
import { Audio } from "expo-av";
import { fetchAllUsers, createGame } from "../../util/DatabaseManager";

const CreateGame = ({ currentUserData, onClose, onPlayGame }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [usersData, setUsersData] = useState([]);

  async function fetchData() {
    setLoading(true);

    // Load users data from games
    await fetchAllUsers().then(({ data, error }) => {
      if (error) {
        console.error("Error updating user data:", error);
      } else {
        const sortedData = data.sort((a, b) => b.rank - a.rank);
        setUsersData(sortedData);
      }
    });

    setLoading(false);
    setRefreshing(false);
  }

  const challengeUser = async (opponent) => {
    setLoading(true);

    // Add new game to the database
    await createGame(currentUserData, opponent).then(({ data, error }) => {
      if (error) {
        console.error("Error updating new game data:", error);
      } else {
        onPlayGame(data);
        setLoading(false);
        setRefreshing(false);
      }
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/sfx/dialog.mp3")
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
              height: "100%",
              width: "100%",
              gap: 20,
            }}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
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
                {usersData.map((opponent) => (
                  <View key={opponent.id} style={styles.menuInner}>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 10,
                        flex: 1,
                      }}>
                      <View
                        style={{
                          width: 40,
                        }}>
                        <Avatar user={opponent} />
                      </View>
                      <View
                        style={{
                          width: "100%",
                          flex: 1,
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
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
                            {opponent.username}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {opponent.id !== currentUserData.id ? (
                      <View
                        style={{
                          width: "auto",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <Button
                          title="Play"
                          size="small"
                          onPress={() => {
                            challengeUser(opponent);
                          }}
                          color="green"
                        />
                      </View>
                    ) : null}
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
              <Button
                color="primary"
                title="Close"
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
    justifyContent: "center",
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
