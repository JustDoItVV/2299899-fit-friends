import '@testing-library/jest-dom';

import { act, render, screen } from '@testing-library/react';

import { withHistory } from '../../test-mocks/test-mocks-components';
import AsideLeftBlock from './aside-left-block';

describe('Component AsideLeftBlock', () => {
  const expectedText = 'expectedText';
  const component = <div key='expected1'>{expectedText}</div>;

  test('should render correctly', async () => {
    const className = 'mock';

    await act(async () => render(withHistory(
      <AsideLeftBlock className={className} backButtonPath='mockPath' children={[component]} />
    )));

    expect(screen.queryByText(expectedText)).toBeInTheDocument();
    expect(screen.queryByText('Назад')).toBeInTheDocument();
    expect(screen.getByRole('button').className.includes(`${className}__back`)).toBeTruthy();
  });

  test('should render correctly without back button', async () => {
    await act(async () => render(withHistory(
      <AsideLeftBlock children={[component]} />
    )));

    expect(screen.queryByText(expectedText)).toBeInTheDocument();
    expect(screen.queryByText('Назад')).not.toBeInTheDocument();
  });
});
