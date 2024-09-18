import { List } from "react-native-paper";

const OwnList = (props) => {

  return (
    <List.Section {...props}>
      {props.children}
    </List.Section>
  );

};

export default OwnList;