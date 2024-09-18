// import { AppRegistry } from 'react-native';
import AppProvider from './contexts/AppContext';
import App from './App';
import { registerRootComponent } from "expo";

export default function Main() {
  return (
        <AppProvider>
            <App />
        </AppProvider>
  );
}

// AppRegistry.registerComponent("Infnet_App", () => Main);
registerRootComponent(Main);