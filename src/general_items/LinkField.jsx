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
import { ACCESS_TYPES_NUMBER_TO_STRING, ACCESS_TYPES } from '../helpers/file';

export function AccessSelect({ access, onChange, canEdit = true }) {
  const accessMap = JSON.parse(JSON.stringify(ACCESS_TYPES_NUMBER_TO_STRING));
  if (access !== ACCESS_TYPES.OWNER) {
    delete accessMap[ACCESS_TYPES.OWNER];
  }

  const style = { ...FONTS.SUBTITLE, height: 50 };
  if (!canEdit || access === ACCESS_TYPES.OWNER) {
    return (
      <div style={{
        ...style, height: 'auto', paddingTop: 15, marginRight: 16,
      }}
      >
        {accessMap[access]}
      </div>
    );
  }

  return (
    <FormControl style={{ backgroundColor: COLORS.WHITE }}>
      <SelectWithoutBorder
        value={access}
        onChange={onChange}
        style={style}
      >
        {Object.keys(accessMap).map((item) => (
          <MenuItem style={style} key={item} value={item}>
            {accessMap[item]}
          </MenuItem>
        ))}
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
