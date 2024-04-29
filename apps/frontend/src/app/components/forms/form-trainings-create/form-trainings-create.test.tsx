import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    createTraining, extractActionsTypes, makeFakeState, makeFakeTraining, redirectToRoute,
    setResponseError, State
} from '@2299899-fit-friends/frontend-core';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import FormTrainingsCreate from './form-trainings-create';

describe('Component FormQuestionnaireUser', () => {
  let mockState: State;

  beforeEach(() => {
    mockState = makeFakeState();
    mockState.APP.responseError = null;
  });

  test('should render correctly', async () => {
    const { withStoreComponent } = withStore(withHistory(<FormTrainingsCreate />), makeFakeState());

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Создание тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Название тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Выберите тип тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Сколько калорий потратим')).toBeInTheDocument();
    expect(screen.queryByText('Сколько времени потратим')).toBeInTheDocument();
    expect(screen.queryByText('Стоимость тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Кому подойдет тренировка')).toBeInTheDocument();
    expect(screen.queryByText('Описание тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Опубликовать')).toBeInTheDocument();
  });

  test('should dispatch "createTraining.pending", "APP/setResponse", "frontend/redirectToRoute", "createTraining.fulfilled" when form submit', async () => {
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(withHistory(<FormTrainingsCreate />), makeFakeState());
    mockAxiosAdapter.onPost(ApiRoute.Training).reply(200, makeFakeTraining());

    await act(async () => render(withStoreComponent));
    await act(async () => fireEvent.submit(screen.getByTestId('create-form')));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      createTraining.pending.type,
      setResponseError.type,
      redirectToRoute.type,
      createTraining.fulfilled.type,
    ]);
  });
});
