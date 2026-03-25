import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loadingTodoId: number | null;
  handleDeleteTodo: (id: number) => void;
  changeCompleted: (todo: Todo) => void;
  handleChangeTitle: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loadingTodoId,
  handleDeleteTodo,
  changeCompleted,
  handleChangeTitle,
}) => {
  const { userId, id, title, completed } = todo;

  const [isDblClicked, setIsDblClicked] = useState(false);
  const [query, setQuery] = useState(title);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery === title) {
      setIsDblClicked(false);

      return;
    }

    if (!trimmedQuery) {
      handleDeleteTodo(id);

      return;
    }

    handleChangeTitle({ userId, id, title: trimmedQuery, completed });
    setIsDblClicked(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      setQuery(title);
      setIsDblClicked(false);
    }
  };

  return (
    <>
      <div
        data-cy="Todo"
        key={id}
        className={classNames('todo', {
          completed: completed,
        })}
      >
        <label className="todo__status-label">
          {/* eslint-disable-line jsx-a11y/label-has-associated-control */}
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={() => changeCompleted(todo)}
          />
        </label>

        {!isDblClicked ? (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setIsDblClicked(true)}
            >
              {loadingTodoId === id ? 'Todo is being saved now' : title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDeleteTodo(id)}
            >
              ×
            </button>
          </>
        ) : (
          <form
            onSubmit={event => {
              event.preventDefault();
              handleSubmit(event);
            }}
            className="todo__edit-form"
          >
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              value={query}
              placeholder="Empty todo will be deleted"
              onChange={event => setQuery(event.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
            />
          </form>
        )}

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': loadingTodoId === id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
