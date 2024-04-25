import MockAdapter from 'axios-mock-adapter';
import { randomUUID } from 'crypto';
import { stringify } from 'qs';
import { withExtraArgument } from 'redux-thunk';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';

import { createApiService } from '../../services/api';
import { AppThunkDispatch } from '../../test-mocks/app-thunk-dispatch.type';
import { extractActionsTypes } from '../../test-mocks/extract-actions-types';
import { makeFakeRequest, makeFakeState } from '../../test-mocks/test-mocks';
import { State } from '../types/state.type';
import { createRequest, fetchRequests, updateRequest } from './training-requests-actions';

describe('Api account user actions', () => {
  const axios = createApiService();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;
  let mockId: string;

  beforeEach(() => {
    mockId = randomUUID();
    const state = makeFakeState();
    state.APP.currentUser.id = mockId;
    store = mockStoreCreator(makeFakeState());
  });
  describe('createRequest', () => {
    const mockId = randomUUID();

    test('should dispatch "createRequest.pending", "createRequest.fulfilled" with server response 201', async () => {
      mockAxiosAdapter.onPost(ApiRoute.TrainingRequest).reply(201);

      await store.dispatch(createRequest(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        createRequest.pending.type,
        createRequest.fulfilled.type,
      ]);
    });

    test('should dispatch "createRequest.pending", "createRequest.rejected" with server response 400', async () => {
      mockAxiosAdapter.onPost(ApiRoute.TrainingRequest).reply(400);

      await store.dispatch(createRequest(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        createRequest.pending.type,
        createRequest.rejected.type,
      ]);
    });
  });

  describe('fetchRequests', () => {
    test('should dispatch "fetchRequests.pending", "fetchRequests.fulfilled" with server response 200', async () => {
      const mockData = {
        entitites: [makeFakeRequest(), makeFakeRequest()],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onGet(`${ApiRoute.TrainingRequest}?${stringify({})}`).reply(200, mockData);

      await store.dispatch(fetchRequests({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchRequestsFulfilled = emittedActions.at(1) as ReturnType<typeof fetchRequests.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchRequests.pending.type,
        fetchRequests.fulfilled.type,
      ]);
      expect(fetchRequestsFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchRequests.pending", "fetchRequests.rejected" with server response 400', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.TrainingRequest}?${stringify({})}`).reply(400);

      await store.dispatch(fetchRequests({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchRequests.pending.type,
        fetchRequests.rejected.type,
      ]);
    });
  });

  describe('updateRequest', () => {
    const mockId = randomUUID();
    const mockData = makeFakeRequest();

    test('should dispatch "updateRequest.pending", "updateRequest.fulfilled" with server response 200', async () => {
      mockAxiosAdapter.onPatch(`${ApiRoute.TrainingRequest}/${mockId}`).reply(200);

      await store.dispatch(updateRequest({ id: mockId, status: mockData.status }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        updateRequest.pending.type,
        updateRequest.fulfilled.type,
      ]);
    });

    test('should dispatch "updateRequest.pending", "updateRequest.rejected" with server response 400', async () => {
      mockAxiosAdapter.onPatch(`${ApiRoute.TrainingRequest}/${mockId}`).reply(400);

      await store.dispatch(updateRequest({ id: mockId, status: mockData.status }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        updateRequest.pending.type,
        updateRequest.rejected.type,
      ]);
    });
  });

});

