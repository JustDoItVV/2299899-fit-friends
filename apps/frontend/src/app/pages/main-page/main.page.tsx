import { Link } from 'react-router-dom';

import { PlaceholderPath, RatingLimit, SliderBlockItems } from '@2299899-fit-friends/consts';
import {
    fetchTrainingsCatalog, fetchUsersCatalog, selectCurrentUser, useAppSelector
} from '@2299899-fit-friends/frontend-core';
import { FrontendRoute } from '@2299899-fit-friends/types';

import CardLookCompany from '../../components/cards/card-look-company/card-look-company';
import CardPlaceholder from '../../components/cards/card-placeholder/card-placeholder';
import CardSpecialOffer from '../../components/cards/card-special-offer/card-special-offer';
import CardTrainingThumbnail from '../../components/cards/card-training-thumbnail/card-training-thumbnail';
import CardTraining from '../../components/cards/card-training/card-training';
import Header from '../../components/header/header';
import SliderBlock from '../../components/slider-block/slider-block';

export default function MainPage(): JSX.Element {
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <div className="wrapper">
      <Header page={FrontendRoute.Main} />
      <main>
        <h1 className="visually-hidden">
          FitFriends — Время находить тренировки, спортзалы и друзей спортсменов
        </h1>
        <section className='special-for-you'>
          <div className="container">
            <SliderBlock
              title='Специально подобрано для вас'
              classNamePrefix='special-for-you'
              fetch={fetchTrainingsCatalog}
              query={{
                type: currentUser?.trainingType,
                duration: currentUser?.trainingDuration,
                caloriesMin: currentUser?.caloriesPerDay,
              }}
              component={CardTrainingThumbnail}
              itemsPerPage={SliderBlockItems.ForYouVisible}
              preload={true}
              maxItems={SliderBlockItems.ForYouMax}
              dots={false}
            />
          </div>
        </section>
        <section className='special-offers'>
          <div className="container">
            <SliderBlock
              title='Специальные предложения'
              showTitle={false}
              classNamePrefix='special-offers'
              fetch={fetchTrainingsCatalog}
              query={{ isSpecialOffer: true }}
              component={CardSpecialOffer}
              maxItems={SliderBlockItems.SpecialMax}
              itemsPerPage={SliderBlockItems.SpecialVisible}
              preload={true}
              controls={false}
              autoplay={true}
              children={
                <CardPlaceholder classNameInfix='spec-gym' imagePath={PlaceholderPath.CardSpecial} />
              }
            />
          </div>
        </section>
        <section className='popular-trainings'>
          <div className="container">
            <SliderBlock
              title='Популярные новинки'
              classNamePrefix='popular-trainings'
              fetch={fetchTrainingsCatalog}
              query={{ ratingMin: RatingLimit.Max }}
              component={CardTraining}
              itemsPerPage={SliderBlockItems.PopularVisible}
              maxItems={SliderBlockItems.PopularMax}
              preload={true}
              dots={false}
              headerAdditionalElement={
                <Link
                  className={`btn-flat look-for-company__button`}
                  to={`/${FrontendRoute.Trainings}`}
                >
                  <span>Смотреть всё</span>
                  <svg width='14' height ='10' aria-hidden>
                    <use xlinkHref='#arrow-right'></use>
                  </svg>
                </Link>
              }
            />
          </div>
        </section>
        <section className='look-for-company'>
          <div className="container">
            <SliderBlock
              title='Ишут компанию для тренировки'
              classNamePrefix='look-for-company'
              fetch={fetchUsersCatalog}
              query={{ isReadyToTraining: true }}
              component={CardLookCompany}
              itemsPerPage={SliderBlockItems.SeekCompanyVisible}
              maxItems={SliderBlockItems.SeekCompanyMax}
              preload={true}
              outlinedButtons={true}
              dots={false}
              headerAdditionalElement={
                <Link
                  className={`btn-flat look-for-company__button btn-flat--light`}
                  to={`/${FrontendRoute.Users}`}
                >
                  <span>Смотреть всё</span>
                  <svg width='14' height ='10' aria-hidden>
                    <use xlinkHref='#arrow-right'></use>
                  </svg>
                </Link>
              }
            />
          </div>
        </section>
      </main>
    </div>
  );
}
