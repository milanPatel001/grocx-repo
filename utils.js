import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "./firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

/* get info methods */

export async function getSearchData(setSearchData) {
  //const arr = ["one", "two", "three", "thhh", "tuo", "tok", "lop", "fo", "add"];
  const querySnapshot = await getDocs(collection(db, "search"));

  const d = [];

  querySnapshot.forEach((doc) => {
    d.push({ id: doc.id, ...doc.data() });
  });
  //console.log(d);
  setSearchData(d);
}

export async function getItemInfo(setData, setBarData, params) {
  console.log("Inside [info], calling getInfoDocs...");
  const querySnapshot = await getDocs(
    collection(db, "items", params.info, "location")
  );

  const d = [];
  const b = [];

  querySnapshot.forEach((doc) => {
    if (!doc.data().id) d.push({ id: doc.id, ...doc.data() });
    else d.push({ ...doc.data() });

    b.push({
      value: doc.data().last_updated[1],
      label: doc.data().shop_name,
    });
  });

  //console.log(d);
  setData(d);
  setBarData(b);
}

/* Favourite Item Methods */

export async function handleFavoritesDeletion(
  id,
  state,
  authState,
  updateFavData
) {
  if (authState[0]?.uid) {
    const ref = doc(db, "favourites", authState[0].uid, "items", id);

    await deleteDoc(ref);

    let fav = [...state.favData];
    fav = fav.filter((f) => id !== f.id);

    updateFavData(fav);
  }
}

export async function handleFavoritesAddition(
  isFav,
  state,
  authState,
  params,
  meta,
  updateFavData
) {
  if (!isFav) {
    if (authState[0]?.uid) {
      const ref = doc(db, "favourites", authState[0].uid, "items", params.info);
      const obj = {
        img: meta?.img,
        weight: meta?.weight,
        name: meta?.name,
        category: meta?.category,
      };
      await setDoc(ref, obj);

      const fav = [...state.favData];
      fav.push({ id: params.info, ...obj });

      updateFavData(fav);
    }
  } else {
    if (authState[0]?.uid) {
      const ref = doc(db, "favourites", authState[0].uid, "items", params.info);

      await deleteDoc(ref);

      let fav = [...state.favData];
      fav = fav.filter((f) => params.info !== f.id);

      updateFavData(fav);
    }
  }
}

/* Image Methods */
export async function pickImage(updateImage, setImage) {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  //console.log(result);

  if (!result.canceled) {
    updateImage(result.assets[0].uri);
    setImage(result.assets[0].uri);
  }
}

export async function uploadImageAsync(uri, id) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.error(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const storageRef = ref(storage, "images/" + id);

  await uploadBytes(storageRef, blob);

  // We're done with the blob, close and release it
  blob.close();

  return await getDownloadURL(storageRef);
}

/* Extras */

export function categoryColor(category) {
  if (category === "Sweets") return "#D0312D";
  else if (category === "Biscuits") return "#E3242B";
  else if (category === "Snacks") return "#5DADE2";
  else if (category === "Fruits") return "#8E44AD";
  else if (category === "Drinks") return "#1ABC9C";
}
