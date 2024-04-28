import '@testing-library/jest-dom';

import {
    extractActionsTypes, makeFakeState, makeFakeUser, setAuthStatus, setCurrentUser, State
} from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountAbout from './account-about';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));
jest.mock('../loading/loading', () => ({
  ...jest.requireActual('../loading/loading'),
  __esModule: true,
  default: jest.fn(() => <div>Loading</div>),
}));

describe('Component AccountAbout', () => {
  let mockState: State;

  beforeEach(() => {
    mockState = makeFakeState();
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };
  });

  test('should render correctly', async () => {
    const { withStoreComponent } = withStore(
      withHistory(<AccountAbout />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Выйти')).toBeInTheDocument();
    expect(screen.queryByTestId('account-about-avatar')).toBeInTheDocument();
    expect(screen.queryByText('Редактировать')).toBeInTheDocument();
    expect(screen.queryByText('Обо мне')).toBeInTheDocument();
    expect(screen.getByTestId('account-about-input-name')).toBeDisabled();
    expect(screen.queryByText('Описание')).toBeInTheDocument();
    expect(screen.queryByText('Готов тренировать')).toBeInTheDocument();
    expect(screen.queryByText('Специализация')).toBeInTheDocument();
    expect(screen.queryByText('Локация')).toBeInTheDocument();
    expect(screen.queryByText('Уровень')).toBeInTheDocument();
  });

  test('should render Loading when current user is null', async () => {
    mockState.APP.currentUser = null;
    const { withStoreComponent } = withStore(
      withHistory(<AccountAbout />),
      mockState,
    );
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Loading')).toBeInTheDocument();
  });

  // test('should render form editable when edit button click', async () => {
  //   const user = userEvent.setup();
  //   const { withStoreComponent } = withStore(
  //     withHistory(<AccountAbout />),
  //     mockState,
  //   );

  //   await act(async () => render(withStoreComponent));
  //   await user.click(screen.getByTestId('account-about-button-edit'));

  //   expect(screen.queryByText('Выйти')).toBeInTheDocument();
  //   expect(screen.queryByTestId('account-about-avatar')).toBeInTheDocument();
  //   expect(screen.queryByText('Сохранить')).toBeInTheDocument();
  //   expect(screen.queryByText('Обо мне')).toBeInTheDocument();
  //   expect(screen.getByTestId('account-about-input-name')).not.toBeDisabled();
  // });

  test('should dispatch "APP/setCurrentUser", "APP/setAuthStatus" logout button click', async () => {
    const { withStoreComponent, mockStore } = withStore(
      withHistory(<AccountAbout />),
      mockState,
    );

    await act(async () => render(withStoreComponent));
    await userEvent.click(screen.getByTestId('account-about-button-logout'));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      setCurrentUser.type,
      setAuthStatus.type,
    ]);
  });
});
