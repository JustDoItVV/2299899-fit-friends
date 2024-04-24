import { NameSpace } from '@2299899-fit-friends/types';

import { makeFakeState } from '../../../test-mocks/test-mocks';
import { selectAuthStatus, selectCurrentUser, selectResponseError } from './app-process.selector';

describe('AppProcess selectors', () => {
  const state = makeFakeState();

  test('should return "authStatus" from state', () => {
    const expected = state[NameSpace.App].authStatus;

    const result = selectAuthStatus(state);

    expect(result).toBe(expected);
  });

  test('should return "currentUser" from state', () => {
    const expected = state[NameSpace.App].currentUser;

    const result = selectCurrentUser(state);

    expect(result).toBe(expected);
  });

  test('should return "responseError" from state', () => {
    const expected = state[NameSpace.App].responseError;

    const result = selectResponseError(state);

    expect(result).toBe(expected);
  });
});
