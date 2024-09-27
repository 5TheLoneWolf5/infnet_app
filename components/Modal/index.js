import { Modal } from 'react-native';

const OwnModal = (props) => {

  return (
    <Modal {...props}>
      {props.children}
    </Modal>
  );

};

export default OwnModal;