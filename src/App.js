import { Alert, Backdrop, CircularProgress, Slide, Snackbar } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useReducer } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header, PrivateRoute } from './components';
import { AboutPage, CalenderPage, ChangePassword, ForgotPasswordPage, LoginPage, LogoutPage, Page, ProfilePage, VehicleTypePage } from './pages';
import { LoadingContext } from './reducer/loading';
import notificationReducer, { closeActionNotification, initialStateNotification, NotificationContext } from './reducer/notification';



function App() {
  const [notification, dispatchNotification] = useReducer(notificationReducer, initialStateNotification);
  const [loading, dispatchLoading] = useReducer(notificationReducer, initialStateNotification);
  return (
    <NotificationContext.Provider value={{ state: notification, dispatch: dispatchNotification }}>
      <LoadingContext.Provider value={{ state: loading, dispatch: dispatchLoading }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/forgot-password" element={<ForgotPasswordPage />}></Route>
            <Route path="/about" element={<AboutPage />}></Route>
            <Route path='/' element={<PrivateRoute />}>
              <Route path="/calendar" element={<CalenderPage />}></Route>
              <Route path="/page" element={<Page />}></Route>
              <Route path="/change-password" element={<ChangePassword />}></Route>
              <Route path="/logout" element={<LogoutPage />}></Route>
              <Route path="/profile" element={<ProfilePage />}></Route>
              <Route path="/vehicle-type" element={<VehicleTypePage />}></Route>
              <Route path="/" element={<CalenderPage />}></Route>
            </Route>
            <Route path="*" element={<div>
              <Header />
              Not found
            </div>}></Route>

          </Routes>
        </BrowserRouter>
        <Slide direction="left" in={notification.open} >
          <Snackbar
            autoHideDuration={2500}
            onClose={() => dispatchNotification(closeActionNotification())}
            anchorOrigin={{ vertical: notification.vertical, horizontal: notification.horizontal }}
            open={notification.open}
            key={notification.vertical + notification.horizontal}
          >
            <Alert variant="filled" severity={notification.type} color={notification.type}>
              {notification.message}
            </Alert>
          </Snackbar>
        </Slide>
        <Backdrop
          sx={{ color: '#fff', zIndex: 1000000000 }}
          open={loading.open}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </LoadingContext.Provider>
    </NotificationContext.Provider>
  );
}

export default App;
