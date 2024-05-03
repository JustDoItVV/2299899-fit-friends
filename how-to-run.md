## Запуск проект - Stage

### 1. Создать `.stage.env` файл

Создать `.stage.env` файл в корне проекта. Список переменных и их описание приведено в файле [description.md](description.md) разделе "[Переменные окружения](description.md#переменные-окружения)". В корне проекта приведен пример файла `.stage.env-example`.

### 2. Запуск приложения в контейнере

Примечание: осле разворачивания контенера postgres возможно нужно подождать несколько секунд, пока не закончится инициализация,
для корректной работы приложения

#### Вариант 1

Воспользоваться готовым docker образом по ссылке [fit-friends.stage](https://github.com/users/JustDoItVV/packages/container/package/fit-friends.stage)
через сценарий:

```
npm run stage:pull:up
```

#### Вариант 2

Самостоятельно локально собрать и запустить docker образ

```
npm run dev:install
npm run stage
```

### [Опционально] 3.1. Наполнить базу моковыми данными

```
npm run stage:cli -- --generate 50 postgresql://admin:123456@fit_friends_postgres:5432/fit_friends?schema=public
```

### [Опционально] 3.2. Подключить сервер postgres в pgAdmin

- После старта контейнера pgAdmin возможно потребуется подождать несколько секунд перед тем, как веб-интерфейс запустится
- PGAdmin ([http://localhost:8081/browser/](http://localhost:8081/browser/)) -> ПКМ на Servers -> Register -> Server...
- Вкладка General -> поле Name: POSTGRES_DB из env файла
- Вкладка Connection -> поле Hostname/address: fit_friends_postgres (container_name из docker-compose.dev.yml)
- Вкладка Connection -> поле username: POSTGRES_USER из env файла
- Вкладка Connection -> поле password: POSTGRES_PASSWORD из env файла

## Ручное тестирование

(Порты указаны для примера и должны быть использованы заданные в .env файле)

- Интерактивная OpenAPI спецификация: [http://localhost:3001/spec/](http://localhost:3001/spec/)
- Интерфейс FakeSMPTServer для контроля отправки почты: [http://localhost:1083/](http://localhost:1083/)
- интерфейс pgAdmin для контроля записей в БД: [http://localhost:8081/browser/](http://localhost:8081/browser/)
- .http файлы:
  - [apps/backend/src/app/user/user.http](apps/backend/src/app/user/user.http) - пользователи
  - [apps/backend/src/app/training/training.http](apps/backend/src/app/training/training.http) - тренировки, каталог тренировок, ЛК тренера
  - [apps/backend/src/app/account-user/account-user.http](apps/backend/src/app/account-user/account-user.http) - ЛК пользователя
  - [apps/backend/src/app/notification/notification.http](apps/backend/src/app/notification/notification.http) - Оповещения
  - [apps/backend/src/app/training-request/training-request.http](apps/backend/src/app/training-request/training-request.http) - Персональные тренировки/совместные тренировки
  - [apps/backend/src/app/review/review.http](apps/backend/src/app/review/review.http) - Отзывы
