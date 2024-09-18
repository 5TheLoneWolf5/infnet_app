import { Menu } from 'react-native-paper';

const OwnMenu = (props) => {

  return (
    <Menu {...props}>
      {props.children}
    </Menu>
  );

};

export default OwnMenu;