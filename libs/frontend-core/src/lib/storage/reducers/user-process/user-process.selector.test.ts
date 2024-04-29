import { NameSpace } from '@2299899-fit-friends/types';

import { makeFakeState } from '../../../test-mocks/test-mocks';
import { selectIsUserLoading, selectUser } from './user-process.selector';

describe('UserProcess selectors', () => {
  const state = makeFakeState();

  test('should return "user" from state', () => {
    const expected = state[NameSpace.User].user;

    const result = selectUser(state);

    expect(result).toBe(expected);
  });

  test('should return "isLoading" from state', () => {
    const expected = state[NameSpace.User].isLoading;

    const result = selectIsUserLoading(state);

    expect(result).toBe(expected);
  });
});
