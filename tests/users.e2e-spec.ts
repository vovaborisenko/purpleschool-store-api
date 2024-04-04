import request from 'supertest';
import { App } from '../src/app';
import { boot } from '../src/main';
import { config } from 'dotenv';

const { parsed: { SUPER_ADMIN_LOGIN, SUPER_ADMIN_PASSWORD } = {} } = config();

let application: App;

beforeAll(async () => {
  const { app } = await boot;

  application = app;
});

afterAll(() => {
  application.close();
});

describe('Users Controller', () => {
  it('Register - error', async () => {
    const res = await request(application.app).post('/users/sign-up').send({
      email: SUPER_ADMIN_LOGIN,
      password: SUPER_ADMIN_PASSWORD,
      name: 'user name',
    });

    expect(res.status).toBe(422);
  });

  it('Login - error', async () => {
    const res = await request(application.app).post('/users/sign-in').send({
      email: 'login@mail.com',
      password: 'pasrdку_wrong',
    });

    expect(res.status).toBe(401);
  });

  it('Login - success', async () => {
    const res = await request(application.app).post('/users/sign-in').send({
      email: SUPER_ADMIN_LOGIN,
      password: SUPER_ADMIN_PASSWORD,
    });

    expect(res.status).toBe(200);
    expect(res.body.jwt).toBeTruthy();
  });

  it('Info - error', async () => {
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', 'Bearer wrong_jwt');

    expect(res.status).toBe(401);
  });

  it('Info - success', async () => {
    const {
      body: { jwt },
    } = await request(application.app).post('/users/sign-in').send({
      email: SUPER_ADMIN_LOGIN,
      password: SUPER_ADMIN_PASSWORD,
    });
    const res = await request(application.app)
      .get('/users/info')
      .set('Authorization', `Bearer ${jwt}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(1);
    expect(res.body.email).toBe(SUPER_ADMIN_LOGIN);
  });
});
