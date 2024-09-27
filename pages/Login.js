import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "../components";
import { TextInput } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { login } from "../firebase/authOps";
import { Link } from "@react-navigation/native";
import { AppContext } from "../contexts/AppContext";
import { populateAll, syncLocalOnlyData, } from "../database/transactions";

const Login = ({ navigation }) => {

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errors, setErrors] = useState([]);
  const [hidePassword, setHidePassword] = useState(true);
  
  const { setToggleMessage, setUserData, setSession } = useContext(AppContext);

  // useEffect(() => console.log(emailInput));

  const handleLogin = async () => {

    const result = await login(emailInput, passwordInput);
    // console.log(result);

    // result?.error ? setErrors((prevArray) => [...prevArray, result.message]) : navigation.navigate("Home");

    if (result?.error) {
      setErrors((prevArray) => [...prevArray, result.message]);
    } else {
        const user = result.user.toJSON();
        // console.log(user);

        // await populateAll(user.uid);
        await syncLocalOnlyData();

        // await insert("user", {
        //   uid: user.uid,
        //   email: user.email, 
        //   emailVerified: "",
        //   displayName: "", 
        //   username: "",
        //   photoURL: "",
        //   phoneNumber: "",
        //   createdAt: user.createdAt,
        //   sync: 1,
        // });
         
        setUserData({ uid: user.uid, email: user.email, });
        setToggleMessage("Usuário logado!");
        // populateLocalUser(user.uid);
        setEmailInput("");
        setPasswordInput("");
        setErrors([]);
        setSession(true);
        // navigation.navigate("Home");
    }

  };

  /*  buttonColor="lightsteelblue" textColor="black" ---> It was considering this comment a text when inside the return. */

  return (
    <ScrollView contentContainerStyle={styles.containerLogin}>
        <View style={{ margin: 15, }}>
          <Image style={{ width: 100, height: 100, margin: "auto", }} source={require("../assets/infnet_receitas.png")} />
          <Text variant="headlineLarge" style={styles.title}>Infnet Receitas</Text>
          <Text variant="headlineSmall" style={styles.title}>Bem vindo(a)!</Text>
        </View>
        <Text variant="labelLarge" style={{ marginLeft: 10, marginBottom: 10 }}>Realize o seu login abaixo.</Text>
        <TextInput label="Email" keyboardType="email-address" value={emailInput} onChangeText={(e) => setEmailInput(e)} />
        <TextInput label="Senha" type="password" value={passwordInput} onChangeText={(e) => setPasswordInput(e)} secureTextEntry={hidePassword} 
          right={hidePassword ? <TextInput.Icon icon="eye-off" onPress={() => setHidePassword(false)} /> :
          <TextInput.Icon icon="eye" onPress={() => setHidePassword(true)} /> } />
       <Button mode="contained-tonal" onPress={handleLogin} style={styles.button}>Logar</Button>
       <View style={{ marginTop: 20, }}>
        <Link style={{ ...styles.register, ...styles.forgotPassword }} to={{ screen: "Esqueci minha senha" }}>Esqueci minha senha</Link>
        <Link style={styles.register} to={{ screen: "Registro" }}>Clique aqui para criar nova uma conta</Link>
       </View>
       {errors.length > 0 && <View>{errors.map((item, idx) => <Text variant="bodyMedium" key={idx} style={{ color: "#FF0000", textAlign: "center", marginTop: 10 }}>{item}</Text>)}</View>}
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
    marginHorizontal: 4,
    textAlign: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    backgroundColor: "#90A5BB",
  },
  
  forgotPassword: {
    backgroundColor: "#F5FFFF",
  },

});

export default Login;