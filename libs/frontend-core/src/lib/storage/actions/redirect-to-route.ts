import { createAction } from '@reduxjs/toolkit';

export const redirectToRoute = createAction<string>(
  'frontend/redirectToRoute'
);
