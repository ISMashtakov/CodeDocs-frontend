import React from 'react';
import { SnackbarProvider } from 'notistack';

import Notification from './Notification';

export default function CustomSnackbarProvider({ children }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      content={Notification}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      autoHideDuration={3000}
    >
      {children}
    </SnackbarProvider>
  );
}
