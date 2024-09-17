import "./App.css";

import ReactDOM from "react-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { Fragment, useContext, useEffect } from "react";
import Layout from "./layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UIContext from "./store/ui-context";
import AuthContext from "./store/auth-context";
import Spinner from "react-bootstrap/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ResponseInterceptor from "./api/ResponseInterceptor";

// eslint-disable-next-line no-unused-vars
import { app } from "./utils/FirebaseConfig";
import Dashboard from "./pages/Dashboard";
import DocumentView from "./pages/DocumentView";

function App() {
  const { state: uiState } = useContext(UIContext);
  const { state: authState } = useContext(AuthContext);

  const notLoggedInRoutes = (
    <Fragment>
      <Route path="login" element={<Login />}></Route>
      <Route path="register" element={<Register />}></Route>
      <Route path="*" element={<Navigate to="/login"></Navigate>}></Route>
    </Fragment>
  );

  const loggedInRoutes = (
    <Fragment>
      <Route
        path="dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }></Route>
      <Route
        path="document/:id"
        element={
          <Layout>
            <DocumentView />
          </Layout>
        }></Route>
      <Route path="*" element={<Navigate to="/dashboard"></Navigate>}></Route>
    </Fragment>
  );

  useEffect(() => {
    if (uiState.toast.severity != null && uiState.toast.message != null) {
      toast[uiState.toast.severity](uiState.toast.message, {
        toastId: uiState.toast.message,
        position: "top-center",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [uiState.toast]);

  return (
    <Fragment>
      {uiState.loader &&
        ReactDOM.createPortal(
          <Fragment>
            <div className="overlay"></div>
            <Spinner animation="border" variant="primary" />
          </Fragment>,
          document.getElementById("spinner-root")
        )}

      <ToastContainer position="bottom-right" />

      <ResponseInterceptor />

      <Routes>
        {authState.isLoggedIn && loggedInRoutes}
        {!authState.isLoggedIn && notLoggedInRoutes}
      </Routes>
    </Fragment>
  );
}

export default App;
