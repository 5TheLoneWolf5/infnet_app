import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Camera, Card, FabButton, IconButton, Surface, Text } from "../components";
import { TextInput, Card as Cd } from "react-native-paper";
import { useCallback, useContext, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { AppContext } from "../contexts/AppContext";
import { drop, generateUID, insert, populateLocalImages, populateLocalItems, select, update, verifyConnection } from "../database/transactions";
import { useFocusEffect } from "@react-navigation/native";
import { deleteImage, uploadImageStorage } from "../firebase/storage";

const NovoItem = ({ route, navigation }) => {

  const { uid } = route.params;
  console.log("UID: " + uid);

  const [recipe, setRecipe] = useState({
    uid: "",
    title: "",
    description: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);

  const { userData, setToggleMessage } = useContext(AppContext);

  const onCapture = (photo) => {
    const images = recipe.images;
    images.push(photo.uri);
    updateImages(images);
  }

  const loadData = async () => {
    if (uid) {

      if (await verifyConnection()) {
        // console.log(userData.uid);
        await populateLocalItems();
        await populateLocalImages();
      }

        console.log("uid: " + uid);
        const d = await select("item", [ "uid", "title", "description", "createdAt", "sync"], `uid='${uid}'`, false);
        const images = await select("item_image", [ "uid", "image", "itemUid", "createdAt", "sync"], `itemUid='${uid}'`, true);

        console.log(images);
        setRecipe((v) => ({
            ...v,
            ...d,
            images: images.map(image => image.image),
            uid: uid,
        }));
    } else {
      setRecipe({  
          uid: "",
          title: "",
          description: "",
          images: []} );
      }
}

  useFocusEffect(useCallback(() => {
    const loadDataAsync = async () => await loadData();
    loadDataAsync();
    console.log("useFocusEffect");
  }, [uid]));

  const _update = async () => {
      setLoading(true);

      let uid = recipe.uid;

      try {
          if (uid) {
              await update('item', {
                  title: recipe.title,
                  description: recipe.description,
                  uid: uid,
              }, uid);

              const dataToBeDeleted = await select("item_image", ["uid", "image"], `itemUid='${uid}'`, true);

              for (let i = 0; i < dataToBeDeleted.length; i++) {
                // const uri = dataToBeDeleted[i].image.split("/");
                // await deleteImage(uri[uri.length-1]);
                await drop("item_image", `uid='${dataToBeDeleted[i].uid}'`);
              }

              for (let image of recipe.images){
                  await insert('item_image', {
                      image: image,
                      itemUid: uid
                  });
                  // console.log(image);
                  const uri = image.split("/");
                  await uploadImageStorage(image, uri[uri.length-1]);
              }
              
          } else {
              const newUid = await insert('item', {
                  title: recipe.title,
                  description: recipe.description,
                  uid: generateUID(28),
              })

              if (recipe.images?.length > 0) {
                  for (let image of recipe.images){
                      await insert('item_image', {
                          image: image,
                          itemUid: newUid,
                      });
                      const uri = image.split("/");
                      await uploadImageStorage(image, uri[uri.length-1]);
                  }
              }
          }
          navigation.navigate("Home");
          setToggleMessage(recipe.uid ? "Dado atualizado!" : "Dado criado!");
      }catch (err){
          console.log(err);
          setToggleMessage(recipe.uid ? "Um erro ocorreu ao atualizar.": "Um erro ocorreu ao criar.")
      }

      setLoading(false);
  }

  const pickImage = async () => {

      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          aspect: [4, 3],
          quality: 1,
      });

      setLoading(true);

      if (!result.canceled) {
          const images = recipe.images;
          result.assets.forEach((image) => {
              images.push(image.uri);
          })
          updateImages(images);
      }
      setLoading(false);
  };

  const updateImages = (images) => {
      setRecipe((v) => ({...v, images: images}));
  }

  const handleRemoveImg = (idx) => {

    const copyImages = recipe.images;
    copyImages.splice(idx, 1);
    updateImages(copyImages);
    setToggleMessage("Imagem removida!");

  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.containerLogin}>
        <Text variant="labelLarge" style={{ margin: 10 }}>Crie ou edite receitas abaixo:</Text>
        <TextInput label="Nome da Receita" type="text" value={recipe.title} onChangeText={(e) => setRecipe((prevData) => ({ ...prevData, title: e, }))} />
        <TextInput label="Descrição" multiline={true} numberOfLines={8} type="text" value={recipe.description} onChangeText={(e) => setRecipe((prevData) => ({ ...prevData, description: e, }))} />
        <View style={{ marginVertical: 10, gap: 4 }}>
          <Button icon="camera" mode="contained" onPress={() => setCameraVisible(true)}>Tirar uma foto</Button>
          <Button icon="image" mode="contained" onPress={pickImage}>Visualizar Galeria</Button>
          <Button mode="contained-tonal" onPress={_update} style={styles.button}>Salvar Receita</Button>
        </View>
        {loading ? <ActivityIndicator animating={true} /> : (
          <Surface elevation={4}>
            {recipe.images.map((item, idx) => {
              return (<Card key={idx} style={styles.card}>
                        <Cd.Actions>
                          <IconButton icon="close" onPress={() => handleRemoveImg(idx)} />
                        </Cd.Actions>
                        <Cd.Cover source={{ uri: item }}  />
                      </Card>)
              })}
          </Surface>)}
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
    gap: 4,
    width: "100%",
    // height: "100%",
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

export default NovoItem;