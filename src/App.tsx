/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as clientService from './api/todos';

import { Todo } from './types/Todo';
import { FilterQuery } from './types/FilterQuery';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorsHandler } from './components/ErrorsHandler';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [activeFilterBtn, setActiveFilterBtn] = useState('all');
  const [title, setTitle] = useState('');
  const [isFocused, setIsFocused] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    clientService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo = {
      title,
      id: 0,
      userId: clientService.USER_ID,
      completed: false,
    };

    const newTodo: Todo = {
      id: Math.max(0, ...todos.map(todo => todo.id)) + 1,
      title: title.trim(),
      userId: clientService.USER_ID,
      completed: false,
    };

    setIsDisabled(true);
    setTempTodo(newTempTodo);

    return clientService
      .addTodos(newTodo)
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setTitle('');
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        setIsDisabled(false);
        setIsFocused(true);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setIsDisabled(true);
    setIsLoading(true);

    return clientService
      .deleteTodos(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
        setIsFocused(true);
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setIsLoading(false);
        setIsDisabled(false);
      });
  };

  const changeCompleted = (updatedTodo: Todo) => {
    setIsLoading(true);

    const toggledTodo = { ...updatedTodo, completed: !updatedTodo.completed };

    return clientService
      .updateTodos(toggledTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === toggledTodo.id ? toggledTodo : todo,
          ),
        );
      })
      .catch(() => setErrorMessage('Unable to update the todo status'))
      .finally(() => setIsLoading(false));
  };

  const handleChangeTitle = (updatedTodo: Todo) => {
    setIsLoading(true);

    return clientService
      .updateTodos(updatedTodo)
      .then(() => {
        setTodos(prevTodos =>
          prevTodos.map(todo =>
            todo.id === updatedTodo.id
              ? { ...todo, title: updatedTodo.title }
              : todo,
          ),
        );
        setErrorMessage('');
      })
      .catch(() => setErrorMessage('Unable to update the todo'))
      .finally(() => setIsLoading(false));
  };

  const handleToggleAll = () => {
    return clientService.updateTodos(todos[0]).then(() => {
      setTodos(prevTodos => {
        const allCompleted = prevTodos.every(todo => todo.completed);

        return prevTodos.map(todo => ({
          ...todo,
          completed: !allCompleted,
        }));
      });
    });
  };

  const clearCompletedTodos = () => {
    return clientService
      .getTodos()
      .then(allTodos => {
        const deletePromises = allTodos
          .filter(todo => todo.completed)
          .map(todo => clientService.deleteTodos(todo.id));

        return Promise.all(deletePromises).then(() => {
          setTodos(allTodos.filter(todo => !todo.completed));
        });
      })
      .catch(() => {
        setErrorMessage('Cannot delete all completed todos');
      });
  };

  const handleQueryChange = (value: string) => {
    setTitle(value);
  };

  const handleChangeFilter = (value: string) => {
    setActiveFilterBtn(value);
  };

  const handleDeleteErrorMsg = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }

    return () => {};
  }, [errorMessage]);

  useEffect(() => {
    setFilteredTodos(
      todos.filter(todo => {
        switch (activeFilterBtn) {
          case FilterQuery.All:
            return true;
          case FilterQuery.Active:
            return !todo.completed;
          case FilterQuery.Completed:
            return todo.completed;
          default:
            return false;
        }
      }),
    );
  }, [todos, activeFilterBtn]);

  if (!clientService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          title={title}
          isFocused={isFocused}
          isDisabled={isDisabled}
          handleToggleAll={handleToggleAll}
          handleQueryChange={handleQueryChange}
          handleSubmit={handleSubmit}
        />

        <TodoList
          todos={filteredTodos}
          isLoading={isLoading}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          changeCompleted={changeCompleted}
          handleChangeTitle={handleChangeTitle}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            activeBtn={activeFilterBtn}
            handleChangeFilter={handleChangeFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}
      </div>

      <ErrorsHandler
        errorMessage={errorMessage}
        handleDeleteErrorMsg={handleDeleteErrorMsg}
      />
    </div>
  );
};
