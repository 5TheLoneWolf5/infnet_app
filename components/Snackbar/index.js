import { Snackbar } from 'react-native-paper';

const OwnSnackbar = (props) => {

  const onDismissSnackBar = () => props.setVisible("");

  return (
    <Snackbar visible={props.visible}
      onDismiss={onDismissSnackBar}
      action={{
        label: 'Fechar',
        onPress: () => {
          onDismissSnackBar();
        },
      }}>
        {props.children}
    </Snackbar>
  );

};

export default OwnSnackbar;