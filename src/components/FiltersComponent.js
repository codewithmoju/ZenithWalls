// Import necessary components and libraries
import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BlurView } from "expo-blur";
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { captilization, hp, wp } from '../helpers/common';
import { theme } from '../constants/themes';
import SectionView, { ColorFilters, CommonFilterRow } from './SectionView';
import { Data } from '../constants/Data';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Define the FiltersComponent functional component
const FiltersComponent = ({ Modalref, onClose, onApply, onReset, filters, setFilters }) => {
    const snapPoints = useMemo(() => ['75%'], []);
    return (
        <BottomSheetModal
            ref={Modalref}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={CustomBackDrop}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.Content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            Filters
                        </Text>
                        <MaterialIcons name="tune" size={24} color={theme.colors.text} />
                    </View>
                    {
                        Object.keys(Sections).map((sectionName, index) => {
                            let sectionView = Sections[sectionName];
                            let title = captilization(sectionName)
                            let sectionData = Data.filters[sectionName]
                            return (
                                <Animated.View key={sectionName}
                                    entering={FadeInDown.delay((index*100)+100).springify().damping(11)}
                                >
                                    <SectionView
                                        title={title}
                                        content={sectionView({
                                            data: sectionData,
                                            filters,
                                            setFilters,
                                            filterName: sectionName,
                                        })}
                                    />
                                </Animated.View>
                            )
                        })
                    }

                    {/* Actions */}
                    <Animated.View style={styles.Buttons}
                        entering={FadeInDown.delay(500).springify().damping(11)}
                    >
                        <Pressable style={styles.resetButton} onPress={onReset}>
                            <Text style={[styles.ButtonText, { color: theme.colors.text }]}>
                                Reset All
                            </Text>
                        </Pressable>
                        <LinearGradient
                            colors={theme.colors.gradientRoyal}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.applyButtonGradient}
                        >
                            <Pressable style={styles.applyButton} onPress={onApply}>
                                <Text style={[styles.ButtonText, { color: theme.colors.white }]}>
                                    Apply Filters
                                </Text>
                            </Pressable>
                        </LinearGradient>
                    </Animated.View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    )
}

// Export the FiltersComponent component as the default export
export default FiltersComponent

// Define the CustomBackDrop functional component
const CustomBackDrop = ({ animatedIndex, style }) => {
    const animatedStyle = useAnimatedStyle(() => {
        let opacity = interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 1],
            Extrapolation.CLAMP
        );
        return {
            opacity
        };
    });

    const containerStyle = useMemo(() => [
        style,
        StyleSheet.absoluteFillObject,
        animatedStyle,
    ], [style, animatedStyle]);

    return (
        <Animated.View style={containerStyle}>
            <BlurView
                blurType='light'
                style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                blurAmount={3}
            />
        </Animated.View>
    );
}

const Sections = {
    "order": (props) => <CommonFilterRow {...props} />,
    "orientation": (props) => <CommonFilterRow {...props} />,
    "type": (props) => <CommonFilterRow {...props} />,
    "colors": (props) => <ColorFilters {...props} />,
}

// Define the styles used in the components
const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    handleIndicator: {
        backgroundColor: theme.colors.primary,
        width: wp(15),
    },
    overLay: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    Content: {
        width: '100%',
        gap: 20,
        paddingHorizontal: wp(5),
        paddingVertical: hp(2)
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(1)
    },
    title: {
        fontSize: hp(3.5),
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.text,
    },
    Buttons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(3),
        marginTop: hp(2),
        paddingBottom: hp(2)
    },
    applyButtonGradient: {
        flex: 1,
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
    },
    applyButton: {
        padding: hp(1.8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    resetButton: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        padding: hp(1.8),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radius.lg,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    ButtonText: {
        fontSize: hp(2),
        fontWeight: theme.fontWeights.bold,
        letterSpacing: 0.5
    }
});
