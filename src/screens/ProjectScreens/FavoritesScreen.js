import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  StatusBar,
  TextInput,
  Alert,
  Share,
  Modal,
  RefreshControl,
  ActivityIndicator,
  ToastAndroid,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFavorites } from '../../constants/FavoritesContext';
import { theme } from '../../constants/themes';
import { hp, wp } from '../../helpers/common';
import { MaterialIcons, Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp, 
  SlideInDown,
  SlideInUp,
  ZoomIn,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const CARD_MARGIN = wp(2);
const CARD_WIDTH = (SCREEN_WIDTH - (COLUMN_COUNT + 1) * CARD_MARGIN * 2) / COLUMN_COUNT;
const CARD_HEIGHT = CARD_WIDTH * 1.6; // 16:10 aspect ratio

const FavoritesScreen = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const navigation = useNavigation();
  
  // State management
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'resolution', 'name'
  const [showPreview, setShowPreview] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const flatListRef = useRef(null);
  
  // Show toast message
  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      // For iOS, you might want to use a toast library or custom implementation
      Alert.alert('', message);
    }
  };
  
  // Filtered and sorted favorites
  const filteredFavorites = useMemo(() => {
    let filtered = [...favorites];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.user?.toLowerCase().includes(query) ||
        item.tags?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => (a.user || '').localeCompare(b.user || ''));
        break;
      case 'resolution':
        filtered.sort((a, b) => (b.imageWidth * b.imageHeight) - (a.imageWidth * a.imageHeight));
        break;
      case 'recent':
      default:
        // Keep original order (most recent first)
        break;
    }
    
    return filtered;
  }, [favorites, searchQuery, sortBy]);
  
  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditMode(!isEditMode);
    setSelectedItems([]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [isEditMode]);
  
  // Toggle item selection
  const toggleItemSelection = useCallback((itemId) => {
    setSelectedItems(prev => {
      const isSelected = prev.includes(itemId);
      if (isSelected) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);
  
  // Select all items
  const selectAll = useCallback(() => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredFavorites.map(item => item.id));
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [selectedItems, filteredFavorites]);
  
  // Remove from favorites
  const handleRemoveFavorite = useCallback((itemId, showUndo = true) => {
    removeFromFavorites(itemId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (showUndo) {
      showToast('Removed from favorites');
    }
  }, [removeFromFavorites]);
  
  // Bulk delete selected items
  const handleBulkDelete = useCallback(() => {
    Alert.alert(
      'Remove Favorites',
      `Remove ${selectedItems.length} wallpaper${selectedItems.length > 1 ? 's' : ''} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            selectedItems.forEach(id => handleRemoveFavorite(id, false));
            setSelectedItems([]);
            setIsEditMode(false);
            showToast(`Removed ${selectedItems.length} wallpapers`);
          }
        }
      ]
    );
  }, [selectedItems, handleRemoveFavorite]);
  
  // Share selected items
  const handleBulkShare = useCallback(async () => {
    try {
      const selectedWallpapers = filteredFavorites.filter(item => selectedItems.includes(item.id));
      const shareText = selectedWallpapers.map(item => 
        `🎨 ${item.user} - ${item.imageWidth}x${item.imageHeight}\n${item.webformatURL}`
      ).join('\n\n');
      
      await Share.share({
        message: `Check out these amazing wallpapers from ZenithWalls:\n\n${shareText}`,
        title: 'My Favorite Wallpapers'
      });
      
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Share error:', error);
    }
  }, [selectedItems, filteredFavorites]);
  
  // Open preview modal
  const openPreview = useCallback((index) => {
    setPreviewIndex(index);
    setShowPreview(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);
  
  // Download wallpaper
  const handleDownload = useCallback(async (item) => {
    try {
      setLoading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === 'granted') {
        const fileUri = `${FileSystem.cacheDirectory}zenithwalls-${item.id}.jpg`;
        const downloadResult = await FileSystem.downloadAsync(
          item.largeImageURL || item.webformatURL, 
          fileUri
        );
        
        if (downloadResult.status === 200) {
          await MediaLibrary.saveToLibraryAsync(downloadResult.uri);
          showToast('Wallpaper saved to gallery');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } else {
        Alert.alert('Permission Required', 'Please allow access to save wallpapers');
      }
    } catch (error) {
      console.error('Download error:', error);
      showToast('Download failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Set wallpaper (placeholder)
  const handleSetWallpaper = useCallback((item) => {
    Alert.alert(
      'Set Wallpaper',
      'Choose wallpaper type:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Home Screen', onPress: () => showToast('Wallpaper set for home screen') },
        { text: 'Lock Screen', onPress: () => showToast('Wallpaper set for lock screen') },
        { text: 'Both', onPress: () => showToast('Wallpaper set for both screens') }
      ]
    );
  }, []);
  
  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh - in real app, you'd sync with server
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
    showToast('Favorites refreshed');
  }, []);
  
  // Get sort label
  const getSortLabel = () => {
    switch (sortBy) {
      case 'name': return 'Name';
      case 'resolution': return 'Resolution';
      case 'recent': return 'Recent';
      default: return 'Sort';
    }
  };
  
  // Render card item
  const renderCard = ({ item, index }) => {
    const isSelected = selectedItems.includes(item.id);
    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).springify()}
        layout={Layout.springify()}
        style={styles.cardContainer}
      >
        <Pressable
          style={({ pressed }) => [
            styles.card,
            pressed && styles.cardPressed,
            isSelected && styles.cardSelected
          ]}
          onPress={() => {
            if (isEditMode) {
              toggleItemSelection(item.id);
            } else {
              openPreview(index);
            }
          }}
          onLongPress={() => {
            if (!isEditMode) {
              setIsEditMode(true);
              toggleItemSelection(item.id);
            }
          }}
        >
          {/* Card Image */}
          <Image
            source={{ uri: item.webformatURL }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          
          {/* Heart/Checkbox Icon */}
          <View style={styles.iconContainer}>
            {isEditMode ? (
              <Animated.View
                entering={ZoomIn.springify()}
                style={[styles.checkbox, isSelected && styles.checkboxSelected]}
              >
                {isSelected && (
                  <MaterialIcons name="check" size={16} color={theme.colors.white} />
                )}
              </Animated.View>
            ) : (
              <Pressable
                onPress={() => handleRemoveFavorite(item.id)}
                style={styles.heartButton}
                hitSlop={8}
              >
                <MaterialIcons name="favorite" size={20} color={theme.colors.error} />
              </Pressable>
            )}
          </View>
          
          {/* Card Info Overlay */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.cardOverlay}
          >
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.user || 'Unknown Artist'}
            </Text>
            <Text style={styles.cardResolution}>
              {item.imageWidth}×{item.imageHeight}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    );
  };
  
  // Empty state component
  const EmptyState = () => (
    <Animated.View entering={FadeInUp.springify()} style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons name="favorite-border" size={80} color={theme.colors.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap the heart on any wallpaper to save it here
      </Text>
      <Pressable
        onPress={() => navigation.navigate('Home')}
        style={styles.browseButton}
      >
        <LinearGradient
          colors={theme.colors.gradientRoyal}
          style={styles.browseButtonGradient}
        >
          <Text style={styles.browseButtonText}>Browse Wallpapers</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
  
  // Preview Modal Component
  const PreviewModal = () => {
    if (!showPreview || filteredFavorites.length === 0) return null;
    
    const currentItem = filteredFavorites[previewIndex];
    
    return (
      <Modal
        visible={showPreview}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.previewContainer}>
          <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.9)" />
          
          {/* Preview Header */}
          <SafeAreaView style={styles.previewHeader}>
            <Pressable onPress={() => setShowPreview(false)} style={styles.previewCloseButton}>
              <MaterialIcons name="close" size={24} color={theme.colors.white} />
            </Pressable>
            <Text style={styles.previewTitle}>
              {previewIndex + 1} of {filteredFavorites.length}
            </Text>
            <View style={styles.previewHeaderSpacer} />
          </SafeAreaView>
          
          {/* Preview Image */}
          <View style={styles.previewImageContainer}>
            <Image
              source={{ uri: currentItem.largeImageURL || currentItem.webformatURL }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Preview Info */}
          <View style={styles.previewInfo}>
            <Text style={styles.previewArtist}>{currentItem.user}</Text>
            <Text style={styles.previewResolution}>
              {currentItem.imageWidth} × {currentItem.imageHeight}
            </Text>
          </View>
          
          {/* Preview Actions */}
          <View style={styles.previewActions}>
            <Pressable
              onPress={() => handleSetWallpaper(currentItem)}
              style={styles.previewActionButton}
            >
              <MaterialIcons name="wallpaper" size={24} color={theme.colors.primary} />
              <Text style={styles.previewActionText}>Set Wallpaper</Text>
            </Pressable>
            
            <Pressable
              onPress={async () => {
                try {
                  await Share.share({
                    message: `🎨 ${currentItem.user} - ${currentItem.imageWidth}x${currentItem.imageHeight}\n${currentItem.webformatURL}`,
                    title: 'Amazing Wallpaper'
                  });
                } catch (error) {
                  console.error('Share error:', error);
                }
              }}
              style={styles.previewActionButton}
            >
              <Feather name="share" size={24} color={theme.colors.secondary} />
              <Text style={styles.previewActionText}>Share</Text>
            </Pressable>
            
            <Pressable
              onPress={() => {
                handleRemoveFavorite(currentItem.id);
                if (filteredFavorites.length === 1) {
                  setShowPreview(false);
                } else if (previewIndex >= filteredFavorites.length - 1) {
                  setPreviewIndex(previewIndex - 1);
                }
              }}
              style={styles.previewActionButton}
            >
              <MaterialIcons name="favorite" size={24} color={theme.colors.error} />
              <Text style={styles.previewActionText}>Remove</Text>
            </Pressable>
            
            <Pressable
              onPress={() => handleDownload(currentItem)}
              style={styles.previewActionButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size={24} color={theme.colors.accent} />
              ) : (
                <MaterialIcons name="download" size={24} color={theme.colors.accent} />
              )}
              <Text style={styles.previewActionText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* Top Bar */}
      <Animated.View entering={FadeIn} style={styles.topBar}>
        <View style={styles.topBarContent}>
          {/* Back Button */}
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.white} />
          </Pressable>
          
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {isEditMode ? `${selectedItems.length} Selected` : 'Favorites'}
            </Text>
            <Text style={styles.subtitle}>
              {filteredFavorites.length} wallpaper{filteredFavorites.length !== 1 ? 's' : ''}
            </Text>
          </View>
          
          {/* Edit Button */}
          <Pressable onPress={toggleEditMode} style={styles.editButton}>
            <Text style={styles.editButtonText}>
              {isEditMode ? 'Done' : 'Edit'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
      
      {/* Search & Sort */}
      <Animated.View entering={FadeInDown.delay(100)} style={styles.searchSortContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by artist or tags..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <MaterialIcons name="clear" size={20} color={theme.colors.textSecondary} />
            </Pressable>
          )}
        </View>
        
        {/* Sort Button */}
        <Pressable
          onPress={() => {
            const sortOptions = ['recent', 'resolution', 'name'];
            const currentIndex = sortOptions.indexOf(sortBy);
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            setSortBy(sortOptions[nextIndex]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={styles.sortButton}
        >
          <MaterialIcons name="sort" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.sortButtonText}>{getSortLabel()}</Text>
        </Pressable>
      </Animated.View>
      
      {/* Edit Mode Actions */}
      {isEditMode && (
        <Animated.View 
          entering={SlideInDown.springify()} 
          style={styles.editModeActions}
        >
          <Pressable onPress={selectAll} style={styles.selectAllButton}>
            <Text style={styles.selectAllText}>
              {selectedItems.length === filteredFavorites.length ? 'Deselect All' : 'Select All'}
            </Text>
          </Pressable>
        </Animated.View>
      )}
      
      {/* Favorites Grid */}
      {filteredFavorites.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          ref={flatListRef}
          data={filteredFavorites}
          renderItem={renderCard}
          keyExtractor={item => item.id.toString()}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
        />
      )}
      
      {/* Bottom Action Bar (Edit Mode) */}
      {isEditMode && selectedItems.length > 0 && (
        <Animated.View 
          entering={SlideInUp.springify()} 
          style={styles.bottomActionBar}
        >
          <Pressable onPress={handleBulkShare} style={styles.bottomActionButton}>
            <Feather name="share" size={24} color={theme.colors.white} />
            <Text style={styles.bottomActionText}>Share</Text>
          </Pressable>
          
          <Pressable onPress={handleBulkDelete} style={styles.bottomActionButton}>
            <MaterialIcons name="delete" size={24} color={theme.colors.error} />
            <Text style={[styles.bottomActionText, { color: theme.colors.error }]}>
              Delete ({selectedItems.length})
            </Text>
          </Pressable>
        </Animated.View>
      )}
      
      {/* Preview Modal */}
      <PreviewModal />
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Top Bar
  topBar: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: wp(4),
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
  },
  subtitle: {
    fontSize: hp(1.4),
    color: theme.colors.textSecondary,
    marginTop: hp(0.3),
  },
  editButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.primary,
  },
  editButtonText: {
    fontSize: hp(1.6),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
  
  // Search & Sort
  searchSortContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    gap: wp(3),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    gap: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: hp(1.6),
    color: theme.colors.white,
    fontWeight: theme.fontWeights.medium,
  },
  clearButton: {
    padding: wp(1),
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.2),
    gap: wp(1),
  },
  sortButtonText: {
    fontSize: hp(1.4),
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeights.medium,
  },
  
  // Edit Mode Actions
  editModeActions: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  selectAllButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
  },
  selectAllText: {
    fontSize: hp(1.5),
    color: theme.colors.primary,
    fontWeight: theme.fontWeights.medium,
  },
  
  // Grid
  gridContent: {
    padding: CARD_MARGIN,
    paddingBottom: hp(10), // Extra space for bottom action bar
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: CARD_MARGIN,
    marginVertical: CARD_MARGIN,
  },
  card: {
    flex: 1,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    ...theme.shadows.md,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    position: 'absolute',
    top: wp(2),
    right: wp(2),
  },
  heartButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    borderWidth: 2,
    borderColor: theme.colors.white,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: hp(8),
    justifyContent: 'flex-end',
    paddingHorizontal: wp(2),
    paddingBottom: wp(2),
  },
  cardTitle: {
    fontSize: hp(1.4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
  cardResolution: {
    fontSize: hp(1.2),
    color: theme.colors.textSecondary,
    marginTop: hp(0.2),
  },
  
  // Bottom Action Bar
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    paddingBottom: hp(3),
  },
  bottomActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp(2),
    paddingVertical: hp(1.5),
    borderRadius: theme.radius.lg,
    marginHorizontal: wp(2),
    backgroundColor: theme.colors.background,
  },
  bottomActionText: {
    fontSize: hp(1.6),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.white,
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
  },
  emptyIconContainer: {
    marginBottom: hp(3),
  },
  emptyTitle: {
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    marginBottom: hp(1),
  },
  emptySubtitle: {
    fontSize: hp(1.8),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: hp(2.5),
    marginBottom: hp(4),
  },
  browseButton: {
    borderRadius: theme.radius.full,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  browseButtonGradient: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(2),
  },
  browseButtonText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
  
  // Preview Modal
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
  },
  previewCloseButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitle: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.white,
  },
  previewHeaderSpacer: {
    width: wp(10),
  },
  previewImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.6,
  },
  previewInfo: {
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  previewArtist: {
    fontSize: hp(2),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
  previewResolution: {
    fontSize: hp(1.6),
    color: theme.colors.textSecondary,
    marginTop: hp(0.5),
  },
  previewActions: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingBottom: hp(4),
    gap: wp(4),
  },
  previewActionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  previewActionText: {
    fontSize: hp(1.3),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.white,
    marginTop: hp(0.5),
  },
});