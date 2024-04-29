import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    deleteNotification, extractActionsTypes, fetchNotifications, makeFakeNotification,
    makeFakeState, State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, FrontendRoute } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import Header from './header';

describe('Component Header', () => {
  let mockState: State;

  beforeEach(() => {
    mockState = makeFakeState();
    mockState.APP.authStatus = AuthStatus.Auth;
  });

  test('should render correctly', async () => {
    const { withStoreComponent } = withStore(
      withHistory(<Header page={FrontendRoute.Main} />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('header-notifications-button-trigger')).toBeInTheDocument();
    expect(screen.queryByText('Оповещения')).not.toBeInTheDocument();
    expect(screen.queryByText('Поиск')).toBeInTheDocument();
  });

  test('should dispatch "fetchNotifications.pending", "fetchNotifications.fulfilled", "deleteNotification.pending", "deleteNotification.fulfilled" and render correctly when open notifications button cilck', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(
      withHistory(<Header page={FrontendRoute.Main} />),
      mockState,
    );
    mockAxiosAdapter.onGet(ApiRoute.Notification).reply(200, [makeFakeNotification(), makeFakeNotification()]);
    mockAxiosAdapter.onDelete(new RegExp(`${ApiRoute.Notification}/(.*)`)).reply(204);

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByTestId('header-notifications-button-trigger'));
    await user.click(screen.getByTestId('header-notifications-list').children[0].children[0]);
    const emittedActions = mockStore.getActions();
    const actions = extractActionsTypes(emittedActions);

    expect(actions).toEqual([
      fetchNotifications.pending.type,
      fetchNotifications.fulfilled.type,
      deleteNotification.pending.type,
      deleteNotification.fulfilled.type,
    ]);
    expect(screen.queryByText('Оповещения')).toBeInTheDocument();
    expect(screen.getByTestId('header-notifications-list').children.length).toBe(2);
  });
});
