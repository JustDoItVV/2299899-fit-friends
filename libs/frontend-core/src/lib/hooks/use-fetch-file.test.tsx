import { AxiosInstance } from 'axios';
import { Provider } from 'react-redux';
import { withExtraArgument } from 'redux-thunk';

import { FetchFileParams } from '@2299899-fit-friends/types';
import { faker } from '@faker-js/faker';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { Action, createAsyncThunk } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';

import { createApiService } from '../services/api';
import { State } from '../storage/types/state.type';
import { AppThunkDispatch } from '../test-mocks/app-thunk-dispatch.type';
import { makeFakeState } from '../test-mocks/test-mocks';
import { useFetchFileUrl } from './use-fetch-file';

describe('Hook useFetchFile', () => {
  const axios = createApiService();
  const middleware = [withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<State, Action<string>, AppThunkDispatch>(middleware);
  const mockStore = mockStoreCreator(makeFakeState());
  const wrapper = ({ children }) => (<Provider store={mockStore}>{children}</Provider>);

  test('should return correct values', async () => {
    const mockUrl = 'mockUrl';
    const fetch = createAsyncThunk<
      string,
      FetchFileParams,
      { dispatch: AppThunkDispatch; state: State; extra: AxiosInstance }
    >('mock', async () => mockUrl);

    const renderHookResult = renderHook(() => useFetchFileUrl(fetch, { id: faker.string.uuid() }), { wrapper });
    await act(() => renderHookResult);

    expect(renderHookResult.result.current.fileUrl).toBe(mockUrl);
    expect(renderHookResult.result.current.loading).toBe(false);
  });

  test('should return correct values when rejected', async () => {
    const fetcherRejecter = Promise.reject();
    const fetch = createAsyncThunk<
      string,
      FetchFileParams,
      { dispatch: AppThunkDispatch; state: State; extra: AxiosInstance }
    >('mock', async () => fetcherRejecter);

    const renderHookResult = renderHook(() => useFetchFileUrl(fetch, { id: faker.string.uuid() }), { wrapper });
    await act(() => renderHookResult);

    expect(renderHookResult.result.current.fileUrl).toBe('');
    expect(renderHookResult.result.current.loading).toBe(false);
  });

  test('should return correct values when rejected and default value provided', async () => {
    const mockDefault = 'mockDefault';
    const fetcherRejecter = Promise.reject();
    const fetch = createAsyncThunk<
      string,
      FetchFileParams,
      { dispatch: AppThunkDispatch; state: State; extra: AxiosInstance }
    >('mock', async () => fetcherRejecter);

    const renderHookResult = renderHook(() =>
      useFetchFileUrl(fetch, { id: faker.string.uuid() }, mockDefault), { wrapper });
    await act(() => renderHookResult);

    expect(renderHookResult.result.current.fileUrl).toBe(mockDefault);
    expect(renderHookResult.result.current.loading).toBe(false);
  });
});
