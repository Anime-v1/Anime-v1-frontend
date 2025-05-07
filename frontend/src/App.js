
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import {AdminPage} from "./component/AdminPage";
import HomePage from "./component/HomePage";
import {RequireAdmin} from "./component/RequireAdmin";
import {AdminCategories} from "./component/AdminCategories";
import {AdminVideos} from "./component/AdminVideos";
import {ToastContainer} from "react-toastify";
import {AdminEpisodes} from "./component/AdminEpisode";
function App() {
  return (
    <div className="App">
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route
                    path="/admin"
                    element={
                        <RequireAdmin>
                            <AdminPage />
                        </RequireAdmin>
                    }
                />
                <Route
                    path="/admin/categories"
                    element={
                        <RequireAdmin>
                            <AdminCategories />
                        </RequireAdmin>
                    }
                />
                <Route
                    path="/admin/videos"
                    element={
                        <RequireAdmin>
                           <AdminVideos/>
                        </RequireAdmin>
                    }
                />
                <Route
                    path="/admin/episodes"
                    element={
                        <RequireAdmin>
                            <AdminEpisodes />
                        </RequireAdmin>
                    }
                />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
        <ToastContainer />
    </div>
  );
}

export default App;
