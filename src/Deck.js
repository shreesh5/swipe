import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, PanResponder, Animated, Dimensions, UIManager, LayoutAnimation } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250

const Deck = ({ data, renderCard, renderNoMoreCards, onSwipeLeft, onSwipeRight }) => {

    const [index, setIndex] = useState(0)
    const position = useRef(new Animated.ValueXY()).current

    useEffect(() => {
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
        LayoutAnimation.spring()
    })

    useEffect(() => {
        setIndex(0)
    }, [data])
    
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

    const onSwipeComplete = (direction) => {

        const item = data[index]

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item)
        position.setValue({ x: 0, y: 0})
        setIndex(index + 1)
    }

    const forceSwipe = (direction) => {
        
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
        Animated.timing(position, {
            toValue: { x , y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => onSwipeComplete(direction))
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

        if (index >= data.length) {
            return renderNoMoreCards();
        }

        return data.map((item, i) => {
            
            if (i < index) {
                return null
            }

            if (i === index) {
                return (
                    <Animated.View
                        {...panResponder.panHandlers}
                        key={item.id}
                        style={[getCardStyle(), styles.cardStyle, { zIndex: i * -1 }]}
                    >
                        {renderCard(item)}
                    </Animated.View>
                )
            }

            return (
                <Animated.View 
                    key={item.id} 
                    style={[styles.cardStyle, { zIndex: i * -1 }]}
                >
                    {renderCard(item)}
                </Animated.View>
                
            )
        }).reverse()
    }
    
    return (
        <View>
            {renderCards()}
        </View>
    )
}

Deck.defaultProps = {
    onSwipeRight: () => {
        console.log('swiped right')
    },
    onSwipeLeft: () => {
        console.log('swiped left')
    }
}

export default Deck

const styles = StyleSheet.create({
    cardStyle: {
        position: 'absolute',
        width: SCREEN_WIDTH
    }
})
