# Service Center — Node.js REST API (вариант 18)

Короткая реализация для лабораторной работы: сервис по ремонту компьютерной техники.

Файлы:
- `app.js` — главный файл сервера
- `src/store.js` — простое in-memory хранилище и функции для работы с данными
- `src/routes/*.js` — маршруты: `customers`, `devices`, `repairs`

Запуск сервера (backend):

1. Скопируйте `.env.example` в `.env` и при необходимости измените `MONGO_URI` и `JWT_SECRET`.

```bash
cd /home/vlad/Desktop/STRWEB/React
npm install
npm run seed    # заполнить БД тестовыми данными
npm run dev     # или npm start
```

Сервер доступен по `http://localhost:3000`.

Запуск клиента (React/Vite):

```bash
cd client
npm install
npm run dev
```

Клиент по умолчанию доступен по `http://localhost:5173`. Если возникают проблемы CORS — запустите сервер и клиент, или используйте прокси.
- Хранилище in-memory — данные не сохраняются при перезапуске. Это упрощённая реализация для лабораторной работы.
- Можно расширить: подключить базу данных (SQLite/Postgres/Mongo), добавить аутентификацию, валидацию через `joi` и т.п.

Замечания по реализации:

- Backend теперь использует MongoDB + Mongoose. Модели: `User`, `Client`, `Device`, `Repair`.
- Аутентификация: локальная (username/password) + JWT. Роуты: `/api/auth`, `/api/clients`, `/api/devices`, `/api/repairs`.
- Примеры: после `npm run seed` будут созданы пользователи `admin/admin123` и `tech/tech123`.
- Frontend: минимальный React-клиент (`client/`) с компонентами и страницами: Home, Catalog (catalog + device view), Clients, Repairs, Login.


Примеры запросов (curl):

Получить список клиентов:
```bash
curl http://localhost:3000/api/customers
```

Добавить клиента:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Новый Клиент","phone":"+7-900-222-3333"}' http://localhost:3000/api/customers
```

Создать ремонт:
```bash
curl -X POST -H "Content-Type: application/json" -d '{"deviceId":1,"description":"Не заряжается"}' http://localhost:3000/api/repairs
```

Заметки:
- Хранилище in-memory — данные не сохраняются при перезапуске. Это упрощённая реализация для лабораторной работы.
- Можно расширить: подключить базу данных (SQLite/Postgres/Mongo), добавить аутентификацию, валидацию через `joi` и т.п.
