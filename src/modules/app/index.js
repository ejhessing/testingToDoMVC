import redirectToAll from './chains/redirectToAll'
import setTitle from './chains/setTitle'
import submitTodo from './chains/submitTodo'
import setTodoNewTitle from './chains/setTodoNewTitle'
import overwriteTodoTitle from './chains/overwriteTodoTitle'
import removeTodo from './chains/removeTodo'
import editTodo from './chains/editTodo'
import toggleAllChecked from './chains/toggleAllChecked'
import toggleTodoCompleted from './chains/toggleTodoCompleted'
import stopEditingTodo from './chains/stopEditingTodo'
import clearCompletedTodos from './chains/clearCompletedTodos'
import setFilter from './chains/setFilter'

export default {
  state: {
    newTodoTitle: '',
    todos: { },
    filter: 'all',
    isSaving: false
  },
  signals: {
    rootRouted: redirectToAll,
    newTodoTitleChanged: setTitle, //test
    newTodoSubmitted: submitTodo, //partly tested
    todoNewTitleChanged: setTodoNewTitle, //test
    todoNewTitleSubmitted: overwriteTodoTitle, //test
    removeTodoClicked: removeTodo, //test
    todoDoubleClicked: editTodo, //test
    toggleAllChanged: toggleAllChecked, //test
    toggleTodoCompletedChanged: toggleTodoCompleted, //test
    todoNewTitleAborted: stopEditingTodo, //test
    clearCompletedClicked: clearCompletedTodos, //test
    filterClicked: setFilter //test
  }
}
