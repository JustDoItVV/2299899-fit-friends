import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Loading from './loading';

describe('Component Loading', () => {
  test('should render correctly', () => {
    render(<Loading />);

    expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
  });
});
