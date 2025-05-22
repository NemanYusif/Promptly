import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Login: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("userEmail");
        if (storedEmail) {
          router.replace({ pathname: "./home" });
        }
      } catch (e) {
        console.log("AsyncStorage error:", e);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      try {
        await AsyncStorage.setItem("userEmail", email);
        router.replace({ pathname: "./home" });
      } catch (e) {
        Alert.alert("Error", "Failed to save user data");
      }
    } else {
      Alert.alert("Error", "Please enter email and password");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900 justify-center px-8">
      <Text className="text-4xl font-extrabold mb-10 text-center text-white">
        Login
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#a1a1aa"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-700 bg-gray-800 rounded-lg p-4 mb-5 text-white text-base"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#a1a1aa"
        secureTextEntry
        className="border border-gray-700 bg-gray-800 rounded-lg p-4 mb-8 text-white text-base"
        value={password}
        onChangeText={(text: string) => setPassword(text)}
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 rounded-lg p-4 mb-6 shadow-lg"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push({ pathname: "./register" })}
        className="mt-4"
        activeOpacity={0.7}
      >
        <Text className="text-gray-400 text-center text-base tracking-wide">
          Don't have an account?{" "}
          <Text className="text-blue-800 underline font-bold">
            Register here
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;
