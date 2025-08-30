import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../../constants/themes';
import { hp, wp } from '../../helpers/common';

const AboutScreen = () => {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    const aboutContent = `About ZenithWalls

Version 1.0.0 - Build 100 - Released December 2024

ZenithWalls is your gateway to an endless collection of stunning wallpapers. We've crafted this app with a focus on simplicity, beauty, and user experience.

Key Features:
• Vast Collection - Access thousands of high-quality wallpapers from Pixabay
• Easy Downloads - Save wallpapers directly to your gallery with one tap
• Favorites System - Create your personal collection of favorite wallpapers
• Preview Modes - See how wallpapers look on your device before downloading
• Share Wallpapers - Share amazing wallpapers with friends and family
• Smart Search - Find exactly what you're looking for with powerful search

Development Team: ZenithWalls Team

Passionate developers dedicated to creating beautiful and functional mobile experiences.

Contact:
Email: support@zenithwalls.com
Website: zenithwalls.com

Credits & Acknowledgments:
• Pixabay - High-quality images and wallpapers
• Expo - React Native development platform
• React Native - Cross-platform mobile framework

Technical Information:
• Framework: React Native with Expo
• Platform Support: iOS & Android
• Content Source: Pixabay API
• Storage: Local AsyncStorage

Thank you for using ZenithWalls! We hope you enjoy discovering and setting beautiful wallpapers.

Made with ❤️ for wallpaper enthusiasts worldwide
© 2024 ZenithWalls. All rights reserved.`;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={theme.colors.background} />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleGoBack}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>About Us</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{aboutContent}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    backButton: {
        padding: wp(2),
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.surface,
    },
    headerTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
    },
    headerSpacer: {
        width: wp(10),
    },
    scrollContent: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        paddingBottom: hp(4),
    },
    contentContainer: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: wp(4),
    },
    contentText: {
        fontSize: hp(1.5),
        color: theme.colors.text,
        lineHeight: hp(2.2),
    },
});

export default AboutScreen;
