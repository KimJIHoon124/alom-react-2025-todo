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
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupToAdd, setNewGroupToAdd] = useState("");

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

  const renameGroup = async () => {
    if (!newGroupName.trim()) return;
    const filtered = toDos.filter((t) => t.group === selectedGroup);
    for (const item of filtered) {
      const ref = doc(db, "todos", item.id);
      await updateDoc(ref, { group: newGroupName });
    }
    setSelectedGroup(newGroupName);
    setNewGroupName("");
    fetchTodos();
  };

  const addGroup = () => {
    const name = newGroupToAdd.trim();
    if (!name || groups.includes(name)) return;
    setGroups([...groups, name]);
    setSelectedGroup(name);
    setNewGroupToAdd("");
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = toDos.filter((t) => t.group === selectedGroup);

  return (
    <div className={styles.container}>
      <h1>📌 {selectedGroup} ({filteredTodos.length})</h1>

      <div className={styles.group_bar}>
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGroup(g)}
            className={g === selectedGroup ? styles.selected : ""}
          >
            {g}
          </button>
        ))}

        {/* 새 그룹 추가 */}
        <input
          type="text"
          placeholder="새 그룹"
          value={newGroupToAdd}
          onChange={(e) => setNewGroupToAdd(e.target.value)}
        />
        <button onClick={addGroup}>그룹 추가</button>

        {/* 이름 변경 */}
        <input
          type="text"
          placeholder="이름 변경"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <button onClick={renameGroup}>이름 변경</button>
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
