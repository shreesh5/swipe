import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View, PanResponder, Animated } from 'react-native'


const Deck = ({ data, renderCard }) => {
    
    const position = useRef(new Animated.ValueXY()).current

    const panResponder = PanResponder.create({

    // executed any time a user presses down on the screen
    // if we return true, then this panResponder should be
    // responsible for handling that gesture
    onStartShouldSetPanResponder: () => true,
    // a true callback. It is called anytime the user
    // starts to drag their finger around the screen
    onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy })
    },
    // It is called anytime a user lets go of the screen
    // after moving something on the screen
    onPanResponderRelease: () => {}
    })

    const [pResonder, setPResponder] = useState(panResponder)
    
    const getCardStyle = () => {
        return {
            ...position.getLayout(),
            transform: [{ rotate: '-45deg' }]
        }
    }

    const renderCards = () => {
        return data.map((item, index) => {
            
            if (index === 4) {
                return (
                    <Animated.View
                        key={item.id}
                        {...pResonder.panHandlers}
                        style={getCardStyle()}
                    >
                        {renderCard(item)}
                    </Animated.View>
                )
            }
            
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
