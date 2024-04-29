import '@testing-library/jest-dom';

import { act, render, screen } from '@testing-library/react';

import { withHistory } from '../../test-mocks/test-mocks-components';
import AccountPanelTrainer from './account-panel-trainer';

describe('Component AccountPanelTrainer', () => {
  test('should render correctly', async () => {
    await act(async () => render(withHistory(<AccountPanelTrainer />)));

    expect(screen.queryByText('Мои тренировки')).toBeInTheDocument();
    expect(screen.queryByText('Создать тренировку')).toBeInTheDocument();
    expect(screen.queryByText('Мои друзья')).toBeInTheDocument();
    expect(screen.queryByText('Мои заказы')).toBeInTheDocument();
    expect(screen.queryByText('Скоро тут будет интересно')).toBeInTheDocument();
  });
});
