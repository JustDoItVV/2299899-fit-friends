import '@testing-library/jest-dom';

import { randomUUID } from 'crypto';

import { makeFakeState, makeFakeTraining } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import PopupBuy from './popup-buy';

describe('Component PopupReview', () => {
  const mockState = makeFakeState();
  const mockId = randomUUID();
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
});
