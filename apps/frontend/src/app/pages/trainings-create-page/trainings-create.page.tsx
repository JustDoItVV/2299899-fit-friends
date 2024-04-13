import { Helmet } from 'react-helmet-async';

import { FrontendRoute } from '@2299899-fit-friends/types';

import FormTrainingsCreate from '../../components/forms/form-trainings-create/form-trainings-create';
import Header from '../../components/header/header';

export default function TrainingsCreatePage(): JSX.Element {
  return (
    <div className="wrapper">
      <Helmet><title>Создать тренировку — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Account} />
      <main>
        <FormTrainingsCreate />
      </main>
    </div>
  );
}
