import styles from "./todo-list.module.css";

function TodoItem({ content, onDelete }) {
  return (
    <div className={styles.todo_item}>
      <span>{content}</span>
      <button onClick={() => onDelete(content)}>삭제</button>
    </div>
  );
}

export default TodoItem;
