import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Register: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleRegister = async () => {
    if (!name || !surname || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await AsyncStorage.setItem("userEmail", email);
      Alert.alert("Success", `Account created for ${name} ${surname}!`);
      router.replace({ pathname: "./home" });
    } catch (e) {
      Alert.alert("Error", "Failed to save user data");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900 justify-start px-8 pt-14">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-4 left-4 z-10 w-10 h-10 justify-center items-center"
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back-circle" size={34} color="white" />
      </TouchableOpacity>

      <Text className="text-4xl font-extrabold mb-10 text-center text-white">
        Register
      </Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#a1a1aa"
        className="border border-gray-700 bg-gray-800 rounded-lg p-4 mb-4 text-white text-base"
        value={name}
        onChangeText={(text: string) => setName(text)}
      />

      <TextInput
        placeholder="Surname"
        placeholderTextColor="#a1a1aa"
        className="border border-gray-700 bg-gray-800 rounded-lg p-4 mb-4 text-white text-base"
        value={surname}
        onChangeText={(text: string) => setSurname(text)}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#a1a1aa"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-700 bg-gray-800 rounded-lg p-4 mb-4 text-white text-base"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#a1a1aa"
        secureTextEntry
        className="border border-gray-700 bg-gray-800 rounded-lg p-4 mb-4 text-white text-base"
        value={password}
        onChangeText={(text: string) => setPassword(text)}
      />

      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#a1a1aa"
        secureTextEntry
        className="border border-gray-700 bg-gray-800 rounded-lg p-4 mb-6 text-white text-base"
        value={confirmPassword}
        onChangeText={(text: string) => setConfirmPassword(text)}
      />

      <TouchableOpacity
        onPress={handleRegister}
        className="bg-green-600 rounded-lg p-4 mb-6 shadow-lg"
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-semibold text-lg">
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push({ pathname: "/" })}
        className="mt-4"
        activeOpacity={0.7}
      >
        <Text className="text-gray-400 text-center text-base tracking-wide">
          Already have an account?{" "}
          <Text className="text-green-400 underline font-semibold">
            Login here
          </Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Register;
