import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import IconButton from '@material-ui/core/IconButton';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import SelectWithoutBorder from './SelectWithoutBorder';

export function AccessSelect({ access, onChange, canEdit = true }) {
  const style = { ...FONTS.SUBTITLE, height: 50 };
  if (!canEdit) {
    <span style={style}>{access === 0 ? 'View' : 'Edit'}</span>;
  }

  return (
    <FormControl style={{ backgroundColor: COLORS.WHITE }}>
      <SelectWithoutBorder
        value={access}
        onChange={onChange}
        style={style}
      >
        <MenuItem style={style} value={0}>View</MenuItem>
        <MenuItem style={style} value={1}>Edit</MenuItem>
      </SelectWithoutBorder>
    </FormControl>
  );
}

export default function LinkField({
  id, access, onChangeAccess, mainUser, style,
}) {
  return (
    <div style={style}>
      <TextField
        id={id}
        style={{ width: 376 }}
        value={document.location.href + document.location.search}
        variant="outlined"
        onChange={() => {}}
        InputProps={{
          style: { ...FONTS.BODY },
          endAdornment:
              mainUser.isViewer ? null
                : (
                  <InputAdornment position="end">
                    <AccessSelect
                      access={access}
                      onChange={onChangeAccess}
                      canEdit={!mainUser.isViewer}
                    />
                  </InputAdornment>
                ),
        }}
      />
      <IconButton color="primary">
        <FileCopyOutlinedIcon />
      </IconButton>
    </div>
  );
}
