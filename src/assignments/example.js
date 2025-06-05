
import { useEffect, useState } from "react";
import styles from "./todo-list.module.css";
import TodoItem from "./todo-item";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

function Example() {
  const [toDo, setTodo] = useState("");
  const [toDos, setTodos] = useState([]);
  const [groups, setGroups] = useState(["기본"]);
  const [selectedGroup, setSelectedGroup] = useState("기본");
  const [groupInput, setGroupInput] = useState("");

  const todosRef = collection(db, "todos");

  const fetchTodos = async () => {
    const q = query(todosRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTodos(result);
    const allGroups = [...new Set(result.map((t) => t.group))];
    setGroups(allGroups);
  };

  const addOrRenameGroup = () => {
    const name = groupInput.trim();
    if (!name) return;
    if (!groups.includes(name)) {
      setGroups([...groups, name]);
    } else {
      const rename = async () => {
        const filtered = toDos.filter((t) => t.group === selectedGroup);
        for (const item of filtered) {
          const ref = doc(db, "todos", item.id);
          await updateDoc(ref, { group: name });
        }
      };
      rename();
    }
    setSelectedGroup(name);
    setGroupInput("");
    fetchTodos();
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!toDo.trim()) return;
    await addDoc(todosRef, {
      content: toDo.trim(),
      createdAt: Date.now(),
      group: selectedGroup,
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

  const filteredTodos = toDos.filter((t) => t.group === selectedGroup);

  return (
    <div className={styles.container}>
      <h1>{selectedGroup} ({filteredTodos.length})</h1>

      <div className={styles.group_input_section}>
        <input
          type="text"
          placeholder="그룹명 입력"
          value={groupInput}
          onChange={(e) => setGroupInput(e.target.value)}
        />
        <button onClick={addOrRenameGroup}>그룹명변경 / 그룹생성</button>
      </div>

      <div className={styles.group_bar}>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g)}
            className={`${styles.tab} ${g === selectedGroup ? styles.selected : ""}`}
          >
            {g}
          </button>
        ))}
      </div>

      <form onSubmit={addTodo} className={styles.form_container}>
        <input
          type="text"
          value={toDo}
          onChange={(e) => setTodo(e.target.value)}
          placeholder="할 일을 입력하세요."
        />
        <button type="submit">추가</button>
      </form>

      <div className={styles.todo_list_container}>
        {filteredTodos.length === 0 ? (
          <p>할 일이 없습니다.</p>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              content={todo.content}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Example;
