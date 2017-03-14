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

  it('sets the filter', () => {
    return runSignal('app.filterClicked', { filter: 'test value' })
      .then(({ state }) => {
        expect(state.app.filter).toBe('test value');
      });
  });

  it('sets the title', () => {
    return runSignal('app.newTodoTitleChanged', { title: 'test' })
      .then(({ state }) => {
        expect(state.app.newTodoTitle).toBe('test');
      });
  });
});


describe('Tests with stubbed state', () => {    
  const ref = 'dcfd5863-790c-4ae2-8183-a47b85802495';
  let runSignal;

  beforeEach(() => {
    App.state = {
      newTodoTitle: '',
      todos: {
        'dcfd5863-790c-4ae2-8183-a47b85802495': {
          isSaving: false,
          title: "toBeDeleted",
          completed: false,
          id: 1489447807501
        },
        '11115863-790c-4ae2-8183-a47b85801111': { 
          isSaving: false,
          title: "notDeleted",
          completed: false,
          id: 1489447807512
        }
      },
      filter: 'all',
      isSaving: false
    }
    
    runSignal = RunSignal({
      modules: {
        app: App
      }
    });
  });

  it('edit ToDo true', () => {
    return runSignal('app.todoDoubleClicked', { ref })
      .then(({ state }) => {
        expect(state.app.todos[ref].$isEditing).toBe(true);
      })
  });

  it('toggle completed to be true', () => {
    return runSignal('app.toggleTodoCompletedChanged', { ref })
      .then(({ state }) => {
        expect(state.app.todos[ref].completed).toBe(true);
      })
  });


  it('remove Todo', () => {
    return runSignal('app.removeTodoClicked', { ref })
      .then(({ state }) => {
        expect(state.app.todos).toMatchObject({
            '11115863-790c-4ae2-8183-a47b85801111': {
              isSaving: false,
              title: "notDeleted",
              completed: false,
              id: 1489447807512
            }
        });
      });
  });

});
