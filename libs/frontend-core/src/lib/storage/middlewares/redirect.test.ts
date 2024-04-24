import { FrontendRoute } from '@2299899-fit-friends/types';
import { configureMockStore, MockStore } from '@jedmao/redux-mock-store';
import { UnknownAction } from '@reduxjs/toolkit';

import { browserHistory } from '../../services/browser-history';
import { redirectToRoute } from '../actions/redirect-to-route';
import { State } from '../types/state.type';
import { redirect } from './redirect';

describe('Redirect middleware', () => {
  let store: MockStore;

  beforeAll(() => {
    const middleware = [redirect];
    const mockStoreCreator = configureMockStore<State, UnknownAction>(middleware);
    store = mockStoreCreator();
  });

  beforeEach(() => {
    browserHistory.push('/');
  });

  test('should redirect to "/login" with "redirectToRoute" action', () => {
    const expectedPath = `/${FrontendRoute.Login}`;
    const redirectAction = redirectToRoute(expectedPath);

    store.dispatch(redirectAction);

    expect(browserHistory.location.pathname).toBe(expectedPath);
  });

  test('should not redirect to "/login" with empty action', () => {
    const expectedPath = `/${FrontendRoute.Login}`;
    const emptyAction = { type: '', payload: expectedPath };

    store.dispatch(emptyAction);

    expect(browserHistory.location.pathname).not.toBe(expectedPath);
  });
});
