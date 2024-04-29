import '@testing-library/jest-dom';

import { act, render, screen } from '@testing-library/react';

import { withHistory } from '../../test-mocks/test-mocks-components';
import AccountPanelUser from './account-panel-user';

describe('Component AccountPanelUser', () => {
  test('should render correctly', async () => {
    await act(async () => render(withHistory(<AccountPanelUser />)));

    expect(screen.queryByText('Мои друзья')).toBeInTheDocument();
    expect(screen.queryByText('Мои покупки')).toBeInTheDocument();
    expect(screen.queryByText('Скоро тут будет интересно')).toBeInTheDocument();
  });
});
