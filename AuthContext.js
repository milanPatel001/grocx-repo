import { createContext, useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword, signOut as sgOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const authState = useAuthState(auth);

  const router = useRouter();

  const signIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        router.replace("/");
      })
      .catch((error) => {
        Alert.alert("", "Wrong email or password!!");
      });
  };

  const signOut = () => {
    sgOut(auth)
      .then(() => {
        setUser(null);
        router.replace("/login");
      })
      .catch((error) => {
        console.log("Can't sign out");
      });
  };

  useEffect(() => {
    if (authState[0]?.uid) setUser(authState[0]);
  }, [authState[0]?.uid]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
