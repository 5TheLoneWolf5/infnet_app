import { View, StyleSheet, ScrollView } from "react-native";
import { FabButton, IconButton, List, Text } from "../components";
import { List as Ls } from "react-native-paper";
import { useCallback, useContext, useState } from "react";
import { drop, populateLocalImages, populateLocalItems, select, verifyConnection } from "../database/transactions";
import { AppContext } from "../contexts/AppContext";
import { useFocusEffect } from "@react-navigation/native";

const Home = ({ navigation }) => {

  const [recipes, setRecipes] = useState([]);

  const { userData } = useContext(AppContext);

  const loadRecipes = async () => {

    if (await verifyConnection()) {
      // console.log(userData.uid);
      await populateLocalItems();
      await populateLocalImages();
    }

    const data = await select("item", ["uid", "title", "description", "createdAt", "sync"], "", true);
    data ? setRecipes(data) : null;
  };

  useFocusEffect(useCallback(() => {
    loadRecipes();
  }, []));

  return (
    <View style={{ height: "100%" }}>
      <ScrollView style={{ height: "100%", }}>
        <Text variant="headlineSmall" style={{ margin: 8 }}>Olá, {userData.email}!</Text>
        <Text variant="titleSmall" style={{ margin: 8 }}>Visualize, edite ou remova receitas abaixo. Crie novas receitas com a ação de adicionar abaixo, ou na aba <Text style={{ fontStyle: "italic", }}>Novo item</Text>.</Text>
        <List style={{ paddingBottom: 80 }}>
          {
            recipes.length ? recipes.map((item, idx) => (
              <Ls.Item
                key={idx}
                title={item.title}
                description={item.description}
                right={() => <><IconButton onPress={() => navigation.navigate("Novo Item", { uid: item.uid })} icon="pencil" /><IconButton onPress={async () => { await drop("item", `uid = "${item.uid}"`); await loadRecipes(); }} icon="delete" /></>}
              />
            )) : null
          }
        </List>
      </ScrollView>
      <FabButton style={styles.fab} icon="plus" onPress={() => navigation.navigate("Novo Item", { uid: "" })} size={"medium"} />
    </View>
  );

};

const styles = StyleSheet.create({

  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0
  },

})

export default Home;