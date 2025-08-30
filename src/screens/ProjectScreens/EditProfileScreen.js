import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

import { theme } from '../../constants/themes';
import { hp, wp } from '../../helpers/common';
import { useProfile } from '../../constants/ProfileContext';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { profile, updateProfile } = useProfile();
    
    const [formData, setFormData] = useState({
        name: profile?.name || '',
        email: profile?.email || '',
        bio: profile?.bio || '',
        profileImage: profile?.profileImage || null
    });
    
    const [loading, setLoading] = useState(false);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleImagePicker = () => {
        Alert.alert(
            'Change Profile Picture',
            'Choose an option',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Camera', onPress: () => openCamera() },
                { text: 'Gallery', onPress: () => openGallery() },
                { text: 'Remove Photo', onPress: () => removePhoto(), style: 'destructive' }
            ]
        );
    };

    const openCamera = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Camera permission is required to take photos.');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
                setFormData(prev => ({ ...prev, profileImage: result.assets[0].uri }));
            }
        } catch (error) {
            console.error('Error opening camera:', error);
            Alert.alert('Error', 'Failed to open camera. Please try again.');
        }
    };

    const openGallery = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Gallery permission is required to select photos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0] && result.assets[0].uri) {
                setFormData(prev => ({ ...prev, profileImage: result.assets[0].uri }));
            }
        } catch (error) {
            console.error('Error opening gallery:', error);
            Alert.alert('Error', 'Failed to open gallery. Please try again.');
        }
    };

    const removePhoto = () => {
        setFormData(prev => ({ ...prev, profileImage: null }));
    };

    const validateForm = () => {
        if (!formData.name || formData.name.trim().length < 2) {
            Alert.alert('Error', 'Please enter a valid name (at least 2 characters)');
            return false;
        }
        
        if (!formData.email || !formData.email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }
        
        if (formData.bio && formData.bio.length > 150) {
            Alert.alert('Error', 'Bio must be less than 150 characters');
            return false;
        }
        
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        
        try {
            setLoading(true);
            
            // Trim form data before saving
            const trimmedData = {
                ...formData,
                name: formData.name.trim(),
                email: formData.email.trim(),
                bio: formData.bio ? formData.bio.trim() : ''
            };
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            updateProfile(trimmedData);
            
            Alert.alert(
                'Success',
                'Profile updated successfully!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={theme.colors.background} />
            
            <KeyboardAvoidingView 
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Pressable style={styles.backButton} onPress={handleGoBack}>
                        <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Profile Image Section */}
                    <View style={styles.imageSection}>
                        <Text style={styles.sectionTitle}>Profile Picture</Text>
                        <View style={styles.imageContainer}>
                            <Pressable
                                style={styles.imageWrapper}
                                onPress={handleImagePicker}
                            >
                                {formData.profileImage ? (
                                    <Image
                                        source={{ uri: formData.profileImage }}
                                        style={styles.profileImage}
                                    />
                                ) : (
                                    <LinearGradient
                                        colors={['#667eea', '#764ba2']}
                                        style={styles.profileImagePlaceholder}
                                    >
                                        <MaterialIcons name="person" size={40} color={theme.colors.white} />
                                    </LinearGradient>
                                )}
                                <View style={styles.imageOverlay}>
                                    <MaterialIcons name="camera-alt" size={20} color={theme.colors.white} />
                                </View>
                            </Pressable>
                            <Text style={styles.imageHint}>Tap to change photo</Text>
                        </View>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        
                        {/* Name Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons 
                                    name="person" 
                                    size={20} 
                                    color={theme.colors.textTertiary} 
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.name}
                                    onChangeText={(text) => handleInputChange('name', text)}
                                    placeholder="Enter your full name"
                                    placeholderTextColor={theme.colors.textTertiary}
                                    maxLength={50}
                                />
                            </View>
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialIcons 
                                    name="email" 
                                    size={20} 
                                    color={theme.colors.textTertiary} 
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.email}
                                    onChangeText={(text) => handleInputChange('email', text)}
                                    placeholder="Enter your email"
                                    placeholderTextColor={theme.colors.textTertiary}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    maxLength={100}
                                />
                            </View>
                        </View>

                        {/* Bio Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Bio</Text>
                            <View style={[styles.inputWrapper, styles.bioWrapper]}>
                                <MaterialIcons 
                                    name="info" 
                                    size={20} 
                                    color={theme.colors.textTertiary} 
                                    style={[styles.inputIcon, styles.bioIcon]}
                                />
                                <TextInput
                                    style={[styles.textInput, styles.bioInput]}
                                    value={formData.bio}
                                    onChangeText={(text) => handleInputChange('bio', text)}
                                    placeholder="Tell us about yourself..."
                                    placeholderTextColor={theme.colors.textTertiary}
                                    multiline
                                    numberOfLines={3}
                                    maxLength={150}
                                    textAlignVertical="top"
                                />
                            </View>
                            <Text style={styles.characterCount}>
                                {formData.bio?.length || 0}/150 characters
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View style={styles.buttonContainer}>
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.saveButtonGradient}
                    >
                        <Pressable
                            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <Text style={styles.saveButtonText}>Saving...</Text>
                            ) : (
                                <>
                                    <MaterialIcons name="save" size={20} color={theme.colors.white} />
                                    <Text style={styles.saveButtonText}>Save Changes</Text>
                                </>
                            )}
                        </Pressable>
                    </LinearGradient>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        backgroundColor: theme.colors.background,
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
        paddingVertical: hp(3),
        paddingBottom: hp(4),
    },
    imageSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.xl,
        padding: wp(6),
        marginBottom: hp(3),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        marginBottom: hp(2.5),
        textAlign: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        gap: hp(1.5),
    },
    imageWrapper: {
        position: 'relative',
        borderRadius: wp(15),
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    profileImage: {
        width: wp(30),
        height: wp(30),
        borderRadius: wp(15),
    },
    profileImagePlaceholder: {
        width: wp(30),
        height: wp(30),
        borderRadius: wp(15),
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp(15),
    },
    imageHint: {
        fontSize: hp(1.5),
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeights.medium,
    },
    formSection: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.xl,
        padding: wp(6),
        marginBottom: hp(3),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    inputContainer: {
        marginBottom: hp(2.5),
    },
    inputLabel: {
        fontSize: hp(1.7),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.text,
        marginBottom: hp(0.8),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
        borderRadius: theme.radius.lg,
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        paddingHorizontal: wp(4),
        paddingVertical: hp(1.8),
    },
    bioWrapper: {
        alignItems: 'flex-start',
        paddingVertical: hp(1.2),
    },
    inputIcon: {
        marginRight: wp(3),
        opacity: 0.7,
    },
    bioIcon: {
        marginTop: hp(0.5),
    },
    textInput: {
        flex: 1,
        fontSize: hp(1.7),
        color: theme.colors.text,
        fontWeight: theme.fontWeights.medium,
    },
    bioInput: {
        minHeight: hp(10),
        textAlignVertical: 'top',
    },
    characterCount: {
        fontSize: hp(1.3),
        color: theme.colors.textTertiary,
        textAlign: 'right',
        marginTop: hp(0.8),
    },
    buttonContainer: {
        paddingHorizontal: wp(4),
        paddingBottom: hp(4),
    },
    saveButtonGradient: {
        borderRadius: theme.radius.xl,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2.5),
        paddingVertical: hp(2.2),
        paddingHorizontal: wp(8),
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: hp(1.8),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.white,
        letterSpacing: 0.5,
    },
});

export default EditProfileScreen;
