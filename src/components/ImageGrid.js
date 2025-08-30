// Import necessary components and libraries from React Native and other dependencies
import React, { useMemo, useState, useEffect } from 'react';
import { View, Image, StyleSheet, Pressable, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/themes';
import { hp, wp } from '../helpers/common';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import { BlurView } from 'expo-blur';
import LoadingIndicator from './LoadingIndicator';
import { 
  getGridColumns, 
  getSpacing, 
  getImageDimensions, 
  getMaxContainerWidth,
  getContainerPadding,
  supportsHover,
  screenWidth 
} from '../utils/responsive';

const getRandomHeight = () => {
  // Much taller height ratios
  const heights = [0.8, 0.6, 0.7, 0.4];
  return heights[Math.floor(Math.random() * heights.length)];
};

// Function to cache image
const cacheImage = async (uri) => {
  try {
    const filename = uri.split('/').pop();
    const path = `${FileSystem.cacheDirectory}${filename}`;
    const image = await FileSystem.getInfoAsync(path);
    
    if (image.exists) {
      return image.uri;
    }
    
    const newImage = await FileSystem.downloadAsync(uri, path);
    return newImage.uri;
  } catch (error) {
    return uri;
  }
};

const ImageItem = React.memo(({ item, aspectRatio, onPress }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [cachedUri, setCachedUri] = useState(null);

  React.useEffect(() => {
    let isMounted = true;
    const loadAndCacheImage = async () => {
      const uri = await cacheImage(item.webformatURL);
      if (isMounted) {
        setCachedUri(uri);
      }
    };
    loadAndCacheImage();
    return () => { isMounted = false; };
  }, [item.webformatURL]);

  return (
    <Pressable
      style={styles.imageContainer}
      onPress={onPress}
    >
      <View style={[styles.image, { aspectRatio }]}>
        {imageLoading && (
          <View style={styles.imagePlaceholder}>
            <BlurView intensity={20} style={StyleSheet.absoluteFill}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </BlurView>
          </View>
        )}
        <Animated.Image
          source={{ uri: cachedUri || item.webformatURL }}
          style={[
            styles.image,
            { aspectRatio },
            !imageLoading && { ...theme.shadows.md }
          ]}
          resizeMode="cover"
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          entering={FadeIn.duration(300)}
        />
      </View>
    </Pressable>
  );
});

const ImageGrid = ({ images, onLoadMore, loading }) => {
  const navigation = useNavigation();
  const [screenData, setScreenData] = useState({
    columns: getGridColumns(),
    spacing: getSpacing(8),
    containerPadding: getContainerPadding(),
    itemWidth: 0
  });

  useEffect(() => {
    const updateLayout = () => {
      const columns = getGridColumns();
      const spacing = getSpacing(8);
      const containerPadding = getContainerPadding();
      const maxWidth = getMaxContainerWidth();
      const availableWidth = Math.min(screenWidth, maxWidth) - (containerPadding * 2);
      const itemWidth = (availableWidth - (spacing * (columns - 1))) / columns;
      
      setScreenData({
        columns,
        spacing,
        containerPadding,
        itemWidth
      });
    };

    updateLayout();
    const subscription = Dimensions.addEventListener('change', updateLayout);
    return () => subscription?.remove();
  }, []);

  // Organize images into responsive columns with balanced heights
  const columns = useMemo(() => {
    const columnCount = screenData.columns;
    const cols = Array(columnCount).fill(null).map(() => []);
    const colHeights = Array(columnCount).fill(0);

    images.forEach((item) => {
      const aspectRatio = getRandomHeight();
      const imageHeight = screenData.itemWidth / aspectRatio;
      
      // Find the shortest column
      const shortestColIndex = colHeights.indexOf(Math.min(...colHeights));
      cols[shortestColIndex].push({ ...item, aspectRatio, height: imageHeight });
      colHeights[shortestColIndex] += imageHeight + screenData.spacing;
    });

    return cols;
  }, [images, screenData]);

  const renderColumn = (items, columnIndex) => {
    return (
      <View 
        key={`column-${columnIndex}`} 
        style={[
          styles.column,
          columnIndex < screenData.columns - 1 && { marginRight: screenData.spacing }
        ]}
      >
        {items.map((item, index) => (
          <Animated.View
            key={`${columnIndex}-${item.id}-${index}`}
            entering={FadeInDown.delay(index * 50).springify()}
            style={[styles.itemContainer, { marginBottom: screenData.spacing }]}
          >
            <ImageItem
              item={item}
              aspectRatio={item.aspectRatio}
              onPress={() => {
                if (navigation.navigate) {
                  navigation.navigate('Preview', { image: item });
                }
              }}
            />
          </Animated.View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, {
      paddingHorizontal: screenData.containerPadding,
      maxWidth: getMaxContainerWidth(),
      alignSelf: 'center'
    }]}>
      <View style={styles.grid}>
        {columns.map((column, index) => renderColumn(column, index))}
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <LoadingIndicator 
            text="Loading more wallpapers..."
            size="large"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  column: {
    flex: 1,
  },
  itemContainer: {
    ...theme.shadows.lg,
  },
  imageContainer: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    elevation: 8,
    ...theme.shadows.lg,
    ...(supportsHover && {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
    }),
  },
  image: {
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  imagePlaceholder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
  },
  loadingContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default ImageGrid;
