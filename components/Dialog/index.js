import { Dialog, Portal } from 'react-native-paper';

const OwnDialog = (props) => {

    return (
        <Portal>
            <Dialog {...props}>
                {props.children}
            </Dialog>
        </Portal>
    );

};

export default OwnDialog;