import { Card } from 'react-native-paper';

const OwnCard = (props) => {

  return (
    <Card {...props}>
      {props.children}
    </Card>
  );

};

export default OwnCard;