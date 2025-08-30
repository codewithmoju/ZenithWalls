import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        profileImage: null,
        bio: 'Wallpaper enthusiast',
        joinDate: new Date().toISOString(),
        downloadCount: 0,
        favoriteCount: 0,
        preferences: {
            notifications: true,
            autoDownload: false,
            downloadQuality: 'high',
            theme: 'dark'
        }
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const storedProfile = await AsyncStorage.getItem('userProfile');
            if (storedProfile) {
                setProfile(JSON.parse(storedProfile));
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const saveProfile = async (newProfile) => {
        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
            setProfile(newProfile);
        } catch (error) {
            console.error('Error saving profile:', error);
        }
    };

    const updateProfile = (updates) => {
        const updatedProfile = { ...profile, ...updates };
        saveProfile(updatedProfile);
    };

    const updatePreferences = (preferences) => {
        const updatedProfile = {
            ...profile,
            preferences: { ...profile.preferences, ...preferences }
        };
        saveProfile(updatedProfile);
    };

    const incrementDownloadCount = () => {
        const updatedProfile = {
            ...profile,
            downloadCount: profile.downloadCount + 1
        };
        saveProfile(updatedProfile);
    };

    const updateFavoriteCount = (count) => {
        const updatedProfile = {
            ...profile,
            favoriteCount: count
        };
        saveProfile(updatedProfile);
    };

    return (
        <ProfileContext.Provider value={{
            profile,
            updateProfile,
            updatePreferences,
            incrementDownloadCount,
            updateFavoriteCount
        }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);
