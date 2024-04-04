import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../storage/types/app-dispatch.type';
import { State } from '../storage/types/state.type';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
