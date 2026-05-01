import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import About from "./About";
import Experience from "./Experience";
import Home from "./Home";
import Projects from "./Projects";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
