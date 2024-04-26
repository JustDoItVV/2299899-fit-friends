import '@testing-library/jest-dom';

import { createMemoryHistory } from 'history';

import { render, screen } from '@testing-library/react';

import HistoryRouter from './history-router';

describe('Component HistoryRouter', () => {
  test('should render correctly', () => {
    const expectedText = 'wrappedComponent';
    const mockComponent = <span>{expectedText}</span>;
    const history = createMemoryHistory();

    render(<HistoryRouter history={history}>{mockComponent}</HistoryRouter>);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
