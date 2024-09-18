import { createContext } from "react";
import * as React from 'react';
import { auth } from "../firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { createTables } from "../database/transactions";

export const AppContext = createContext({
    session: null,
    setSession: () => null,
    appTheme: null,
    setAppTheme: () => null,
    // setTheme: async (theme: string) => null,
    toggleMessage: null,
    setToggleMessage: () => null,
    userData: {
        uid: "",
        email: "",
    },
});

export default function AppProvider(props) {

    const [toggleMessage, setToggleMessage] = React.useState("");
    const [session, setSession] = React.useState(false);
    const [appTheme, setAppTheme] = React.useState("automatic");
    const [userData, setUserData] = React.useState({
                                                        uid: "",
                                                        email: "",
                                                    });

    React.useEffect(() => {
        
        createTables();

        onAuthStateChanged(auth, (user) => {
            if (user) {
              setUserData({ uid: user.uid, email: user.email, });
              setSession(true);
            }
          });

    }, []);

    return ( <AppContext.Provider value={{
                    session,
                    setSession,
                    appTheme,
                    setAppTheme,
                    toggleMessage,
                    setToggleMessage,
                    userData,
                    setUserData,
                }}>
                {props.children}
            </AppContext.Provider> );

};