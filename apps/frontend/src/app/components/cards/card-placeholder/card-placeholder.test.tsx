import '@testing-library/jest-dom';

import { makeFakeState, makeFakeUser } from '@2299899-fit-friends/frontend-core';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../../test-mocks/test-mocks-components';
import CardPlaceholder from './card-placeholder';

describe('Component CardPlaceholder', () => {
  test('should render correctly', async () => {
    const mockClassNameInfix = 'mock';
    const mockState = makeFakeState();
    mockState.APP.currentUser = { ...makeFakeUser() };
    const { withStoreComponent } = withStore(
      withHistory(<CardPlaceholder classNameInfix={mockClassNameInfix} imagePath='' />),
      mockState,
    );

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('Скоро здесь появится что - то полезное')).toBeInTheDocument();
    expect(screen.queryByText('Скоро здесь появится что - то полезное')?.className.includes(`thumbnail-${mockClassNameInfix}__title`)).toBeTruthy();
  });
});
