import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

const FormContext = createContext();

// first two are for modal popups
const dataReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_ITEM":
      return { ...state, item: action.payload };
    case "UPDATE_LOCATION":
      return { ...state, location: action.payload };
    case "UPDATE_PRICES":
      return { ...state, prices: action.payload };
    case "UPDATE_SELF_CATEGORIES":
      return { ...state, cat: action.payload };
    case "UPDATE_SELF_IMAGE":
      return { ...state, img: action.payload };
    default:
      return state;
  }
};

export const FormProvider = ({ children }) => {
  const initialState = {
    item: null,
    location: null,
    prices: null,
    cat: null,
    img: null,
  };

  const [state, dispatch] = useReducer(dataReducer, initialState);

  const getAllHomeDocs = async () => {
    console.log("Inside context getAllDocs..");
    const querySnapshot = await getDocs(collection(db, "items"));

    const d = [];

    querySnapshot.forEach((doc) => {
      d.push({ id: doc.id, ...doc.data() });
    });

    //console.log(d);
    dispatch({ type: "UPDATE_HOME_DATA", payload: d });
  };

  useEffect(() => {
    getAllHomeDocs();
  }, []);

  //Modal methods
  const updateItem = (newData) => {
    dispatch({ type: "UPDATE_ITEM", payload: newData });
  };

  const updateLocation = (newData) => {
    dispatch({ type: "UPDATE_LOCATION", payload: newData });
  };

  const updatePrices = (newData) => {
    dispatch({ type: "UPDATE_PRICES", payload: newData });
  };

  const updateCategories = (newData) => {
    //console.log("Inside update cat");
    //console.log(newData);
    dispatch({ type: "UPDATE_SELF_CATEGORIES", payload: newData });
  };

  const updateImage = (newData) => {
    console.log("Inside update img");
    dispatch({ type: "UPDATE_SELF_IMAGE", payload: newData });
  };

  return (
    <FormContext.Provider
      value={{
        state,
        updateItem,
        updateLocation,
        updatePrices,
        updateCategories,
        updateImage,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => {
  return useContext(FormContext);
};
