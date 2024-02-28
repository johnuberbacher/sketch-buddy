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
import { supabase } from "../lib/supabase";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Nav from "../components/Nav";
import NewButton from "../components/NewButton";
import COLORS from "../constants/colors";
import Avatar from "../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import ChooseWord from "../components/ChooseWord";
import Modal from "../components/Modal";
import CreateGame from "../components/CreateGame";
import Settings from "../components/Settings";
import {
  fetchUserProfile,
  fetchAllUsers,
  fetchUsers,
  fetchUserData,
  updateUserData,
} from "../util/DatabaseManager";

const Leaderboard = ({ route }) => {
  const { key, session } = route.params;
  const [loading, setLoading] = useState(true);
  const [isSettingsVisibleModal, setIsSettingsVisibleModal] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [usersData, setUsersData] = useState([]);
  const [topUsersData, setTopUsersData] = useState([]);
  const navigation = useNavigation();

  async function fetchData() {
    // Load users data from games
    fetchAllUsers().then(({ data, error }) => {
      if (error) {
        console.error("Error updating user data:", error);
      } else {
        // Sort data by Rank
        const sortedData = data.sort((a, b) => b.rank - a.rank);

        // const topUsers = sortedData;
        const topUsers = sortedData.slice(0, 3);

        // Swap the first two users
        [topUsers[0], topUsers[1]] = [topUsers[1], topUsers[0]];

        setTopUsersData(topUsers);

        // Omit top 3 users from usersData
        const remainingUsers = sortedData;
        setUsersData(remainingUsers);
      }
    });
    setLoading(false);
    setRefreshing(false);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            width: "100%",
            height: "100%",
            gap: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator
            size="large"
            color="white"
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      ) : (
        <>
          {isSettingsVisibleModal && (
            <Modal props="" title="Settings">
              <Settings onClose={() => setIsSettingsVisibleModal(false)} />
            </Modal>
          )}
          <ScrollView
            style={{ backgroundColor: "transparent" }}
            contentContainerStyle={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100%",
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                maxWidth: 500,
                marginHorizontal: "auto",
                gap: 20,
                paddingTop: 50,
              }}>
              <View
                style={{
                  paddingHorizontal: 20,
                  position: "relative",
                }}>
                <Text
                  style={{
                    fontSize: 34,
                    fontFamily: "Kanit-Bold",
                    color: COLORS.text,
                  }}>
                  Leaderboards
                </Text>
              </View>
              <View style={styles.menu}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}>
                  {topUsersData.map((user, index) => (
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}>
                      <View
                        style={{
                          width: index === 1 ? 100 : 80,
                          overflow: "hidden",
                        }}>
                        <Avatar user={user}
                        />
                      </View>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: -15,
                          width: 30,
                          height: 30,
                          borderWidth: 4,
                          borderColor: "white",
                          aspectRatio: 1,
                          backgroundColor:
                            index === 1
                              ? COLORS.secondary
                              : index === 0
                              ? COLORS.primary
                              : COLORS.primary,
                          borderRadius: 300,
                        }}>
                        <Text
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            width: "100%",
                            fontSize: 13,
                            fontFamily: "Kanit-Bold",
                            textAlign: "center",
                            color: "white",
                          }}>
                          {index === 1 ? "1" : index === 0 ? "2" : "3"}
                        </Text>
                      </View>
                      <Text selectable={false} style={styles.usernameTitle}>
                        {user.username}
                      </Text>
                      <Text selectable={false} style={styles.leaderboardLevel}>
                        Level {user.rank}
                      </Text>
                    </View>
                  ))}
                </View>
                {usersData.map((user, index) => (
                  <View key={user.id} style={styles.menuInner}>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 10,
                        flex: 1,
                      }}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 30,
                          height: 30,
                          borderWidth: 4,
                          borderColor: "white",
                          aspectRatio: 1,
                          backgroundColor:
                            index === 0
                              ? COLORS.secondary
                              : index === 1
                              ? COLORS.primary
                              : COLORS.primary,
                          borderRadius: 300,
                        }}>
                        <Text
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%",
                            width: "100%",
                            fontSize: 13,
                            fontFamily: "Kanit-Bold",
                            textAlign: "center",
                            color: "white",
                          }}>
                          {index + 1}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 60,
                        }}>
                        <Avatar user={user}
                        />
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
                      }}>
                      <NewButton
                        title="Play"
                        size="small"
                        onPress={() => {
                          createNewGame(user);
                        }}
                        color="green"
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    padding: 20,
    gap: 20,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
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
    fontFamily: "Kanit-Medium",
    marginLeft: 10,
    color: COLORS.text,
  },
  leaderboardLevel: {
    fontSize: 14,
    fontFamily: "Kanit-Regular",
    marginLeft: 10,
    color: COLORS.text,
    opacity: 0.5,
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

export default Leaderboard;
