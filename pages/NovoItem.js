import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, FabButton, Text } from "../components";
import { TextInput } from "react-native-paper";
import { useContext, useEffect, useRef, useState } from "react";
import { signUp } from "../firebase/authOps";
import { Link } from "@react-navigation/native";
import { AppContext } from "../contexts/AppContext";

const NovoItem = ({ route, navigation }) => {

  const { uid } = route.params;

  const [recipe, setRecipe] = useState({
    uid: "",
    title: "",
    description: "",
    images: [],
  });
  const [errors, setErrors] = useState([]);
  const [hidePassword, setHidePassword] = useState(true);
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);
  
  const { setToggleMessage } = useContext(AppContext);

  const handleRegister = () => {

  };

  return (
    <ScrollView contentContainerStyle={styles.containerLogin}>
      <Text variant="labelLarge" style={{ margin: 10 }}>Crie ou edite receitas abaixo:</Text>
      <TextInput label="Nome da Receita" type="text" value={recipe.title} onChangeText={(e) => setRecipe((prevData) => ({ ...prevData, title: e, }))} />
      <TextInput label="Descrição" multiline={true} numberOfLines={8} type="text" value={recipe.description} onChangeText={(e) => setRecipe((prevData) => ({ ...prevData, description: e, }))} />
      <Button mode="contained-tonal" onPress={handleRegister} style={styles.button}>Salvar Receita</Button>
      {errors.length > 0 && <View>{errors.map((item, idx) => <Text key={idx} variant="bodyMedium" style={{ color: "#FF0000", textAlign: "center", marginTop: 10 }}>{item}</Text>)}</View>}
      <FabButton style={styles.fab} icon="arrow-left" onPress={() => navigation.navigate("Home")} size={"medium"} />
    </ScrollView>
  );

};

const styles = StyleSheet.create({

  containerLogin: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "100%",
    height: "100%",
  },

  title: {
    // fontSize: 30,
    // margin: 10,
    // textAlign: "center",
    textAlign: "center",
  },

  button: {
    marginTop: 15,
  },

  register: {
    marginTop: 15,
    textAlign: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    padding: 2,
    backgroundColor: "#90A5BB",
  },

  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0
  },

});

export default NovoItem;