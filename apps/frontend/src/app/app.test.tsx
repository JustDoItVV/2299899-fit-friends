import '@testing-library/jest-dom';

import { createMemoryHistory, MemoryHistory } from 'history';

import { makeFakeState, makeFakeUser, State } from '@2299899-fit-friends/frontend-core';
import { AuthStatus, FrontendRoute, UserRole } from '@2299899-fit-friends/types';
import { act, render, screen } from '@testing-library/react';

import App from './app';
import { withHistory, withStore } from './test-mocks/test-mocks-components';

jest.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: { workerSrc: 'abc' } },
  Outline: null,
  Page: () => <div>page</div>,
  Document: () => <div>page</div>,
}));
jest.mock('./pages/account-friends-page/account-friends.page', () => ({
  ...jest.requireActual('./pages/account-friends-page/account-friends.page'),
  __esModule: true,
  default: jest.fn(() => <div>AccountFriendsPage</div>),
}));
jest.mock('./pages/account-orders-page/account-orders.page', () => ({
  ...jest.requireActual('./pages/account-orders-page/account-orders.page'),
  __esModule: true,
  default: jest.fn(() => <div>AccountOrdersPage</div>),
}));
jest.mock('./pages/account-page/account.page', () => ({
  ...jest.requireActual('./pages/account-page/account.page'),
  __esModule: true,
  default: jest.fn(() => <div>AccountPage</div>),
}));
jest.mock('./pages/account-purchases-page/account-purchases.page', () => ({
  ...jest.requireActual('./pages/account-purchases-page/account-purchases.page'),
  __esModule: true,
  default: jest.fn(() => <div>AccountPurchasesPage</div>),
}));
jest.mock('./pages/account-trainings-page/account-trainings.page', () => ({
  ...jest.requireActual('./pages/account-trainings-page/account-trainings.page'),
  __esModule: true,
  default: jest.fn(() => <div>AccountTrainingsPage</div>),
}));
jest.mock('./pages/intro-page/intro.page', () => ({
  ...jest.requireActual('./pages/intro-page/intro.page'),
  __esModule: true,
  default: jest.fn(() => <div>IntroPage</div>),
}));
jest.mock('./pages/login-page/login.page', () => ({
  ...jest.requireActual('./pages/login-page/login.page'),
  __esModule: true,
  default: jest.fn(() => <div>LoginPage</div>),
}));
jest.mock('./pages/main-page/main.page', () => ({
  ...jest.requireActual('./pages/main-page/main.page'),
  __esModule: true,
  default: jest.fn(() => <div>MainPage</div>),
}));
jest.mock('./pages/not-found-page/not-found.page', () => ({
  ...jest.requireActual('./pages/not-found-page/not-found.page'),
  __esModule: true,
  default: jest.fn(() => <div>NotFoundPage</div>),
}));
jest.mock('./pages/questionnaire-page/questionnaire.page', () => ({
  ...jest.requireActual('./pages/questionnaire-page/questionnaire.page'),
  __esModule: true,
  default: jest.fn(() => <div>QuestionnairePage</div>),
}));
jest.mock('./pages/registration-page/registration.page', () => ({
  ...jest.requireActual('./pages/registration-page/registration.page'),
  __esModule: true,
  default: jest.fn(() => <div>RegistrationPage</div>),
}));
jest.mock('./pages/training-card-page/training-card.page', () => ({
  ...jest.requireActual('./pages/training-card-page/training-card.page'),
  __esModule: true,
  default: jest.fn(() => <div>TrainingCardPage</div>),
}));
jest.mock('./pages/trainings-create-page/trainings-create.page', () => ({
  ...jest.requireActual('./pages/trainings-create-page/trainings-create.page'),
  __esModule: true,
  default: jest.fn(() => <div>TrainingsCreatePage</div>),
}));
jest.mock('./pages/trainings-page/trainings.page', () => ({
  ...jest.requireActual('./pages/trainings-page/trainings.page'),
  __esModule: true,
  default: jest.fn(() => <div>TrainingsPage</div>),
}));
jest.mock('./pages/user-card-page/user-card.page', () => ({
  ...jest.requireActual('./pages/user-card-page/user-card.page'),
  __esModule: true,
  default: jest.fn(() => <div>UserCardPage</div>),
}));
jest.mock('./pages/users-page/users.page', () => ({
  ...jest.requireActual('./pages/users-page/users.page'),
  __esModule: true,
  default: jest.fn(() => <div>UsersPage</div>),
}));

describe('App routing', () => {
  let mockHistory: MemoryHistory;
  let withStoreComponent: JSX.Element;
  let mockState: State;

  beforeEach(() => {
    mockState = makeFakeState();
    mockHistory = createMemoryHistory();
    const withStoreResult = withStore(
      withHistory(<App />, mockHistory),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
  });

  test('should render IntroPage when user navigates to "/"', async () => {
    mockHistory.push('/');

    render(withStoreComponent);

    expect(screen.queryByText('IntroPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/login" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Login}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/login" and authorized and role Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Login}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountPage')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/login" and authorized and role User', async () => {
    mockHistory.push(`/${FrontendRoute.Login}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('MainPage')).toBeInTheDocument();
  });

  test('should render RegistrationPage when user navigates to "/registration" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Registration}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('RegistrationPage')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/registration" and authorized and role Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Registration}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountPage')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/registration" and authorized and role User', async () => {
    mockHistory.push(`/${FrontendRoute.Registration}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('MainPage')).toBeInTheDocument();
  });

  test('should render QuestionnairePage when user navigates to "/questionnaire" and authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Questionnaire}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser() };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('QuestionnairePage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/questionnaire" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Questionnaire}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/main" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Main}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('MainPage')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/main" and authorized and role Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Main}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/main" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Main}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/account" and authorized and role Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountPage')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/account" and authorized and role User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render AccountFriendsPage when user navigates to "/account/friends" and authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Friends}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser() };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountFriendsPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/friends" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Friends}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render TrainingsCreatePage when user navigates to "/account/create" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Create}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('TrainingsCreatePage')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/account/create" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Create}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('MainPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/create" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Create}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render AccountTrainingsPage when user navigates to "/account/trainings" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountTrainingsPage')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/account/trainings" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('MainPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/trainings" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render AccountOrdersPage when user navigates to "/account/orders" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Orders}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountOrdersPage')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/account/orders" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Orders}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('MainPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/orders" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Orders}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render AccountPurchasesPage when user navigates to "/account/purchases" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Purchases}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountPurchasesPage')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/account/purchases" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Purchases}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/purchases" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Purchases}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render TrainingsPage when user navigates to "/trainings" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('TrainingsPage')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/trainings" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/trainings" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render UsersPage when user navigates to "/users" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Users}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('UsersPage')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/users" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Users}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('AccountPage')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/users" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Users}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('LoginPage')).toBeInTheDocument();
  });

  test('should render NotFoundPage when user navigates to non-existing route', async () => {
    mockHistory.push(`/non-existing-route`);
    mockState.APP.authStatus = AuthStatus.Auth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('NotFoundPage')).toBeInTheDocument();
  })
});
