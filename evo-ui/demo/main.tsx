import React from 'react';

import ReactDOM from 'react-dom/client';
import Showcase from './Showcase';
import { EvoThemeProvider } from '../src/Theme/ThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <EvoThemeProvider defaultTheme="system">
      <Showcase />
    </EvoThemeProvider>
  </React.StrictMode>
);

