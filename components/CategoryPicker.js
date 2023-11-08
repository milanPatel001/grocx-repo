import { useState } from "react";
import { Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useFormData } from "../FormContext";

export default function CategoryPicker() {
  const [checked, setisChecked] = useState([
    { cat: "Biscuits", ch: false },
    { cat: "Drinks", ch: false },
    { cat: "Fruits", ch: false },
    { cat: "Snacks", ch: false },
  ]);

  const { updateCategories } = useFormData();

  const handleCheck = (index) => {
    const newCheckboxes = [...checked];
    newCheckboxes[index].ch = !newCheckboxes[index].ch;

    updateCategories(newCheckboxes);
    setisChecked(newCheckboxes);
  };

  return (
    <View style={{ flexDirection: "row", gap: 15 }}>
      {checked.map((obj, index) => (
        <View
          key={index}
          style={{
            gap: 2,
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "serif" }}>{obj.cat}</Text>

          <BouncyCheckbox
            isChecked={obj.ch}
            onPress={() => handleCheck(index)}
            size={30}
            disableText
            fillColor="red"
          />
        </View>
      ))}
    </View>
  );
}
