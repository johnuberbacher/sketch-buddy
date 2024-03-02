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
import Button from "../components/Button";
import COLORS from "../constants/colors";
import Avatar from "../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import ChooseWord from "../components/modals/ChooseWord";
import Modal from "../components/Modal";
import CreateGame from "../components/modals/CreateGame";
import Settings from "../components/Settings";
import { fetchAllUsers } from "../util/DatabaseManager";

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

        if (sortedData.length === 0) {
          console.warn("No users found");
          setLoading(false);
          setRefreshing(false);
          return;
        }

        // Ensure there are at least 3 users
        const topUsers =
          sortedData.length >= 3 ? sortedData.slice(0, 3) : sortedData;

        // Swap the first two users if there are at least 2 users
        if (topUsers.length >= 2) {
          [topUsers[0], topUsers[1]] = [topUsers[1], topUsers[0]];
        }

        setTopUsersData(topUsers);

        // Omit top 3 users from usersData
        // const remainingUsers = sortedData.slice(topUsers.length);
        setUsersData(sortedData);
        setLoading(false);
        setRefreshing(false);
      }
    });
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="white"
            style={styles.activityIndicator}
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
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.mainContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Leaderboards</Text>
              </View>
              <View style={styles.menu}>
                <View style={styles.topUsersContainer}>
                  {topUsersData.map((user, index) => (
                    <View key={index} style={styles.topUserItem}>
                    <View
                      style={{
                        width: 60,
                      }}>
                      <Avatar user={user} />
                    </View>
                      <View style={styles.rankContainer}>
                        <Text style={styles.rankText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.usernameTitle}>{user.username}</Text>
                      <Text style={styles.leaderboardLevel}>
                        Level {user.rank}
                      </Text>
                    </View>
                  ))}
                </View>
                {usersData.map((user, index) => (
                  <View key={user.id} style={styles.menuInner}>
                    <View style={styles.userDetailsContainer}>
                      <View style={styles.rankContainer}>
                        <Text style={styles.rankText}>{index + 1}</Text>
                      </View>
                      <View
                        style={{
                          width: 60,
                        }}>
                        <Avatar user={user} />
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.usernameTitle}>
                          {user.username}
                        </Text>
                        <Text style={styles.leaderboardLevel}>
                          Level {user.rank}
                        </Text>
                      </View>
                    </View>
                    {user.id !== session.user.id ? (
                      <View style={styles.buttonContainer}>
                        <Button
                          title="Play"
                          size="small"
                          onPress={() => {
                            null;
                          }}
                          color="green"
                        />
                      </View>
                    ) : null}
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

const styles = {
  loadingContainer: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
    gap: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  activityIndicator: {
    transform: [{ scale: 2 }],
  },
  scrollView: {
    backgroundColor: "transparent",
  },
  scrollViewContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  mainContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    maxWidth: 500,
    marginHorizontal: "auto",
    gap: 20,
    paddingTop: 50,
  },
  headerContainer: {
    paddingHorizontal: 20,
    position: "relative",
  },
  headerText: {
    fontSize: 34,
    fontFamily: "Kanit-Bold",
    color: COLORS.text,
  },
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
    gap: 15,
  },
  topUsersContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  topUserItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  rankContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.secondary,
    overflow: "hidden",
    borderRadius: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  rankText: {
    fontSize: 13,
    fontFamily: "Kanit-Bold",
    textAlign: "center",
    color: "white",
  },
  userDetailsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  userDetails: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  buttonContainer: {
    height: 40,
    width: "auto",
    flexDirection: "column",
  },
  usernameTitle: {
    fontSize: 16,
    fontFamily: "Kanit-Medium",
    color: COLORS.text,
  },
  leaderboardLevel: {
    fontSize: 14,
    fontFamily: "Kanit-Regular",
    color: COLORS.text,
    opacity: 0.5,
  },
};

export default Leaderboard;
