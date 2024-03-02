import { supabase } from "../lib/supabase";

// Fetch user profile data
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .limit(1)
      .single();
    return { data, error };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { data: null, error };
  }
};

// Fetch user associated games
export const fetchUserGames = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .or("user1.eq." + userId + ",user2.eq." + userId + "");
    return { data, error };
  } catch (error) {
    console.error("Error fetching user associated games:", error);
    return { data: null, error };
  }
};

// Fetch multiple users data
export const fetchAllUsers = async () => {
  try {
    const { data, error } = await supabase.from("profiles").select("*");
    return { data, error };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: null, error };
  }
};

// Fetch multiple users data games
export const fetchUsers = async (users: Array<string>) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("id", users); // Use .in() instead of .eq() for an array of values
    return { data, error };
  } catch (error) {
    console.error("Error fetching users:", error.message); // Access error.message for more detailed error information
    return { data: null, error };
  }
};

// Fetch user data
export const fetchUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId);
    return { data, error };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { data: null, error };
  }
};

// Fetch Game data
export const fetchGameData = async (gameId: string) => {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .limit(1)
      .single();
    return { data, error };
  } catch (error) {
    console.error("Error fetching game data:", error);
    return { data: null, error };
  }
};

// Update game data
export const updateGameData = async (
  gameId: string,
  newData: Record<string, any>
) => {
  try {
    const { data, error } = await supabase
      .from("games")
      .update(newData)
      .eq("id", gameId);
    return { data, error };
  } catch (error) {
    console.error("Error updating game data:", error);
    return { data: null, error };
  }
};

// Update user data
export const updateUserData = async (
  userId: string,
  newData: Record<string, any>
) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(newData)
      .eq("id", userId);
    return { data, error };
  } catch (error) {
    console.error("Error updating user data:", error);
    return { data: null, error };
  }
};

// Update user avatar
export const updateUserAvatar = async (userId: string, path: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar_url: path })
      .eq("id", userId);
    return { data, error };
  } catch (error) {
    console.error("Error updating user avatar:", error);
    return { data: null, error };
  }
};

// Update username
export const updateUsername = async (userId: string, username: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ username: username })
      .eq("id", userId);
    return { data, error };
  } catch (error) {
    console.error("Error updating username:", error);
    return { data: null, error };
  }
};

// Update user coins
export const updateUserCoins = async (userId: string, coins: Number) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ coins: coins })
      .eq("id", userId);
    return { data, error };
  } catch (error) {
    console.error("Error updating user data:", error);
    return { data: null, error };
  }
};

// Create new game
export const createGame = async (user: Array, opponent: Array) => {
  try {
    const { data, error } = await supabase
      .from("games")
      .upsert([
        {
          user1: user.id,
          user1username: user.username,
          user2: opponent.id,
          user2username: opponent.username,
          turn: user.id,
          action: "draw",
          word: null,
          difficulty: null,
          streak: 0,
          svg: null,
          requested_help: false,
        },
      ])
      .select()
      .limit(1)
      .single();
    return { data, error };
  } catch (error) {
    console.error("Error upserting game data:", error);
    return { data: null, error };
  }
};
