import { useState } from "react";
import Form from "./components/Form"
import Navbar from "./components/Navbar"
import TaskView from "./components/TaskView";
import Stats from "./components/Stats";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, getTasks, updateTask } from './api.js'

const TASKS_QUERY_KEY = ['tasks'];

const App = () => {
  const queryClient = useQueryClient();
  const [cnt, setCnt] = useState(1);
  const [item, setItem] = useState('');

  // const [task, setTask] = useState([]);

  const { data: tasks = [], isPending, error } = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: getTasks
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const optimisticId = `optimistic-${Date.now()}-${Math.random()}`;
      const optimisticTask = { ...newTask, _id: optimisticId };
      queryClient.setQueryData(TASKS_QUERY_KEY, (current = []) => [...current, optimisticTask]);
      return { optimisticId };
    },
    onSuccess: (createdTask, _newTask, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, (current = []) =>
        current.map((task) => task._id === context?.optimisticId ? createdTask : task)
      );
    },
    onError: (_error, _newTask, context) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, (current = []) =>
        current.filter((task) => task._id !== context?.optimisticId)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      let removedTask;
      let removedIndex = -1;
      queryClient.setQueryData(TASKS_QUERY_KEY, (current = []) => {
        removedIndex = current.findIndex((task) => task._id === id);
        removedTask = current[removedIndex];
        return current.filter((task) => task._id !== id);
      });
      return { removedTask, removedIndex };
    },
    onError: (_error, _id, context) => {
      if (!context?.removedTask) return;
      queryClient.setQueryData(TASKS_QUERY_KEY, (current = []) => {
        if (current.some((task) => task._id === context.removedTask._id)) return current;
        const restored = [...current];
        restored.splice(context.removedIndex, 0, context.removedTask);
        return restored;
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTask = queryClient.getQueryData(TASKS_QUERY_KEY)
        ?.find((task) => task._id === id);
      queryClient.setQueryData(TASKS_QUERY_KEY, (current = []) =>
        current.map((task) => task._id === id ? { ...task, ...updates } : task)
      );
      return { previousTask };
    },
    onSuccess: (updatedTask, variables) => {
      queryClient.setQueryData(TASKS_QUERY_KEY, (current = []) =>
        current.map((task) => task._id === variables.id ? updatedTask : task)
      );
    },
    onError: (_error, variables, context) => {
      if (!context?.previousTask) return;
      queryClient.setQueryData(TASKS_QUERY_KEY, (current = []) =>
        current.map((task) => task._id === variables.id ? context.previousTask : task)
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
  });

  function handleDeleteTask(task) {
    deleteMutation.mutate(task._id);
  }

  function handleUpdate(task) {
    updateMutation.mutate({
      id: task._id,
      updates: {packed: !task.packed}
    })
  }

  function handleFormSubmit(e) {
      e.preventDefault();
      if(item.trim() === '') {
          return;
      }

      const newTask = { item: item.trim(), quantity: Number(cnt), packed: false };

      createMutation.mutate(newTask, {
        onSuccess: () => {
          setCnt(1);
          setItem('');
        }
      });
  }
  const mutationError = createMutation.error || updateMutation.error || deleteMutation.error;

  return (
    <div className="app-shell">
      <Navbar />
      <Form cnt={cnt} item={item} setItem={setItem} setCnt={setCnt} handleFormSubmit={handleFormSubmit}/>
      {(error || mutationError) && <p role="alert">{(error || mutationError).message}</p>}
      <TaskView tasks={tasks} isLoading={isPending} handleDeleteTask={handleDeleteTask} handleUpdate={handleUpdate}/>
      <Stats tasks={tasks}/>
    </div>
  )
}

export default App
