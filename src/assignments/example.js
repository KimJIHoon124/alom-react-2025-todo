import { useEffect, useState } from "react";
import styles from "./todo-list.module.css";
import TodoItem from "./todo-item";
import { db } from "../firebase"; // firebase.js 경로 맞게 조정
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";

function Example() {
  const [toDo, setTodo] = useState("");
  const [toDos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const todosRef = collection(db, "todos");

  const fetchTodos = async () => {
    const q = query(todosRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTodos(result);
    setLoading(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!toDo.trim()) {
      alert("내용을 입력하세요.");
      setTodo("");
      return;
    }
    const duplicate = toDos.find((t) => t.content === toDo.trim());
    if (duplicate) {
      alert("이미 존재하는 할 일입니다.");
      return;
    }
    await addDoc(todosRef, {
      content: toDo.trim(),
      createdAt: Date.now(),
    });
    setTodo("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className={styles.container}>
      <h1>My To Dos ({toDos.length})</h1>
      <form onSubmit={addTodo} className={styles.form_container}>
        <input
          type="text"
          value={toDo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="할 일을 입력하세요."
        />
        <button type="submit">작성하기</button>
      </form>
      <hr />
      {loading ? (
        <div>불러오는 중...</div>
      ) : toDos.length === 0 ? (
        <div>예정된 할 일이 없습니다.</div>
      ) : (
        <div className={styles.todo_list_container}>
          {toDos.map((todo) => (
            <TodoItem
              key={todo.id}
              content={todo.content}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Example;
