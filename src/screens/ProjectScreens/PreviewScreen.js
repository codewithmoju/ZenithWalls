import { 
  StyleSheet, 
  Text, 
  View, 
  StatusBar, 
  Image, 
  Pressable, 
  Dimensions, 
  Platform, 
  ScrollView, 
  Alert, 
  Share,
  Modal,
  SafeAreaView,
  FlatList,
  ActivityIndicator
} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { BlurView } from 'expo-blur'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/themes'
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import Animated, { 
  FadeIn, 
  SlideInDown, 
  SlideInUp,
  FadeInUp,
  ZoomIn
} from 'react-native-reanimated'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { useFavorites } from '../../constants/FavoritesContext';
import { useDownloads } from '../../constants/DownloadsContext';
import { apiCall } from '../../API';
import * as Haptics from 'expo-haptics'
import GlassMorphism from '../../components/GlassMorphism'
import { WallpaperUtils } from '../../utils/wallpaperUtils'
import PreviewLoadingScreen from '../../components/PreviewLoadingScreen'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PreviewScreen = ({ route }) => {
    const { image } = route.params;
    const navigation = useNavigation();
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const { addDownload } = useDownloads();

    const [similarWallpapers, setSimilarWallpapers] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        StatusBar.setBarStyle('light-content');
        fetchSimilarWallpapers();
        
        // Simulate initial loading
        setTimeout(() => {
            setInitialLoading(false);
        }, 1000);
    }, []);

    const fetchSimilarWallpapers = async () => {
        try {
            setLoading(true);
            const params = {
                q: image.tags,
                page: currentPage,
                per_page: 20,
                safesearch: 'true',
                image_type: 'photo',
                orientation: 'vertical'
            };

            const response = await apiCall(params);
            if (response.success && response.data?.hits) {
                const filteredWallpapers = response.data.hits.filter(hit => hit.id !== image.id);
                setSimilarWallpapers(prev => 
                    currentPage === 1 ? filteredWallpapers : [...prev, ...filteredWallpapers]
                );
            }
        } catch (error) {
            console.error('Error fetching similar wallpapers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (!loading) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            
            const { status } = await MediaLibrary.requestPermissionsAsync();
            
            if (status === 'granted') {
                const fileUri = `${FileSystem.cacheDirectory}wallpaper-${image.id}.jpg`;
                const downloadResult = await FileSystem.downloadAsync(image.largeImageURL, fileUri);
                
                if (downloadResult.status === 200) {
                    const saveResult = await WallpaperUtils.saveToGallery(
                        downloadResult.uri,
                        `${image.user}_wallpaper_${image.id}`
                    );
                    
                    if (saveResult.success) {
                        // Add to downloads context
                        await addDownload(image);
                        
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        Alert.alert(
                            "Success! 🎉", 
                            "Wallpaper saved to your gallery",
                            [{ text: "OK", style: "default" }]
                        );
                    } else {
                        throw new Error(saveResult.error);
                    }
                } else {
                    throw new Error('Download failed');
                }
            } else {
                Alert.alert(
                    "Permission Required",
                    "Please grant gallery access to save wallpapers",
                    [{ text: "OK", style: "default" }]
                );
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert(
                "Download Failed", 
                "Unable to save wallpaper. Please try again.",
                [{ text: "OK", style: "default" }]
            );
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } finally {
            setDownloading(false);
        }
    };

    const handleDetailsPress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowDetailsModal(true);
    };

    const shareWallpaper = async () => {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            
            const shareData = await WallpaperUtils.shareWallpaper(image);
            
            await Share.share({
                message: shareData.message,
                url: shareData.url,
                title: shareData.title,
            });
        } catch (error) {
            console.error('Share error:', error);
            Alert.alert('Share Failed', 'Unable to share wallpaper. Please try again.');
        }
    };

    const toggleFavorite = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (isFavorite(image.id)) {
            removeFromFavorites(image.id);
        } else {
            addToFavorites(image);
        }
    };

    const renderSimilarItem = ({ item }) => (
        <Pressable
            style={styles.similarItem}
            onPress={() => navigation.push('Preview', { image: item })}
        >
            <Image
                source={{ uri: item.webformatURL }}
                style={styles.similarImage}
                resizeMode="cover"
            />
        </Pressable>
    );

    const goBack = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.goBack();
    };

    const closeDetailsModal = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowDetailsModal(false);
    };

    if (initialLoading) {
        return (
            <PreviewLoadingScreen 
                visible={true}
                title="Loading Preview"
                subtitle="Preparing your wallpaper"
                progress={0}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View 
                    entering={FadeIn.duration(600)}
                    style={styles.header}
                >
                    <Pressable onPress={goBack} style={[styles.backButton, styles.headerButton]}>
                        <Ionicons name="arrow-back" size={22} color={theme.colors.white} />
                    </Pressable>
                    
                    <View style={styles.headerTitle}>
                        <Text style={styles.headerTitleText}>Wallpaper Preview</Text>
                        <Text style={styles.headerSubtitle}>by {image.user}</Text>
                    </View>
                    
                    <Pressable onPress={toggleFavorite} style={[styles.favoriteButton, styles.headerButton, isFavorite(image.id) && styles.favoriteActive]}>
                        <Ionicons 
                            name={isFavorite(image.id) ? "heart" : "heart-outline"} 
                            size={22} 
                            color={theme.colors.white}
                        />
                    </Pressable>
                </Animated.View>

                {/* Main Wallpaper Display */}
                <Animated.View 
                    entering={ZoomIn.delay(300).duration(800).springify()}
                    style={styles.wallpaperContainer}
                >
                    <View style={styles.imageWrapper}>
                        <Image
                            source={{ uri: image.largeImageURL }}
                            style={styles.wallpaperImage}
                            resizeMode="cover"
                            onLoadStart={() => setImageLoaded(false)}
                            onLoadEnd={() => setImageLoaded(true)}
                        />
                        
                        {!imageLoaded && (
                            <View style={styles.imageLoader}>
                                <ActivityIndicator size="large" color={theme.colors.primary} />
                                <Text style={styles.loadingText}>Loading wallpaper...</Text>
                            </View>
                        )}
                    </View>
                </Animated.View>

                {/* Wallpaper Info */}
                <Animated.View 
                    entering={SlideInUp.delay(600).duration(500)}
                    style={styles.infoContainer}
                >
                    <GlassMorphism variant="medium" style={styles.infoContent}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <MaterialIcons name="photo-size-select-actual" size={20} color={theme.colors.textSecondary} />
                                <Text style={styles.infoLabel}>Resolution</Text>
                                <Text style={styles.infoValue}>{image.imageWidth} × {image.imageHeight}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <MaterialIcons name="visibility" size={20} color={theme.colors.textSecondary} />
                                <Text style={styles.infoLabel}>Views</Text>
                                <Text style={styles.infoValue}>{image.views?.toLocaleString() || 'N/A'}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <MaterialIcons name="download" size={20} color={theme.colors.textSecondary} />
                                <Text style={styles.infoLabel}>Downloads</Text>
                                <Text style={styles.infoValue}>{image.downloads?.toLocaleString() || 'N/A'}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <MaterialIcons name="label" size={20} color={theme.colors.textSecondary} />
                                <Text style={styles.infoLabel}>Tags</Text>
                                <Text style={styles.infoValue} numberOfLines={2}>{image.tags}</Text>
                            </View>
                        </View>
                    </GlassMorphism>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View 
                    entering={SlideInUp.delay(800).duration(500)}
                    style={styles.actionContainer}
                >
                    {/* Primary Action */}
                    <Pressable 
                        style={[styles.primaryActionButton, downloading && styles.buttonDisabled]}
                        onPress={handleDownload}
                        disabled={downloading}
                    >
                        <View style={styles.primaryActionContent}>
                            {downloading ? (
                                <ActivityIndicator size="small" color={theme.colors.white} />
                            ) : (
                                <MaterialIcons name="download" size={24} color={theme.colors.white} />
                            )}
                            <Text style={styles.primaryActionText}>
                                {downloading ? 'Downloading...' : 'Download HD'}
                            </Text>
                        </View>
                    </Pressable>

                    {/* Secondary Actions */}
                    <View style={styles.secondaryActionRow}>
                        <Pressable 
                            style={styles.secondaryActionButton}
                            onPress={shareWallpaper}
                        >
                            <View style={styles.secondaryActionContent}>
                                <MaterialIcons name="share" size={20} color={theme.colors.white} />
                                <Text style={styles.secondaryActionText}>Share</Text>
                            </View>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.secondaryActionButton}
                            onPress={handleDetailsPress}
                        >
                            <View style={styles.secondaryActionContent}>
                                <MaterialIcons name="info-outline" size={20} color={theme.colors.white} />
                                <Text style={styles.secondaryActionText}>Details</Text>
                            </View>
                        </Pressable>
                    </View>
                </Animated.View>

                {/* Similar Wallpapers */}
                {similarWallpapers.length > 0 && (
                    <Animated.View 
                        entering={FadeInUp.delay(1000).duration(600)}
                        style={styles.similarSection}
                    >
                        <Text style={styles.similarTitle}>Similar Wallpapers</Text>
                        <FlatList
                            data={similarWallpapers}
                            renderItem={renderSimilarItem}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.similarList}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.7}
                        />
                        {loading && (
                            <View style={styles.similarLoading}>
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            </View>
                        )}
                    </Animated.View>
                )}
            </ScrollView>

            {/* Details Modal */}
            {showDetailsModal && (
                <Animated.View 
                    entering={FadeIn.duration(300)}
                    style={styles.modalOverlay}
                >
                    <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
                    <Animated.View 
                        entering={SlideInUp.duration(400).springify()}
                        style={styles.detailsModal}
                    >
                        <View style={styles.detailsModalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Wallpaper Details</Text>
                                <Pressable 
                                    onPress={closeDetailsModal}
                                    style={styles.modalCloseButton}
                                >
                                    <MaterialIcons name="close" size={22} color={theme.colors.white} />
                                </Pressable>
                            </View>
                            
                            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
                                <View style={styles.detailsGrid}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Artist</Text>
                                        <Text style={styles.detailValue}>{image.user}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Resolution</Text>
                                        <Text style={styles.detailValue}>{image.imageWidth} × {image.imageHeight}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>File Size</Text>
                                        <Text style={styles.detailValue}>{Math.round((image.imageSize || 0) / 1024)} KB</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Views</Text>
                                        <Text style={styles.detailValue}>{image.views?.toLocaleString() || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Downloads</Text>
                                        <Text style={styles.detailValue}>{image.downloads?.toLocaleString() || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Category</Text>
                                        <Text style={styles.detailValue}>{image.category || 'General'}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Tags</Text>
                                        <Text style={styles.detailValue}>{image.tags}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </Animated.View>
                </Animated.View>
            )}

            {/* Loading Screens */}
            <PreviewLoadingScreen 
                visible={downloading}
                title="Downloading Wallpaper"
                subtitle="Saving to your gallery"
                progress={0}
            />
        </SafeAreaView>
    );
};

export default PreviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: hp(4),
    },
    
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(4),
        paddingTop: Platform.OS === 'ios' ? hp(2) : hp(4),
        paddingBottom: hp(2),
        zIndex: 10,
    },
    backButton: {
        zIndex: 10,
    },
    favoriteButton: {
        zIndex: 10,
    },
    headerButton: {
        width: wp(11),
        height: wp(11),
        borderRadius: wp(5.5),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        ...theme.shadows.sm,
    },
    favoriteActive: {
        backgroundColor: theme.colors.error,
        borderColor: theme.colors.error,
        ...theme.shadows.primaryShadow,
    },
    headerTitle: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: wp(4),
    },
    headerTitleText: {
        fontSize: hp(2.2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: hp(1.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: hp(0.2),
    },

    // Wallpaper Display
    wallpaperContainer: {
        paddingHorizontal: wp(4),
        marginBottom: hp(3),
    },
    imageWrapper: {
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        ...theme.shadows.xl,
        elevation: 12,
    },
    wallpaperImage: {
        width: '100%',
        height: Platform.OS === 'ios' ? SCREEN_HEIGHT * 0.55 : SCREEN_HEIGHT * 0.6,
        backgroundColor: theme.colors.surface,
        minHeight: hp(40),
        maxHeight: hp(70),
    },
    imageLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    loadingText: {
        color: theme.colors.white,
        fontSize: hp(1.6),
        fontWeight: theme.fontWeights.medium,
        marginTop: hp(1),
    },

    // Info Section
    infoContainer: {
        paddingHorizontal: wp(4),
        marginBottom: hp(3),
    },
    infoContent: {
        padding: wp(4),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(2),
    },
    infoItem: {
        flex: 1,
        alignItems: 'center',
        gap: hp(0.5),
    },
    infoLabel: {
        fontSize: hp(1.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    infoValue: {
        fontSize: hp(1.6),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },

    // Action Buttons
    actionContainer: {
        paddingHorizontal: wp(4),
        marginBottom: hp(3),
        gap: hp(2.5),
    },
    primaryActionButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.radius.xl,
        paddingVertical: hp(2.2),
        paddingHorizontal: wp(8),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: hp(6),
        ...theme.shadows.primaryShadow,
        elevation: 8,
    },
    primaryActionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
    },
    primaryActionText: {
        color: theme.colors.white,
        fontSize: hp(1.9),
        fontWeight: theme.fontWeights.bold,
        letterSpacing: 0.5,
    },
    buttonDisabled: {
        opacity: 0.6,
        transform: [{ scale: 0.98 }],
    },
    secondaryActionRow: {
        flexDirection: 'row',
        gap: wp(3),
    },
    secondaryActionButton: {
        flex: 1,
        borderRadius: theme.radius.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        ...theme.shadows.md,
        elevation: 4,
    },
    secondaryActionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(1.8),
        paddingHorizontal: wp(4),
        gap: wp(2.5),
        minHeight: hp(5.5),
    },
    secondaryActionText: {
        color: theme.colors.white,
        fontSize: hp(1.5),
        fontWeight: theme.fontWeights.semibold,
        letterSpacing: 0.3,
    },

    // Similar Wallpapers
    similarSection: {
        paddingHorizontal: wp(4),
    },
    similarTitle: {
        fontSize: hp(2.2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        marginBottom: hp(2),
    },
    similarList: {
        paddingRight: wp(4),
    },
    similarItem: {
        marginRight: wp(2),
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        ...theme.shadows.md,
    },
    similarImage: {
        width: wp(28),
        height: hp(18),
        backgroundColor: theme.colors.surface,
    },
    similarLoading: {
        alignItems: 'center',
        paddingVertical: hp(2),
    },

    // Details Modal
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        paddingHorizontal: wp(4),
        paddingVertical: hp(8),
    },
    detailsModal: {
        width: '100%',
        maxWidth: wp(90),
        maxHeight: '85%',
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        ...theme.shadows.xl,
        elevation: 20,
    },
    detailsModalContent: {
        padding: wp(6),
        paddingBottom: wp(8),
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(3),
        paddingBottom: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        fontSize: hp(2.2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.white,
    },
    modalCloseButton: {
        padding: wp(2),
        borderRadius: wp(4),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalScrollView: {
        maxHeight: hp(50),
        paddingRight: wp(2),
    },
    detailsGrid: {
        gap: hp(2.5),
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: hp(1.2),
        paddingHorizontal: wp(3),
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    detailLabel: {
        fontSize: hp(1.6),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    detailValue: {
        fontSize: hp(1.6),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white,
        flex: 2,
        textAlign: 'right',
        flexWrap: 'wrap',
    },
});