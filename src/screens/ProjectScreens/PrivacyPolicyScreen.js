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

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();

    const handleGoBack = () => {
        navigation.goBack();
    };

    const privacyContent = `ZenithWalls Privacy Policy

Last Updated: December 2024

1. Information We Collect
We collect minimal information to provide you with the best wallpaper experience:
• Profile Information: Name, email, and bio that you provide
• Device Information: Basic device specifications to optimize wallpaper quality
• Download History: Local records of your downloaded wallpapers (stored on your device only)

2. How We Use Your Information
Your information is used exclusively to enhance your ZenithWalls experience:
• Personalizing your wallpaper recommendations
• Improving app performance and stability
• Providing customer support when requested

We never sell, rent, or share your personal information with third parties.

3. Data Storage and Security
• Local Storage: All personal data is stored locally on your device
• No Cloud Sync: Your profile information never leaves your device
• Third-Party APIs: We only use Pixabay's API for wallpaper content
• Secure Connections: All data transmissions use HTTPS encryption

4. Permissions We Request
• Storage/Media Library: To save wallpapers to your device's gallery
• Camera: To capture profile pictures (optional)
• Internet: To fetch wallpaper content

You can revoke these permissions at any time through your device settings.

5. Your Rights
• Access: View all data we store about you
• Correction: Update your profile information at any time
• Deletion: Remove your data by uninstalling the app
• Opt-out: Disable analytics by contacting our support team

Contact Us
If you have questions about this privacy policy, contact us at privacy@zenithwalls.com

By using ZenithWalls, you acknowledge that you have read and understood this Privacy Policy.`;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={theme.colors.background} />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleGoBack}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.contentContainer}>
                    <Text style={styles.contentText}>{privacyContent}</Text>
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
    introSection: {
        marginBottom: hp(3),
    },
    introCard: {
        padding: wp(6),
        borderRadius: theme.radius.xl,
        alignItems: 'center',
        textAlign: 'center',
    },
    introIcon: {
        marginBottom: hp(2),
    },
    introTitle: {
        fontSize: hp(2.6),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        marginBottom: hp(1.5),
        textAlign: 'center',
    },
    introText: {
        fontSize: hp(1.6),
        color: theme.colors.textSecondary,
        lineHeight: hp(2.2),
        textAlign: 'center',
        marginBottom: hp(2),
    },
    updateInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: hp(1.5),
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    updateText: {
        fontSize: hp(1.3),
        color: theme.colors.textTertiary,
        fontWeight: theme.fontWeights.medium,
    },
    sectionContainer: {
        marginBottom: hp(2.5),
    },
    sectionCard: {
        padding: wp(4),
        borderRadius: theme.radius.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        marginBottom: hp(1.5),
    },
    sectionTitle: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        flex: 1,
    },
    sectionContent: {
        fontSize: hp(1.5),
        color: theme.colors.textSecondary,
        lineHeight: hp(2.1),
        textAlign: 'justify',
    },
    contactSection: {
        marginVertical: hp(2),
    },
    contactCard: {
        padding: wp(5),
        borderRadius: theme.radius.xl,
        alignItems: 'center',
    },
    contactIcon: {
        marginBottom: hp(1.5),
    },
    contactTitle: {
        fontSize: hp(2.2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        marginBottom: hp(1),
        textAlign: 'center',
    },
    contactText: {
        fontSize: hp(1.5),
        color: theme.colors.textSecondary,
        lineHeight: hp(2),
        textAlign: 'center',
        marginBottom: hp(2),
    },
    contactInfo: {
        gap: hp(1),
        alignItems: 'center',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
    },
    contactDetail: {
        fontSize: hp(1.4),
        color: theme.colors.text,
        fontWeight: theme.fontWeights.medium,
    },
    footerSection: {
        alignItems: 'center',
        paddingVertical: hp(3),
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        gap: hp(1),
    },
    footerText: {
        fontSize: hp(1.4),
        color: theme.colors.textTertiary,
        textAlign: 'center',
        lineHeight: hp(2),
        fontStyle: 'italic',
    },
    footerSubtext: {
        fontSize: hp(1.3),
        color: theme.colors.textQuaternary,
        textAlign: 'center',
        fontWeight: theme.fontWeights.medium,
    },
});

export default PrivacyPolicyScreen;
