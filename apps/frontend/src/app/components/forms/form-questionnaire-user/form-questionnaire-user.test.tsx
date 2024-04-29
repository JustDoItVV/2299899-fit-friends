import '@testing-library/jest-dom';

import { toBeOneOf } from 'jest-extended';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    extractActionsTypes, makeFakeState, makeFakeUser, redirectToRoute, setResponseError, State,
    updateUser
} from '@2299899-fit-friends/frontend-core';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import FormQuestionnaireUser from './form-questionnaire-user';

jest.mock('../../loading/loading', () => ({
  ...jest.requireActual('../../loading/loading'),
  __esModule: true,
  default: jest.fn(() => <div>Loading</div>),
}));

expect.extend({ toBeOneOf });
describe('Component FormQuestionnaireUser', () => {
  let mockState: State;

  beforeEach(() => {
    mockState = makeFakeState();
  });

  test('should render correctly', async () => {
    const mockUser = makeFakeUser();
    mockState.APP.currentUser = mockUser;
    const { withStoreComponent } = withStore(withHistory(<FormQuestionnaireUser />), mockState);

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Опросник')).toBeInTheDocument();
    expect(screen.queryByText('Ваша специализация (тип) тренировок')).toBeInTheDocument();
    expect(screen
      .queryAllByTestId('form-questionnaire-input-type')
      .filter((element) => (element as HTMLInputElement).checked)
      .length
    ).toBe(mockUser.trainingType.length);
    expect(screen.queryByText('Сколько времени вы готовы уделять на тренировку в день')).toBeInTheDocument();
    expect(screen
      .queryAllByTestId('form-questionnaire-input-duration')
      .filter((element) => (element as HTMLInputElement).checked)
      .length
    ).toBeOneOf([0, 1]);
    if (mockUser.trainingDuration) {
      expect((screen
        .queryAllByTestId('form-questionnaire-input-duration')
        .filter((element) => (element as HTMLInputElement).checked)[0] as HTMLInputElement)
        .value
      ).toBe(mockUser.trainingDuration);
    }
    expect(screen.queryByText('Ваш уровень')).toBeInTheDocument();
    expect(screen
      .queryAllByTestId('form-questionnaire-input-level')
      .filter((element) => (element as HTMLInputElement).checked)
      .length
    ).toBeOneOf([0, 1]);
    if (mockUser.trainingLevel) {
      expect((screen
        .queryAllByTestId('form-questionnaire-input-level')
        .filter((element) => (element as HTMLInputElement).checked)[0] as HTMLInputElement)
        .value
      ).toBe(mockUser.trainingLevel);
    }
    expect(screen.queryByText('Сколько калорий хотите сбросить')).toBeInTheDocument();
    expect(screen.queryByText('Сколько калорий тратить в день')).toBeInTheDocument();
  });

  test('should render Loading with current user null', async () => {
    mockState.APP.currentUser = null;
    const { withStoreComponent } = withStore(withHistory(<FormQuestionnaireUser />), mockState);

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Опросник')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading')).toBeInTheDocument();
  });

  test('should dispatch "updateUser.pending", "APP/setResponse", "updateUser.fulfilled", "frontend/redirectToRoute" when form submit', async () => {
    const mockUser = makeFakeUser();
    mockState.APP.currentUser = mockUser;
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(withHistory(<FormQuestionnaireUser />), mockState);
    mockAxiosAdapter.onPatch(new RegExp(`${ApiRoute.User}/(.*)`)).reply(200, mockUser);

    await act(async () => render(withStoreComponent));
    await act(async () => fireEvent.submit(screen.getByTestId('questionnaire-form')));
    const emittedActions = mockStore.getActions();
    const actionsTypes = extractActionsTypes(emittedActions);

    expect(actionsTypes).toEqual([
      updateUser.pending.type,
      setResponseError.type,
      updateUser.fulfilled.type,
      redirectToRoute.type,
    ]);
  });
});
