import { Modal, View, Text, TouchableOpacity,StyleSheet } from 'react-native';


const colors = ['red', 'blue', 'green', 'yellow'];

const ColorPickerModal = ({ visible, onSelectColor }) => {
    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.modalContainer}>
                <Text style={styles.modalText}>Choisissez une couleur</Text>
                <View style={styles.colorButtons}>
                    {colors.map((color) => (
                        <TouchableOpacity
                            key={color}
                            style={[styles.colorButton, { backgroundColor: color }]}
                            onPress={() => onSelectColor(color)}
                        />
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalText: {
        fontSize: 20,
        color: 'white',
        marginBottom: 20,
    },
    colorButtons: {
        flexDirection: 'row',
    },
    colorButton: {
        width: 50,
        height: 50,
        margin: 10,
        borderRadius: 25,
    },
});
export default ColorPickerModal;