import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    createReview, extractActionsTypes, makeFakeReview, makeFakeState, setResponseError
} from '@2299899-fit-friends/frontend-core';
import { faker } from '@faker-js/faker';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import PopupReview from './popup-review';

describe('Component PopupReview', () => {
  const mockState = makeFakeState();
  const mockId = faker.string.uuid();
  test('should render correctly closed', async () => {
    const { withStoreComponent } = withStore(withHistory(
      <PopupReview trainingId={mockId} trigger={<button data-testid="trigger"/>}/>
    ), mockState);

    render(withStoreComponent);

    expect(screen.queryByTestId('trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.queryByText('Поделитесь своими впечатлениями о тренировке')).not.toBeInTheDocument();
  });

  test('should render correctly opened on click', async () => {
    const user = userEvent.setup();
    const { withStoreComponent } = withStore(withHistory(
      <PopupReview trainingId={mockId} trigger={<button data-testid="trigger"/>}/>
    ), mockState);

    render(withStoreComponent);
    await user.click(screen.getByTestId('trigger'));

    expect(screen.queryByTestId('trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('overlay')).toBeInTheDocument();
    expect(screen.queryByText('Поделитесь своими впечатлениями о тренировке')).toBeInTheDocument();
  });

  test('should dispatch "createReview.pending", "APP/setResponseError", "createReview.fulfilled" and render correctly when create button cilck', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(withHistory(
      <PopupReview trainingId={mockId} trigger={<button data-testid="trigger"/>}/>
    ), mockState);
    mockAxiosAdapter.onPost(new RegExp(`${ApiRoute.Training}/(.*)${ApiRoute.Reviews}`))
      .reply(200, makeFakeReview());

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByTestId('trigger'));
    await user.click(screen.getAllByTestId('review-rating')[0]);
    await user.type(screen.getByTestId('review-text'), 'mock');
    await act(async () => fireEvent.click(screen.getByTestId('review-create')));
    const emittedActions = mockStore.getActions();
    const actions = extractActionsTypes(emittedActions);

    expect(actions).toEqual([
      createReview.pending.type,
      setResponseError.type,
      createReview.fulfilled.type,
    ]);
  });
});
