import { Navigate } from 'react-router-dom';

import { selectCurrentUser, useAppSelector } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, UserRole } from '@2299899-fit-friends/types';

type AuthorizedRouteProps = {
  role: UserRole;
  children: JSX.Element;
};

export default function RoleRoute(props: AuthorizedRouteProps): JSX.Element {
  const { role, children } = props;
  const currentUser = useAppSelector(selectCurrentUser);

  return currentUser?.role === role ? children : <Navigate to={FrontendRoute.Main} />;
}
