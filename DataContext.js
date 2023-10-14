import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

// Create a context for your data provider
const DataContext = createContext();

// Create a reducer function to manage state updates
const dataReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FAV_DATA":
      return { ...state, favData: action.payload };
    case "UPDATE_HOME_DATA":
      return { ...state, homeData: action.payload };
    case "UPDATE_CAT_DATA":
      return { ...state, catData: action.payload };
    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  const initialState = {
    favData: null,
    homeData: null,
    catData: null,
  };

  const [state, dispatch] = useReducer(dataReducer, initialState);
  const authState = useAuthState(auth);

  const getAllHomeDocs = async () => {
    console.log("Inside context getAllDocs..");
    const querySnapshot = await getDocs(collection(db, "items"));

    const d = [];

    const cat = {
      Biscuit: [],
      Drink: [],
      Pizza: [],
      IceCream: [],
      Vegetable: [],
      Chips: [],
      Sauce: [],
    };

    querySnapshot.forEach((doc) => {
      d.push({ id: doc.id, ...doc.data() });

      doc
        .data()
        .category.forEach((c) => cat[c].push({ id: doc.id, ...doc.data() }));
    });

    //console.log(cat);
    dispatch({ type: "UPDATE_HOME_DATA", payload: d });
    dispatch({ type: "UPDATE_CAT_DATA", payload: cat });
  };

  const getAllFavDocs = async () => {
    console.log("Inside context getAllFavDocs..");
    const querySnapshot = await getDocs(
      collection(db, "favourites", authState[0].uid, "items")
    );

    const d = [];

    querySnapshot.forEach((doc) => {
      d.push({ id: doc.id, ...doc.data() });
    });
    console.log(d);
    dispatch({ type: "UPDATE_FAV_DATA", payload: d });
  };

  useEffect(() => {
    getAllHomeDocs();
  }, []);

  useEffect(() => {
    if (authState[0]?.uid) {
      getAllFavDocs();
    }
  }, [authState[0]?.uid]);

  const updateFavData = (newData) => {
    console.log("fav update called");
    dispatch({ type: "UPDATE_FAV_DATA", payload: newData });
  };

  const updateHomeData = (newData) => {
    dispatch({ type: "UPDATE_HOME_DATA", payload: newData });
  };

  return (
    <DataContext.Provider value={{ state, updateFavData, updateHomeData }}>
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook to easily access the context
export const useData = () => {
  return useContext(DataContext);
};
