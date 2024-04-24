import { makeFakeBalance, makeFakeReview, makeFakeTraining } from '../../../test-mocks/test-mocks';
import { TrainingProcess } from '../../types/training-process.type';
import { setBalance, setReviews, setTraining, trainingProcess } from './training-process.slice';

describe('TrainingProcess slice', () => {
  const initialState: TrainingProcess = {
    training: null,
    reviews: [],
    balance: null,
    isLoading: false,
  };

  test('should return initial state with empty action', () => {
    const emptyAction = { type: '' };

    const result = trainingProcess.reducer(initialState, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('should return default initial state with empty action und undefined initial state argument', () => {
    const emptyAction = { type: '' };

    const result = trainingProcess.reducer(undefined, emptyAction);

    expect(result).toEqual(initialState);
  });

  test('should set "training" to training in state', () => {
    const expected = makeFakeTraining();

    const result = trainingProcess.reducer(undefined, setTraining(expected));

    expect(result.training).toEqual(expected);
  });

  test('should set "training" to null in state', () => {
    const expected = null;

    const result = trainingProcess.reducer(undefined, setTraining(expected));

    expect(result.training).toBeNull();
  });

  test('should set "reviews" to objects array in state', () => {
    const expected = [makeFakeReview(), makeFakeReview()];

    const result = trainingProcess.reducer(undefined, setReviews(expected));

    expect(result.reviews).toEqual(expected);
  });

  test('should set "balance" to object in state', () => {
    const expected = makeFakeBalance();

    const result = trainingProcess.reducer(undefined, setBalance(expected));

    expect(result.balance).toEqual(expected);
  });

  test('should set "balance" to null in state', () => {
    const expected = null;

    const result = trainingProcess.reducer(undefined, setBalance(expected));

    expect(result.balance).toBeNull();
  });
});
