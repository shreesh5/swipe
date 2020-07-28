import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View, PanResponder, Animated, Dimensions } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250

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
    onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
            forceSwipe('right')
        } else if (gesture.dx < - SWIPE_THRESHOLD) {
            forceSwipe('left')
        } else {
            resetPosition()
        }
    }
    })

    const [pResonder, setPResponder] = useState(panResponder)

    const forceSwipe = (direction) => {
        
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
        
        Animated.timing(position, {
            toValue: { x , y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start()
    }
    
    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 }
        }).start()
    }


    const getCardStyle = () => {
        
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        })
        
        return {
            ...position.getLayout(),
            transform: [{ rotate }]
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
