import React, { useMemo, useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router';
import themeSettings from './components/Theme';
import Home from './view/Home.jsx';
import Login from './view/Login.jsx';
import Signup from './view/Signup.jsx';
import ProfilePage from './view/ProfilePage.jsx';
import ColorModeContext from './context/ColorModeContext';
import EditProfile from './view/Widget/EditProfile.jsx';
import MyPostWidget from './view/Widget/MyPostWidget.jsx';

function App() {
  const [mode, setMode] = useState('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path='/home' element={<Home />} />
            <Route path='/' element={<Login />} />
            <Route path='/register' element={<Signup />} />
            <Route path='/profile/:userId' element={<ProfilePage />} />
            <Route path='/profile/:userId/edit' element={<EditProfile />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;