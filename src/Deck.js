import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


const Deck = ({ data, renderCard }) => {
    
    const renderCards = () => {
        return data.map(item => {
            return renderCard(item)
        })
    }
    
    return (
        <View>
            {renderCards()}
        </View>
    )
}

export default Deck

const styles = StyleSheet.create({})
