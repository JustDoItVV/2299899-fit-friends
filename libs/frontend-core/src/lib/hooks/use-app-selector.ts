import { TypedUseSelectorHook, useSelector } from 'react-redux';

import { State } from '../storage/types/state.type';

export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
