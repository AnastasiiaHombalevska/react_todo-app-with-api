import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  isLoading: boolean;
  tempTodo: Todo | null;
  handleDeleteTodo: (id: number) => void;
  changeCompleted: (todo: Todo) => void;
  handleChangeTitle: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isLoading,
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
          isLoading={isLoading}
          tempTodo={tempTodo}
          handleDeleteTodo={handleDeleteTodo}
          changeCompleted={changeCompleted}
          handleChangeTitle={handleChangeTitle}
        />
      ))}
    </section>
  );
};
