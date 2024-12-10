import classNames from 'classnames';
import React, { useState } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  tempTodo: Todo | null;
  handleDeleteTodo: (id: number) => void;
  changeCompleted: (todo: Todo) => void;
  handleChangeTitle: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  tempTodo,
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

    if (trimmedQuery) {
      handleChangeTitle({ userId, id, title: query, completed });
    } else {
      handleDeleteTodo(id);
    }

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
              {!isLoading ? title : 'Todo is being saved now'}
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
          <form onSubmit={handleSubmit} className="todo__edit-form">
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              value={query}
              placeholder="Empty todo will be deleted"
              onChange={event => setQuery(event.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </form>
        )}

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {tempTodo && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">{/* eslint-disable-line jsx-a11y/label-has-associated-control */}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
