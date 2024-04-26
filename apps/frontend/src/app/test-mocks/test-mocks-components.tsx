import MockAdapter from 'axios-mock-adapter';
import { createMemoryHistory, MemoryHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { withExtraArgument } from 'redux-thunk';

import {
    AppThunkDispatch, CatalogItem, createApiService, State
} from '@2299899-fit-friends/frontend-core';
import { Pagination, QueryPagination } from '@2299899-fit-friends/types';
import { configureMockStore, MockStore } from '@jedmao/redux-mock-store';
import { Action, createAsyncThunk } from '@reduxjs/toolkit';

import HistoryRouter from '../components/history-router/history-router';

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

export function MockCardComponent(props: { item: CatalogItem, index?: number, key?: string }): JSX.Element {
  return (
    <div>
      {props.item.id}
    </div>
  );
}

export function makeMockFetchCatalog(replyData: Pagination<CatalogItem>) {
  return createAsyncThunk<
    Pagination<CatalogItem>,
    QueryPagination,
    { dispatch: AppThunkDispatch; state: State; }
  >('mockFetch', async () => replyData);
}
