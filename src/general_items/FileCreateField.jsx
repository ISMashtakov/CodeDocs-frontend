import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';

import COLORS from '../style/colors';
import SelectWithoutBorder from './SelectWithoutBorder';
import { LANGUAGE_ICON, LANGUAGE_NAME } from '../helpers/file';

function LanguageSelect({ language, onChange }) {
  return (
    <FormControl style={{ backgroundColor: COLORS.WHITE }}>
      <SelectWithoutBorder
        value={language}
        onChange={onChange}
      >
        {
          Object.keys(LANGUAGE_NAME).map((item) => (
            <MenuItem key={item} value={item}>
              <div style={{ display: 'flex', verticalAlign: 'middle' }}>
                <img src={LANGUAGE_ICON[item]} alt="icon" />
                <span style={{ marginTop: 2, marginLeft: 5 }}>{LANGUAGE_NAME[item]}</span>
                {' '}

              </div>
            </MenuItem>
          ))
          }
      </SelectWithoutBorder>
    </FormControl>
  );
}

export default function FileCreateField({
  id, filename, onChangeFilename, language, onChangeLanguage,
}) {
  return (
    <TextField
      id={id}
      style={{ width: 479 }}
      label="Filename"
      value={filename}
      variant="outlined"
      onChange={onChangeFilename}
      InputProps={{
        endAdornment:
  <InputAdornment position="end">
    <LanguageSelect
      language={language}
      onChange={onChangeLanguage}
    />
  </InputAdornment>,
      }}
    />
  );
}
