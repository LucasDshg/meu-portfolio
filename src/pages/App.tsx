import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import About from "./About";
import Experience from "./Experience";
import Home from "./Home";
import Login from "./Login";
import Projects from "./Projects";

function App() {
  return (
    <MainLayout>
      <Routes>
        {/* Rotas Públicas com Slug */}
        <Route path="/u/:slug" element={<Home />} />
        <Route path="/u/:slug/about" element={<About />} />
        <Route path="/u/:slug/experience" element={<Experience />} />
        <Route path="/u/:slug/projects" element={<Projects />} />

        {/* Rotas Padrão (usuário logado) */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
