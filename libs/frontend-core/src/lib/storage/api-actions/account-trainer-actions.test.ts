import MockAdapter from 'axios-mock-adapter';
import { randomUUID } from 'node:crypto';
import { stringify } from 'qs';
import { withExtraArgument } from 'redux-thunk';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { faker } from '@faker-js/faker';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';

import { createApiService } from '../../services/api';
import { AppThunkDispatch } from '../../test-mocks/app-thunk-dispatch.type';
import { extractActionsTypes } from '../../test-mocks/extract-actions-types';
import {
    makeFakeOrder, makeFakeResponseError, makeFakeState, makeFakeTraining, makeFakeUser
} from '../../test-mocks/test-mocks';
import { redirectToRoute } from '../actions/redirect-to-route';
import { setResponseError } from '../reducers/app-process/app-process.slice';
import { State } from '../types/state.type';
import {
    createTraining, fetchCertificate, fetchTrainerCatalog, fetchTrainerFriends, fetchTrainerOrders,
    fetchTraining, fetchTrainingBackgroundPicture, fetchTrainingVideo, updateTraining
} from './account-trainer-actions';

describe('Api account trainer actions', () => {
  const axios = createApiService();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    mockAxiosAdapter.resetHistory();
    mockAxiosAdapter.resetHandlers();
    store = mockStoreCreator(makeFakeState());
  });

  describe('createTraining', () => {
    test('should dispatch "createTraining.pending", "APP/setResponseError", "frontend/redirectToRoute", "createTraining.fulfilled" with server response 201', async () => {
      const mockData = makeFakeTraining();
      mockAxiosAdapter.onPost(ApiRoute.Training).reply(201, mockData);

      await store.dispatch(createTraining(new FormData()));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof createTraining.rejected>;
      const createTrainingFulfilled = emittedActions.at(3) as ReturnType<typeof createTraining.fulfilled>;

      expect(actionsTypes).toEqual([
        createTraining.pending.type,
        setResponseError().type,
        redirectToRoute().type,
        createTraining.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toBeNull();
      expect(createTrainingFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "createTraining.pending", "APP/setResponseError", "createTraining.fulfilled" with server response 201', async () => {
      const mockResponseError = makeFakeResponseError();
      mockAxiosAdapter.onPost(ApiRoute.Training).reply(201, mockResponseError);

      await store.dispatch(createTraining(new FormData()));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(3) as ReturnType<typeof createTraining.rejected>;

      expect(actionsTypes).toEqual([
        createTraining.pending.type,
        setResponseError().type,
        redirectToRoute().type,
        createTraining.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toEqual(mockResponseError);
    });
  });

  describe('fetchTrainerCatalog', () => {
    test('should dispatch "fetchTrainerCatalog.pending", "fetchTrainerCatalog.fulfilled" with server response 200', async () => {
      const mockData = {
        entitites: [makeFakeTraining(), makeFakeTraining()],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.Trainer}?${stringify({})}`).reply(200, mockData);

      await store.dispatch(fetchTrainerCatalog({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchTrainerCatalogFulfilled = emittedActions.at(1) as ReturnType<typeof fetchTrainerCatalog.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchTrainerCatalog.pending.type,
        fetchTrainerCatalog.fulfilled.type,
      ]);
      expect(fetchTrainerCatalogFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchTrainerCatalog.pending", "fetchTrainerCatalog.rejected" with server response 400', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.Trainer}?${stringify({})}`).reply(400);

      await store.dispatch(fetchTrainerCatalog({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchTrainerCatalog.pending.type,
        fetchTrainerCatalog.rejected.type,
      ]);
    });
  });

  describe('fetchTrainingBackgroundPicture', () => {
    test('should dispatch "fetchTrainingBackgroundPicture.pending", "fetchTrainingBackgroundPicture.fulfilled" with server response 200', async () => {
      const mockId = randomUUID();
      const mockData = faker.image.dataUri();
      mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockId}${ApiRoute.BackgroundPicture}`).reply(200, mockData);

      await store.dispatch(fetchTrainingBackgroundPicture({ id: mockId }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchTrainingBackgroundPictureFulfilled = emittedActions.at(1) as ReturnType<typeof fetchTrainingBackgroundPicture.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchTrainingBackgroundPicture.pending.type,
        fetchTrainingBackgroundPicture.fulfilled.type,
      ]);
      expect(fetchTrainingBackgroundPictureFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchTrainingBackgroundPicture.pending", "fetchTrainingBackgroundPicture.rejected" with server response 404', async () => {
      const mockId = randomUUID();
      mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockId}${ApiRoute.BackgroundPicture}`).reply(404);

      await store.dispatch(fetchTrainingBackgroundPicture({ id: mockId }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchTrainingBackgroundPicture.pending.type,
        fetchTrainingBackgroundPicture.rejected.type,
      ]);
    });
  });

  describe('fetchTrainingVideo', () => {
    test('should dispatch "fetchTrainingVideo.pending", "fetchTrainingVideo.fulfilled" with server response 200', async () => {
      const mockId = randomUUID();
      const mockData = new Blob();
      global.URL.createObjectURL = jest.fn();
      mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockId}${ApiRoute.Video}`).reply(200, mockData);

      await store.dispatch(fetchTrainingVideo({ id: mockId }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchTrainingVideoFulfilled = emittedActions.at(1) as ReturnType<typeof fetchTrainingVideo.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchTrainingVideo.pending.type,
        fetchTrainingVideo.fulfilled.type,
      ]);
      expect(fetchTrainingVideoFulfilled.payload).toEqual(URL.createObjectURL(mockData));
    });

    test('should dispatch "fetchTrainingVideo.pending", "fetchTrainingVideo.rejected" with server response 404', async () => {
      const mockId = randomUUID();
      mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockId}${ApiRoute.Video}`).reply(404);

      await store.dispatch(fetchTrainingVideo({ id: mockId }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchTrainingVideo.pending.type,
        fetchTrainingVideo.rejected.type,
      ]);
    });
  });

  describe('fetchTrainerFriends', () => {
    test('should dispatch "fetchTrainerFriends.pending", "fetchTrainerFriends.fulfilled" with server response 200', async () => {
      const user1 = makeFakeUser();
      const user2 = makeFakeUser();
      const mockData = {
        entitites: [{ ...user1, birthdate: user1.birthdate.toDateString() }, { ...user2, birthdate: user2.birthdate.toDateString() }],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Friends}?${stringify({})}`).reply(200, mockData);

      await store.dispatch(fetchTrainerFriends({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchTrainerFriendsFulfilled = emittedActions.at(1) as ReturnType<typeof fetchTrainerFriends.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchTrainerFriends.pending.type,
        fetchTrainerFriends.fulfilled.type,
      ]);
      expect(fetchTrainerFriendsFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchTrainerFriends.pending", "fetchTrainerFriends.rejected" with server response 400', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Friends}?${stringify({})}`).reply(400);

      await store.dispatch(fetchTrainerFriends({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchTrainerFriends.pending.type,
        fetchTrainerFriends.rejected.type,
      ]);
    });
  });

  describe('fetchTrainerOrders', () => {
    test('should dispatch "fetchTrainerOrders.pending", "fetchTrainerOrders.fulfilled" with server response 200', async () => {
      const mockData = {
        entitites: [makeFakeOrder(), makeFakeOrder()],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Orders}?${stringify({})}`).reply(200, mockData);

      await store.dispatch(fetchTrainerOrders({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchTrainerOrdersFulfilled = emittedActions.at(1) as ReturnType<typeof fetchTrainerOrders.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchTrainerOrders.pending.type,
        fetchTrainerOrders.fulfilled.type,
      ]);
      expect(fetchTrainerOrdersFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchTrainerOrders.pending", "fetchTrainerOrders.rejected" with server response 400', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Friends}?${stringify({})}`).reply(400);

      await store.dispatch(fetchTrainerOrders({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchTrainerOrders.pending.type,
        fetchTrainerOrders.rejected.type,
      ]);
    });
  });

  describe('fetchCertificate', () => {
    test('should dispatch "fetchCertificate.pending", "fetchCertificate.fulfilled" with server response 200', async () => {
      const mockId = randomUUID();
      const mockPath = faker.system.filePath();
      const mockData = new Blob();
      global.URL.createObjectURL = jest.fn();
      mockAxiosAdapter.onPost(`${ApiRoute.User}/${mockId}${ApiRoute.Certificates}`).reply(200, mockData);

      await store.dispatch(fetchCertificate({ id: mockId, path: mockPath }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchCertificateFulfilled = emittedActions.at(1) as ReturnType<typeof fetchCertificate.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchCertificate.pending.type,
        fetchCertificate.fulfilled.type,
      ]);
      expect(fetchCertificateFulfilled.payload).toEqual(URL.createObjectURL(mockData));
    });

    test('should dispatch "fetchCertificate.pending", "fetchCertificate.rejected" with server response 404', async () => {
      const mockId = randomUUID();
      const mockPath = faker.system.filePath();
      mockAxiosAdapter.onPost(`${ApiRoute.User}/${mockId}${ApiRoute.Certificates}`).reply(404);

      await store.dispatch(fetchCertificate({ id: mockId, path: mockPath }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchCertificate.pending.type,
        fetchCertificate.rejected.type,
      ]);
    });
  });

  describe('fetchTraining', () => {
    test('should dispatch "fetchTraining.pending", "fetchTraining.fulfilled" with server response 200', async () => {
      const mockId = randomUUID();
      const mockData = makeFakeTraining();
      mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockId}`).reply(200, mockData);

      await store.dispatch(fetchTraining(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchTrainingFulfilled = emittedActions.at(1) as ReturnType<typeof fetchTraining.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchTraining.pending.type,
        fetchTraining.fulfilled.type,
      ]);
      expect(fetchTrainingFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchTraining.pending", "fetchTraining.rejected" with server response 404', async () => {
      const mockId = randomUUID();
      mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockId}`).reply(201);

      await store.dispatch(fetchTraining(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchTraining.pending.type,
        fetchTraining.fulfilled.type,
      ]);
    });
  });

  describe('updateTraining', () => {
    test('should dispatch "updateTraining.pending", "APP/setResponseError", "frontend/redirectToRoute", "updateTraining.fulfilled" with server response 200', async () => {
      const mockId = randomUUID();
      const mockData = makeFakeTraining();
      mockAxiosAdapter.onPatch(`${ApiRoute.Training}/${mockId}`).reply(200, mockData);

      await store.dispatch(updateTraining({ id: mockId, data: new FormData() }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof updateTraining.rejected>;
      const updateTrainingFulfilled = emittedActions.at(2) as ReturnType<typeof updateTraining.fulfilled>;

      expect(actionsTypes).toEqual([
        updateTraining.pending.type,
        setResponseError().type,
        updateTraining.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toBeNull();
      expect(updateTrainingFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "updateTraining.pending", "APP/setResponseError", "updateTraining.fulfilled" with server response 400', async () => {
      const mockId = randomUUID();
      const mockResponseError = makeFakeResponseError();
      mockAxiosAdapter.onPatch(`${ApiRoute.Training}/${mockId}`).reply(400, mockResponseError);

      await store.dispatch(updateTraining({ id: mockId, data: new FormData() }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof updateTraining.rejected>;

      expect(actionsTypes).toEqual([
        updateTraining.pending.type,
        setResponseError().type,
        updateTraining.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toEqual(mockResponseError);
    });
  });
});
