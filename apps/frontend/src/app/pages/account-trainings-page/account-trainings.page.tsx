import { Helmet } from 'react-helmet-async';

import { FrontendRoute } from '@2299899-fit-friends/types';

import Header from '../../components/header/header';
import TrainingCatalogCard from '../../components/training-catalog-card/training-catalog-card';
import TrainingsQueryForm from '../../components/trainings-query-form/trainings-query-form';

export default function AccountTrainingsPage(): JSX.Element {
  return (
    <div className="wrapper">
      <Helmet><title>Личный кабинет — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Account} />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Мои тренировки</h1>
              <TrainingsQueryForm />
              <div className="inner-page__content">
                <div className="my-trainings">
                  <ul className="my-trainings__list">
                    <TrainingCatalogCard />
                    <TrainingCatalogCard />
                    <TrainingCatalogCard />
                    <TrainingCatalogCard />
                    <TrainingCatalogCard />
                    <TrainingCatalogCard />
                  </ul>
                  <div className="show-more my-trainings__show-more">
                    <button
                      className="btn show-more__button show-more__button--more"
                      type="button"
                    >
                      Показать еще
                    </button>
                    <button
                      className="btn show-more__button show-more__button--to-top"
                      type="button"
                    >
                      Вернуться в начало
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
