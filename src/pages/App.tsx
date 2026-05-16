import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoadingPage } from '../components/LoadingPage';
import NotFound from '../components/NotFound';
import MainLayout from '../layout/MainLayout';
import About from './About';
import ArticleDetail from './ArticleDetail';
import Articles from './Articles';
import Experience from './Experience';
import Home from './Home';
import Login from './Login';
import PrivacyPolicy from './PrivacyPolicy';
import Projects from './Projects';

const Admin = lazy(() => import('./Admin'));
const ArticleEditor = lazy(
  () => import('./admin/components/articles/ArticleEditor'),
);

function App() {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/u/:slug">
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="experience" element={<Experience />} />
            <Route path="project" element={<Projects />} />
            <Route path="articles" element={<Articles />} />
            <Route path="articles/:articleSlug" element={<ArticleDetail />} />
          </Route>

          <Route path="/admin">
            <Route index element={<Admin />} />
            <Route path="articles/new" element={<ArticleEditor />} />
            <Route path="articles/edit/:id" element={<ArticleEditor />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default App;
