import { makeFakeUser } from '../../../test-mocks/test-mocks';
import { UserProcess } from '../../types/user-process.type';
import { setUser, userProcess } from './user-process.slice';

describe('UserProcess slice', () => {
  const initialState: UserProcess = {
    user: null,
    isLoading: false,
  };

  test('should return initial state with empty action', () => {
    const emptyAction = { type: '' };

    const result = userProcess.reducer(initialState, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('should return default initial state with empty action und undefined initial state argument', () => {
    const emptyAction = { type: '' };

    const result = userProcess.reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('should set "user" to user in state', () => {
    const expected = makeFakeUser();

    const result = userProcess.reducer(undefined, setUser(expected));

    expect(result.user).toEqual(expected);
  });

  test('should set "user" to null in state', () => {
    const expected = null;

    const result = userProcess.reducer(undefined, setUser(expected));

    expect(result.user).toBeNull();
  });
});
