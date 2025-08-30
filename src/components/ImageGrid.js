// Import necessary components and libraries from React Native and other dependencies
import React, { useMemo, useState } from 'react';
import { View, Image, StyleSheet, Pressable, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../constants/themes';
import { hp, wp } from '../helpers/common';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import { BlurView } from 'expo-blur';
import LoadingIndicator from './LoadingIndicator';

const COLUMN_COUNT = 2;
const SPACING = theme.spacing.sm;
const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = (SCREEN_WIDTH - (COLUMN_COUNT + 1) * SPACING * 2) / COLUMN_COUNT;

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

  // Organize images into two columns with balanced heights
  const columns = useMemo(() => {
    const cols = [[], []]; // Initialize two columns
    let colHeights = [0, 0]; // Track height of each column

    images.forEach((item) => {
      const aspectRatio = getRandomHeight();
      const imageHeight = ITEM_WIDTH / aspectRatio;
      
      // Add to shorter column
      const shorterColIndex = colHeights[0] <= colHeights[1] ? 0 : 1;
      cols[shorterColIndex].push({ ...item, aspectRatio, height: imageHeight });
      colHeights[shorterColIndex] += imageHeight + SPACING * 2;
    });

    return cols;
  }, [images]);

  const renderColumn = (items, columnIndex) => {
    return (
      <View 
        key={`column-${columnIndex}`} 
        style={[
          styles.column,
          columnIndex === 0 && { marginRight: SPACING }
        ]}
      >
        {items.map((item, index) => (
          <Animated.View
            key={`${columnIndex}-${item.id}-${index}`}
            entering={FadeInDown.delay(index * 50).springify()}
            style={styles.itemContainer}
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
        <View style={styles.container}>
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
    paddingHorizontal: SPACING,
  },
  grid: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
  },
  itemContainer: {
    marginBottom: SPACING * 2,
    ...theme.shadows.lg,
  },
  imageContainer: {
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    elevation: 8,
    ...theme.shadows.lg,
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
