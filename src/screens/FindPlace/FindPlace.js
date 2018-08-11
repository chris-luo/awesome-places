import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { connect } from 'react-redux';

import PlaceList from '../../components/PlaceList/PlaceList';
import { getPlaces } from '../../store/actions';

class FindPlaceScreen extends Component {
    static navigatorStyle = {
        navBarButtonColor: "orange"
    }

    state = {
        placesLoaded: false,
        removeAnim: new Animated.Value(1),
        listAnim: new Animated.Value(0)
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    onNavigatorEvent = event => {
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willAppear") {
                // this.setState({
                //     placesLoaded: false
                // });
                this.props.onLoadPlaces();
            }
        }
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    }

    placesLoadedHandler = () => {
        Animated.timing(this.state.listAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
        }).start()
    }

    placesSearchHandler = () => {
        Animated.timing(this.state.removeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true
        }).start(() => {
            this.setState({
                placesLoaded: true
            });
            this.placesLoadedHandler();
        });
    }

    itemSelectedHandler = key => {
        const selectedPlace = this.props.places.find(place => place.key === key)
        this.props.navigator.push({
            screen: "awesome-places.PlaceDetailScreen",
            title: selectedPlace.name,
            passProps: {
                selectedPlace: selectedPlace
            }
        })
    }

    render() {
        let content = (
            <Animated.View style={{
                opacity: this.state.removeAnim,
                transform: [
                    {
                        scale: this.state.removeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [12, 1]
                        })
                    }
                ]
            }}>
                <TouchableOpacity onPress={this.placesSearchHandler}>
                    <View style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>
                            Find Places
                    </Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );

        if (this.state.placesLoaded) {
            content = (
                <Animated.View style={{
                    opacity: this.state.listAnim
                }}>
                    <PlaceList places={this.props.places} onItemSelected={this.itemSelectedHandler} />
                </Animated.View>
            );
        }
        return (
            <View style={this.state.placesLoaded ? null : styles.buttonContainer}>
                {content}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    searchButton: {
        borderColor: "orange",
        borderWidth: 3,
        borderRadius: 50,
        padding: 20
    },
    searchButtonText: {
        color: "orange",
        fontWeight: "bold",
        fontSize: 26
    }
})

const mapStateToProps = state => ({
    places: state.places.places
});

const mapDispatchToProps = dispatch => ({
    onLoadPlaces: () => dispatch(getPlaces())
})

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);