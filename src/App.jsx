import React, { useReducer, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const ACTIONS = {
  ADD_TODO: 'add-todo',
  TOGGLE_TODO: 'toggle-todo',
  DELETE_TODO: 'delete-todo'
};


const reducer = (todos, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      return [...todos, newTodo(action.payload.name)];
    case ACTIONS.TOGGLE_TODO:
      return todos.map(todo => {
        if (todo.id === action.payload.id) {
          return { ...todo, complete: !todo.complete };
        }
        return todo;
      });
    case ACTIONS.DELETE_TODO:
      return todos.filter(todo => todo.id !== action.payload.id);
    default:
      return todos;
  }
};

const newTodo = (name) => {
  return { id: Date.now(), name: name, complete: false };
};

const App = () => {
  const [todos, dispatch] = useReducer(reducer, [], () => {
    const localData = localStorage.getItem('todos');
    return localData ? JSON.parse(localData) : [];
  });
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please, add new todo!');
      return;
    }
    setError('');
    dispatch({ type: ACTIONS.ADD_TODO, payload: { name } });
    setName('');
  };

  return (
    <div className="container">
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add new todo ..."
        />
        <button type="submit" style={{padding:"10px", width: "30%"}} className='btn  btn-outline-success'>Add</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.complete ? 'line-through' : '' }}>
            <span onClick={() => dispatch({ type: ACTIONS.TOGGLE_TODO, payload: { id: todo.id } })}>
              {todo.name}
            </span>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_TODO, payload: { id: todo.id } })}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
