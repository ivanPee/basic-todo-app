import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can choose any icon set

const AppLoader = ({ visible }) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const spinAnimation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );
        spinAnimation.start();

        return () => spinAnimation.stop();
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={() => {}}
        >
            <View style={styles.modalOverlay}>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Icon name="spinner" size={40} color="#fff" />
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AppLoader;
