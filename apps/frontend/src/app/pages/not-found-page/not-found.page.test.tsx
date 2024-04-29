import '@testing-library/jest-dom';

import { act, render, screen } from '@testing-library/react';

import { withHistory } from '../../test-mocks/test-mocks-components';
import NotFoundPage from './not-found.page';

jest.mock('../../components/popups/popup-error/popup-error', () => ({
  ...jest.requireActual('../../components/popups/popup-error/popup-error'),
  __esModule: true,
  default: jest.fn(() => <div>PopupError</div>),
}));

describe('Component NotFoundPage', () => {
  test('should render correctly', async () => {
    await act(async () => render(withHistory(<NotFoundPage />)));

    expect(screen.queryByText('PopupError')).toBeInTheDocument();
  });
});
