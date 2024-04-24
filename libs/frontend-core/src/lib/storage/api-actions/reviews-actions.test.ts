import MockAdapter from 'axios-mock-adapter';
import { randomUUID } from 'node:crypto';
import { withExtraArgument } from 'redux-thunk';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';

import { createApiService } from '../../services/api';
import { AppThunkDispatch } from '../../test-mocks/app-thunk-dispatch.type';
import { extractActionsTypes } from '../../test-mocks/extract-actions-types';
import { makeFakeResponseError, makeFakeReview, makeFakeState } from '../../test-mocks/test-mocks';
import { setResponseError } from '../reducers/app-process/app-process.slice';
import { State } from '../types/state.type';
import { createReview, fetchReviews } from './reviews-actions';

describe('Api reviews actions', () => {
  const axios = createApiService();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator(makeFakeState());
  });

  describe('fetchReviews', () => {
    test('should dispatch "fetchReviews.pending", "fetchReviews.fulfilled" with server response 200', async () => {
      const mockId = randomUUID();
      const mockData = [makeFakeReview(), makeFakeReview()];
      mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockId}${ApiRoute.Reviews}`).reply(200, mockData);

      await store.dispatch(fetchReviews(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchReviewsFulfilled = emittedActions.at(1) as ReturnType<typeof fetchReviews.fulfilled>;

      expect(actionsTypes).toEqual([fetchReviews.pending.type, fetchReviews.fulfilled.type]);
      expect(fetchReviewsFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchReviews.pending", "fetchReviews.rejected" with server response 400', async () => {
      const mockId = randomUUID();
      mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockId}${ApiRoute.Reviews}`).reply(400);

      await store.dispatch(fetchReviews(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([fetchReviews.pending.type, fetchReviews.rejected.type]);
    });
  });

  describe('createReviews', () => {
    test('should dispatch "createReview.pending", "APP/setResponseError", "createReview.fulfilled" with server response 201', async () => {
      const mockId = randomUUID();
      const mockData = makeFakeReview();
      mockAxiosAdapter.onPost(`${ApiRoute.Training}/${mockId}${ApiRoute.Reviews}`).reply(201, mockData);

      await store.dispatch(createReview({ id: mockId, data: mockData }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const createReviewsFulfilled = emittedActions.at(2) as ReturnType<typeof createReview.fulfilled>;

      expect(actionsTypes).toEqual([createReview.pending.type, setResponseError().type, createReview.fulfilled.type]);
      expect(createReviewsFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "createReview.pending", "APP/setResponseError", "createReview.fulfilled" with server response 400', async () => {
      const mockId = randomUUID();
      const mockData = makeFakeReview();
      const mockFakeResponseError = makeFakeResponseError();
      mockAxiosAdapter.onPost(`${ApiRoute.Training}/${mockId}${ApiRoute.Reviews}`).reply(400, mockFakeResponseError);

      await store.dispatch(createReview({ id: mockId, data: mockData }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const createReviewsResponseError = emittedActions.at(1) as ReturnType<typeof createReview.rejected>;

      expect(actionsTypes).toEqual([createReview.pending.type, setResponseError().type, createReview.fulfilled.type]);
      expect(createReviewsResponseError.payload).toEqual(mockFakeResponseError);
    });
  });
});
