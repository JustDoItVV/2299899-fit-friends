import { useLocation, useNavigate } from 'react-router-dom';

import { FrontendRoute } from '@2299899-fit-friends/types';

export function useBackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    if (location.key === 'default') {
      navigate(`/${FrontendRoute.Main}`);
    } else {
      navigate(-1);
    }
  };

  return handleBackButtonClick;
}
