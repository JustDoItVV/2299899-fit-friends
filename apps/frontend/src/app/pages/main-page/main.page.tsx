import { CardPlaceholderPreviewImage, SliderBlockItems } from '@2299899-fit-friends/consts';
import { fetchTrainingsCatalog, fetchUsersCatalog } from '@2299899-fit-friends/frontend-core';
import { FrontendRoute } from '@2299899-fit-friends/types';

import CardLookCompany from '../../components/cards/card-look-company/card-look-company';
import CardPlaceholder from '../../components/cards/card-placeholder/card-placeholder';
import CardSpecialOffer from '../../components/cards/card-special-offer/card-special-offer';
import CardTrainingThumbnail from '../../components/cards/card-training-thumbnail/card-training-thumbnail';
import CardTraining from '../../components/cards/card-training/card-training';
import Header from '../../components/header/header';
import SLiderBlock from '../../components/slider-block/slider-block';

export default function MainPage(): JSX.Element {

  return (
    <div className="wrapper">
      <Header page={FrontendRoute.Main} />
      <main>
        <h1 className="visually-hidden">
          FitFriends — Время находить тренировки, спортзалы и друзей спортсменов
        </h1>
        <SLiderBlock
          title='Специально подобрано для вас'
          classNamePrefix='special-for-you'
          fetch={fetchTrainingsCatalog}
          component={CardTrainingThumbnail}
          itemsPerPage={SliderBlockItems.ForYouVisible}
          preload={true}
          maxItems={SliderBlockItems.ForYouMax}
          dots={false}
        />
        <SLiderBlock
          title='Специальные предложения'
          showTitle={false}
          classNamePrefix='special-offers'
          fetch={fetchTrainingsCatalog}
          component={CardSpecialOffer}
          maxItems={SliderBlockItems.SpecialMax}
          itemsPerPage={SliderBlockItems.SpecialVisible}
          preload={true}
          controls={false}
          children={
            <CardPlaceholder classNameInfix='spec-gym' imagePath={CardPlaceholderPreviewImage.Special} />
          }
        />
        <SLiderBlock
          title='Популярные новинки'
          classNamePrefix='popular-trainings'
          fetch={fetchTrainingsCatalog}
          component={CardTraining}
          itemsPerPage={SliderBlockItems.PopularVisible}
          maxItems={SliderBlockItems.PopularMax}
          preload={true}
          dots={false}
        />
        <SLiderBlock
          title='Ишут компанию для тренировки'
          classNamePrefix='look-for-company'
          fetch={fetchUsersCatalog}
          component={CardLookCompany}
          itemsPerPage={SliderBlockItems.SeekCompanyVisible}
          maxItems={SliderBlockItems.SeekCompanyMax}
          preload={true}
          outlinedButtons={true}
          dots={false}
        />
      </main>
    </div>
  );
}
