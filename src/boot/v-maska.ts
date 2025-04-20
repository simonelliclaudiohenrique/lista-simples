import { boot } from 'quasar/wrappers';
import { vMaska } from 'maska/vue';

export default boot(({ app }) => {
  app.directive('maska', vMaska);
});
