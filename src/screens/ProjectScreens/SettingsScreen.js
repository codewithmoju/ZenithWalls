import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Switch,
    Alert,
    Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { theme } from '../../constants/themes';
import { hp, wp } from '../../helpers/common';
import { useProfile } from '../../constants/ProfileContext';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { profile, updatePreferences } = useProfile();
    const [settings, setSettings] = useState({
        notifications: true,
        autoDownload: false,
        downloadQuality: 'high',
        theme: 'dark',
        ...profile?.preferences
    });
    const [cacheSize, setCacheSize] = useState('0 MB');

    useEffect(() => {
        loadSettings();
        calculateCacheSize();
    }, []);

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('app_settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                setSettings(parsed);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSettings = async (newSettings) => {
        try {
            await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
            if (updatePreferences) {
                updatePreferences(newSettings);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const calculateCacheSize = async () => {
        // Simulate cache size calculation
        const sizes = ['12 MB', '8 MB', '15 MB', '23 MB', '5 MB'];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        setCacheSize(randomSize);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleToggle = (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const handleQualityChange = () => {
        const qualities = ['low', 'medium', 'high', 'ultra'];
        const currentIndex = qualities.indexOf(settings.downloadQuality);
        const nextIndex = (currentIndex + 1) % qualities.length;
        const newQuality = qualities[nextIndex];
        
        const newSettings = { ...settings, downloadQuality: newQuality };
        setSettings(newSettings);
        saveSettings(newSettings);
    };

    const handleThemeChange = () => {
        const themes = ['dark', 'light', 'auto'];
        const currentIndex = themes.indexOf(settings.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const newTheme = themes[nextIndex];
        
        const newSettings = { ...settings, theme: newTheme };
        setSettings(newSettings);
        saveSettings(newSettings);
        
        Alert.alert('Theme Changed', `Theme set to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`);
    };

    const handleClearCache = async () => {
        Alert.alert(
            'Clear Cache',
            `This will remove ${cacheSize} of cached images and free up storage space. Continue?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Clear', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Simulate cache clearing with a delay
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            setCacheSize('0 MB');
                            Alert.alert('Success', 'Cache cleared successfully! Freed up ' + cacheSize);
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear cache. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const handleResetSettings = () => {
        Alert.alert(
            'Reset Settings',
            'This will reset all settings to their default values. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Reset', 
                    style: 'destructive',
                    onPress: async () => {
                        const defaultSettings = {
                            notifications: true,
                            autoDownload: false,
                            downloadQuality: 'high',
                            theme: 'dark'
                        };
                        setSettings(defaultSettings);
                        await saveSettings(defaultSettings);
                        Alert.alert('Success', 'Settings reset to defaults!');
                    }
                }
            ]
        );
    };

    const handleRateApp = () => {
        Alert.alert(
            'Rate ZenithWalls',
            'Enjoying ZenithWalls? Please take a moment to rate us on the app store!',
            [
                { text: 'Later', style: 'cancel' },
                { 
                    text: 'Rate Now', 
                    onPress: () => {
                        Alert.alert('Thanks!', 'This would open the app store for rating.');
                    }
                }
            ]
        );
    };

    const handleShareApp = () => {
        Alert.alert(
            'Share ZenithWalls',
            'Share this awesome wallpaper app with your friends!',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Share', 
                    onPress: () => {
                        Alert.alert('Sharing', 'This would open the share dialog.');
                    }
                }
            ]
        );
    };

    const getQualityLabel = (quality) => {
        const labels = {
            low: 'Low (Faster)',
            medium: 'Medium',
            high: 'High (Recommended)',
            ultra: 'Ultra (Largest)'
        };
        return labels[quality] || quality;
    };

    const getThemeLabel = (theme) => {
        const labels = {
            dark: 'Dark',
            light: 'Light',
            auto: 'Auto (System)'
        };
        return labels[theme] || theme;
    };

    const settingItems = [
        {
            section: 'General',
            items: [
                {
                    title: 'Push Notifications',
                    subtitle: 'Get notified about new wallpapers',
                    icon: 'notifications',
                    type: 'toggle',
                    value: settings.notifications,
                    onToggle: (value) => handleToggle('notifications', value)
                },
                {
                    title: 'Auto Download Favorites',
                    subtitle: 'Automatically save favorites',
                    icon: 'cloud-download',
                    type: 'toggle',
                    value: settings.autoDownload,
                    onToggle: (value) => handleToggle('autoDownload', value)
                }
            ]
        },
        {
            section: 'Appearance',
            items: [
                {
                    title: 'Download Quality',
                    subtitle: getQualityLabel(settings.downloadQuality),
                    icon: 'hd',
                    type: 'selector',
                    onPress: handleQualityChange
                },
                {
                    title: 'App Theme',
                    subtitle: getThemeLabel(settings.theme),
                    icon: 'palette',
                    type: 'selector',
                    onPress: handleThemeChange
                }
            ]
        },
        {
            section: 'Storage',
            items: [
                {
                    title: 'Clear Cache',
                    subtitle: `${cacheSize} of cached data`,
                    icon: 'delete-sweep',
                    type: 'action',
                    onPress: handleClearCache
                }
            ]
        },
        {
            section: 'App',
            items: [
                {
                    title: 'Rate ZenithWalls',
                    subtitle: 'Help us improve the app',
                    icon: 'star-rate',
                    type: 'action',
                    onPress: handleRateApp
                },
                {
                    title: 'Share App',
                    subtitle: 'Tell your friends about us',
                    icon: 'share',
                    type: 'action',
                    onPress: handleShareApp
                },
                {
                    title: 'Reset Settings',
                    subtitle: 'Restore default preferences',
                    icon: 'restore',
                    type: 'action',
                    color: '#ff6b6b',
                    onPress: handleResetSettings
                }
            ]
        }
    ];

    const renderSettingItem = (item) => (
        <Pressable
            key={item.title}
            style={({ pressed }) => [
                styles.settingItem,
                pressed && styles.settingPressed
            ]}
            onPress={item.onPress}
            disabled={item.type === 'toggle'}
        >
            <View style={styles.settingLeft}>
                <View style={[
                    styles.settingIcon, 
                    { backgroundColor: `${item.color || theme.colors.primary}20` }
                ]}>
                    <MaterialIcons
                        name={item.icon}
                        size={22}
                        color={item.color || theme.colors.primary}
                    />
                </View>
                <View style={styles.settingText}>
                    <Text style={[
                        styles.settingTitle,
                        item.color && { color: item.color }
                    ]}>
                        {item.title}
                    </Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
            </View>
            
            <View style={styles.settingRight}>
                {item.type === 'toggle' ? (
                    <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{
                            false: theme.colors.border,
                            true: theme.colors.primary + '40'
                        }}
                        thumbColor={item.value ? theme.colors.primary : theme.colors.textTertiary}
                        ios_backgroundColor={theme.colors.border}
                    />
                ) : (
                    <MaterialIcons
                        name="chevron-right"
                        size={24}
                        color={theme.colors.textTertiary}
                    />
                )}
            </View>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={theme.colors.background} />
            
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleGoBack}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {settingItems.map((section) => (
                    <View key={section.section} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.section}</Text>
                        <View style={styles.settingsCard}>
                            {section.items.map((item) => renderSettingItem(item))}
                        </View>
                    </View>
                ))}

                {/* App Info */}
                <View style={styles.appInfo}>
                    <View style={styles.infoCard}>
                        <MaterialIcons 
                            name="info" 
                            size={24} 
                            color={theme.colors.primary} 
                        />
                        <View style={styles.infoText}>
                            <Text style={styles.infoTitle}>ZenithWalls</Text>
                            <Text style={styles.infoSubtitle}>Version 1.0.0</Text>
                            <Text style={styles.infoDescription}>
                                Premium wallpaper experience with stunning collections and seamless downloads.
                            </Text>
                        </View>
                    </View>
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
    section: {
        marginBottom: hp(3),
    },
    sectionTitle: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        marginBottom: hp(1.5),
        paddingHorizontal: wp(2),
    },
    settingsCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: wp(4),
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 0.5,
        borderBottomColor: theme.colors.border,
        minHeight: hp(7),
    },
    toggleItem: {
        paddingVertical: hp(2),
    },
    settingPressed: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: wp(3),
    },
    settingIcon: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.text,
        marginBottom: hp(0.2),
    },
    settingSubtitle: {
        fontSize: hp(1.4),
        color: theme.colors.textTertiary,
        fontWeight: theme.fontWeights.medium,
    },
    settingRight: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    appInfo: {
        marginTop: hp(2),
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: wp(4),
        borderRadius: theme.radius.xl,
        gap: wp(3),
    },
    infoText: {
        flex: 1,
    },
    infoTitle: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        marginBottom: hp(0.5),
    },
    infoSubtitle: {
        fontSize: hp(1.6),
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeights.medium,
        marginBottom: hp(1),
    },
    infoDescription: {
        fontSize: hp(1.5),
        color: theme.colors.textTertiary,
        lineHeight: hp(2.2),
    },
});

export default SettingsScreen;
