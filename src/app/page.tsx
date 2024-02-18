import { serverClient } from './_trpc/serverClient';
import TodoList from './components/TodoList';

export default async function Home() {
  const todos = await serverClient.getTodos();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 text-stone-200">
      <TodoList initialTodos={todos} />
    </main>
  );
}
