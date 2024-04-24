import { NameSpace } from '@2299899-fit-friends/types';

import { makeFakeState } from '../../../test-mocks/test-mocks';
import {
    selectBalance, selectReviews, selectTraining, selectTrainingDataIsLoading
} from './training-process.selector';

describe('TrainingProcess selectors', () => {
  const state = makeFakeState();

  test('should return "training" from state', () => {
    const expected = state[NameSpace.Training].training;

    const result = selectTraining(state);

    expect(result).toBe(expected);
  });

  test('should return "reviews" from state', () => {
    const expected = state[NameSpace.Training].reviews;

    const result = selectReviews(state);

    expect(result).toBe(expected);
  });

  test('should return "balance" from state', () => {
    const expected = state[NameSpace.Training].balance;

    const result = selectBalance(state);

    expect(result).toBe(expected);
  });

  test('should return "isLoading" from state', () => {
    const expected = state[NameSpace.Training].isLoading;

    const result = selectTrainingDataIsLoading(state);

    expect(result).toBe(expected);
  });
});
