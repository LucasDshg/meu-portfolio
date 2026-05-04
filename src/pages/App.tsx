import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import About from './About';
import Admin from './Admin';
import ArticleEditor from './admin/components/articles/ArticleEditor';
import ArticleDetail from './ArticleDetail';
import Articles from './Articles';
import Experience from './Experience';
import Home from './Home';
import Login from './Login';
import Projects from './Projects';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/u/:slug" element={<Home />} />
        <Route path="/u/:slug/about" element={<About />} />
        <Route path="/u/:slug/experience" element={<Experience />} />
        <Route path="/u/:slug/project" element={<Projects />} />
        <Route path="/u/:slug/articles" element={<Articles />} />
        <Route
          path="/u/:slug/articles/:articleSlug"
          element={<ArticleDetail />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/articles/new" element={<ArticleEditor />} />
        <Route path="/admin/articles/edit/:id" element={<ArticleEditor />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
