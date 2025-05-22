import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MAX_LENGTH = 1600;

const Home = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ from: string; text: string }[]>(
    []
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const handleLogout = () => {
    Alert.alert("Logout", "Do you really want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.removeItem("userEmail");
          router.replace("/");
        },
      },
    ]);
  };
  const API_KEY = "AIzaSyDm8B0h4fGtYKzGfFkmy5yiyO5-UPsuyfI";
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: input.trim() }],
            },
          ],
        }),
      });

      const data = await response.json();

      console.log("API cavabı:", JSON.stringify(data, null, 2));

      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from API";

      const botMessage = {
        from: "bot",
        text: botText,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching API response:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Failed to fetch reply from API." },
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900 pt-6 px-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white text-xl font-bold">Promptly</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={35} color="white" />
        </TouchableOpacity>
      </View>

      <View className="h-0.5 bg-gray-700 mb-2 w-full" />

      <ScrollView
        className="flex-1 mb-2"
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-3 rounded-xl my-1 max-w-[80%] ${
              msg.from === "user"
                ? "bg-green-600 self-end"
                : "bg-gray-700 self-start"
            }`}
          >
            <Text className="text-white">{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
        className="flex-row items-end bg-gray-800 rounded-full px-4 py-2 mb-4"
      >
        <TextInput
          value={input}
          onChangeText={(text) => text.length <= MAX_LENGTH && setInput(text)}
          placeholder="Type your message..."
          placeholderTextColor="#a1a1aa"
          multiline
          numberOfLines={2}
          maxLength={MAX_LENGTH}
          style={{ flex: 1, color: "white", maxHeight: 60 }}
        />
        <TouchableOpacity
          onPress={sendMessage}
          className="ml-2 bg-blue-600 rounded-full w-10 h-10 items-center justify-center"
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Home;
