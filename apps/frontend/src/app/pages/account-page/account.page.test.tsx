import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountPage from './account.page';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: 'abc' } },
  Outline: null,
  Page: () => <div>page</div>,
  Document: () => <div>page</div>,
}));

describe('Component AccountPage', () => {
  let mockState: State;
  let withStoreComponent: JSX.Element;

  beforeEach(() => {
    mockState = makeFakeState();
    const withStoreResult = withStore(
      withHistory(<AccountPage />),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;

    mockState.APP.authStatus = AuthStatus.Auth;
  });

  test('should render correctly with role Trainer', async () => {
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Личный кабинет')).toBeInTheDocument();
    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Создать тренировку')).toBeInTheDocument();
    expect(screen.queryByText('Мои друзья')).toBeInTheDocument();
    expect(screen.queryByText('Мои заказы')).toBeInTheDocument();
  });

  test('should render correctly with role User', async () => {
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Личный кабинет')).toBeInTheDocument();
    expect(screen.queryByText('Мои друзья')).toBeInTheDocument();
    expect(screen.queryByText('Мои покупки')).toBeInTheDocument();
  });
});
