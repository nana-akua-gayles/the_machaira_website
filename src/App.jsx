
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import { AuthProvider } from "./context/AuthContext";

// Pages
// HOME
import Home from "./pages/home/Home";

// ABOUT
import About from "./pages/about/About";

// NEWSFEED
import Newsfeed from "./pages/newsfeed/NewsfeedPage";

// DEVOTIONAL
import Devotional from "./pages/devotional/Devotional";
import DevotionalReader from "./pages/devotional/DevotionalReader";
import PreviousDevotional from "./pages/devotional/PreviousDevotional";

// LEADERBOARD
import Leaderboard from "./pages/leaderboard/Leaderboard";

// DISCUSSION FORUM
import DiscussionForum from "./pages/discussionForum/DiscussionForum";
import DiscussionThread from "./pages/discussionForum/DiscussionThread";
import DiscussionNewPost from "./pages/discussionForum/DiscussionNewPost";

// CHURCH
import AboutChurch from "./pages/churchabout/AboutChurch";

// PARTNERSHIP
import Partnership from "./pages/partnership/Partnership";

// AUTH
import AuthPage from "./pages/auth/AuthPage";

// TESTIMONIALS
import Testimonials from "./pages/testimonials/Testimonials";

// SUBSCRIPTION
import Subscribe from "./pages/Subscribe";

function App() {
  return (
    <AuthProvider>
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
            <Route
              path="/previous-devotionals"
              element={<PreviousDevotional />}
            />

            {/* Leaderboard */}
            <Route path="/leaderboard" element={<Leaderboard />} />

            {/* Church Blog */}
            <Route path="/newsfeed" element={<Newsfeed />} />
            <Route path="/aboutChurch" element={<AboutChurch />} />

            {/* Discussion Forum */}
            <Route path="/forum" element={<DiscussionForum />} />
            <Route path="/forum/new" element={<DiscussionNewPost />} />
            <Route path="/forum/:id" element={<DiscussionThread />} />

            {/* Partnership */}
            <Route path="/partnership" element={<Partnership />} />

            {/* Auth */}
            <Route path="/login" element={<AuthPage />} />

            {/* Testimonials */}
            <Route path="/testimonials" element={<Testimonials />} />

            {/* Subscription */}
            <Route path="/subscribe" element={<Subscribe />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
