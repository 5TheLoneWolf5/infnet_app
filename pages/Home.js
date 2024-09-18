import { View, StyleSheet } from "react-native";
import { FabButton, IconButton, List, Text } from "../components";
import { useContext, useEffect, useState } from "react";
import { select } from "../database/transactions";
import { AppContext } from "../contexts/AppContext";

const Home = ({ navigation }) => {

  const [recipes, setRecipes] = useState([]);

  const { userData } = useContext(AppContext);

  const loadRecipes = async () => {
    const data = await select("item", ["uid", "title", "description", "createdAt", "sync"], "", true);
    data ? setRecipes(data) : null;
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <View style={{ height: "100%" }}>
      <Text variant="headlineSmall" style={{ margin: 8 }}>Olá, {userData.email}!</Text>
      <Text variant="titleSmall" style={{ margin: 8 }}>Visualize, edite ou remova receitas abaixo. Crie novas receitas com a ação de adicionar abaixo, ou na aba <Text style={{ fontStyle: "italic", }}>Novo item</Text>.</Text>
      <View>
        {/* {
          recipes.length && recipes.map((item, idx) => (
            <List 
              title={item.title}
              description={item.description}
              right={() => <IconButton onPress={() => navigation.navigate("Novo Item", { uid: item.uid })} icon="pencil" />}
            />
          ))
        } */}
      </View>
      <FabButton style={styles.fab} icon="plus" onPress={() => navigation.navigate("Novo Item")} size={"medium"} />
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