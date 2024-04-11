import { useDispatch } from 'react-redux';

import { AppDispatch } from '../storage/types/app-dispatch.type';

export const useAppDispatch = () => useDispatch<AppDispatch>();
