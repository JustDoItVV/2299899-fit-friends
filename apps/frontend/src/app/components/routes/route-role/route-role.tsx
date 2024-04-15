import { Navigate } from 'react-router-dom';

import { selectCurrentUser, useAppSelector } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute, UserRole } from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

type RouteRoleProps = {
  role: UserRole;
  children: JSX.Element;
  redirect?: string;
};

export default function RouteRole(props: RouteRoleProps): JSX.Element {
  const { role, children, redirect } = props;
  const redirectPath = redirect ?? `/${FrontendRoute.Main}`;
  const currentUser = useAppSelector(selectCurrentUser);

  if (!currentUser?.role) {
    return <Loading />
  }

  return currentUser?.role === role ? children : <Navigate to={redirectPath} />;
}
