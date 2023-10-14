import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgUri } from "react-native-svg";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useRouter } from "expo-router";
import { auth } from "../firebaseConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    //Alert.alert(`Email ${email}, Password ${password}`);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        router.push("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(`Error code: ${errorCode}, msg: ${errorMessage}`);
      });
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <SvgUri
            style={{ width: 75, height: 75 }}
            uri="https://api.dicebear.com/7.x/big-smile/svg?seed=Aneka"
          />
          <Text
            style={{
              color: "black",
              fontSize: 45,
              marginLeft: 2,
              fontFamily: "serif",
              fontWeight: 600,
            }}
          >
            Login
          </Text>
        </View>
        <View style={styles.subheader}>
          <Text
            style={{
              color: "black",
              fontSize: 15,
              marginLeft: 15,
              marginTop: 7,
            }}
          >
            Enter details to log in..
          </Text>
        </View>
        <View style={styles.form}>
          <Text
            style={{
              fontWeight: "500",
              fontFamily: "serif",
              fontSize: 25,
              marginLeft: 45,
            }}
          >
            Email
          </Text>
          <TextInput
            placeholder="Enter email"
            style={styles.email}
            onChangeText={setEmail}
            value={email}
          />
          <Text
            style={{
              fontWeight: "500",
              fontFamily: "serif",
              fontSize: 25,
              marginLeft: 45,
            }}
          >
            Password
          </Text>
          <TextInput
            placeholder="Enter password"
            onChangeText={setPassword}
            value={password}
            style={styles.password}
          />

          <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
            <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "#f7f7f7",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "100%",
    maxHeight: 500,
    minHeight: 390,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    width: "100%",
    maxHeight: 85,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    alignItems: "center",
  },
  subheader: {
    width: "100%",
    maxHeight: 40,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 20,
  },
  form: {
    flex: 1,
    width: "100%",
    paddingTop: 25,
  },
  email: {
    width: "75%",
    borderBottomWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingBottom: 10,
    paddingHorizontal: 5,
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "white",
    marginBottom: 30,
    marginTop: 5,
  },
  password: {
    width: "75%",
    borderBottomWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingBottom: 10,
    paddingHorizontal: 5,
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "white",
    marginBottom: 40,
    marginTop: 5,
  },
  button: {
    backgroundColor: "black",
    width: "75%",
    borderRadius: 20,
    justifyContent: "center",
    paddingVertical: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
});
