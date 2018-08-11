import { SET_PLACES, REMOVE_PLACE, PLACE_ADDED, START_ADD_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';

export const startAddPlace = () => {
    return {
        type: START_ADD_PLACE
    }
}

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        let authToken;
        dispatch(uiStartLoading());
        dispatch(authGetToken())
            .catch(() => {
                alert("No valid token found.");
            })
            .then(token => {
                authToken = token;
                return fetch("https://us-central1-awesome-places-1533493318776.cloudfunctions.net/storeImage", {
                    method: "POST",
                    body: JSON.stringify({
                        image: image.base64
                    }),
                    headers: {
                        "authorization": "Bearer " + authToken
                    }
                });
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong, please try again!");
                dispatch(uiStopLoading());
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw (new Error());
                }
            })
            .then(parsedRes => {
                const placeData = {
                    name: placeName,
                    location: location,
                    image: parsedRes.imageUrl
                }
                return fetch("https://awesome-places-1533493318776.firebaseio.com/places.json?auth=" + authToken, {
                    method: "POST",
                    body: JSON.stringify(placeData)
                })
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw (new Error());
                }
            })
            .then(parsedRes => {
                console.log(parsedRes);
                dispatch(uiStopLoading());
                dispatch(placeAdded());
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong, please try again!");
                dispatch(uiStopLoading());
            });
    }
    return {
        type: ADD_PLACE,
        placeName: placeName,
        location: location,
        image: image
    }
};

export const placeAdded = () => {
    return {
        type: PLACE_ADDED
    }
}

export const getPlaces = () => {
    return dispatch => {
        dispatch(authGetToken())
            .catch(() => {
                alert("No valid token found.");
            })
            .then(token => {
                return fetch("https://awesome-places-1533493318776.firebaseio.com/places.json?auth=" + token)
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw (new Error());
                }
            })
            .then(parsedRes => {
                const places = [];
                for (let key in parsedRes) {
                    places.push({
                        ...parsedRes[key],
                        image: {
                            uri: parsedRes[key].image
                        },
                        key: key
                    });
                }
                dispatch(setPlaces(places))
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong.");
            })
    }
};

export const setPlaces = places => {
    return {
        type: SET_PLACES,
        places: places
    }
}

export const deletePlace = (key) => {
    return dispatch => {
        dispatch(authGetToken())
            .catch(() => {
                alert("No valid token found.");
            })
            .then(token => {
                dispatch(removePlace(key));
                return fetch(`https://awesome-places-1533493318776.firebaseio.com/places/${key}.json?auth=${token}`, {
                    method: "DELETE"
                })
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw (new Error());
                }
            })
            .then(parsedRes => {
                console.log(parsedRes);
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong.");
            });
    }
}

export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key: key
    }
}