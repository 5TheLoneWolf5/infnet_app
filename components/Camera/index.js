import { CameraView, useCameraPermissions } from 'expo-camera';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dialog as Dlg } from 'react-native-paper';
// import { Button, Dialog, FabButton, Modal, Text } from '..';
import OwnDialog from '../Dialog';
import OwnButton from '../Button';
import OwnFAB from '../FabButton';
import OwnModal from '../Modal';
import OwnText from '../Text';

const Camera = forwardRef(({setCameraVisible, onCapture}, ref) => {

    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [dialogGrantCamera, setDialogGrantCamera] = useState(true);
    const [cameraRef, setCameraRef] = useState(null);
    // console.log("Permission: " + permission);

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const closeCamera = () => {
        setCameraVisible(false);
    }

    useImperativeHandle(ref, () => ({
            takePicture: async () => {
                if (cameraRef) {
                    const photo = await cameraRef.takePictureAsync({
                        base64: false,
                        quality: 1,
                        scale: 1
                    });
                    console.log(photo)
                    onCapture(photo);
                    closeCamera();
                }
            },
        }),
    );

    if (!permission) {
        // console.log("!permission: " + permission);
        return ( <View><OwnText>Permissão não concedida.</OwnText></View> );
    }

    if (!permission.granted) {
        // console.log("!permission.granted " + permission);
        return (
            <OwnDialog
                visible={dialogGrantCamera}
                onDismiss={() => { setDialogGrantCamera(false); setCameraVisible(false); }}>
                    <Dlg.Icon icon={"alert"} />
                    <Dlg.Title>Permitir acesso à camera</Dlg.Title>
                    <Dlg.Content>
                        <OwnText>Deseja permitir que o aplicativo acesse sua câmera?</OwnText>
                    </Dlg.Content>
                    <Dlg.Actions>
                        <OwnButton onPress={() => { setDialogGrantCamera(false); setCameraVisible(false); }}>Cancelar</OwnButton>
                        <OwnButton onPress={async () => { await requestPermission(); setDialogGrantCamera(false); closeCamera(); }}>Permitir</OwnButton>
                    </Dlg.Actions>
                </OwnDialog>
        );
    }

    return (
        <OwnModal style={styles.container}>
            <CameraView
                ref={(ref) => setCameraRef(ref)}
                style={styles.camera} facing={facing}>
                <OwnFAB
                    onPress={closeCamera}
                    icon="close"
                    style={styles.closeButton} />
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                        <TouchableOpacity>
                            <OwnFAB
                                onPress={() => ref.current.takePicture()}
                                icon="camera"
                                style={styles.takePicture}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <OwnFAB
                                onPress={toggleCameraFacing}
                                icon="camera-flip"
                                style={styles.takePicture}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </OwnModal>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    closeButton: {
        position: 'absolute',
        zIndex: 10,
        top: 10,
        right: 10,
        borderRadius: 100
    },
    takePicture: {
        borderRadius: 100
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'relative',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        zIndex: 999,
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default Camera;