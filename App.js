import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Perfil from "./pages/Perfil";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import EsqueciSenha from "./pages/EsqueciSenha";
import NovoItem from "./pages/NovoItem";
import Sair from "./pages/Sair";
import { Snackbar } from "./components/index";
import { PaperProvider, Menu as PaperMenu } from 'react-native-paper';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useContext, useEffect } from "react";
import { AppContext } from './contexts/AppContext';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from './constants/themes';

const Drawer = createDrawerNavigator();

export default function App() {

  const { session, appTheme, toggleMessage, setToggleMessage } = useContext(AppContext);

  const colorScheme = useColorScheme();
  
  useEffect(() => console.log(appTheme + " - appTheme"));

  // console.log(colorScheme);
  let theme = {};
  
  if (appTheme && appTheme !== "automatic") {

    theme = appTheme === "dark" ? darkTheme : lightTheme;

  } else {

    if (colorScheme === "dark") {

      theme = darkTheme;
  
    } else {
  
      theme = lightTheme;
  
    }

  }
  
  return (
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Drawer.Navigator initialRoute Name="Home" screenOptions={{
            drawerInactiveTintColor: theme.colors.onSecondaryContainer,
            drawerInactiveBackgroundColor: theme.colors.background,
            headerTintColor: theme.colors.onSecondaryContainer,
            drawerStyle: {
              backgroundColor: theme.colors.background,
            },
            sceneContainerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            // drawerPosition: "right",
            // headerRight: props => false,
          }}>
              { session ? (
                <Drawer.Group>
                  <Drawer.Screen
                    name="Home"
                    component={Home}
                  //   options={{
                  //     headerRight: () => (
                  //     <Menu visible={visible} onDismiss={closeMenu} anchor={<Button icon="cog" buttonColor="lightsteelblue" textColor="black" onPress={openMenu}></Button>}>
                  //       <PaperMenu.Item title="Configurações" />
                  //     </Menu>
                  //   ),
                  // }}
                  />
                  <Drawer.Screen name="Dashboard" component={Dashboard} />
                  <Drawer.Screen name="Perfil" component={Perfil} />
                  <Drawer.Screen name="Settings" component={Settings} />
                  <Drawer.Screen name="Novo Item" component={NovoItem} initialParams={{ uid: "" }} />
                  <Drawer.Screen name="Sair" component={Sair} />
                </Drawer.Group> ) : 
                (
                <Drawer.Group>
                  <Drawer.Screen name="Login" component={Login} />
                  <Drawer.Screen name="Registro" component={Registro} />
                  <Drawer.Screen name="Esqueci minha senha" component={EsqueciSenha} />
                </Drawer.Group>
              ) }
            </Drawer.Navigator>
            <Snackbar visible={toggleMessage} setVisible={setToggleMessage}>{toggleMessage}</Snackbar>
          </NavigationContainer>
    </PaperProvider>
  );
}