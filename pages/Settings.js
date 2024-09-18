import { View, Text } from "react-native";
import { RadioButton } from "../components/index";
import { RadioButton as Radio } from 'react-native-paper';
import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";

const Settings = ({ navigation }) => {

  const [chosenTheme, setChosenTheme] = useState("");
  const { setAppTheme } = useContext(AppContext);
  
  const handleTheme = (value) => {

    // console.log(value);
    setChosenTheme(value);
    setAppTheme(value);

  };

  // const [visible, setVisible] = useState(false);

  // const openMenu = () => setVisible(true);
  // const closeMenu = () => setVisible(false);

  return (
    <View>
      <RadioButton onValueChange={handleTheme} value={chosenTheme}>
        <Radio.Item label="Modo Escuro" value="dark" />
        <Radio.Item label="Modo Claro" value="light" />
        <Radio.Item label="Tema Padrão do Sistema" value="automatic" />
      </RadioButton>
      {/* <Menu visible={visible} onDismiss={closeMenu} anchor={<Button icon="cog" buttonColor="lightsteelblue" textColor="black" onPress={openMenu}></Button>}>
        <PaperMenu.Item onPress={() => navigation.navigate("Login")} title="Login" />
        <PaperMenu.Item onPress={() => navigation.navigate("Registro")} title="Registro" />
        <PaperMenu.Item onPress={() => navigation.navigate("EsqueciSenha")} title="Esqueci minha senha" />
        <PaperMenu.Item onPress={() => navigation.navigate("NovoItem")} title="Novo item" />
        <PaperMenu.Item onPress={() => navigation.navigate("Sair")} title="Sair" />
      </Menu> */}
    </View>
  );

};

export default Settings;