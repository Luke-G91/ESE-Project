import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GroupDetails from "./pages/GroupDetails";
import Groups from "./pages/Groups";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Zoom } from "react-toastify/unstyled";
import PostDetail from "./pages/PostDetail";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <>
          <ToastContainer
            autoClose={3000}
            closeOnClick={true}
            pauseOnHover
            theme="dark"
            transition={Zoom}
            pauseOnFocusLoss={false}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/*"
              element={
                <AuthProvider>
                  <ProtectedRoutes />
                </AuthProvider>
              }
            />
          </Routes>
        </>
      </Router>
    </QueryClientProvider>
  );
}

const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/group/:groupId"
        element={
          <ProtectedRoute>
            <GroupDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/:postId"
        element={
          <ProtectedRoute>
            <PostDetail />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default App;
