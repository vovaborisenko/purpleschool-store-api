# purpleschool-store-api

API по управлению товарами

## Настройка

1. Заполните .env переменные.

    ```yml
    DATABASE_URL="postgresql://{USER_NAME}:{USER_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?schema=public"
    SUPER_ADMIN_LOGIN= # email супер админа
    SUPER_ADMIN_PASSWORD= # пароль супер админа
    SECRET= # secret для JWT
    SALT= # соль для пароля пользователя
    ```

## Запустить docker

В корне проекта в терминале запустить команду:

```powershell
docker compose -d up
```

После успешного запуска контейнеров:

- База данных будет доступна по адресу localhost:5432
- PGAdmin панель в браузере можно открыть по адресу <http://localhost:5050/>
