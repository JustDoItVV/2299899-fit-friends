import MockAdapter from 'axios-mock-adapter';
import { randomUUID } from 'crypto';
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
    makeFakeAuthData, makeFakeResponseError, makeFakeState, makeFakeUser
} from '../../test-mocks/test-mocks';
import { redirectToRoute } from '../actions/redirect-to-route';
import { setAuthStatus, setResponseError } from '../reducers/app-process/app-process.slice';
import { State } from '../types/state.type';
import {
    checkAuth, fetchUser, fetchUserAvatar, fetchUsersCatalog, loginUser, registerUser, updateUser
} from './users-actions';

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

  describe('checkAuth', () => {
    const mockId = randomUUID();

    test('should dispatch "checkAuth.pending", "checkAuth.fulfilled" with server response 201', async () => {
      mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Check}`).reply(201, { id: mockId });
      mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockId}`).reply(200, makeFakeUser());

      await store.dispatch(checkAuth());
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        checkAuth.pending.type,
        checkAuth.fulfilled.type,
      ]);
    });

    test('should dispatch "checkAuth.pending", "checkAuth.rejected" with server response 401', async () => {
      mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Check}`).reply(401);

      await store.dispatch(checkAuth());
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        checkAuth.pending.type,
        checkAuth.rejected.type,
      ]);
    });
  });

  describe('loginUser', () => {
    const mockAuthData = makeFakeAuthData();

    test('should dispatch "loginUser.pending", "APP/setResponseError", "frontend/redirectToRoute", "loginUser.fulfilled" with server response 201', async () => {
      const user1 = makeFakeUser();
      const mockData = { ...user1, birthdate: user1.birthdate.toDateString() };
      mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Login}`).reply(201, mockData);

      await store.dispatch(loginUser(mockAuthData));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof loginUser.fulfilled>;
      const loginUserFulfilled = emittedActions.at(3) as ReturnType<typeof loginUser.fulfilled>;

      expect(actionsTypes).toEqual([
        loginUser.pending.type,
        setResponseError.type,
        redirectToRoute.type,
        loginUser.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toBeNull();
      expect(loginUserFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "loginUser.pending", "APP/setResponseError", "loginUser.fulfilled" with server response 400', async () => {
      const mockResponseError = makeFakeResponseError();
      mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Login}`).reply(400, mockResponseError);

      await store.dispatch(loginUser(mockAuthData));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof loginUser.rejected>;

      expect(actionsTypes).toEqual([
        loginUser.pending.type,
        setResponseError.type,
        loginUser.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toEqual(mockResponseError);
    });
  });

  describe('registerUser', () => {
    const user1 = makeFakeUser();
    const mockData = { ...user1, birthdate: user1.birthdate.toDateString(), ...makeFakeAuthData() };
    const formData = new FormData();
    for (const key in mockData) {
      formData.append(key, mockData[key]);
    }

    test('should dispatch "registerUser.pending", "APP/setAuthStatus", "APP/setResponseError", "frontend/redirectToRoute", "registerUser.fulfilled" with server response 201', async () => {
      mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Register}`).reply(201, mockData);
      mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Login}`).reply(201, mockData);

      await store.dispatch(registerUser(formData));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(2) as ReturnType<typeof registerUser.fulfilled>;
      const loginUserFulfilled = emittedActions.at(4) as ReturnType<typeof registerUser.fulfilled>;

      expect(actionsTypes).toEqual([
        registerUser.pending.type,
        setAuthStatus.type,
        setResponseError.type,
        redirectToRoute.type,
        registerUser.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toBeNull();
      expect(loginUserFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "registerUser.pending", "APP/setResponseError", "registerUser.fulfilled" with server response 400', async () => {
      const mockResponseError = makeFakeResponseError();
      mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Register}`).reply(400, mockResponseError);

      await store.dispatch(registerUser(formData));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof registerUser.rejected>;

      expect(actionsTypes).toEqual([
        registerUser.pending.type,
        setResponseError.type,
        registerUser.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toEqual(mockResponseError);
    });
  });

  describe('fetchUser', () => {
    test('should dispatch "fetchRequests.pending", "fetchRequests.fulfilled" with server response 200', async () => {
      const user1 = makeFakeUser();
      const mockData = { ...user1, birthdate: user1.birthdate.toDateString() };
      mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockId}`).reply(200, mockData);

      await store.dispatch(fetchUser(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchUserFulfilled = emittedActions.at(1) as ReturnType<typeof fetchUser.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchUser.pending.type,
        fetchUser.fulfilled.type,
      ]);
      expect(fetchUserFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchUser.pending", "fetchUser.rejected" with server response 401', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockId}`).reply(401);

      await store.dispatch(fetchUser(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchUser.pending.type,
        fetchUser.rejected.type,
      ]);
    });
  });

  describe('updateUser', () => {
    const user1 = makeFakeUser();
    const mockData = { ...user1, birthdate: user1.birthdate.toDateString(), ...makeFakeAuthData() };
    const formData = new FormData();
    for (const key in mockData) {
      formData.append(key, mockData[key]);
    }

    test('should dispatch "updateUser.pending", "APP/setResponseError", "updateUser.fulfilled" with server response 200', async () => {
      mockAxiosAdapter.onPatch(`${ApiRoute.User}/${mockId}`).reply(200, mockData);

      await store.dispatch(updateUser({ id: mockId, data: formData }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof updateUser.fulfilled>;
      const updateUserFulfilled = emittedActions.at(2) as ReturnType<typeof updateUser.fulfilled>;

      expect(actionsTypes).toEqual([
        updateUser.pending.type,
        setResponseError.type,
        updateUser.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toBeNull();
      expect(updateUserFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "updateUser.pending", "APP/setResponseError", "updateUser.fulfilled" with server response 401', async () => {
      const mockResponseError = makeFakeResponseError();
      mockAxiosAdapter.onPatch(`${ApiRoute.User}/${mockId}`).reply(401, mockResponseError);

      await store.dispatch(updateUser({ id: mockId, data: formData }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof updateUser.rejected>;

      expect(actionsTypes).toEqual([
        updateUser.pending.type,
        setResponseError.type,
        updateUser.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toEqual(mockResponseError);
    });
  });

  describe('fetchUserAvatar', () => {
    test('should dispatch "fetchUserAvatar.pending", "fetchUserAvatar.fulfilled" with server response 200', async () => {
      const mockData = faker.image.dataUri();
      mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockId}${ApiRoute.Avatar}`).reply(200, mockData);

      await store.dispatch(fetchUserAvatar({ id: mockId }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchUserAvatarFulfilled = emittedActions.at(1) as ReturnType<typeof fetchUserAvatar.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchUserAvatar.pending.type,
        fetchUserAvatar.fulfilled.type,
      ]);
      expect(fetchUserAvatarFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchUserAvatar.pending", "fetchUserAvatar.rejected" with server response 404', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockId}${ApiRoute.Avatar}`).reply(404);

      await store.dispatch(fetchUserAvatar({ id: mockId }));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchUserAvatar.pending.type,
        fetchUserAvatar.rejected.type,
      ]);
    });
  });

  describe('fetchUsersCatalog', () => {
    test('should dispatch "fetchUsersCatalog.pending", "fetchUsersCatalog.fulfilled" with server response 200', async () => {
      const user1 = makeFakeUser();
      const user2 = makeFakeUser();
      const mockData = {
        entitites: [{ ...user1, birthdate: user1.birthdate.toDateString() }, { ...user2, birthdate: user2.birthdate.toDateString() }],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onGet(`${ApiRoute.User}?${stringify({})}`).reply(200, mockData);

      await store.dispatch(fetchUsersCatalog({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchUsersCatalogFulfilled = emittedActions.at(1) as ReturnType<typeof fetchUsersCatalog.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchUsersCatalog.pending.type,
        fetchUsersCatalog.fulfilled.type,
      ]);
      expect(fetchUsersCatalogFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchUsersCatalog.pending", "fetchUsersCatalog.rejected" with server response 400', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.User}?${stringify({})}`).reply(400);

      await store.dispatch(fetchUsersCatalog({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchUsersCatalog.pending.type,
        fetchUsersCatalog.rejected.type,
      ]);
    });
  });
});

