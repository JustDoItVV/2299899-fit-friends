import { randomArrayElement } from '@2299899-fit-friends/helpers';
import { AuthStatus } from '@2299899-fit-friends/types';

import { makeFakeResponseError, makeFakeUser } from '../../../test-mocks/test-mocks';
import { AppProcess } from '../../types/app-process.type';
import { appProcess, setAuthStatus, setCurrentUser, setResponseError } from './app-process.slice';

describe('AppProcess slice', () => {
  const initialState: AppProcess = {
    authStatus: AuthStatus.Unknown,
    currentUser: null,
    responseError: null,
  };

  test('should return initial state with empty action', () => {
    const emptyAction = { type: '' };

    const result = appProcess.reducer(initialState, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('should return default initial state with empty action und undefined initial state argument', () => {
    const emptyAction = { type: '' };

    const result = appProcess.reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('should set "authStatus" in state', () => {
    const expected = randomArrayElement(Object.values(AuthStatus));

    const result = appProcess.reducer(undefined, setAuthStatus(expected));

    expect(result.authStatus).toBe(expected);
  });

  test('should set "currentUser" to user in state', () => {
    const expected = makeFakeUser();

    const result = appProcess.reducer(undefined, setCurrentUser(expected));

    expect(result.currentUser).toEqual(expected);
  });

  test('should set "currentUser" to null in state', () => {
    const expected = null;

    const result = appProcess.reducer(undefined, setCurrentUser(expected));

    expect(result.currentUser).toBeNull();
  });

  test('should set "responseError" to object in state', () => {
    const expected = makeFakeResponseError();

    const result = appProcess.reducer(undefined, setResponseError(expected));

    expect(result.responseError).toEqual(expected);
  });

  test('should set "responseError" to null in state', () => {
    const expected = null;

    const result = appProcess.reducer(undefined, setResponseError(expected));

    expect(result.responseError).toBeNull();
  });
});
