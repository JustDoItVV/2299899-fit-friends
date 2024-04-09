import { NameSpace } from '@2299899-fit-friends/types';
import { combineReducers } from '@reduxjs/toolkit';

import { appProcess } from './reducers/app-process/app-process.slice';
import { trainingProcess } from './reducers/training-process/training-process.slice';
import { userProcess } from './reducers/user-process/user-process.slice';

export const rootReducer = combineReducers({
  [NameSpace.App]: appProcess.reducer,
  [NameSpace.User]: userProcess.reducer,
  [NameSpace.Training]: trainingProcess.reducer,
});
