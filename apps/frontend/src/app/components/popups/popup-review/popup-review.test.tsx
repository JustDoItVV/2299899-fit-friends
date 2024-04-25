import '@testing-library/jest-dom';

import { makeFakeState } from '@2299899-fit-friends/frontend-core';
import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';
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
});
