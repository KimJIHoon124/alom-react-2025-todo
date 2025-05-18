import { useState } from "react";

function App() {
  // 과제1-1: 7-1, 7-2강을 듣고 이곳에 투두리스트 컴포넌트를 작성해주세요.
  const [todo, setTodo] = useState("");
  const onChange = (event) => setTodo(event.target.value);
  console.log(todo);

  return (
    <div>
      <h1>My To Dos</h1>
    </div>
  );
}

export default App;
