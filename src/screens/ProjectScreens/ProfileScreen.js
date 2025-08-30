import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Alert,
    Share,
    Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';

import { theme } from '../../constants/themes';
import { hp, wp } from '../../helpers/common';
import { useProfile } from '../../constants/ProfileContext';
import { useFavorites } from '../../constants/FavoritesContext';
import { useDownloads } from '../../constants/DownloadsContext';
import GlassMorphism from '../../components/GlassMorphism';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { profile, updateProfile } = useProfile();
    const { favorites } = useFavorites();
    const { downloads } = useDownloads();

    useEffect(() => {
        // Update favorite count when favorites change
        if (profile.favoriteCount !== favorites.length) {
            updateProfile({ favoriteCount: favorites.length });
        }
    }, [favorites.length, profile.favoriteCount, updateProfile]);

    const handleEditProfile = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('EditProfile');
    };

    const handleShare = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            await Share.share({
                message: 'Check out ZenithWalls - Amazing wallpapers for your device! 📱✨',
                title: 'ZenithWalls'
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleRateApp = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Alert.alert(
            'Rate ZenithWalls',
            'Would you like to rate our app on the store?',
            [
                { text: 'Later', style: 'cancel' },
                { text: 'Rate Now', onPress: () => console.log('Redirect to store') }
            ]
        );
    };

    const handleContactUs = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Linking.openURL('mailto:support@zenithwalls.com?subject=ZenithWalls Support');
    };

    const handlePrivacyPolicy = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('PrivacyPolicy');
    };

    const handleTermsOfService = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('TermsOfService');
    };

    const handleAbout = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('About');
    };

    const profileOptions = [
        {
            id: 'favorites',
            title: 'My Favorites',
            subtitle: `${favorites.length} wallpapers`,
            icon: 'favorite',
            iconType: 'MaterialIcons',
            color: theme.colors.error,
            onPress: () => {
                try {
                    navigation.navigate('Favorites');
                } catch (error) {
                    console.error('Navigation error:', error);
                    Alert.alert('Navigation Error', 'Unable to navigate to favorites');
                }
            }
        },
        {
            id: 'downloads',
            title: 'Downloads',
            subtitle: `${downloads.length} wallpapers`,
            icon: 'download',
            iconType: 'MaterialIcons',
            color: theme.colors.success,
            onPress: () => navigation.navigate('Downloads')
        },
        {
            id: 'settings',
            title: 'Settings',
            subtitle: 'App preferences',
            icon: 'settings',
            iconType: 'MaterialIcons',
            color: theme.colors.primary,
            onPress: () => navigation.navigate('Settings')
        }
    ];

    const appOptions = [
        {
            id: 'share',
            title: 'Share App',
            subtitle: 'Tell your friends',
            icon: 'share',
            iconType: 'MaterialIcons',
            color: theme.colors.accent,
            onPress: handleShare
        },
        {
            id: 'rate',
            title: 'Rate App',
            subtitle: 'Leave a review',
            icon: 'star-rate',
            iconType: 'MaterialIcons',
            color: theme.colors.warning,
            onPress: handleRateApp
        },
        {
            id: 'contact',
            title: 'Contact Us',
            subtitle: 'Get support',
            icon: 'email',
            iconType: 'MaterialIcons',
            color: theme.colors.info,
            onPress: handleContactUs
        }
    ];

    const legalOptions = [
        {
            id: 'privacy',
            title: 'Privacy Policy',
            icon: 'shield-check',
            iconType: 'MaterialCommunityIcons',
            onPress: handlePrivacyPolicy
        },
        {
            id: 'terms',
            title: 'Terms of Service',
            icon: 'file-document',
            iconType: 'MaterialCommunityIcons',
            onPress: handleTermsOfService
        },
        {
            id: 'about',
            title: 'About',
            icon: 'information',
            iconType: 'MaterialIcons',
            onPress: handleAbout
        }
    ];

    const renderOptionItem = (item, index, showSubtitle = true) => (
        <Animated.View
            key={item.id}
            entering={FadeInDown.delay(index * 100).springify()}
        >
            <Pressable
                style={({ pressed }) => [
                    styles.optionItem,
                    pressed && styles.optionPressed
                ]}
                onPress={item.onPress}
            >
                <View style={styles.optionLeft}>
                    <View style={[styles.optionIcon, { backgroundColor: `${item.color}20` }]}>
                        {item.iconType === 'MaterialCommunityIcons' ? (
                            <MaterialCommunityIcons
                                name={item.icon}
                                size={24}
                                color={item.color || theme.colors.textSecondary}
                            />
                        ) : (
                            <MaterialIcons
                                name={item.icon}
                                size={24}
                                color={item.color || theme.colors.textSecondary}
                            />
                        )}
                    </View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>{item.title}</Text>
                        {showSubtitle && item.subtitle && (
                            <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                        )}
                    </View>
                </View>
                <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={theme.colors.textTertiary}
                />
            </Pressable>
        </Animated.View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={theme.colors.background} />
            
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <Animated.View entering={FadeIn.delay(100)} style={styles.header}>
                    <LinearGradient
                        colors={theme.colors.gradientAurora}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.headerGradient}
                    >
                        <View style={styles.profileSection}>
                            {/* Profile Image */}
                            <View style={styles.profileImageContainer}>
                                {profile.profileImage ? (
                                    <Image
                                        source={{ uri: profile.profileImage }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <LinearGradient
                                        colors={theme.colors.gradientRoyal}
                                        style={styles.profileImagePlaceholder}
                                    >
                                        <Text style={styles.profileInitials}>
                                            {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </Text>
                                    </LinearGradient>
                                )}
                                <Pressable
                                    style={styles.editImageButton}
                                    onPress={handleEditProfile}
                                >
                                    <MaterialIcons name="edit" size={16} color={theme.colors.white} />
                                </Pressable>
                            </View>

                            {/* Profile Info */}
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>{profile.name}</Text>
                                <Text style={styles.profileEmail}>{profile.email}</Text>
                                {profile.bio && (
                                    <Text style={styles.profileBio}>{profile.bio}</Text>
                                )}
                            </View>

                            {/* Edit Profile Button */}
                            <Pressable
                                style={styles.editProfileButton}
                                onPress={handleEditProfile}
                            >
                                <Text style={styles.editProfileText}>Edit Profile</Text>
                                <MaterialIcons name="edit" size={18} color={theme.colors.primary} />
                            </Pressable>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Stats */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.statsContainer}>
                    <GlassMorphism variant="medium" style={styles.statsCard}>
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{downloads.length}</Text>
                                <Text style={styles.statLabel}>Downloads</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{favorites.length}</Text>
                                <Text style={styles.statLabel}>Favorites</Text>
                            </View>
                        </View>
                    </GlassMorphism>
                </Animated.View>

                {/* Profile Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile</Text>
                    <GlassMorphism variant="light" style={styles.optionsCard}>
                        {profileOptions.map((option, index) => renderOptionItem(option, index))}
                    </GlassMorphism>
                </View>

                {/* App Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App</Text>
                    <GlassMorphism variant="light" style={styles.optionsCard}>
                        {appOptions.map((option, index) => renderOptionItem(option, index))}
                    </GlassMorphism>
                </View>

                {/* Legal Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Legal</Text>
                    <GlassMorphism variant="light" style={styles.optionsCard}>
                        {legalOptions.map((option, index) => renderOptionItem(option, index, false))}
                    </GlassMorphism>
                </View>

                {/* App Version */}
                <Animated.View 
                    entering={FadeInDown.delay(600)} 
                    style={styles.versionContainer}
                >
                    <Text style={styles.versionText}>ZenithWalls v1.0.0</Text>
                    <Text style={styles.versionSubtext}>Made with ❤️ for wallpaper lovers</Text>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        paddingBottom: hp(4),
    },
    header: {
        marginBottom: hp(3),
    },
    headerGradient: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(3),
        borderBottomLeftRadius: theme.radius.xxl,
        borderBottomRightRadius: theme.radius.xxl,
    },
    profileSection: {
        alignItems: 'center',
        gap: hp(2),
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        width: wp(25),
        height: wp(25),
        borderRadius: wp(12.5),
        borderWidth: 4,
        borderColor: theme.colors.white,
    },
    profileImagePlaceholder: {
        width: wp(25),
        height: wp(25),
        borderRadius: wp(12.5),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: theme.colors.white,
    },
    profileInitials: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.white,
    },
    editImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: theme.colors.primary,
        borderRadius: wp(4),
        width: wp(8),
        height: wp(8),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: theme.colors.white,
    },
    profileInfo: {
        alignItems: 'center',
        gap: hp(0.5),
    },
    profileName: {
        fontSize: hp(3),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.white,
        textAlign: 'center',
    },
    profileEmail: {
        fontSize: hp(1.8),
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    profileBio: {
        fontSize: hp(1.6),
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        marginTop: hp(0.5),
    },
    editProfileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(2),
        backgroundColor: theme.colors.white,
        paddingHorizontal: wp(6),
        paddingVertical: hp(1.5),
        borderRadius: theme.radius.xl,
        ...theme.shadows.md,
    },
    editProfileText: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.primary,
    },
    statsContainer: {
        paddingHorizontal: wp(4),
        marginBottom: hp(3),
    },
    statsCard: {
        padding: wp(4),
        borderRadius: theme.radius.xl,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        gap: hp(0.5),
    },
    statValue: {
        fontSize: hp(2.8),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
    },
    statLabel: {
        fontSize: hp(1.4),
        color: theme.colors.textTertiary,
        fontWeight: theme.fontWeights.medium,
    },
    statDivider: {
        width: 1,
        height: hp(4),
        backgroundColor: theme.colors.border,
    },
    section: {
        paddingHorizontal: wp(4),
        marginBottom: hp(3),
    },
    sectionTitle: {
        fontSize: hp(2.2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        marginBottom: hp(1.5),
    },
    optionsCard: {
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    optionPressed: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: wp(3),
    },
    optionIcon: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        flex: 1,
    },
    optionTitle: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.text,
    },
    optionSubtitle: {
        fontSize: hp(1.4),
        color: theme.colors.textTertiary,
        marginTop: hp(0.2),
    },
    versionContainer: {
        alignItems: 'center',
        paddingHorizontal: wp(4),
        marginTop: hp(2),
    },
    versionText: {
        fontSize: hp(1.6),
        color: theme.colors.textTertiary,
        fontWeight: theme.fontWeights.medium,
    },
    versionSubtext: {
        fontSize: hp(1.4),
        color: theme.colors.textQuaternary,
        marginTop: hp(0.5),
    },
});

export default ProfileScreen;
