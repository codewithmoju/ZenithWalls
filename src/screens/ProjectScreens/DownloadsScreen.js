import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Alert,
    RefreshControl,
    FlatList,
    Modal,
    Share,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn, SlideInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { BlurView } from 'expo-blur';

import { theme } from '../../constants/themes';
import { hp, wp } from '../../helpers/common';
import { useDownloads } from '../../constants/DownloadsContext';
import GlassMorphism from '../../components/GlassMorphism';
import { WallpaperUtils } from '../../utils/wallpaperUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_SIZE = (SCREEN_WIDTH - wp(6)) / 2;

const DownloadsScreen = () => {
    const navigation = useNavigation();
    const { 
        downloads, 
        loading, 
        removeDownload, 
        clearAllDownloads, 
        getDownloadStats,
        refreshDownloads
    } = useDownloads();
    
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDownload, setSelectedDownload] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [sortBy, setSortBy] = useState('recent'); // recent, oldest, name, size

    const stats = useMemo(() => getDownloadStats(), [downloads]);
    
    const sortedDownloads = useMemo(() => {
        if (!downloads.length) return [];
        
        const sorted = [...downloads];
        switch (sortBy) {
            case 'recent':
                return sorted.sort((a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt));
            case 'oldest':
                return sorted.sort((a, b) => new Date(a.downloadedAt) - new Date(b.downloadedAt));
            case 'name':
                return sorted.sort((a, b) => (a.user || '').localeCompare(b.user || ''));
            case 'size':
                return sorted.sort((a, b) => (b.fileSize || 0) - (a.fileSize || 0));
            default:
                return sorted;
        }
    }, [downloads, sortBy]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refreshDownloads();
        setRefreshing(false);
    };

    const handleGoBack = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.goBack();
    };

    const handleWallpaperPress = async (download) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Preview', { image: download });
    };

    const handleWallpaperLongPress = async (download) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedDownload(download);
        setShowDetailsModal(true);
    };

    const handleDeleteDownload = (downloadId) => {
        Alert.alert(
            'Delete Download',
            'Are you sure you want to remove this wallpaper from your downloads? This will not delete the file from your gallery.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        const result = await removeDownload(downloadId);
                        if (result.success) {
                            setShowDetailsModal(false);
                        }
                    }
                }
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear All Downloads',
            `Are you sure you want to clear all ${downloads.length} downloads? This will not delete the files from your gallery.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        await clearAllDownloads();
                    }
                }
            ]
        );
    };

    const handleShareDownload = async (download) => {
        try {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const shareData = await WallpaperUtils.shareWallpaper(download);
            if (shareData) {
                await Share.share({
                    message: shareData.message,
                    url: shareData.url,
                    title: shareData.title,
                });
            }
        } catch (error) {
            console.error('Share error:', error);
            Alert.alert('Share Failed', 'Unable to share wallpaper. Please try again.');
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderDownloadItem = ({ item, index }) => (
        <Animated.View entering={FadeInDown.delay(index * 50)}>
            <Pressable
                style={styles.downloadItem}
                onPress={() => handleWallpaperPress(item)}
                onLongPress={() => handleWallpaperLongPress(item)}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: item.webformatURL }}
                        style={styles.wallpaperImage}
                        resizeMode="cover"
                    />
                    <View style={styles.imageOverlay}>
                        <View style={styles.imageInfo}>
                            <Text style={styles.imageResolution}>
                                {item.imageWidth} × {item.imageHeight}
                            </Text>
                            <Text style={styles.imageSize}>
                                {formatFileSize(item.fileSize)}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.downloadInfo}>
                    <Text style={styles.artistName} numberOfLines={1}>
                        {item.user}
                    </Text>
                    <Text style={styles.downloadDate} numberOfLines={1}>
                        {formatDate(item.downloadedAt)}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );

    const EmptyState = () => (
        <Animated.View entering={FadeIn} style={styles.emptyContainer}>
            <MaterialCommunityIcons 
                name="download-circle-outline" 
                size={wp(20)} 
                color={theme.colors.textTertiary} 
            />
            <Text style={styles.emptyTitle}>No Downloads Yet</Text>
            <Text style={styles.emptySubtitle}>
                Start downloading wallpapers to see them here
            </Text>
            <Pressable
                style={styles.browseButton}
                onPress={() => navigation.navigate('Home')}
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

    if (downloads.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" backgroundColor={theme.colors.background} />
                
                {/* Header */}
                <Animated.View entering={FadeIn} style={styles.header}>
                    <Pressable style={styles.backButton} onPress={handleGoBack}>
                        <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                    </Pressable>
                    <Text style={styles.headerTitle}>Downloads</Text>
                    <View style={styles.headerSpacer} />
                </Animated.View>

                <EmptyState />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={theme.colors.background} />
            
            {/* Header */}
            <Animated.View entering={FadeIn} style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleGoBack}>
                    <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Downloads</Text>
                <Pressable style={styles.headerAction} onPress={handleClearAll}>
                    <MaterialIcons name="clear-all" size={24} color={theme.colors.error} />
                </Pressable>
            </Animated.View>

            {/* Stats */}
            <Animated.View entering={FadeInDown.delay(100)} style={styles.statsContainer}>
                <GlassMorphism variant="medium" style={styles.statsCard}>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stats.totalDownloads}</Text>
                            <Text style={styles.statLabel}>Downloaded</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{formatFileSize(stats.totalSize)}</Text>
                            <Text style={styles.statLabel}>Total Size</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue} numberOfLines={1}>
                                {stats.mostDownloadedCategory}
                            </Text>
                            <Text style={styles.statLabel}>Top Category</Text>
                        </View>
                    </View>
                </GlassMorphism>
            </Animated.View>

            {/* Sort Options */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
                    {[
                        { key: 'recent', label: 'Recent', icon: 'schedule' },
                        { key: 'oldest', label: 'Oldest', icon: 'history' },
                        { key: 'name', label: 'Artist', icon: 'person' },
                        { key: 'size', label: 'Size', icon: 'photo-size-select-large' }
                    ].map(option => (
                        <Pressable
                            key={option.key}
                            style={[
                                styles.sortOption,
                                sortBy === option.key && styles.sortOptionActive
                            ]}
                            onPress={() => setSortBy(option.key)}
                        >
                            <MaterialIcons 
                                name={option.icon} 
                                size={16} 
                                color={sortBy === option.key ? theme.colors.white : theme.colors.textTertiary} 
                            />
                            <Text style={[
                                styles.sortOptionText,
                                sortBy === option.key && styles.sortOptionTextActive
                            ]}>
                                {option.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </Animated.View>

            {/* Downloads Grid */}
            <FlatList
                data={sortedDownloads}
                renderItem={renderDownloadItem}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.gridContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
            />

            {/* Details Modal */}
            {showDetailsModal && selectedDownload && (
                <Modal
                    visible={showDetailsModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowDetailsModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />
                        <Animated.View entering={SlideInRight} style={styles.detailsModal}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Download Details</Text>
                                <Pressable
                                    onPress={() => setShowDetailsModal(false)}
                                    style={styles.modalCloseButton}
                                >
                                    <MaterialIcons name="close" size={22} color={theme.colors.white} />
                                </Pressable>
                            </View>

                            <ScrollView style={styles.modalContent}>
                                <View style={styles.modalImageContainer}>
                                    <Image
                                        source={{ uri: selectedDownload.webformatURL }}
                                        style={styles.modalImage}
                                        resizeMode="cover"
                                    />
                                </View>

                                <View style={styles.detailsList}>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Artist</Text>
                                        <Text style={styles.detailValue}>{selectedDownload.user}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Resolution</Text>
                                        <Text style={styles.detailValue}>
                                            {selectedDownload.imageWidth} × {selectedDownload.imageHeight}
                                        </Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>File Size</Text>
                                        <Text style={styles.detailValue}>
                                            {formatFileSize(selectedDownload.fileSize)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Downloaded</Text>
                                        <Text style={styles.detailValue}>
                                            {formatDate(selectedDownload.downloadedAt)}
                                        </Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Category</Text>
                                        <Text style={styles.detailValue}>
                                            {selectedDownload.category || 'General'}
                                        </Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Text style={styles.detailLabel}>Tags</Text>
                                        <Text style={styles.detailValue}>{selectedDownload.tags}</Text>
                                    </View>
                                </View>

                                <View style={styles.modalActions}>
                                    <Pressable
                                        style={styles.modalActionButton}
                                        onPress={() => {
                                            setShowDetailsModal(false);
                                            handleWallpaperPress(selectedDownload);
                                        }}
                                    >
                                        <MaterialIcons name="visibility" size={20} color={theme.colors.primary} />
                                        <Text style={styles.modalActionText}>View</Text>
                                    </Pressable>
                                    <Pressable
                                        style={styles.modalActionButton}
                                        onPress={() => handleShareDownload(selectedDownload)}
                                    >
                                        <MaterialIcons name="share" size={20} color={theme.colors.accent} />
                                        <Text style={styles.modalActionText}>Share</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.modalActionButton, styles.deleteButton]}
                                        onPress={() => handleDeleteDownload(selectedDownload.id)}
                                    >
                                        <MaterialIcons name="delete" size={20} color={theme.colors.error} />
                                        <Text style={[styles.modalActionText, styles.deleteText]}>Delete</Text>
                                    </Pressable>
                                </View>
                            </ScrollView>
                        </Animated.View>
                    </View>
                </Modal>
            )}
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
    headerAction: {
        padding: wp(2),
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.surface,
    },
    statsContainer: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
    },
    statsCard: {
        padding: wp(4),
        borderRadius: theme.radius.xl,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
        gap: hp(0.5),
        flex: 1,
    },
    statValue: {
        fontSize: hp(2.2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: hp(1.2),
        color: theme.colors.textTertiary,
        fontWeight: theme.fontWeights.medium,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: hp(3),
        backgroundColor: theme.colors.border,
    },
    sortContainer: {
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
    },
    sortLabel: {
        fontSize: hp(1.6),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.text,
        marginBottom: hp(1),
    },
    sortScroll: {
        flexGrow: 0,
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(1),
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        marginRight: wp(2),
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.surface,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sortOptionActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    sortOptionText: {
        fontSize: hp(1.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.textTertiary,
    },
    sortOptionTextActive: {
        color: theme.colors.white,
    },
    gridContainer: {
        paddingHorizontal: wp(3),
        paddingVertical: hp(2),
        paddingBottom: hp(4),
    },
    downloadItem: {
        width: ITEM_SIZE,
        marginHorizontal: wp(1.5),
        marginVertical: hp(1),
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        backgroundColor: theme.colors.surface,
        ...theme.shadows.md,
    },
    imageContainer: {
        position: 'relative',
    },
    wallpaperImage: {
        width: '100%',
        height: ITEM_SIZE * 1.4,
        backgroundColor: theme.colors.surface,
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    imageInfo: {
        padding: wp(2),
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    imageResolution: {
        fontSize: hp(1.2),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white,
    },
    imageSize: {
        fontSize: hp(1.1),
        color: 'rgba(255, 255, 255, 0.8)',
    },
    downloadInfo: {
        padding: wp(3),
        gap: hp(0.5),
    },
    artistName: {
        fontSize: hp(1.4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.text,
    },
    downloadDate: {
        fontSize: hp(1.2),
        color: theme.colors.textTertiary,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(8),
        gap: hp(2),
    },
    emptyTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: hp(1.6),
        color: theme.colors.textTertiary,
        textAlign: 'center',
        lineHeight: hp(2.2),
    },
    browseButton: {
        marginTop: hp(2),
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
    },
    browseButtonGradient: {
        paddingHorizontal: wp(8),
        paddingVertical: hp(1.5),
        alignItems: 'center',
    },
    browseButtonText: {
        fontSize: hp(1.6),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.white,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
    },
    detailsModal: {
        width: '100%',
        maxWidth: wp(90),
        maxHeight: '90%',
        borderRadius: theme.radius.xl,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: wp(4),
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.white,
    },
    modalCloseButton: {
        padding: wp(1),
        borderRadius: wp(3),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalContent: {
        flex: 1,
    },
    modalImageContainer: {
        padding: wp(4),
        alignItems: 'center',
    },
    modalImage: {
        width: wp(60),
        height: wp(80),
        borderRadius: theme.radius.lg,
        backgroundColor: theme.colors.surface,
    },
    detailsList: {
        padding: wp(4),
        gap: hp(1.5),
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: hp(1),
        paddingHorizontal: wp(3),
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: theme.radius.md,
    },
    detailLabel: {
        fontSize: hp(1.4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    detailValue: {
        fontSize: hp(1.4),
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.white,
        flex: 2,
        textAlign: 'right',
    },
    modalActions: {
        flexDirection: 'row',
        padding: wp(4),
        gap: wp(3),
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    modalActionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(2),
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(3),
        borderRadius: theme.radius.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
    },
    modalActionText: {
        fontSize: hp(1.4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.white,
    },
    deleteText: {
        color: theme.colors.error,
    },
});

export default DownloadsScreen;
