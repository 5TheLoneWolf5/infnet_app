import { Text } from 'react-native-paper';

const OwnText = (props) => {

  return (
    <Text {...props} variant={props.variant}>{props.children}</Text>
  );

};

export default OwnText;