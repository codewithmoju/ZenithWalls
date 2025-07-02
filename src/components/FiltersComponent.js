// Import necessary components and libraries
import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useMemo } from 'react'
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { BlurView } from "@react-native-community/blur";
import Animated, { Extrapolation, FadeInDown, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { captilization, hp } from '../helpers/common';
import { theme } from '../constants/themes';
import SectionView, { ColorFilters, CommonFilterRow } from './SectionView';
import { Data } from '../constants/Data';



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
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.Content}>
                    <Text style={styles.title}>
                        Filters
                    </Text>
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
                            <Text style={[styles.ButtonText, { color: theme.colors.black }]}>
                                Reset
                            </Text>
                        </Pressable>
                        <Pressable style={styles.applyButton} onPress={onApply}>
                            <Text style={[styles.ButtonText, { color: theme.colors.white }]}>
                                Apply 
                            </Text>
                        </Pressable>
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

    // Create an animated style for the backdrop
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

    // Combine styles for the container
    const containerStyle = useMemo(() => [
        style,
        StyleSheet.absoluteFillObject,
        animatedStyle,

    ], [style, animatedStyle]);

    // Return the backdrop view with blur effect
    return (
        <Animated.View style={containerStyle}>
            <BlurView
                blurType='light' // Use a light blur type for better background visibility
                style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                blurAmount={3} // Adjust blur amount as needed
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
    },
    overLay: {
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    Content: {

        //width: '100%',
        gap: 15,
        paddingHorizontal: 10,
        paddingVertical: 20
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.black,
        marginBottom: 5
    },
    Buttons:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        gap:10
    },
    applyButton:{
        flex:1,
        backgroundColor:theme.colors.black,
        padding:12,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:theme.radius.lg,
        borderCurve:'continuous'
    },
    resetButton:{
        flex:1,
        backgroundColor:theme.colors.neutral(0.83),
        padding:12,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:theme.radius.lg,
        borderCurve:'continuous',
        borderWidth:2,
        borderColor:theme.colors.grayBG
    },
    ButtonText:{
        fontSize:hp(2.2),
        fontWeight:theme.fontWeights.bold
    }
});
