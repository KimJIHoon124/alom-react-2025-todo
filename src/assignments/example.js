import { useEffect, useState } from "react";
import styles from "./todo-list.module.css";
import TodoItem from "./todo-item";

function Example() {
  const [toDo, setTodo] = useState("");
  const [toDos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setTodo(e.target.value);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!toDo.trim()) {
      alert("올바른 값을 입력해주세요");
      setTodo("");
      return;
    }
    if (toDos.includes(toDo)) {
      alert("이미 같은 값이 존재합니다");
      return;
    }
    setTodos((prev) => [toDo, ...prev]);
    setTodo("");
  }

  function onDelete(content) {
    const newTodos = toDos.filter((todo) => todo !== content);
    setTodos(newTodos);
  }

  useEffect(() => {
    const saved = localStorage.getItem("my_todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
    setLoading(true);
  }, []);

  useEffect(() => {
    if (loading) {
      localStorage.setItem("my_todos", JSON.stringify(toDos));
    }
  }, [toDos, loading]);

  return (
    <div className={styles.container}>
      <h1>My To Dos ({toDos.length})</h1>
      <form onSubmit={onSubmit} className={styles.form_container}>
        <input
          type="text"
          value={toDo}
          onChange={onChange}
          placeholder="할 일을 입력하세요."
        />
        <button type="submit">작성하기</button>
      </form>
      <hr />
      {toDos.length === 0 ? (
        <div>예정된 할 일이 없습니다.</div>
      ) : (
        <div className={styles.todo_list_container}>
          {toDos.map((todo, idx) => (
            <TodoItem key={idx} content={todo} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Example;