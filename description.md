## Запуск проект - Development

### 1. Создать `.env` файл

Создать `.env` файл в корне проекта. Список переменных и их описание приведено в разделе "[Переменные окружения](#переменные-окружения)". В корне проекта приведен пример файла `.env-example`.

### 2. Установить все зависимости npm, docker контейнеры, миграции

```
npm run dev
```

### 2.1. Выборочная установка зависимостей (для тестирования)

Только npm пакеты и генерация клиента Prisma
```
dev:install
```

Только развертывание docker контейнеров внешних приложений
```
dev:dependencies
```

### 3. Запустить проект

Терминал 1:

```
npm run dev:backend
```

Терминал 2:

```
npm run dev:frontend
```

### [Опционально] 4.1. Наполнить базу моковыми данными

```
npm run dev:cli -- --generate 50 postgresql://admin:123456@localhost:5432/fit_friends?schema=public
```

### [Опционально] 4.2. Подключить сервер postgres в pgAdmin

- После старта контейнера pgAdmin возможно потребуется подождать несколько секунд перед тем, как веб-интерфейс запустится
- PGAdmin ([http://localhost:8081/browser/](http://localhost:8081/browser/)) -> ПКМ на Servers -> Register -> Server...
- Вкладка General -> поле Name: POSTGRES_DB из env файла
- Вкладка Connection -> поле Hostname/address: fit_friends_postgres (container_name из docker-compose.dev.yml)
- Вкладка Connection -> поле username: POSTGRES_USER из env файла
- Вкладка Connection -> поле password: POSTGRES_PASSWORD из env файла

## Автоматизированное тестирование

Запуск юнит тестов

```
npm run dev:tests
```


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

## Сценарии

- `dev:cli` - запук CLI утилиты для генерации моковых данных и заполнения базы данных. Команды (после `npm run dev:cli -- `):
  - `--help` - показать справку
  - `--generate <n> <connection string>` - генерация `<n>` записей и наполнение базы данных по адресу `<connection string>`. Пример:
  ```
  npm run dev:cli -- --generate 10 postgresql://admin:123456@localhost:5432/fit_friends?schema=public
  ```
- `dev:backend` - запуск бэкэнд приложения
- `dev:frontend` - запуск фронтэнд приложения
- `dev:lint` - проверка EsLint директорий
- `dev:tests` - запуск юнит тестов frontend, frontend-core с детализацией
- `dev:install` - установка npm зависимостей и генерация клиента Prisma
- `dev:dependencies` - установка зависимостей приложения в docker контейнерах
- `dev` - установка всех необходимых для запуска приложения зависимостей npm, docker, миграций на этапе разработки
- `stage:build:backend` - сборка build дистрибутива приложения `backend`
- `stage:build:cli` - сборка build дистрибутива приложения `cli`
- `stage:build:frontend` - сборка build дистрибутива приложения `frontend`
- `stage:build` - сборка build дистрибутивов всех приложений
- `stage:container:build` - сборка образа docker контейнера
- `stage:container:up` - запуск контейнера приложения и зависимостей
- `stage:container:db:migrate` - применение миграций в контейнерном приложении
- `stage:container:db:reset` - сброс состояния БД в контейнерном приложении
- `stage:container` - создание образа контейнера
- `stage` - сборка build приложения и упаковка в контенейнер на этапе stage
- `stage:cli` - запуск приложения `cli` в докер контейнере
- `stage:pull:up` - скачивание готового образа приложения и развёртывание через docker compose необходимых зависимостей

## Переменные окружения

Файл `.env` в корне проекта.

| <Переменная>=<пример> | Описание |
| :--- | --- |
| NODE_ENV=development | Окружение |
| HOST=localhost | Адрес хоста |
| BACKEND_PORT=3001 | Порт приложения `backend` |
| UPLOAD_DIRECTORY_PATH=<BASE_DIR>/uploads | Директория для загрузки файло, <BASE_DIR> - указать абсолютный путь до базовой директории проекта |
| MOCK_PASSWORD=123456 | Пароль для генерации моковых данных пользователей |
| PUBLIC_DIRECTORY_PATH=./apps/frontend/public | Директория для статических файлов приложения `frontend` |
|     |     |
| JWT_ACCESS_TOKEN_SECRET=very-secret | Секрет JWT access токена |
| JWT_ACCESS_TOKEN_EXPIRES_IN=15m | Время жизни JWT access токена |
| JWT_REFRESH_TOKEN_SECRET=very-secret-x2 | Секрет JWT refresh токена |
| JWT_REFRESH_TOKEN_EXPIRES_IN=7d | Время жизни JWT refresh токена |
|     |     |
| POSTGRES_PORT=5432 | Порт для создания докер контейнера `PostgreSQL` |
| POSTGRES_USER=admin | Пользователь Postgres |
| POSTGRES_PASSWORD=123456 | Пароль Postgres |
| POSTGRES_DB=guitar_shop | Название базы данных Postgres |
| PGADMIN_DEFAULT_EMAIL=local@local.local | Логин PGAdmin |
| PGADMIN_DEFAULT_PASSWORD=a12345678 | Пароль PGAdmin |
| PGADMIN_PORT=8081 | Порт для создания докер контейнера `PGAdmin` |
| DATABASE_URL=postgresql://<user>:<password>@<host or docker container name>:<port>/fit_friends?schema=public | Url для подключения к базе данных: <user> - пользователь из POSTGRES_USER, <password> - пароль из POSTGRES_PASSWORD, <port> - порт из POSTGRES_PORT |
|     |     |
| DEFAULT_USER_NAME=admin | Имя пользователя для генерации моковых данных |
| DEFAULT_USER_EMAIL=admin@local.local | Электронная почта для генерации моковых данных |
| DEFAULT_USER_PASSWORD=admin | Пароль для генерации моковых данных |
|     |     |
| VITE_FRONTEND_HOST=localhost | Адрес хоста приложения `frontend` |
| VITE_FRONTEND_PORT=3000 | Порт vite приложения `frontend` |
| VITE_FRONTEND_PREVIEW_PORT=3100 | Порт превью vite приложения `frontend` |
|     |     |
| FAKE_SMTP_SERVER_PORT_1=8025 | Порт 1 для создания докер контейнера `Fake SMPT Server` |
| FAKE_SMTP_SERVER_PORT_2=1083 | Порт 2 для создания докер контейнера `Fake SMPT Server` |
| MAIL_SMTP_HOST=localhost | Сервер для отправляемых писем |
| MAIL_SMTP_PORT=8025 | Порт для отправляемых писем |
| MAIL_USER_NAME=name | Имя пользователя SMTP сервера |
| MAIL_USER_PASSWORD=password | Пароль SMTP сервера |
| MAIL_FROM=localhost@local.local | Адрес отправителя писем |
