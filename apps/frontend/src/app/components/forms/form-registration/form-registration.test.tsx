import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    extractActionsTypes, makeFakeState, makeFakeUser, redirectToRoute, registerUser, setAuthStatus,
    setResponseError
} from '@2299899-fit-friends/frontend-core';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import FormRegistration from './form-registration';

describe('Component FormQuestionnaireUser', () => {
  test('should render correctly', async () => {
    const { withStoreComponent } = withStore(withHistory(<FormRegistration />), makeFakeState());

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Загрузите фото профиля')).toBeInTheDocument();
    expect(screen.queryByText('Имя')).toBeInTheDocument();
    expect(screen.queryByText('E-mail')).toBeInTheDocument();
    expect(screen.queryByText('Дата рождения')).toBeInTheDocument();
    expect(screen.queryByText('Ваша локация')).toBeInTheDocument();
    expect(screen.queryByText('Пароль')).toBeInTheDocument();
    expect(screen.queryByText('Пол')).toBeInTheDocument();
    expect(screen.queryByText('Выберите роль')).toBeInTheDocument();
    expect(screen.queryByText('Продолжить')).toBeInTheDocument();
    expect(screen.getByText('Продолжить')).toBeDisabled();
  });

  test('should dispatch "registerUser.pending", "APP/setAuthData", "APP/setResponse", "frontend/redirectToRoute", "registerUser.fulfilled" when form submit', async () => {
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(withHistory(<FormRegistration />), makeFakeState());
    mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Register}`).reply(200);
    mockAxiosAdapter.onPost(`${ApiRoute.User}${ApiRoute.Login}`).reply(200, makeFakeUser());

    await act(async () => render(withStoreComponent));
    await act(async () => fireEvent.submit(screen.getByTestId('register-form')));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      registerUser.pending.type,
      setAuthStatus.type,
      setResponseError.type,
      redirectToRoute.type,
      registerUser.fulfilled.type,
    ]);
  });
});
