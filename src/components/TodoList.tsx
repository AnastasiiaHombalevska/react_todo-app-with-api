import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  loadingTodoId: number | null;
  tempTodo: Todo | null;
  handleDeleteTodo: (id: number) => void;
  changeCompleted: (todo: Todo) => void;
  handleChangeTitle: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoId,
  tempTodo,
  handleDeleteTodo,
  changeCompleted,
  handleChangeTitle,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          loadingTodoId={loadingTodoId}
          handleDeleteTodo={handleDeleteTodo}
          changeCompleted={changeCompleted}
          handleChangeTitle={handleChangeTitle}
        />
      ))}

      {tempTodo && (
        <div data-cy="Todo" className="todo">
  <input
    id={`todo-status-${tempTodo.id}`}
    data-cy="TodoStatus"
    type="checkbox"
    className="todo__status"
    checked={false}
    readOnly
  />

  <label
    className="todo__status-label"
    htmlFor={`todo-status-${tempTodo.id}`}
  >
    {/* додаємо пустий span, щоб правило пройшло */}
    <span className="sr-only">Mark todo as completed</span>
  </label>

  <span data-cy="TodoTitle" className="todo__title">
    {tempTodo.title}
  </span>

  <button type="button" className="todo__remove" data-cy="TodoDelete">
    ×
  </button>

  <div
    data-cy="TodoLoader"
    className={`modal overlay ${loadingTodoId === tempTodo.id ? 'is-active' : ''}`}
  >
    <div className="modal-background has-background-white-ter" />
    <div className="loader" />
  </div>
</div>

      )}
    </section>
  );
};
