import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import placesReducer from './reducers/places';

const rootReducer = combineReducers({
    places: placesReducer
});

let componseEnhancers = compose;

const configureStore = () => {
    return createStore(rootReducer, componseEnhancers(applyMiddleware(thunk)));
}

export default configureStore;