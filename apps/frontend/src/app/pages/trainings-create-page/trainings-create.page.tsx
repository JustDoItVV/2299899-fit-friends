import { Helmet } from 'react-helmet-async';

import { FrontendRoute } from '@2299899-fit-friends/types';

import Header from '../../components/header/header';
import TrainingsCreateForm from '../../components/trainings-create-form/trainings-create-form';

export default function TrainingsCreatePage(): JSX.Element {
  return (
    <div className="wrapper">
      <Helmet><title>Создать тренировку — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Account} />
      <main>
        <TrainingsCreateForm />
      </main>
    </div>
  );
}
