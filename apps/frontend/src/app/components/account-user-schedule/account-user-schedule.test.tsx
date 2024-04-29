import '@testing-library/jest-dom';

import { CaloriesPerDayLimit } from '@2299899-fit-friends/consts';
import { makeFakeState, makeFakeUser } from '@2299899-fit-friends/frontend-core';
import { faker } from '@faker-js/faker';
import { act, render, screen } from '@testing-library/react';

import { withHistory, withStore } from '../../test-mocks/test-mocks-components';
import AccountUserSchedule from './account-user-schedule';

describe('Component AccountPanelUser', () => {
  test('should render correctly', async () => {
    const mockUser = makeFakeUser();
    mockUser.caloriesPerDay = faker.number.int({ min: CaloriesPerDayLimit.Min, max: CaloriesPerDayLimit.Max });
    const mockState = makeFakeState();
    mockState.APP.currentUser = mockUser;
    const { withStoreComponent } = withStore(withHistory(<AccountUserSchedule />), mockState);

    await act(async () => render(withStoreComponent));

    expect(screen.queryByText('План на день, ккал')).toBeInTheDocument();
    expect(screen.queryByDisplayValue(mockUser.caloriesPerDay)).toBeInTheDocument();
    expect(screen.queryByText('План на неделю, ккал')).toBeInTheDocument();
    expect(screen.queryByDisplayValue(mockUser.caloriesPerDay * 7)).toBeInTheDocument();
  });
});
