import '@testing-library/jest-dom';

import { makeFakeState } from '@2299899-fit-friends/frontend-core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import PopupCertificates from './popup-certificates';

describe('Component PopupReview', () => {
  const mockState = makeFakeState();

  test('should render correctly closed', async () => {
    const { withStoreComponent } = withStore(withHistory(
      <PopupCertificates trigger={<button data-testid="trigger"/>}/>
    ), mockState);

    render(withStoreComponent);

    expect(screen.queryByTestId('trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('overlay')).not.toBeInTheDocument();
    expect(screen.queryByText('Сертификаты')).not.toBeInTheDocument();
  });

  test('should render correctly opened on click', async () => {
    const user = userEvent.setup();
    const { withStoreComponent } = withStore(withHistory(
      <PopupCertificates trigger={<button data-testid="trigger"/>}/>
    ), mockState);

    render(withStoreComponent);
    await user.click(screen.getByTestId('trigger'));

    expect(screen.queryByTestId('trigger')).toBeInTheDocument();
    expect(screen.queryByTestId('overlay')).toBeInTheDocument();
    expect(screen.queryByText('Сертификаты')).toBeInTheDocument();
  });
});
