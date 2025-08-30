import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                setFavorites(JSON.parse(storedFavorites));
            }
        } catch (error) {
            console.error('Error loading favorites:', error);
        }
    };

    const saveFavorites = async (newFavorites) => {
        try {
            await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
            setFavorites(newFavorites);
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    const addToFavorites = (wallpaper) => {
        const newFavorites = [...favorites, wallpaper];
        saveFavorites(newFavorites);
    };

    const removeFromFavorites = (wallpaperId) => {
        const newFavorites = favorites.filter(item => item.id !== wallpaperId);
        saveFavorites(newFavorites);
    };

    const isFavorite = (wallpaperId) => {
        return favorites.some(item => item.id === wallpaperId);
    };

    return (
        <FavoritesContext.Provider value={{
            favorites,
            addToFavorites,
            removeFromFavorites,
            isFavorite
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext); 