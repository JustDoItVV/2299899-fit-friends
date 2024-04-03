import { FrontendRoute } from '@2299899-fit-friends/types';

import Header from '../../components/header/header';

export default function TrainingsCreatePage(): JSX.Element {
  return (
    <div className="wrapper">
      <Header page={FrontendRoute.Personal} />
      <main>
        <div className="popup-form popup-form--create-training">
          <div className="popup-form__wrapper">
            <div className="popup-form__content">
              <div className="popup-form__title-wrapper">
                <h1 className="popup-form__title">Создание тренировки</h1>
              </div>
              <div className="popup-form__form">
                <form method="get">
                  <div className="create-training">
                    <div className="create-training__wrapper">
                      <div className="create-training__block">
                        <h2 className="create-training__legend">
                          Название тренировки
                        </h2>
                        <div className="custom-input create-training__input">
                          <label>
                            <span className="custom-input__wrapper">
                              <input type="text" name="training-name" />
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className="create-training__block">
                        <h2 className="create-training__legend">
                          Характеристики тренировки
                        </h2>
                        <div className="create-training__info">
                          <div className="custom-select custom-select--not-selected">
                            <span className="custom-select__label">
                              Выберите тип тренировки
                            </span>
                            <button
                              className="custom-select__button"
                              type="button"
                              aria-label="Выберите одну из опций"
                            >
                              <span className="custom-select__text" />
                              <span className="custom-select__icon">
                                <svg width={15} height={6} aria-hidden="true">
                                  <use xlinkHref="#arrow-down" />
                                </svg>
                              </span>
                            </button>
                            <ul className="custom-select__list" role="listbox"></ul>
                          </div>
                          <div className="custom-input custom-input--with-text-right">
                            <label>
                              <span className="custom-input__label">
                                Сколько калорий потратим
                              </span>
                              <span className="custom-input__wrapper">
                                <input type="number" name="calories" />
                                <span className="custom-input__text">ккал</span>
                              </span>
                            </label>
                          </div>
                          <div className="custom-select custom-select--not-selected">
                            <span className="custom-select__label">
                              Сколько времени потратим
                            </span>
                            <button
                              className="custom-select__button"
                              type="button"
                              aria-label="Выберите одну из опций"
                            >
                              <span className="custom-select__text" />
                              <span className="custom-select__icon">
                                <svg width={15} height={6} aria-hidden="true">
                                  <use xlinkHref="#arrow-down" />
                                </svg>
                              </span>
                            </button>
                            <ul className="custom-select__list" role="listbox"></ul>
                          </div>
                          <div className="custom-input custom-input--with-text-right">
                            <label>
                              <span className="custom-input__label">
                                Стоимость тренировки
                              </span>
                              <span className="custom-input__wrapper">
                                <input type="number" name="price" />
                                <span className="custom-input__text">₽</span>
                              </span>
                            </label>
                          </div>
                          <div className="custom-select custom-select--not-selected">
                            <span className="custom-select__label">
                              Выберите уровень тренировки
                            </span>
                            <button
                              className="custom-select__button"
                              type="button"
                              aria-label="Выберите одну из опций"
                            >
                              <span className="custom-select__text" />
                              <span className="custom-select__icon">
                                <svg width={15} height={6} aria-hidden="true">
                                  <use xlinkHref="#arrow-down" />
                                </svg>
                              </span>
                            </button>
                            <ul className="custom-select__list" role="listbox"></ul>
                          </div>
                          <div className="create-training__radio-wrapper">
                            <span className="create-training__label">
                              Кому подойдет тренировка
                            </span>
                            <br />
                            <div className="custom-toggle-radio create-training__radio">
                              <div className="custom-toggle-radio__block">
                                <label>
                                  <input type="radio" name="gender" />
                                  <span className="custom-toggle-radio__icon" />
                                  <span className="custom-toggle-radio__label">
                                    Мужчинам
                                  </span>
                                </label>
                              </div>
                              <div className="custom-toggle-radio__block">
                                <label>
                                  <input
                                    type="radio"
                                    name="gender"
                                    defaultChecked
                                  />
                                  <span className="custom-toggle-radio__icon" />
                                  <span className="custom-toggle-radio__label">
                                    Женщинам
                                  </span>
                                </label>
                              </div>
                              <div className="custom-toggle-radio__block">
                                <label>
                                  <input type="radio" name="gender" />
                                  <span className="custom-toggle-radio__icon" />
                                  <span className="custom-toggle-radio__label">
                                    Всем
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="create-training__block">
                        <h2 className="create-training__legend">
                          Описание тренировки
                        </h2>
                        <div className="custom-textarea create-training__textarea">
                          <label>
                            <textarea
                              name="description"
                              placeholder=" "
                              defaultValue={""}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="create-training__block">
                        <h2 className="create-training__legend">
                          Загрузите видео-тренировку
                        </h2>
                        <div className="drag-and-drop create-training__drag-and-drop">
                          <label>
                            <span className="drag-and-drop__label" tabIndex={0}>
                              Загрузите сюда файлы формата MOV, AVI или MP4
                              <svg width={20} height={20} aria-hidden="true">
                                <use xlinkHref="#icon-import-video" />
                              </svg>
                            </span>
                            <input
                              type="file"
                              name="import"
                              tabIndex={-1}
                              accept=".mov, .avi, .mp4"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                    <button className="btn create-training__button" type="submit">
                      Опубликовать
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
