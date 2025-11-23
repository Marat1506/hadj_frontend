import {combineReducers} from 'redux';
import storage from 'redux-persist/lib/storage';

import UserReducer from './slices/authSlice.ts';

const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
    whitelist: [] // можно оставить пустым, если вообще не хочешь сохранять ничего
};

const reducer = combineReducers({
    user: UserReducer, // <-- без persistReducer
});

export {rootPersistConfig, reducer};
