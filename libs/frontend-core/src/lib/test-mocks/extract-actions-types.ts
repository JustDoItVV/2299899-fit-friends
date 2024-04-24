import { Action } from '@reduxjs/toolkit';

export const extractActionsTypes = (actions: Action<string>[]) => actions.map(({ type }) => type);
