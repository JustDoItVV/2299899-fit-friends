import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import { withHistory } from '../../../test-mocks/test-mocks-components';
import PopupError from './popup-error';

describe('Component PopupReview', () => {
  test('should render correctly closed', async () => {
    const component = withHistory(<PopupError statusCode={500}/>);

    render(component);

    expect(screen.queryByText('500')).toBeInTheDocument();
    expect(screen.getByText('Вернуться на главную')).toBeInTheDocument();
  });
});
