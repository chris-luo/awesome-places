import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import placesReducer from './reducers/places';
import uiReducer from './reducers/ui';
import authReducer from './reducers/auth';

const rootReducer = combineReducers({
    places: placesReducer,
    ui: uiReducer,
    auth: authReducer
});

let componseEnhancers = compose;

const configureStore = () => {
    return createStore(rootReducer, componseEnhancers(applyMiddleware(thunk)));
}

export default configureStore;