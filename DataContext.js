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
    case "UPDATE_RECENT_DATA":
      const found = state.recentData.find(
        (item) => item.id === action.payload.id
      );
      if (found) return state;

      const newArr = [...state.recentData];

      if (state.recentData.length == 6) {
        newArr.shift();
      }
      newArr.push(action.payload);

      return { ...state, recentData: newArr };
    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  const initialState = {
    favData: null,
    homeData: null,
    catData: null,
    recentData: [],
  };

  const [state, dispatch] = useReducer(dataReducer, initialState);
  const authState = useAuthState(auth);

  const getAllHomeDocs = async () => {
    console.log("Inside context getAllDocs..");
    const querySnapshot = await getDocs(collection(db, "items"));

    const d = [];

    const cat = {
      Biscuits: [],
      Drinks: [],
      Snacks: [],
      IceCream: [],
      Sweets: [],
      Fruits: [],
    };

    querySnapshot.forEach((doc) => {
      if (!doc.data().id) d.push({ id: doc.id, ...doc.data() });
      else d.push({ ...doc.data() });

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
    //console.log(d);
    dispatch({ type: "UPDATE_FAV_DATA", payload: d });
  };

  useEffect(() => {
    if (authState[0]?.uid) {
      getAllHomeDocs();
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

  const updateRecentData = (newData) => {
    dispatch({ type: "UPDATE_RECENT_DATA", payload: newData });
    //console.log(state.recentData);
  };

  return (
    <DataContext.Provider
      value={{ state, updateFavData, updateHomeData, updateRecentData }}
    >
      {children}
    </DataContext.Provider>
  );
};

// Create a custom hook to easily access the context
export const useData = () => {
  return useContext(DataContext);
};
