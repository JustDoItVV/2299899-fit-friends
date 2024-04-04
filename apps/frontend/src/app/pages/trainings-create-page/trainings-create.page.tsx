import { FrontendRoute } from '@2299899-fit-friends/types';

import Header from '../../components/header/header';
import TrainingsCreateForm from '../../components/trainings-create-form/trainings-create-form';

export default function TrainingsCreatePage(): JSX.Element {
  return (
    <div className="wrapper">
      <Header page={FrontendRoute.Personal} />
      <main>
        <TrainingsCreateForm />
      </main>
    </div>
  );
}
