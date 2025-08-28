// Router Libraries
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom'

//Import useEffect and useState
import { useEffect, useState } from 'react'

// Main Components
import Menu from './component/header/menu'
import Footer from './component/footer/footer'

// User Router
import CreatePost from './component/userRoutes/createPost'
import Profile from './component/userRoutes/profile/profile'
import MyCreations from './component/userRoutes/myCreations'
import Favorites from './component/userRoutes/favorites'
import Home from './component/userRoutes/home'
import Post from './component/userRoutes/post'
import PostComment from './component/userRoutes/postComponent/postComment'
import PostUser from './component/userRoutes/postComponent/postUser'
import UpdatePost from './component/userRoutes/updatePost'
import OtherProfile from './component/userRoutes/profile/otherProfile'
import Search from './component/userRoutes/search'

// Session Routes
import Login from './component/session/login'
import CreateAccont from './component/session/createAccont'

// Error Page Route
import ErrorPage from './component/errorPage/errorPage'

// Import Reset CSS
import 'normalize.css'

// Import protectRoute
import ProtectedRoute from './component/server/protectRoute'

// loader component
function Loader() {
  return (
    <div className='loading dark:text-white'>
      <div className="spinner" />
      <p >Loading...</p>
      <style>{`
        .spinner {
          margin: 0 auto;
          width: 100px;
          height: 100px;
          border: 4px solid rgba(0,0,0,0.1);
          border-top: 4px solid #333;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function RouterApp() {

  // hide components depending on the path
  const location = useLocation();
  const hiddenRoutes = ['/', '/createAccont', '/post', '/postComment', '/postUser'];
  const hiddenFooter = ['/post', '/postComment', '/postUser' ];

  const showOnlyHeader = hiddenFooter.some(route => location.pathname.startsWith(route));
  const showLayout = !hiddenRoutes.includes(location.pathname) && !showOnlyHeader;
  const isErrorPage = location.pathname === '/404';

  // Loader
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Loading similar content (For example, data from an API)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>

        {!isErrorPage && (showLayout || showOnlyHeader) && <Menu />}

        <Routes>

          {/* Session Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/createAccont" element={ <CreateAccont />} />

          {/* User Routes */}
          <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
          <Route path='/createPost' element={<ProtectedRoute> <CreatePost /> </ProtectedRoute>} />
          <Route path='/myCreations' element={<ProtectedRoute> <MyCreations /> </ProtectedRoute>} />
          <Route path='/favorites' element={<ProtectedRoute> <Favorites /> </ProtectedRoute>} />
          <Route path='/post/:id' element={<ProtectedRoute> <Post /> </ProtectedRoute>} />
          <Route path="/postComment/:idPost" element={<ProtectedRoute> <PostComment /> </ProtectedRoute>} />
          <Route path="/postUser/:id" element={<ProtectedRoute> <PostUser /> </ProtectedRoute>} />
          <Route path='/updatePost/:idPost' element={<ProtectedRoute> <UpdatePost /> </ProtectedRoute>} />
          <Route path='/otherProfile' element={<ProtectedRoute> <OtherProfile /> </ProtectedRoute>} />
          <Route path='/search' element={<ProtectedRoute> <Search /> </ProtectedRoute>} />

          {/* Error Page */}
          <Route path="/404" element={<ErrorPage />} />

          <Route path="*" element={<Navigate to="/404" replace />} />

        </Routes>

        {!isErrorPage && showLayout && <Footer />}
    </div>
  )
}

function App() {
  
  return (
      <BrowserRouter>
        <RouterApp />
      </BrowserRouter>
  )
}

export default App
