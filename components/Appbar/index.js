import { Appbar } from 'react-native-paper';

const OwnAppbar = (props) => {

  return (
    <Appbar.Header {...props}>
      {props.children}
    </Appbar.Header>
  );

};

export default OwnAppbar;