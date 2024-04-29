import '@testing-library/jest-dom';

import { ApiRoute } from '@2299899-fit-friends/consts';
import {
    extractActionsTypes, makeFakeBalance, makeFakeState, makeFakeTraining, updateBalance
} from '@2299899-fit-friends/frontend-core';
import { faker } from '@faker-js/faker';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import PopupBuy from './popup-buy';

jest.mock('@2299899-fit-friends/frontend-core', () => ({
  ...jest.requireActual('@2299899-fit-friends/frontend-core'),
  useFetchFileUrl: () => ({ fileUrl: '', setFileUrl: jest.fn(), loading: false }),
}));

describe('Component PopupReview', () => {
  const mockState = makeFakeState();
  const mockId = faker.string.uuid();
  const mockTraining = makeFakeTraining();

  test('should render correctly closed', async () => {
    const { withStoreComponent } = withStore(withHistory(
      <PopupBuy
        trainingId={mockId}
        trainingTitle={mockTraining.title}
        trainingPrice={mockTraining.price}
        trigger={<button data-testid="trigger"/>}
      />
    ), mockState);

    await act(async () => render(withStoreComponent));

    expect(screen.queryByTestId('trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.queryByText('Купить тренировку')).not.toBeInTheDocument();
    expect(screen.queryByText('Итого')).not.toBeInTheDocument();
  });

  test('should render correctly opened on click', async () => {
    const user = userEvent.setup();
    const { withStoreComponent } = withStore(withHistory(
      <PopupBuy
        trainingId={mockId}
        trainingTitle={mockTraining.title}
        trainingPrice={mockTraining.price}
        trigger={<button data-testid="trigger"/>}
      />
    ), mockState);

    render(withStoreComponent);
    await user.click(screen.getByTestId('trigger'));

    expect(screen.queryByTestId('trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('overlay')).toBeInTheDocument();
    expect(screen.queryByText('Купить тренировку')).toBeInTheDocument();
    expect(screen.queryByText('Итого')).toBeInTheDocument();
  });

  test('should dispatch "updateBalance.pending", "updateBalance.fulfilled" and render correctly when buy button cilck', async () => {
    const user = userEvent.setup();
    const { withStoreComponent, mockAxiosAdapter, mockStore } = withStore(withHistory(
      <PopupBuy
        trainingId={mockId}
        trainingTitle={mockTraining.title}
        trainingPrice={mockTraining.price}
        trigger={<button data-testid="trigger"/>}
      />
    ), mockState);
    mockAxiosAdapter.onPatch(`${ApiRoute.Account}${ApiRoute.User}${ApiRoute.Balance}`).reply(200, makeFakeBalance());

    await act(async () => render(withStoreComponent));
    await user.click(screen.getByTestId('trigger'));
    await user.click(screen.getByTestId('buy-button-amount'));
    await user.click(screen.getByTestId('buy-method-visa'));
    await act(async () => fireEvent.click(screen.getByTestId('buy-button')));
    const emittedActions = mockStore.getActions();
    const actions = extractActionsTypes(emittedActions);

    expect(actions).toEqual([
      updateBalance.pending.type,
      updateBalance.fulfilled.type,
    ]);
  });
});
