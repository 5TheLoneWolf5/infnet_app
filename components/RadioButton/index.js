import { RadioButton } from 'react-native-paper';

const OwnRadioButton = (props) => {

  return (
    <RadioButton.Group {...props}>
      {props.children}
    </RadioButton.Group>
  );

};

export default OwnRadioButton;