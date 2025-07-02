import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { captilization, hp } from '../helpers/common'
import { theme } from '../constants/themes'

const SectionView = ({ title, content }) => {
    return (
        <View style={styles.SectionContainer}>
            <Text style={styles.SectionTitle}>{title}</Text>
            <View>
                {content}
            </View>
        </View>
    )
}

export default SectionView

export const CommonFilterRow = ({ data, filterName, filters, setFilters }) => {

    const onSelect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexBoxWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item;
                    let backgroundColor = isActive ? theme.colors.black : theme.colors.white;
                    let color = isActive ? theme.colors.white : theme.colors.black;


                    return (
                        <Pressable
                            onPress={() => onSelect(item)}
                            key={item}
                            style={[styles.ButtonOutLine, { backgroundColor }]}
                        >
                            <Text style={[styles.OutlinedButtonText, { color }]}>
                                {captilization(item)}
                            </Text>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}
export const ColorFilters = ({ data, filterName, filters, setFilters }) => {

    const onSelect = (item) => {
        setFilters({ ...filters, [filterName]: item })
    }

    return (
        <View style={styles.flexBoxWrap}>
            {
                data && data.map((item, index) => {
                    let isActive = filters && filters[filterName] == item;
                    let borderColor = isActive ? theme.colors.black : theme.colors.white;


                    return (
                        <Pressable
                            onPress={() => onSelect(item)}
                            key={item}
                        >
                            <View style={[styles.colorWrapper, { borderColor }]}>
                                <View style={[styles.color, { backgroundColor: item }]}></View>
                            </View>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}



const styles = StyleSheet.create({
    SectionContainer: {
        gap: 8
    },
    SectionTitle: {
        fontSize: hp(2.4),
        fontWeight: theme.fontWeights.semibold,
        color: theme.colors.black,
    },
    flexBoxWrap: {
        gap: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    ButtonOutLine: {
        padding: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: theme.colors.black,
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous'
    },
    color: {
        height: 40,
        width: 40,
        borderRadius: 20,
        borderCurve: 'continuous'
    },
    colorWrapper: {
        padding: 3,
        borderRadius: 20,
        borderWidth: 2,
        borderCurve: 'continuous'
    },OutlinedButtonText:{
        fontSize: hp(1.8),
      fontWeight:theme.fontWeights.bold
    }
})