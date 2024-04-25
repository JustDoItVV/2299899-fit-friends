import MockAdapter from 'axios-mock-adapter';
import { createMemoryHistory, MemoryHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { withExtraArgument } from 'redux-thunk';

import { AppThunkDispatch, createApiService, State } from '@2299899-fit-friends/frontend-core';
import { configureMockStore, MockStore } from '@jedmao/redux-mock-store';
import { Action } from '@reduxjs/toolkit';

import HistoryRouter from '../components/history-router/history-router.component';

type ComponentWithMockStore = {
  withStoreComponent: JSX.Element;
  mockStore: MockStore;
  mockAxiosAdapter: MockAdapter;
};

export function withHistory(component: JSX.Element, history? : MemoryHistory) {
  const memoryHistory = history ?? createMemoryHistory();
  return (
    <HelmetProvider>
      <HistoryRouter history={memoryHistory}>
        {component}
      </HistoryRouter>
    </HelmetProvider>
  );
}

export function withStore(component: JSX.Element, initialState: Partial<State> = {}): ComponentWithMockStore {
  const axios = createApiService();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  const mockStore = mockStoreCreator(initialState);

  return {
    withStoreComponent: <Provider store={mockStore}>{component}</Provider>,
    mockStore,
    mockAxiosAdapter,
  };
}
