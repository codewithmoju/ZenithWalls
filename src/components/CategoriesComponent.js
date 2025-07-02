import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native'
import React from 'react'
import { Data } from '../constants/Data'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/themes'
import Animated, { FadeInRight } from 'react-native-reanimated'


const CategoriesComponent = ({activeCategory,handleActiveCategory}) => {
    return (
        <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.FlatListContainer}
            data={Data.Categories}
            keyExtractor={item => item}
            renderItem={({ item, index }) => (
                <CategoriesItems
                isActive={activeCategory==item}
                handleActiveCategory={handleActiveCategory}
                    title={item}
                    index={index}
                />
            )}
        />
    )
}

export default CategoriesComponent

const CategoriesItems = ({ title, index,isActive,handleActiveCategory }) => {
let color=isActive?theme.colors.white:theme.colors.black;
let backgroundColor=isActive?theme.colors.black:theme.colors.white;


    return (
        <Animated.View entering={FadeInRight.delay(index*200).duration(1000).springify().damping(14)}>
            <Pressable
            onPress={()=>handleActiveCategory(isActive?null:title)}
            style={[styles.Categories,{backgroundColor}]}>
                <Text style={[styles.title,{color}]}>
                    {title}
                </Text>
            </Pressable>

        </Animated.View>
    )
}

const styles = StyleSheet.create({
    FlatListContainer:{
        paddingHorizontal:wp(4),
        gap:8
    },
    Categories:{
        padding:10,
        paddingHorizontal:15,
        borderRadius:theme.radius.lg,
        borderCurve:'continuous',
        borderWidth:1,
        borderColor:theme.colors.grayBG,
        backgroundColor:theme.colors.white
    },
    title:{
        fontSize:hp(1.9),
        color:theme.colors.black,
        fontWeight:theme.fontWeights.medium
    }
})