import { Action, ThunkDispatch } from '@reduxjs/toolkit';

import { createApiService } from '../services/api';
import { State } from '../storage/types/state.type';

export type AppThunkDispatch = ThunkDispatch<State, ReturnType<typeof createApiService>, Action>;
