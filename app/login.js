import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgUri } from "react-native-svg";
import { useRouter } from "expo-router";
import { useAuth } from "../AuthContext";
import { EyeIcon, EyeSlashIcon } from "react-native-heroicons/outline";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidden, setHidden] = useState(true);
  const [error, setError] = useState([false, false]);

  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = () => {
    if (email.length === 0 || password.length === 0) {
      const e = [false, false];

      if (email.length === 0) e[0] = true;
      if (password.length === 0) e[1] = true;

      setError(e);
    } else {
      signIn(email.trim(), password.trim());
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* <SvgUri
            style={{ width: 75, height: 75 }}
            uri="https://api.dicebear.com/7.x/big-smile/svg?seed=Aneka"
          /> */}
          <Text
            style={{
              color: "black",
              fontSize: 45,

              fontFamily: "serif",
              fontWeight: "800",
            }}
          >
            GrocX
          </Text>
        </View>

        <View style={styles.subheader}>
          <Text
            style={{ fontSize: 25, fontFamily: "serif", fontWeight: "700" }}
          >
            Sign In
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="Enter email"
            placeholderTextColor={error[0] ? "red" : "gray"}
            style={{
              ...styles.email,
              borderColor: email.length === 0 && error[0] ? "red" : "black",
            }}
            onChangeText={setEmail}
            value={email}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Enter password"
              placeholderTextColor={error[1] ? "red" : "gray"}
              secureTextEntry={hidden}
              onChangeText={setPassword}
              value={password}
              style={{
                ...styles.password,
                borderColor:
                  password.length === 0 && error[0] ? "red" : "black",
              }}
            />
            <TouchableOpacity onPress={() => setHidden(!hidden)}>
              {!hidden ? (
                <EyeSlashIcon size={24} color="gray" />
              ) : (
                <EyeIcon size={24} color="gray" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
            <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>
              Login
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}></View>

          <Text style={{ marginTop: 20, textAlign: "center", fontSize: 17 }}>
            Not a member?
          </Text>

          <TouchableOpacity style={{}} onPress={() => router.push("/signup")}>
            <Text
              style={{ color: "#33adff", textAlign: "center", fontSize: 15 }}
            >
              Sign Up Here
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
    backgroundColor: "white",
    alignItems: "center",
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
  },
  header: {
    width: "100%",
    maxHeight: 85,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",

    alignItems: "center",
  },
  subheader: {
    width: "100%",
    maxHeight: 40,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  form: {
    flex: 1,
    width: "75%",
    paddingTop: 25,
  },
  email: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    paddingBottom: 10,
    paddingHorizontal: 5,
    backgroundColor: "white",
    marginBottom: 30,
    marginTop: 5,
    fontSize: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
    paddingBottom: 10,
    width: "100%",
  },
  password: {
    borderBottomWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "white",
    fontSize: 20,
    flexBasis: "95%",
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  button: {
    backgroundColor: "red",
    width: "75%",
    borderRadius: 20,
    justifyContent: "center",
    paddingVertical: 10,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 40,
  },
  divider: {
    borderWidth: 0.2,
    borderColor: "gray",
    marginTop: 30,
    width: "75%",
    marginLeft: "auto",
    marginRight: "auto",
  },
});
