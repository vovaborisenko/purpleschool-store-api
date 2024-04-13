import { Container } from 'inversify';
import { App } from './app';
import { appBindings } from './inversify.config';
import { TYPES } from './types';

interface IBootstrapReturn {
  app: App;
  appContainer: Container;
}

async function bootstrap(): Promise<IBootstrapReturn> {
  const appContainer = new Container();

  appContainer.load(appBindings);

  const app = appContainer.get<App>(TYPES.Application);

  await app.init();

  return { app, appContainer };
}

export const boot = bootstrap();
