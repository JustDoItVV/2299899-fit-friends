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
import {
    makeFakeBalance, makeFakeResponseError, makeFakeState, makeFakeUser
} from '../../test-mocks/test-mocks';
import { setResponseError } from '../reducers/app-process/app-process.slice';
import { setUser } from '../reducers/user-process/user-process.slice';
import { State } from '../types/state.type';
import {
    addFriend, deleteFriend, fetchBalanceCatalog, fetchUserFriends, sendNewTrainingsMail,
    subscribeToTrainer, unsubscribeFromTrainer, updateBalance
} from './account-user-actions';

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
  describe('updateBalance', () => {
    const mockData = makeFakeBalance();

    test('should dispatch "updateBalance.pending", "updateBalance.fulfilled" with server response 200', async () => {
      mockAxiosAdapter.onPatch(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}`).reply(200, mockData);

      await store.dispatch(updateBalance(mockData));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const updateBalanceFulfilled = emittedActions.at(1) as ReturnType<typeof updateBalance.fulfilled>;

      expect(actionsTypes).toEqual([
        updateBalance.pending.type,
        updateBalance.fulfilled.type,
      ]);
      expect(updateBalanceFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "updateBalance.pending", "updateBalance.rejected" with server response 400', async () => {
      mockAxiosAdapter.onPatch(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}`).reply(400);

      await store.dispatch(updateBalance(mockData));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        updateBalance.pending.type,
        updateBalance.rejected.type,
      ]);
    });
  });

  describe('fetchBalanceCatalog', () => {
    test('should dispatch "fetchBalanceCatalog.pending", "fetchBalanceCatalog.fulfilled" with server response 200', async () => {
      const mockData = {
        entitites: [makeFakeBalance(), makeFakeBalance()],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}?${stringify({})}`).reply(200, mockData);

      await store.dispatch(fetchBalanceCatalog({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchBalanceCatalogFulfilled = emittedActions.at(1) as ReturnType<typeof fetchBalanceCatalog.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchBalanceCatalog.pending.type,
        fetchBalanceCatalog.fulfilled.type,
      ]);
      expect(fetchBalanceCatalogFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchBalanceCatalog.pending", "fetchBalanceCatalog.rejected" with server response 400', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}?${stringify({})}`).reply(400);

      await store.dispatch(fetchBalanceCatalog({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchBalanceCatalog.pending.type,
        fetchBalanceCatalog.rejected.type,
      ]);
    });
  });

  describe('addFriend', () => {
    test('should dispatch "addFriend.pending", "USER/setUser", "APP/setResponseError", "addFriend.fulfilled" with server response 200', async () => {
      const user1 = makeFakeUser();
      const user2 = makeFakeUser();
      const user3 = makeFakeUser();
      const mockUser = { ...user1, birthdate: user1.birthdate.toDateString() };
      const mockData = {
        entitites: [{ ...user2, birthdate: user2.birthdate.toDateString() }, { ...user3, birthdate: user3.birthdate.toDateString() }],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onPost(`${ApiRoute.User}/${mockId}${ApiRoute.Friend}`).reply(200, mockData);
      mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockId}`).reply(200, mockUser);

      await store.dispatch(addFriend(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setUserFulfilled = emittedActions.at(1) as ReturnType<typeof addFriend.fulfilled>;
      const setResponseFulfilled = emittedActions.at(2) as ReturnType<typeof addFriend.fulfilled>;

      expect(actionsTypes).toEqual([
        addFriend.pending.type,
        setUser().type,
        setResponseError().type,
        addFriend.fulfilled.type,
      ]);
      expect(setUserFulfilled.payload).toEqual(mockUser);
      expect(setResponseFulfilled.payload).toBeNull();
    });

    test('should dispatch "addFriend.pending", "APP/setResponseError", "addFriend.fulfilled" with server response 400', async () => {
      const mockResponseError = makeFakeResponseError();
      mockAxiosAdapter.onPost(`${ApiRoute.User}/${mockId}${ApiRoute.Friend}`).reply(400, mockResponseError);

      await store.dispatch(addFriend(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof addFriend.rejected>;

      expect(actionsTypes).toEqual([
        addFriend.pending.type,
        setResponseError.type,
        addFriend.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toEqual(mockResponseError);
    });
  });

  describe('deleteFriend', () => {
    test('should dispatch "deleteFriend.pending", "USER/setUser", "APP/setResponseError", "deleteFriend.fulfilled" with server response 200', async () => {
      const user1 = makeFakeUser();
      const user2 = makeFakeUser();
      const user3 = makeFakeUser();
      const mockUser = { ...user1, birthdate: user1.birthdate.toDateString() };
      const mockData = {
        entitites: [{ ...user2, birthdate: user2.birthdate.toDateString() }, { ...user3, birthdate: user3.birthdate.toDateString() }],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onDelete(`${ApiRoute.User}/${mockId}${ApiRoute.Friend}`).reply(200, mockData);
      mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockId}`).reply(200, mockUser);

      await store.dispatch(deleteFriend(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setUserFulfilled = emittedActions.at(1) as ReturnType<typeof deleteFriend.fulfilled>;
      const setResponseFulfilled = emittedActions.at(2) as ReturnType<typeof deleteFriend.fulfilled>;

      expect(actionsTypes).toEqual([
        deleteFriend.pending.type,
        setUser.type,
        setResponseError.type,
        deleteFriend.fulfilled.type,
      ]);
      expect(setUserFulfilled.payload).toEqual(mockUser);
      expect(setResponseFulfilled.payload).toBeNull();
    });

    test('should dispatch "deleteFriend.pending", "APP/setResponseError", "deleteFriend.fulfilled" with server response 400', async () => {
      const mockResponseError = makeFakeResponseError();
      mockAxiosAdapter.onDelete(`${ApiRoute.User}/${mockId}${ApiRoute.Friend}`).reply(400, mockResponseError);

      await store.dispatch(deleteFriend(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof deleteFriend.rejected>;

      expect(actionsTypes).toEqual([
        deleteFriend.pending.type,
        setResponseError.type,
        deleteFriend.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toEqual(mockResponseError);
    });
  });

  describe('subscribeToTrainer', () => {
    test('should dispatch "subscribeToTrainer.pending", "subscribeToTrainer.fulfilled" with server response 200', async () => {
      const user1 = makeFakeUser();
      const mockUser = { ...user1, birthdate: user1.birthdate.toDateString() };
      mockAxiosAdapter.onPost(`${ApiRoute.User}/${mockId}${ApiRoute.Subscribe}`).reply(200);
      mockAxiosAdapter.onPost(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.SendNewTrainingsMail}`).reply(200);
      mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockId}`).reply(200, mockUser);

      await store.dispatch(subscribeToTrainer(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        subscribeToTrainer.pending.type,
        subscribeToTrainer.fulfilled.type,
      ]);
    });

    test('should dispatch "subscribeToTrainer.pending", "APP/setResponseError", "subscribeToTrainer.fulfilled" with server response 400', async () => {
      const mockResponseError = makeFakeResponseError();
      mockAxiosAdapter.onPost(`${ApiRoute.User}/${mockId}${ApiRoute.Subscribe}`).reply(400, mockResponseError);

      await store.dispatch(subscribeToTrainer(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof subscribeToTrainer.rejected>;

      expect(actionsTypes).toEqual([
        subscribeToTrainer.pending.type,
        setResponseError.type,
        subscribeToTrainer.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toEqual(mockResponseError);
    });
  });

  describe('unsubscribeFromTrainer', () => {
    test('should dispatch "unsubscribeFromTrainer.pending", "subscribeToTrainer.fulfilled" with server response 200', async () => {
      const user1 = makeFakeUser();
      const mockUser = { ...user1, birthdate: user1.birthdate.toDateString() };
      mockAxiosAdapter.onDelete(`${ApiRoute.User}/${mockId}${ApiRoute.Subscribe}`).reply(200);
      mockAxiosAdapter.onGet(`${ApiRoute.User}/${mockId}`).reply(200, mockUser);

      await store.dispatch(unsubscribeFromTrainer(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        unsubscribeFromTrainer.pending.type,
        unsubscribeFromTrainer.fulfilled.type,
      ]);
    });

    test('should dispatch "unsubscribeFromTrainer.pending", "APP/setResponseError", "unsubscribeFromTrainer.fulfilled" with server response 400', async () => {
      const mockResponseError = makeFakeResponseError();
      mockAxiosAdapter.onDelete(`${ApiRoute.User}/${mockId}${ApiRoute.Subscribe}`).reply(400, mockResponseError);

      await store.dispatch(unsubscribeFromTrainer(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const setResponseFulfilled = emittedActions.at(1) as ReturnType<typeof subscribeToTrainer.rejected>;

      expect(actionsTypes).toEqual([
        unsubscribeFromTrainer.pending.type,
        setResponseError.type,
        unsubscribeFromTrainer.fulfilled.type,
      ]);
      expect(setResponseFulfilled.payload).toEqual(mockResponseError);
    });
  });

  describe('fetchUserFriends', () => {
    test('should dispatch "fetchUserFriends.pending", "fetchUserFriends.fulfilled" with server response 200', async () => {
      const user1 = makeFakeUser();
      const user2 = makeFakeUser();
      const mockData = {
        entitites: [{ ...user1, birthdate: user1.birthdate.toDateString() }, { ...user2, birthdate: user2.birthdate.toDateString() }],
        totalPages: 1,
        totalItems: 2,
        itemsPerPage: 50,
        currentPage: 1,
      };
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Friends}?${stringify({})}`).reply(200, mockData);

      await store.dispatch(fetchUserFriends({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchUserFriendsFulfilled = emittedActions.at(1) as ReturnType<typeof fetchUserFriends.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchUserFriends.pending.type,
        fetchUserFriends.fulfilled.type,
      ]);
      expect(fetchUserFriendsFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchUserFriends.pending", "fetchUserFriends.rejected" with server response 400', async () => {
      mockAxiosAdapter.onGet(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Friends}?${stringify({})}`).reply(400);

      await store.dispatch(fetchUserFriends({}));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchUserFriends.pending.type,
        fetchUserFriends.rejected.type,
      ]);
    });
  });

  describe('sendNewTrainingsMail', () => {
    test('should dispatch "sendNewTrainingsMail.pending", "sendNewTrainingsMail.fulfilled" with server response 200', async () => {
      mockAxiosAdapter.onPost(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.SendNewTrainingsMail}`).reply(200);

      await store.dispatch(sendNewTrainingsMail());
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        sendNewTrainingsMail.pending.type,
        sendNewTrainingsMail.fulfilled.type,
      ]);
    });

    test('should dispatch "sendNewTrainingsMail.pending", "sendNewTrainingsMail.rejected" with server response 401', async () => {
      mockAxiosAdapter.onPost(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.SendNewTrainingsMail}`).reply(401);

      await store.dispatch(sendNewTrainingsMail());
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        sendNewTrainingsMail.pending.type,
        sendNewTrainingsMail.rejected.type,
      ]);
    });
  });
});
