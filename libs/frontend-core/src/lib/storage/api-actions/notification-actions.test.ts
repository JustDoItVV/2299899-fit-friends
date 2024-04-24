import MockAdapter from 'axios-mock-adapter';
import { randomUUID } from 'node:crypto';
import { withExtraArgument } from 'redux-thunk';

import { ApiRoute } from '@2299899-fit-friends/consts';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';

import { createApiService } from '../../services/api';
import { AppThunkDispatch } from '../../test-mocks/app-thunk-dispatch.type';
import { extractActionsTypes } from '../../test-mocks/extract-actions-types';
import { makeFakeNotification, makeFakeState } from '../../test-mocks/test-mocks';
import { State } from '../types/state.type';
import { deleteNotification, fetchNotifications } from './notification-actions';

describe('Api notification actions', () => {
  const axios = createApiService();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator(makeFakeState());
  });

  describe('fetchNotifications', () => {
    test('should dispatch "fetchNotifications.pending", "fetchNotifications.fulfilled" with server response 200', async () => {
      const mockData = [makeFakeNotification(), makeFakeNotification()];
      mockAxiosAdapter.onGet(ApiRoute.Notification).reply(200, mockData);

      await store.dispatch(fetchNotifications());
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);
      const fetchNotificationsFulfilled = emittedActions.at(1) as ReturnType<typeof fetchNotifications.fulfilled>;

      expect(actionsTypes).toEqual([
        fetchNotifications.pending.type,
        fetchNotifications.fulfilled.type,
      ]);
      expect(fetchNotificationsFulfilled.payload).toEqual(mockData);
    });

    test('should dispatch "fetchNotifications.pending", "fetchNotifications.rejected" with server response 401', async () => {
      mockAxiosAdapter.onGet(ApiRoute.Notification).reply(401);

      await store.dispatch(fetchNotifications());
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        fetchNotifications.pending.type,
        fetchNotifications.rejected.type,
      ]);
    });
  });

  describe('deleteNotification', () => {
    test('should dispatch "deleteNotification.pending", "deleteNotification.fulfilled" with server response 204', async () => {
      const mockId = randomUUID();
      mockAxiosAdapter.onDelete(`${ApiRoute.Notification}/${mockId}`).reply(204);

      await store.dispatch(deleteNotification(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        deleteNotification.pending.type,
        deleteNotification.fulfilled.type,
      ]);
    });

    test('should dispatch "deleteNotification.pending", "deleteNotification.rejected" with server response 401', async () => {
      const mockId = randomUUID();
      mockAxiosAdapter.onDelete(`${ApiRoute.Notification}/${mockId}`).reply(401);

      await store.dispatch(deleteNotification(mockId));
      const emittedActions = store.getActions();
      const actionsTypes = extractActionsTypes(emittedActions);

      expect(actionsTypes).toEqual([
        deleteNotification.pending.type,
        deleteNotification.rejected.type,
      ]);
    });
  });
});
