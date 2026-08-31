import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";

// Pages
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import ChurchBlog from "./pages/churchBlog/ChurchBlog";
import Devotional from "./pages/devotional/Devotional";
import DiscussionForum from "./pages/discussionForum/DiscussionForum";
import Partnership from "./pages/partnership/Partnership";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Main Website Layout */}
        <Route element={<MainLayout />}>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* About */}
          <Route
            path="/about"
            element={<About />}
          />

          {/* Devotional */}
          <Route
            path="/devotional"
            element={<Devotional />}
          />

          {/* Church Blog */}
          <Route
            path="/blog"
            element={<ChurchBlog />}
          />

          {/* Discussion Forum */}
          <Route
            path="/forum"
            element={<DiscussionForum />}
          />

          {/* Partnership */}
          <Route
            path="/partnership"
            element={<Partnership />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;