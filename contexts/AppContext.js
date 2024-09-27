import { createContext } from "react";
import * as React from 'react';
import { auth } from "../firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { createTables, populateAll, syncLocalOnlyData } from "../database/transactions";

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

    const isSigningUp = React.useRef(false);
    const [toggleMessage, setToggleMessage] = React.useState("");
    const [session, setSession] = React.useState(false);
    const [appTheme, setAppTheme] = React.useState("automatic");
    const [userData, setUserData] = React.useState({
                                                        uid: "",
                                                        email: "",
                                                    });

    React.useEffect(() => {

        const dbSetup = async () => {
            await createTables();
        };
        
        dbSetup();

        onAuthStateChanged(auth, async (user) => {
            if (user && !isSigningUp.current) {
                // console.log("Been Here!!!");
                await populateAll(user.uid);
                await syncLocalOnlyData();
                setToggleMessage("Usuário logado!");
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
                    isSigningUp,
                }}>
                {props.children}
            </AppContext.Provider> );

};