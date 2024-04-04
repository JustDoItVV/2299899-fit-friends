import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

import { FrontendRoute } from '@2299899-fit-friends/types';

import Header from '../../components/header/header';

export default function PersonalTrainingsPage(): JSX.Element {
  return (
    <div className="wrapper">
      <Helmet><title>Личный кабинет — FitFriends</title></Helmet>
      <Header page={FrontendRoute.Personal} />
      <main>
        <section className="inner-page">
          <div className="container">
            <div className="inner-page__wrapper">
              <h1 className="visually-hidden">Мои тренировки</h1>
              <div className="my-training-form">
                <h2 className="visually-hidden">Мои тренировки Фильтр</h2>
                <div className="my-training-form__wrapper">
                  <button
                    className="btn-flat btn-flat--underlined my-training-form__btnback"
                    type="button"
                  >
                    <svg width={14} height={10} aria-hidden="true">
                      <use xlinkHref="#arrow-left" />
                    </svg>
                    <span>Назад</span>
                  </button>
                  <h3 className="my-training-form__title">фильтры</h3>
                  <form className="my-training-form__form">
                    <div className="my-training-form__block my-training-form__block--price">
                      <h4 className="my-training-form__block-title">Цена, ₽</h4>
                      <div className="filter-price">
                        <div className="filter-price__input-text filter-price__input-text--min">
                          <input
                            type="number"
                            id="text-min"
                            name="text-min"
                            defaultValue={0}
                          />
                          <label htmlFor="text-min">от</label>
                        </div>
                        <div className="filter-price__input-text filter-price__input-text--max">
                          <input
                            type="number"
                            id="text-max"
                            name="text-max"
                            defaultValue={3200}
                          />
                          <label htmlFor="text-max">до</label>
                        </div>
                      </div>
                      <div className="filter-range">
                        <div className="filter-range__scale">
                          <div className="filter-range__bar">
                            <span className="visually-hidden">
                              Полоса прокрутки
                            </span>
                          </div>
                        </div>
                        <div className="filter-range__control">
                          <button className="filter-range__min-toggle">
                            <span className="visually-hidden">
                              Минимальное значение
                            </span>
                          </button>
                          <button className="filter-range__max-toggle">
                            <span className="visually-hidden">
                              Максимальное значение
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="my-training-form__block my-training-form__block--calories">
                      <h4 className="my-training-form__block-title">Калории</h4>
                      <div className="filter-calories">
                        <div className="filter-calories__input-text filter-calories__input-text--min">
                          <input
                            type="number"
                            id="text-min-cal"
                            name="text-min-cal"
                          />
                          <label htmlFor="text-min-cal">от</label>
                        </div>
                        <div className="filter-calories__input-text filter-calories__input-text--max">
                          <input
                            type="number"
                            id="text-max-cal"
                            name="text-max-cal"
                          />
                          <label htmlFor="text-max-cal">до</label>
                        </div>
                      </div>
                      <div className="filter-range">
                        <div className="filter-range__scale">
                          <div className="filter-range__bar">
                            <span className="visually-hidden">
                              Полоса прокрутки
                            </span>
                          </div>
                        </div>
                        <div className="filter-range__control">
                          <button className="filter-range__min-toggle">
                            <span className="visually-hidden">
                              Минимальное значение
                            </span>
                          </button>
                          <button className="filter-range__max-toggle">
                            <span className="visually-hidden">
                              Максимальное значение
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="my-training-form__block my-training-form__block--raiting">
                      <h4 className="my-training-form__block-title">Рейтинг</h4>
                      <div className="filter-raiting">
                        <div className="filter-raiting__scale">
                          <div className="filter-raiting__bar">
                            <span className="visually-hidden">
                              Полоса прокрутки
                            </span>
                          </div>
                        </div>
                        <div className="filter-raiting__control">
                          <button className="filter-raiting__min-toggle">
                            <span className="visually-hidden">
                              Минимальное значение
                            </span>
                          </button>
                          <span>0</span>
                          <button className="filter-raiting__max-toggle">
                            <span className="visually-hidden">
                              Максимальное значение
                            </span>
                          </button>
                          <span>5</span>
                        </div>
                      </div>
                    </div>
                    <div className="my-training-form__block my-training-form__block--duration">
                      <h4 className="my-training-form__block-title">
                        Длительность
                      </h4>
                      <ul className="my-training-form__check-list">
                        <li className="my-training-form__check-list-item">
                          <div className="custom-toggle custom-toggle--checkbox">
                            <label>
                              <input
                                type="checkbox"
                                defaultValue="duration-1"
                                name="duration"
                              />
                              <span className="custom-toggle__icon">
                                <svg width={9} height={6} aria-hidden="true">
                                  <use xlinkHref="#arrow-check" />
                                </svg>
                              </span>
                              <span className="custom-toggle__label">
                                10 мин - 30 мин
                              </span>
                            </label>
                          </div>
                        </li>
                        <li className="my-training-form__check-list-item">
                          <div className="custom-toggle custom-toggle--checkbox">
                            <label>
                              <input
                                type="checkbox"
                                defaultValue="duration-1"
                                name="duration"
                                defaultChecked
                              />
                              <span className="custom-toggle__icon">
                                <svg width={9} height={6} aria-hidden="true">
                                  <use xlinkHref="#arrow-check" />
                                </svg>
                              </span>
                              <span className="custom-toggle__label">
                                30 мин - 50 мин
                              </span>
                            </label>
                          </div>
                        </li>
                        <li className="my-training-form__check-list-item">
                          <div className="custom-toggle custom-toggle--checkbox">
                            <label>
                              <input
                                type="checkbox"
                                defaultValue="duration-1"
                                name="duration"
                              />
                              <span className="custom-toggle__icon">
                                <svg width={9} height={6} aria-hidden="true">
                                  <use xlinkHref="#arrow-check" />
                                </svg>
                              </span>
                              <span className="custom-toggle__label">
                                50 мин - 80 мин
                              </span>
                            </label>
                          </div>
                        </li>
                        <li className="my-training-form__check-list-item">
                          <div className="custom-toggle custom-toggle--checkbox">
                            <label>
                              <input
                                type="checkbox"
                                defaultValue="duration-1"
                                name="duration"
                              />
                              <span className="custom-toggle__icon">
                                <svg width={9} height={6} aria-hidden="true">
                                  <use xlinkHref="#arrow-check" />
                                </svg>
                              </span>
                              <span className="custom-toggle__label">
                                80 мин - 100 мин
                              </span>
                            </label>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </form>
                </div>
              </div>
              <div className="inner-page__content">
                <div className="my-trainings">
                  <ul className="my-trainings__list">
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-02.webp, img/content/thumbnails/training-02@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-02.jpg"
                                srcSet="img/content/thumbnails/training-02@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">Бесплатно</p>
                          <h3 className="thumbnail-training__title">crossfit</h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#кроссфит</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#1200ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                5
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Сложный комплекс упражнений для профессиональных
                              атлетов на&nbsp;отработку показателей
                              в&nbsp;классическом стиле.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-01.webp, img/content/thumbnails/training-01@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-01.jpg"
                                srcSet="img/content/thumbnails/training-01@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              800
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">energy</h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#пилатес</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#320ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                4
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Упражнения укрепляют мышечный корсет, делают суставы
                              более гибкими, улучшают осанку и&nbsp;координацию.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-03.webp, img/content/thumbnails/training-03@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-03.jpg"
                                srcSet="img/content/thumbnails/training-03@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              1000
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">boxing</h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#бокс</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#800ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                5
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Тренировка на&nbsp;отработку правильных ударов,
                              координации и&nbsp;оптимальной механики защитных
                              движений.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-04.webp, img/content/thumbnails/training-04@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-04.jpg"
                                srcSet="img/content/thumbnails/training-04@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              1200
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">power</h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#силовые</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#600ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                4
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Тренировка на&nbsp;отработку правильной техники работы
                              с&nbsp;тяжелыми весами, укрепления мышц кора
                              и&nbsp;спины.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-05.webp, img/content/thumbnails/training-05@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-05.jpg"
                                srcSet="img/content/thumbnails/training-05@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              1400
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">antistress</h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#йога</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#250ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                5
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              В&nbsp;основе программы лежит работа с&nbsp;телом
                              и&nbsp;с&nbsp;психо-эмоциональным состоянием. Уберем
                              зажимы тела, избавимся от стресса.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-06.webp, img/content/thumbnails/training-06@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-06.jpg"
                                srcSet="img/content/thumbnails/training-06@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              1600
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">
                            run, forrest, run
                          </h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#бег</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#500ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                5
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Узнайте правильную технику бега, развивайте
                              выносливость и&nbsp;откройте для себя все секреты
                              длительных пробежек.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-07.webp, img/content/thumbnails/training-07@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-07.jpg"
                                srcSet="img/content/thumbnails/training-07@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              1600
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">fitball</h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#пилатес</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#200ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                5
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Тренировка на&nbsp;фитболе&nbsp;— отличном тренажере
                              для развития чувства баланса и&nbsp;равновесия,
                              улучшения координации.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-08.webp, img/content/thumbnails/training-08@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-08.jpg"
                                srcSet="img/content/thumbnails/training-08@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              1800
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">hatha</h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#йога</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#350ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                4
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Упражнения по&nbsp;хатха йоге, направленные
                              на&nbsp;понижение нервной возбудимости
                              и&nbsp;активацию процессов анаболизма.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-09.webp, img/content/thumbnails/training-09@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-09.jpg"
                                srcSet="img/content/thumbnails/training-09@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              1800
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">
                            full body stretch
                          </h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#стретчинг</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#400ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                5
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Комплекс упражнений на&nbsp;растяжку всего тела для
                              новичков. Плавное погружение в&nbsp;стретчинг
                              и&nbsp;умеренная нагрузка.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-10.webp, img/content/thumbnails/training-10@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-10.jpg"
                                srcSet="img/content/thumbnails/training-10@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              2000
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">upper body</h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#силовые</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#800ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                4
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Проработка мышц груди для профи, экспериментируем
                              с&nbsp;уровнем наклона скамьи и&nbsp;различной шириной
                              хвата.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-11.webp, img/content/thumbnails/training-11@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-11.jpg"
                                srcSet="img/content/thumbnails/training-11@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              2200
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">
                            devil's cindy
                          </h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#кроссфит</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#950ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                5
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Знаменитый кроссфит комплекс. Синди&nbsp;—
                              универсальная тренировка для развития функциональной
                              силы.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="my-trainings__item">
                      <div className="thumbnail-training">
                        <div className="thumbnail-training__inner">
                          <div className="thumbnail-training__image">
                            <picture>
                              <source
                                type="image/webp"
                                srcSet="img/content/thumbnails/training-12.webp, img/content/thumbnails/training-12@2x.webp 2x"
                              />
                              <img
                                src="img/content/thumbnails/training-12.jpg"
                                srcSet="img/content/thumbnails/training-12@2x.jpg 2x"
                                width={330}
                                height={190}
                                alt=""
                              />
                            </picture>
                          </div>
                          <p className="thumbnail-training__price">
                            <span className="thumbnail-training__price-value">
                              2400
                            </span>
                            <span>₽</span>
                          </p>
                          <h3 className="thumbnail-training__title">fleksbend</h3>
                          <div className="thumbnail-training__info">
                            <ul className="thumbnail-training__hashtags-list">
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#аэробика</span>
                                </div>
                              </li>
                              <li className="thumbnail-training__hashtags-item">
                                <div className="hashtag thumbnail-training__hashtag">
                                  <span>#450ккал</span>
                                </div>
                              </li>
                            </ul>
                            <div className="thumbnail-training__rate">
                              <svg width={16} height={16} aria-hidden="true">
                                <use xlinkHref="#icon-star" />
                              </svg>
                              <span className="thumbnail-training__rate-value">
                                4
                              </span>
                            </div>
                          </div>
                          <div className="thumbnail-training__text-wrapper">
                            <p className="thumbnail-training__text">
                              Тренируясь с&nbsp;резинкой для фитнеса, вы можете
                              проработать почти все мышечные группы
                              и&nbsp;разнообразить тренировки.
                            </p>
                          </div>
                          <div className="thumbnail-training__button-wrapper">
                            <Link
                              className="btn btn--small thumbnail-training__button-catalog"
                              to="*"
                            >
                              Подробнее
                            </Link>
                            <Link
                              className="btn btn--small btn--outlined thumbnail-training__button-catalog"
                              to="*"
                            >
                              Отзывы
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
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
