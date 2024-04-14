import { useLocation, useNavigate } from 'react-router-dom';

import { FrontendRoute } from '@2299899-fit-friends/types';

export function useBackButton(defaultPath = `/${FrontendRoute.Main}`) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    if (location.key === 'default') {
      navigate(defaultPath);
    } else {
      navigate(-1);
    }
  };

  return handleBackButtonClick;
}
