import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { logout } from "../firebase/authOps";
import { AppContext } from "../contexts/AppContext";
import { useContext } from "react";
import { createTables, dropTable } from "../database/transactions";

const Sair = ({ navigation }) => {

  const { setToggleMessage, setSession, setUserData } = useContext(AppContext);

  const handleExit = async () => {

    await logout();
    await dropTable("user");
    await dropTable("item");
    await dropTable("item_image");
    await createTables();
    console.log("Tables regenerated.");
    setSession(false);
    setUserData({ uid: "", email: "" });
    setToggleMessage("Usuário deslogado!");
    // navigation.navigate("Login");

  };

  return (
    <View>
      <Button mode="contained-tonal" buttonColor="#FF474C" onPress={handleExit}>Sair</Button>
    </View>
  );

};

export default Sair;