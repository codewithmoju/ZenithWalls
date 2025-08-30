import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DownloadsContext = createContext();

export const DownloadsProvider = ({ children }) => {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDownloads();
    }, []);

    const loadDownloads = async () => {
        try {
            setLoading(true);
            const storedDownloads = await AsyncStorage.getItem('zenith_downloads');
            if (storedDownloads) {
                const parsedDownloads = JSON.parse(storedDownloads);
                setDownloads(parsedDownloads);
            }
        } catch (error) {
            console.error('Error loading downloads:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveDownloads = async (newDownloads) => {
        try {
            await AsyncStorage.setItem('zenith_downloads', JSON.stringify(newDownloads));
        } catch (error) {
            console.error('Error saving downloads:', error);
        }
    };

    const addDownload = async (wallpaperData) => {
        try {
            const downloadData = {
                id: wallpaperData.id,
                imageWidth: wallpaperData.imageWidth,
                imageHeight: wallpaperData.imageHeight,
                largeImageURL: wallpaperData.largeImageURL,
                webformatURL: wallpaperData.webformatURL,
                user: wallpaperData.user,
                tags: wallpaperData.tags,
                views: wallpaperData.views,
                downloads: wallpaperData.downloads,
                category: wallpaperData.category,
                downloadedAt: new Date().toISOString(),
                fileName: `wallpaper-${wallpaperData.id}-${Date.now()}.jpg`,
                fileSize: wallpaperData.imageSize || 0,
                localPath: null, // Will be set when actually saved to device
            };

            const updatedDownloads = [downloadData, ...downloads];
            setDownloads(updatedDownloads);
            await saveDownloads(updatedDownloads);
            
            return { success: true, data: downloadData };
        } catch (error) {
            console.error('Error adding download:', error);
            return { success: false, error: error.message };
        }
    };

    const removeDownload = async (downloadId) => {
        try {
            const updatedDownloads = downloads.filter(item => item.id !== downloadId);
            setDownloads(updatedDownloads);
            await saveDownloads(updatedDownloads);
            return { success: true };
        } catch (error) {
            console.error('Error removing download:', error);
            return { success: false, error: error.message };
        }
    };

    const isDownloaded = (wallpaperId) => {
        return downloads.some(item => item.id === wallpaperId);
    };

    const getDownload = (wallpaperId) => {
        return downloads.find(item => item.id === wallpaperId);
    };

    const clearAllDownloads = async () => {
        try {
            setDownloads([]);
            await AsyncStorage.removeItem('zenith_downloads');
            return { success: true };
        } catch (error) {
            console.error('Error clearing downloads:', error);
            return { success: false, error: error.message };
        }
    };

    const getDownloadsByCategory = (category) => {
        return downloads.filter(item => 
            item.category === category || 
            (item.tags && item.tags.toLowerCase().includes(category.toLowerCase()))
        );
    };

    const getRecentDownloads = (limit = 10) => {
        return downloads
            .sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt))
            .slice(0, limit);
    };

    const getDownloadStats = () => {
        if (downloads.length === 0) {
            return {
                totalDownloads: 0,
                totalSize: 0,
                mostDownloadedCategory: 'None',
                oldestDownload: null,
                newestDownload: null
            };
        }

        const totalSize = downloads.reduce((sum, item) => sum + (item.fileSize || 0), 0);
        
        // Get category statistics
        const categoryCount = {};
        downloads.forEach(item => {
            const category = item.category || 'General';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        
        const mostDownloadedCategory = Object.keys(categoryCount).reduce((a, b) => 
            categoryCount[a] > categoryCount[b] ? a : b, 'General'
        );

        const sortedDownloads = downloads.sort((a, b) => 
            new Date(a.downloadedAt) - new Date(b.downloadedAt)
        );

        return {
            totalDownloads: downloads.length,
            totalSize,
            mostDownloadedCategory,
            oldestDownload: sortedDownloads[0],
            newestDownload: sortedDownloads[sortedDownloads.length - 1],
            categoryCount
        };
    };

    const updateDownloadLocalPath = async (downloadId, localPath) => {
        try {
            const updatedDownloads = downloads.map(item =>
                item.id === downloadId ? { ...item, localPath } : item
            );
            setDownloads(updatedDownloads);
            await saveDownloads(updatedDownloads);
            return { success: true };
        } catch (error) {
            console.error('Error updating download path:', error);
            return { success: false, error: error.message };
        }
    };

    const contextValue = {
        downloads,
        loading,
        addDownload,
        removeDownload,
        isDownloaded,
        getDownload,
        clearAllDownloads,
        getDownloadsByCategory,
        getRecentDownloads,
        getDownloadStats,
        updateDownloadLocalPath,
        refreshDownloads: loadDownloads,
    };

    return (
        <DownloadsContext.Provider value={contextValue}>
            {children}
        </DownloadsContext.Provider>
    );
};

export const useDownloads = () => {
    const context = useContext(DownloadsContext);
    if (!context) {
        throw new Error('useDownloads must be used within a DownloadsProvider');
    }
    return context;
};

export default DownloadsContext;
