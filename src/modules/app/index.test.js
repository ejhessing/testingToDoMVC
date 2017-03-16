import { RunSignal, runAction } from 'cerebral/test';
import { state } from 'cerebral/tags';

import App from '.';

import createTodo from './actions/createTodo';
import postTodo from './actions/postTodo';

describe('App module', () => {
  let runSignal;
  
  beforeEach(() => {
    runSignal = RunSignal({
      modules: {
        app: App
      }
    });
  });

  afterEach(() => {
    App.state = {
      newTodoTitle: '',
      todos: {},
      filter: 'all',
      isSaving: false
    }
  })

  it('sets the filter', () => {
    return runSignal('app.filterClicked', { filter: 'test value' })
      .then(({ state }) => {
        expect(state.app.filter).toBe('test value');
      });
  });

  it('sets the title', () => {
    return runSignal('app.newTodoTitleChanged', { title: 'new title' })
      .then(({ state }) => {
        expect(state.app.newTodoTitle).toBe('new title');
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
          title: 'toBeDeleted',
          completed: false,
          id: 1489447807501
        },
        '11115863-790c-4ae2-8183-a47b85801111': { 
          isSaving: false,
          title: 'notDeleted',
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
              title: 'notDeleted',
              completed: false,
              id: 1489447807512
            }
        });
      });
  });

  it('Clear Completed Todos', () => {
    App.state.todos[ref].completed = true;
    return runSignal('app.clearCompletedClicked')
      .then(({ state }) => {
        expect(state.app.todos).toMatchObject({
            '11115863-790c-4ae2-8183-a47b85801111': {
              isSaving: false,
              title: 'notDeleted',
              completed: false,
              id: 1489447807512
            }
        });
      });
  });

  it('Toggle All Checked ', () => {
    return runSignal('app.toggleAllChanged')
      .then(({ state }) => {
        expect(state.app.todos).toMatchObject({
        'dcfd5863-790c-4ae2-8183-a47b85802495': {
          isSaving: false,
          title: 'toBeDeleted',
          completed: true,
          id: 1489447807501
        },
        '11115863-790c-4ae2-8183-a47b85801111': { 
          isSaving: false,
          title: 'notDeleted',
          completed: true,
          id: 1489447807512
        }
      });
    });
  });

});


describe('Test with editing State', () => {    
  const ref = 'dcfd5863-790c-4ae2-8183-a47b85802495';

  let runSignal;

  beforeEach(() => {
    App.state = {
      newTodoTitle: '',
      todos: {
        'dcfd5863-790c-4ae2-8183-a47b85802495': {
          isSaving: false,
          title: 'Change name please',
          completed: false,
          id: 1489447807501,
          $isEditing: true,
          $newTitle: 'New Name'
        },
        '11115863-790c-4ae2-8183-a47b85801111': { 
          isSaving: false,
          title: 'notDeleted',
          completed: true,
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

  it('stop editing todo', () => {
    return runSignal('app.todoNewTitleAborted', { ref })
      .then(({ state }) => {
        expect(state.app.todos[ref].$isEditing).toBe(false);
      })
  });

  it('overwrite todo title', () => {
    return runSignal('app.todoNewTitleSubmitted', { ref })
      .then(({ state }) => {
        expect(state.app.todos[ref].title).toBe('New Name');
      })
  })

  it('overwrite todo title, stop editing todo', () => {
    return runSignal('app.todoNewTitleSubmitted', { ref })
      .then(({ state }) => {
        expect(state.app.todos[ref].$isEditing).toBe(false);
      })
  })

  it('Set Todo New Title', () => {
    const ref = '11115863-790c-4ae2-8183-a47b85801111';
    const title = 'New Todo Title';

    return runSignal('app.todoNewTitleChanged', { ref, title  })
      .then(({ state }) => {
        expect(state.app.todos[ref].$newTitle).toBe('New Todo Title');
      })
  })
});


describe('Create Todo Action', () => {    
  let stubState;

  beforeEach(() => {
   stubState = { 
      state: {
        app: {
        newTodoTitle: 'New Todo',
        todos: {},
        filter: 'all',
        isSaving: false
        }
      }
    } 
  });

  it('Create a new ref ', () => {
    return runAction(createTodo, stubState)
      .then((data) => {
        expect(data.output.ref).toBeTruthy();
      })
  });

  it('Check if a new todo is created with the right properties', () => {
    return runAction(createTodo, stubState)
      .then((data) => {
        const todos = data.state.app.todos;
        const firstTodo = Object.keys(todos)[0];
        expect(todos[firstTodo]).toMatchObject({
          $isSaving: true,
          title: 'New Todo',
          completed: false
        });
      })
  });

 
});

describe('SubmitTodo Signal', () => {    
  const ref = 'dcfd5863-790c-4ae2-8183-a47b85802495';

  let runSignal;

  beforeEach(() => {
    App.state = {
      newTodoTitle: 'New Todo',
      todos: {},
      filter: 'all',
      isSaving: false
    }
    
    runSignal = RunSignal({
      modules: {
        app: App
      }
    });
  });


  it('Clear new todo Title ', () => {
    return runSignal('app.newTodoSubmitted')
      .then(({ state }) => {
        expect(state.app.newTodoTitle).toBe('');
      })
  });

  it('Make sure isSaving is turned off ', () => {
    App.state.isSaving = true;
    return runSignal('app.newTodoSubmitted')
      .then(({ state }) => {
        expect(state.app.isSaving).toBe(false);
      })
  });


});

