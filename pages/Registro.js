import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "../components";
import { TextInput } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { signUp } from "../firebase/authOps";
import { Link } from "@react-navigation/native";
import { AppContext } from "../contexts/AppContext";
import { saveData } from "../firebase/realtime";

const Registro = ({ navigation }) => {

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errors, setErrors] = useState([]);
  const [hidePassword, setHidePassword] = useState(true);

  const { setToggleMessage, isSigningUp, } = useContext(AppContext);

  // useEffect(() => console.log(emailInput));

  const handleRegister = async () => {

    isSigningUp.current = true;
    const result = await signUp(emailInput, passwordInput);

    if (result?.error) {
      setErrors((prevArray) => [...prevArray, result.message]);
      // isSigningUp.current = false;
    } else {
        const user = result.user.toJSON();
        // console.log(user);

        // console.log(user, user.uid);
        await saveData("user", {
          uid: user.uid,
          email: user.email, 
          emailVerified: "",
          displayName: "", 
          username: "",
          photoURL: "",
          phoneNumber: "",
          createdAt: user.createdAt,
          sync: 1,
        }, user.uid);
        setToggleMessage("Usuário registrado!");
        setEmailInput("");
        setPasswordInput("");
        setErrors([]);
        navigation.navigate("Login");
        // isSigningUp.current = false;
    }

  };

  return (
    <ScrollView contentContainerStyle={styles.containerLogin}>
        <View style={{ margin: 15, }}>
          <Image style={{ width: 100, height: 100, margin: "auto", }} source={require("../assets/infnet_receitas.png")} />
          <Text variant="headlineLarge" style={styles.title}>Infnet Receitas</Text>
          <Text variant="headlineSmall" style={styles.title}>Seja bem vindo(a)!</Text>
        </View>
        <Text variant="labelLarge" style={{ marginLeft: 10, marginBottom: 10 }}>Realize o seu cadastro abaixo.</Text>
        <TextInput label="Email" keyboardType="email-address" value={emailInput} onChangeText={(e) => setEmailInput(e)} />
        <TextInput label="Senha" type="password" value={passwordInput} onChangeText={(e) => setPasswordInput(e)} secureTextEntry={hidePassword} 
          right={hidePassword ? <TextInput.Icon icon="eye-off" onPress={() => setHidePassword(false)} /> :
          <TextInput.Icon icon="eye" onPress={() => setHidePassword(true)} /> } />
       <Button mode="contained-tonal" onPress={handleRegister} style={styles.button}>Cadastrar</Button>
       <Link style={styles.register} to={{ screen: "Login" }}>Ou clique aqui para fazer login</Link>
       {errors.length > 0 && <View>{errors.map((item, idx) => <Text key={idx} variant="bodyMedium" style={{ color: "#FF0000", textAlign: "center", marginTop: 10 }}>{item}</Text>)}</View>}
    </ScrollView>
  );

};

const styles = StyleSheet.create({

  containerLogin: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    width: "100%",
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

});

export default Registro;