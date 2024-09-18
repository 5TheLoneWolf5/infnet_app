import { useContext, useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "../components";
import { resetPassword } from "../firebase/authOps";
import { AppContext } from "../contexts/AppContext";
import { Text } from "react-native-paper";

const EsqueciSenha = () => {

  const [emailInput, setEmailInput] = useState("");

  const { setToggleMessage } = useContext(AppContext);

  const handleSendEmail = async () => {

    const result = await resetPassword(emailInput);
    // console.log(result);

    if (result?.error) {
      setToggleMessage("Erro: " + result.error);
    } else {
      setToggleMessage("Email enviado para " + emailInput + "!");
      setEmailInput("");
    }

  };

  return (
    <View>
      <Text style={{ marginLeft: 10, marginVertical: 10 }}>Digite o seu email abaixo:</Text>
      <TextInput label="Email" keyboardType="email-address" value={emailInput} onChangeText={(e) => setEmailInput(e)} />
      <Button style={{ marginVertical: 10 }} mode="contained-tonal" onPress={handleSendEmail}><Text>Enviar email de recuperação</Text></Button>
    </View>
  );

};

export default EsqueciSenha;