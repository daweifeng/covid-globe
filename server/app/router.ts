import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.get('/cases/confirmed', controller.cases.confirmed);
  router.get('/cases/confirmedByLocation', controller.cases.confirmedCasesBylocation);
};
