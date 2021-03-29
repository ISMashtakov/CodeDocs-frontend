import React from 'react';
import Select from '@material-ui/core/Select';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import COLORS from '../style/colors';

const theme = createMuiTheme({
  overrides: {
    PrivateNotchedOutline: {
      root: {
        borderWidth: '0px !important',
      },
    },
    MuiSelect: {
      select: {
        backgroundColor: `${COLORS.WHITE} !important`,
      },
    },
  },
});

export default function SelectWithoutBorder(props) {
  const { children } = props;
  return (
    <ThemeProvider theme={theme}>
      <Select {...props} variant="outlined">{children}</Select>
    </ThemeProvider>
  );
}
