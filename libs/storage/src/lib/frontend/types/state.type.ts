import { frontendStorage } from '../index';

export type State = ReturnType<typeof frontendStorage.getState>;
