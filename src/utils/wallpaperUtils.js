import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Haptics from 'expo-haptics';
import { Alert, Platform, Linking } from 'react-native';

// Enhanced wallpaper utility functions
export class WallpaperUtils {
  static async downloadAndCacheImage(imageUrl, imageId) {
    try {
      const filename = `wallpaper-${imageId}-${Date.now()}.jpg`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      
      // Check if image already exists in cache
      const cachedImage = await FileSystem.getInfoAsync(fileUri);
      if (cachedImage.exists) {
        return { success: true, uri: fileUri, fromCache: true };
      }
      
      // Download the image
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (downloadResult.status === 200) {
        return { success: true, uri: downloadResult.uri, fromCache: false };
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      return { success: false, error: error.message };
    }
  }

  static async saveToGallery(imageUri, imageName = 'ZenithWalls_Wallpaper') {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please grant media library access to save wallpapers',
          [{ text: 'OK', style: 'default' }]
        );
        return { success: false, error: 'Permission denied' };
      }

      // Save to gallery
      const asset = await MediaLibrary.saveToLibraryAsync(imageUri);
      
      // Create album if it doesn't exist
      try {
        const album = await MediaLibrary.getAlbumAsync('ZenithWalls');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('ZenithWalls', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
      } catch (albumError) {
        console.log('Album creation failed, but image saved to gallery:', albumError);
      }

      return { success: true, asset };
    } catch (error) {
      console.error('Save to gallery error:', error);
      return { success: false, error: error.message };
    }
  }

  static async setWallpaper(imageUri, type = 'both') {
    try {
      // First save to gallery
      const saveResult = await this.saveToGallery(imageUri);
      
      if (!saveResult.success) {
        throw new Error(saveResult.error);
      }

      // Platform-specific wallpaper setting instructions
      const instructions = this.getWallpaperInstructions(type);
      
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        '🎉 Wallpaper Ready!',
        `Your wallpaper has been saved to gallery.\n\n${instructions}`,
        [
          { text: 'Open Settings', onPress: () => this.openWallpaperSettings() },
          { text: 'Done', style: 'default' }
        ]
      );

      return { success: true };
    } catch (error) {
      console.error('Set wallpaper error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      Alert.alert(
        '❌ Error',
        'Failed to set wallpaper. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
      
      return { success: false, error: error.message };
    }
  }

  static getWallpaperInstructions(type) {
    const typeText = type === 'home' ? 'Home Screen' : 
                    type === 'lock' ? 'Lock Screen' : 'Both Screens';
    
    if (Platform.OS === 'ios') {
      return `To set as ${typeText} wallpaper:\n• Go to Settings > Wallpaper\n• Tap "Add New Wallpaper"\n• Select from "ZenithWalls" album\n• Choose "${typeText}"`;
    } else {
      return `To set as ${typeText} wallpaper:\n• Go to Settings > Display > Wallpaper\n• Select from "ZenithWalls" folder\n• Choose "${typeText}"`;
    }
  }

  static async openWallpaperSettings() {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('App-Prefs:Wallpaper');
      } else {
        await Linking.openSettings();
      }
    } catch (error) {
      console.log('Could not open settings:', error);
    }
  }

  static async shareWallpaper(imageData) {
    try {
      const message = `🎨 Amazing wallpaper by ${imageData.user}!\n\n` +
                     `📱 Resolution: ${imageData.imageWidth}×${imageData.imageHeight}\n` +
                     `🏷️ Tags: ${imageData.tags?.split(',').slice(0, 3).join(', ')}\n\n` +
                     `Download from ZenithWalls app!`;

      return {
        message,
        url: imageData.webformatURL,
        title: `${imageData.user}'s Wallpaper - ZenithWalls`
      };
    } catch (error) {
      console.error('Share preparation error:', error);
      return null;
    }
  }

  static analyzeImageQuality(width, height) {
    const totalPixels = width * height;
    const aspectRatio = width / height;
    
    let quality = 'Standard';
    if (totalPixels >= 8000000) quality = '4K Ultra';
    else if (totalPixels >= 2073600) quality = 'Full HD';
    else if (totalPixels >= 1310720) quality = 'HD';
    else if (totalPixels >= 921600) quality = 'High';

    const orientation = aspectRatio > 1.3 ? 'landscape' : 
                       aspectRatio < 0.8 ? 'portrait' : 'square';

    return {
      quality,
      orientation,
      aspectRatio: aspectRatio.toFixed(2),
      totalPixels,
      megapixels: (totalPixels / 1000000).toFixed(1),
      suitability: {
        mobile: orientation === 'portrait' || orientation === 'square',
        tablet: true,
        desktop: orientation === 'landscape'
      }
    };
  }

  static getOptimalPreviewMode(imageAnalysis) {
    if (imageAnalysis.orientation === 'portrait') {
      return 'device';
    } else if (imageAnalysis.orientation === 'landscape') {
      return 'fullscreen';
    }
    return 'device';
  }
}

export default WallpaperUtils;
