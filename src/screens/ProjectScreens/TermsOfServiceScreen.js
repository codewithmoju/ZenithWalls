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

const TermsOfServiceScreen = () => {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    const termsContent = `Terms of Service

Effective Date: December 2024 - Version 1.0

Please read these terms carefully before using ZenithWalls. By using our app, you agree to comply with and be bound by these terms and conditions.

1. Acceptance of Terms
By downloading, installing, or using ZenithWalls, you agree to be bound by these Terms of Service and our Privacy Policy. These terms constitute a legally binding agreement between you and ZenithWalls.

2. Description of Service
ZenithWalls provides access to high-quality wallpaper images sourced from Pixabay. Our service includes browsing, searching, downloading, favoriting, and sharing wallpapers.

3. User Responsibilities
• Provide accurate information
• Maintain device security
• Use the app lawfully
• Report security issues

4. Acceptable Use Policy
You may not:
• Use the app illegally
• Reverse engineer the application
• Interfere with app functionality
• Use automated tools
• Distribute harmful content

5. Content and Intellectual Property
• Wallpaper content is subject to original source terms
• Users are responsible for proper usage rights
• App interface and functionality are proprietary to ZenithWalls

6. Downloads and Storage
• Files are saved to your device gallery
• You manage your storage space
• We're not responsible for data loss

7. Privacy and Data Protection
Your privacy is important. Please review our Privacy Policy for details about data collection and usage.

8. Third-Party Services
We integrate with Pixabay API, Expo platform, and device OS features. Each has its own terms and policies.

9. Disclaimers and Limitations
ZenithWalls is provided "as is" without warranties. We don't guarantee uninterrupted service or specific functionality.

10. Limitation of Liability
We are not liable for any direct, indirect, or consequential damages arising from app usage.

11. Modifications to Terms
We may modify these terms at any time with notification through the app.

12. Termination
You may terminate by uninstalling the app. We may terminate access for terms violations.

13. Governing Law
These terms are governed by applicable laws. Disputes will be resolved through negotiation or arbitration.

Important Notice:
These terms are legally binding. If you disagree with any part, do not use ZenithWalls.

Questions About These Terms?
Contact us:
Email: legal@zenithwalls.com
Support: support@zenithwalls.com

By continuing to use ZenithWalls, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

Last updated: December 2024 • ZenithWalls v1.0`;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={theme.colors.background} />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleGoBack}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Terms of Service</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{termsContent}</Text>
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

export default TermsOfServiceScreen;
