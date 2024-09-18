import { Button } from 'react-native-paper';

const OwnButton = (props) => {

  return (
    <Button {...props}>
      {props.children}
    </Button>
  );

};

export default OwnButton;