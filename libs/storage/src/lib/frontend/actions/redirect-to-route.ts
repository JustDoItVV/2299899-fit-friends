import { FrontendRoute } from '@2299899-fit-friends/types';
import { createAction } from '@reduxjs/toolkit';

export const redirectToRoute = createAction<FrontendRoute>('frontend/redirectToRoute');
