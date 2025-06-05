import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Example from "./assignments/example";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/example" replace />} />
        <Route path="/example" element={<Example />} />
      </Routes>
    </Router>
  );
}

export default App;
