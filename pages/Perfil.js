import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, AvatarIcon, AvatarImage, Button, Camera, Card, FabButton, IconButton, Surface, Text } from "../components";
import { TextInput, Card as Cd } from "react-native-paper";
import { useCallback, useContext, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { AppContext } from "../contexts/AppContext";
import { populateLocalUser, select, update, verifyConnection } from "../database/transactions";
import { useFocusEffect } from "@react-navigation/native";
import { uploadImageStorage } from "../firebase/storage";

const Perfil = ({ navigation }) => {

  const [user, setUser] = useState({
    uid: "",
    email: "", 
    emailVerified: "",
    displayName: "", 
    username: "",
    photoURL: "",
    phoneNumber: "",
    createdAt: "",
    sync: "",
  });
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);

  const { userData, setToggleMessage } = useContext(AppContext);

  const onCapture = (photo) => {
    setUser((prevData) => ({ ...prevData, photoURL: photo.uri }));
  };

  const loadData = async () => {
    const data = await select("user", ["uid", "emailVerified", "username", "displayName", "email", "photoURL", "phoneNumber", "createdAt"], null, false);
    // console.log(data);
    setUser((prevData) => ({ ...prevData, ...data }));
  };

  useFocusEffect(useCallback(() => {
    
    const loadPopulateProfile = async () => { if (await verifyConnection()); await populateLocalUser(userData.uid); };
    const loadDataAsync = async () => await loadData();

    loadPopulateProfile();
    loadDataAsync();
    
    console.log("useFocusEffect");
  }, []));

  const _update = async () => {
    try{
        await update("user", user, user.uid);

        if (user.photoURL) {
          const uri = user.photoURL.split("/");
          await uploadImageStorage(user.photoURL, uri[uri.length-1]); 
        }
        setToggleMessage("Dados atualizados!");
    } catch (error) {
      setToggleMessage("Um erro ocorreu.");
    }
  }

  const pickImage = async () => {

      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: false,
          aspect: [4, 3],
          quality: 1,
      });

      if (!result.canceled) {
        setUser((prevData) => ({ ...prevData, photoURL: result.assets[0].uri }));
      }
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.containerLogin}>
        {user?.photoURL ? <AvatarImage source={{ uri: user.photoURL }} size={100} style={styles.avatar} /> : <AvatarIcon icon="account" size={100} style={styles.avatar} />}
        <Surface style={{ flexDirection: "row", justifyContent: "space-around", margin: 10, padding: 5, borderRadius: 10 }}>
          <Button icon="camera" mode="contained" onPress={() => setCameraVisible(true)}>Tirar uma foto</Button>
          <Button icon="image" mode="contained" onPress={pickImage}>Abrir Galeria</Button>
        </Surface>
        <TextInput label="Username" value={user.username} onChangeText={(e) => setUser((prevData) => ({ ...prevData, username: e, }))} />
        <TextInput label="Nome" value={user.displayName} onChangeText={(e) => setUser((prevData) => ({ ...prevData, displayName: e, }))} />
        <TextInput label="E-mail" keyboardType="email-address" value={user.email} onChangeText={(e) => setUser((prevData) => ({ ...prevData, email: e, }))} />
        <TextInput label="Telefone" keyboardType="email-address" value={user.phoneNumber} onChangeText={(e) => setUser((prevData) => ({ ...prevData, phoneNumber: e, }))} />
        <View style={{ marginVertical: 10, gap: 4 }}>
          <Button mode="contained-tonal" onPress={_update} style={styles.button}>Salvar Perfil</Button>
        </View>
        { cameraVisible ? <Camera onCapture={onCapture} setCameraVisible={setCameraVisible} ref={cameraRef} /> : null }
      </ScrollView>
      <FabButton style={styles.fab} icon="arrow-left" onPress={() => navigation.navigate("Home")} size={"medium"} />
    </>
  );

};

const styles = StyleSheet.create({

  containerLogin: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 4,
    width: "100%",
    // height: "100%",
  },

  avatar: {
    margin: "auto",
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

  gridImage: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "stretch",
    width: "100%",
  },

  card: {
    borderColor: "black",
    borderWidth: 2,
    margin: 5,
  }

});

export default Perfil;