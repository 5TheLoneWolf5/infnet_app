import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./app";

const signUp = async (email, password) => {

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        return true;
    }
    catch (error) {
        return { error: true, message: error.message };
    }

};

const login = async (email, password) => {

    try {
        await signInWithEmailAndPassword(auth, email, password);
        return true;
    }
    catch (error) {
        return { error: true, message: error.message };
    }

};

const logout = async () => {

    signOut(auth).then(() => {
        console.log("Logged out.");
    }).catch((error) => {
        console.log(error.message);
    });

};

const resetPassword = async (email) => {

    let msg = {};

    await sendPasswordResetEmail(auth, email)
        .then(() => {
            // console.log("Enviado!");
        })
        .catch((error) => {
            msg.error = error.message;
        // ..
        });

    return msg;

};

export { signUp, login, logout, resetPassword, };