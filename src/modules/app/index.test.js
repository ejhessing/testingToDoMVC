import { RunSignal } from 'cerebral/test';

import App from '.';

describe('App module', () => {
  let runSignal;

  beforeEach(() => {
    runSignal = RunSignal({
      modules: {
        app: App
      }
    });
  });

  describe('filterClicked signal', () => {
    it('sets the filter', () => {
      return runSignal('app.filterClicked', { filter: 'test value' }).then(({ state }) => {
        expect(state.app.filter).toBe('test value');
      });
    });
  });
});
