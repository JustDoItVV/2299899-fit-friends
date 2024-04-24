import MockAdapter from 'axios-mock-adapter';
import { stringify } from 'qs';
import { withExtraArgument } from 'redux-thunk';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';

import { createApiService } from '../../services/api';
import { AppThunkDispatch } from '../../test-mocks/app-thunk-dispatch.type';
import { extractActionsTypes } from '../../test-mocks/extract-actions-types';
import { makeFakeState, makeFakeTraining } from '../../test-mocks/test-mocks';
import { State } from '../types/state.type';
import { fetchTrainingsCatalog } from './trainings-catalog-actions';

describe('Api trainings catalog actions', () => {
  const axios = createApiService();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator(makeFakeState());
  });

  describe('fetchTrainingsCatalog', () => {
    test('should dispatch "fetchTrainingsCatalog.pending", "fetchTrainingsCatalog.fulfilled" with server response 200', async () => {
      const mockData = {
        entitites: [makeFakeTraining(), makeFakeTraining()],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onGet(`${ApiRoute.Training}?${stringify({})}`).reply(200, mockData);

      await store.dispatch(fetchTrainingsCatalog({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchTrainingsCatalogFulfilled = emittedActions.at(1) as ReturnType<typeof fetchTrainingsCatalog.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchTrainingsCatalog.pending.type,
        fetchTrainingsCatalog.fulfilled.type,
      ]);
      expect(fetchTrainingsCatalogFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchTrainingsCatalog.pending", "fetchTrainingsCatalog.rejected" with server response 400', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.Training}?${stringify({})}`).reply(400);

      await store.dispatch(fetchTrainingsCatalog({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchTrainingsCatalog.pending.type,
        fetchTrainingsCatalog.rejected.type,
      ]);
    });
  });
});
