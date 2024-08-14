import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AvatarProvider } from './src/context/AvatarContext';
import { AuthProvider, useAuth } from "./src/services/auth/AuthContext";
import AppNavigation from "./src/navigation/AppNavigation";

const AppWrapper = () => {
    const { loading } = useAuth();

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return <AppNavigation />;
}

export default function App() {
    return (
        <AuthProvider>
            <AvatarProvider>
                <AppWrapper />
            </AvatarProvider>

        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
