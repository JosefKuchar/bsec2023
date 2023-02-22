import { StyleSheet } from "react-native";
import { useState } from "react";
import { RootTabScreenProps } from "../types";
import { Button } from "react-native-paper";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [count, setCount] = useState(0);

  return (
    <Button className="mt-20 p-2" onPress={() => setCount(count + 1)}>
      Počet kliknutí: {count}
    </Button>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
