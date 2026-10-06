import { useEffect, useState } from "react";
import Form from "./components/Form"
import Navbar from "./components/Navbar"
import TaskView from "./components/TaskView";
import Stats from "./components/Stats";
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {getTasks, createTask, deleteTask, updateTask} from './api.js'


const App = () => {
  const queryClient = useQueryClient();
  const [cnt, setCnt] = useState(1);
  const [item, setItem] = useState('');

  // const [task, setTask] = useState([]);

  const {data: tasks = [], isPending, error} = useQuery({queryKey: ['tasks'], queryFn: getTasks});

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']})
    },
    onError: () => {
      console.log('Error occured in create');
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']})
    },
    onError: () => {
      console.log('Error occured in delete');
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['tasks']});
      
    },
    onError: () => {
      console.log('Error occured in update');
    }
  })

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
      if(item === '') {
          return;
      }

      const newTask = {item, quantity: cnt, packed:false, idx:Date.now()};

      createMutation.mutate(newTask);
      
      setCnt(1);
      setItem('');
  }
  return (
    <div className="app-shell">
      <Navbar />
      <Form cnt={cnt} item={item} setItem={setItem} setCnt={setCnt} handleFormSubmit={handleFormSubmit}/>
      <TaskView tasks={tasks} handleDeleteTask={handleDeleteTask} handleUpdate={handleUpdate}/>
      <Stats tasks={tasks}/>
    </div>
  )
}

export default App