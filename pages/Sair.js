import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import { logout } from "../firebase/authOps";
import { AppContext } from "../contexts/AppContext";
import { useContext } from "react";

const Sair = ({ navigation }) => {

  const { setToggleMessage, setSession, setUserData } = useContext(AppContext);

  const handleExit = async () => {

    logout();
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