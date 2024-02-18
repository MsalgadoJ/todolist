'use client';

import { useState } from 'react';
import { trpc } from '../_trpc/client';
import { serverClient } from '../_trpc/serverClient';

export default function TodoList({
  initialTodos,
}: {
  initialTodos: Awaited<ReturnType<(typeof serverClient)['getTodos']>>;
}) {
  const getTodos = trpc.getTodos.useQuery(undefined, {
    initialData: initialTodos,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const [content, setContent] = useState('');

  function handleClick() {
    if (content.length) {
      addTodo.mutate(content);
      setContent('');
    }
  }

  return (
    <div>
      <div>
        {getTodos?.data?.map((todo) => {
          return (
            <div>
              <input
                id={`check-${todo.id}`}
                type="checkbox"
                checked={!!todo.done}
                onChange={async () => {
                  setDone.mutate({ id: todo.id, done: todo.done ? 0 : 1 });
                }}
              />
              <label htmlFor={`check-${todo.id}`}>{todo.content}</label>
            </div>
          );
        })}
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <input
          id="content"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={async () => handleClick()}>Add Todo</button>
      </div>
    </div>
  );
}
