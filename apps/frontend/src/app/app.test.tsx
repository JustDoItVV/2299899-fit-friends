import '@testing-library/jest-dom';

import MockAdapter from 'axios-mock-adapter';
import { createMemoryHistory, MemoryHistory } from 'history';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    makeFakeOrder, makeFakeRequest, makeFakeState, makeFakeTraining, makeFakeUser, State
} from '@2299899-fit-friends/frontend-core';
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

describe('App routing', () => {
  let mockHistory: MemoryHistory;
  let withStoreComponent: JSX.Element;
  let mockState: State;
  let mockAxiosAdapter: MockAdapter;

  beforeEach(() => {
    mockState = makeFakeState();
    mockHistory = createMemoryHistory();
    const withStoreResult = withStore(
      withHistory(<App />, mockHistory),
      mockState,
    );
    withStoreComponent = withStoreResult.withStoreComponent;
    mockAxiosAdapter = withStoreResult.mockAxiosAdapter;

    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Training}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeTraining()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.User}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeUser()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
  });

  test('should render IntroPage when user navigates to "/"', async () => {
    mockHistory.push('/');

    render(withStoreComponent);

    expect(screen.queryByText('Регистрация')).toBeInTheDocument();
    expect(screen.queryByText('Есть аккаунт?')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/login" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Login}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/login" and authorized and role Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Login}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).not.toBeInTheDocument();
    expect(screen.queryByText('Пароль')).not.toBeInTheDocument();
    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Создать тренировку')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/login" and authorized and role User', async () => {
    mockHistory.push(`/${FrontendRoute.Login}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('slider-block-special-for-you')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-special-offers')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-popular-trainings')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-look-for-company')).toBeInTheDocument();
  });

  test('should render RegistrationPage when user navigates to "/registration" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Registration}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Регистрация')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/registration" and authorized and role Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Registration}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Регистрация')).not.toBeInTheDocument();
    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Создать тренировку')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/registration" and authorized and role User', async () => {
    mockHistory.push(`/${FrontendRoute.Registration}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('slider-block-special-for-you')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-special-offers')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-popular-trainings')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-look-for-company')).toBeInTheDocument();
  });

  test('should render QuestionnairePage when user navigates to "/questionnaire" and authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Questionnaire}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser() };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Опросник')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/questionnaire" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Questionnaire}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Опросник')).not.toBeInTheDocument();
    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render Main when user navigates to "/main" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Main}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('slider-block-special-for-you')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-special-offers')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-popular-trainings')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-look-for-company')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/main" and authorized and role Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Main}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };
    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Регистрация')).not.toBeInTheDocument();
    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Создать тренировку')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/main" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Main}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/account" and authorized and role Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Создать тренировку')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/account" and authorized and role User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Мои друзья')).toBeInTheDocument();
    expect(screen.queryByText('Мои покупки')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render AccountFriendsPage when user navigates to "/account/friends" and authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Friends}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser() };
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Friends}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeUser()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Friends}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeUser()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.TrainingRequest}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeRequest()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Мои друзья')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/friends" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Friends}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render TrainingsCreatePage when user navigates to "/account/create" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Create}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Создание тренировки')).toBeInTheDocument();
  });

  test('should render TrainingsCreatePage when user navigates to "/account/create" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Create}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Создание тренировки')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/account/create" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Create}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('slider-block-special-for-you')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-special-offers')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-popular-trainings')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-look-for-company')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/create" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Create}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render AccountTrainingsPage when user navigates to "/account/trainings" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Account}${ApiRoute.Trainer}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeTraining()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/account/trainings" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('slider-block-special-for-you')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-special-offers')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-popular-trainings')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-look-for-company')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/trainings" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render AccountOrdersPage when user navigates to "/account/orders" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Orders}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Account}${ApiRoute.Trainer}${ApiRoute.Orders}?(.*)`, 'g'))
      .reply(200, { entities: [makeFakeOrder()], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Мои заказы')).toBeInTheDocument();
  });

  test('should render MainPage when user navigates to "/account/orders" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Orders}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('slider-block-special-for-you')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-special-offers')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-popular-trainings')).toBeInTheDocument();
    expect(screen.queryByTestId('slider-block-look-for-company')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/orders" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Orders}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render AccountPurchasesPage when user navigates to "/account/purchases" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Purchases}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };
    const mockOrder = makeFakeOrder();
    mockAxiosAdapter.onGet(new RegExp(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}?(.*)`, 'g'))
      .reply(200, { entities: [mockOrder], totalPages: 1, totalItems: 1, itemsPerPage: 50, currentPage: 1 });
    mockAxiosAdapter.onGet(`${ApiRoute.Training}/${mockOrder.trainingId}`).reply(200, makeFakeTraining());

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Мои покупки')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/account/purchases" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Purchases}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Создать тренировку')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/account/purchases" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Account}/${FrontendRoute.Purchases}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render TrainingsPage when user navigates to "/trainings" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Каталог тренировок')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/trainings" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Создать тренировку')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/trainings" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Trainings}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render UsersPage when user navigates to "/users" and authorized and User', async () => {
    mockHistory.push(`/${FrontendRoute.Users}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.User };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Каталог пользователей')).toBeInTheDocument();
  });

  test('should render AccountPage when user navigates to "/users" and authorized and Trainer', async () => {
    mockHistory.push(`/${FrontendRoute.Users}`);
    mockState.APP.authStatus = AuthStatus.Auth;
    mockState.APP.currentUser = { ...makeFakeUser(), role: UserRole.Trainer };

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Создать тренировку')).toBeInTheDocument();
  });

  test('should render LoginPage when user navigates to "/users" and not authorized', async () => {
    mockHistory.push(`/${FrontendRoute.Users}`);
    mockState.APP.authStatus = AuthStatus.NoAuth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
  });

  test('should render NotFoundPage when user navigates to non-existing route', async () => {
    mockHistory.push(`/non-existing-route`);
    mockState.APP.authStatus = AuthStatus.Auth;

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('404')).toBeInTheDocument();
    expect(screen.queryByText('Вернуться на главную')).toBeInTheDocument();
  })
});
