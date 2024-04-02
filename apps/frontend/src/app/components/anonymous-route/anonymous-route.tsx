import { Navigate } from 'react-router-dom';

import { AuthStatus, FrontendRoute, UserRole } from '@2299899-fit-friends/types';

type AnonymousRouteProps = {
  authStatus: AuthStatus;
  userRole: UserRole | undefined;
  children: JSX.Element;
};

export default function AnonymousRoute(props: AnonymousRouteProps): JSX.Element {
  const { authStatus, userRole, children } = props;

  return authStatus !== AuthStatus.Auth
    ? (children)
    : (<Navigate to={userRole === UserRole.Trainer ? FrontendRoute.Personal : FrontendRoute.Main} />);
}
