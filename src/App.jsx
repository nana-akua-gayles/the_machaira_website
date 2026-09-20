import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";

// Pages
//HOME
import Home from "./pages/home/Home";

//ABOUT
import About from "./pages/about/About";

//NEWSFEED
import Newsfeed from "./pages/newsfeed/NewsfeedPage";

//CHURCH BLOG
import ChurchBlog from "./pages/churchBlog/ChurchBlog";

//DEVOTIONAL
import Devotional from "./pages/devotional/Devotional";
import DiscussionForum from "./pages/discussionForum/DiscussionForum";
import DevotionalReader from "./pages/devotional/DevotionalReader";
import PreviousDevotional from "./pages/devotional/PreviousDevotional";

//PARTNERSHIP
import Partnership from "./pages/partnership/Partnership";

//AUTH
import AuthPage from "./pages/auth/AuthPage";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Main Website Layout */}
        <Route element={<MainLayout />}>

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* About */}
          <Route path="/about" element={<About />} />

          {/* Devotional */}
          <Route path="/devotional" element={<Devotional />} />
          <Route path="/devotional/:id" element={<DevotionalReader />} />
          <Route path="/previous-devotionals" element={<PreviousDevotional />} />

          {/* Church Blog */}
          <Route
            path="/newsfeed"
            element={<Newsfeed />}
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

          {/* Auth */}
          {/* Login */}
          <Route
            path="/login"
            element={<AuthPage initialMode="login" />}
          />

          {/* Register */}
          <Route
            path="/register"
            element={<AuthPage initialMode="register" />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;