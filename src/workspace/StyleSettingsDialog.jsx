import React from 'react';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

import CustomDialog from '../general_items/CustomDialog';
import changeFileIcon from '../images/icons/change_file_blue.png';
import { setWorkspaceStyleAction } from './actions';
import { styleNameMap } from '../helpers/workspace_style';
import FONTS from '../style/fonts';

let shoodUpdateStyle = true;

const NAME_STYLE = { float: 'left', marginTop: 4 };
const SELECT_STYLE = { width: 40, float: 'right' };
const CONTAINER_STYLE = { width: 260, height: 32 };

function StyleSettingsDialog({
  open, onClose, workspaceStyle, setWorkspaceStyle,
}) {
  const [theme, _setTheme] = React.useState('');
  const [color, setColor] = React.useState('');
  const [keywordColor, setKeywordColor] = React.useState('');
  const [gutterColor, setGutterColor] = React.useState('');
  const [gutterBackground, setGutterBackground] = React.useState('');
  const [gutterActiveBackground, setGutterActiveBackground] = React.useState('');

  function clickToSave() {
    workspaceStyle.theme = theme;
    workspaceStyle.color = color;
    workspaceStyle.keywordColor = keywordColor;
    workspaceStyle.gutterColor = gutterColor;
    workspaceStyle.gutterBackground = gutterBackground;
    workspaceStyle.gutterActiveBackground = gutterActiveBackground;
    setWorkspaceStyle(workspaceStyle);
    onClose();
    shoodUpdateStyle = false;
  }

  function setTheme(value) {
    _setTheme(value);
    setColor(styleNameMap[value].color);
    setKeywordColor(styleNameMap[value].keywordColor);
    setGutterColor(styleNameMap[value].gutterColor);
    setGutterBackground(styleNameMap[value].gutterBackground);
    setGutterActiveBackground(styleNameMap[value].gutterActiveBackground);
  }

  if (open && shoodUpdateStyle) {
    setTheme(workspaceStyle.theme);
    shoodUpdateStyle = false;
  }

  return (
    <CustomDialog
      icon={changeFileIcon}
      title="Change style"
      onCancel={onClose}
      isOpen={open}
      onAction={clickToSave}
      actionText="Save"
      buttonWidth={110}
    >
      <div style={{ ...FONTS.BODY, marginTop: 10 }}>
        <div style={CONTAINER_STYLE}>
          <span style={NAME_STYLE}>Theme:</span>
          <Select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ minWidth: 190, marginLeft: 10, float: 'right' }}>
            {Object.keys(styleNameMap).map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
          </Select>
        </div>

        <div style={CONTAINER_STYLE}>
          <span style={NAME_STYLE}>Text color:</span>
          <Input disableUnderline value={color} onChange={(e) => setColor(e.target.value)} style={SELECT_STYLE} type="color" />
        </div>

        <div style={CONTAINER_STYLE}>
          <span style={NAME_STYLE}>Keyword color:</span>
          <Input disableUnderline value={keywordColor} onChange={(e) => setKeywordColor(e.target.value)} style={SELECT_STYLE} type="color" />
        </div>

        <div style={CONTAINER_STYLE}>
          <span style={NAME_STYLE}>Gutter color:</span>
          <Input disableUnderline value={gutterColor} onChange={(e) => setGutterColor(e.target.value)} style={SELECT_STYLE} type="color" />
        </div>

        <div style={CONTAINER_STYLE}>
          <span style={NAME_STYLE}>Gutter background color:</span>
          <Input disableUnderline value={gutterBackground} onChange={(e) => setGutterBackground(e.target.value)} style={SELECT_STYLE} type="color" />
        </div>

        <div style={CONTAINER_STYLE}>
          <span style={NAME_STYLE}>Gutter active line color:</span>
          <Input disableUnderline value={gutterActiveBackground} onChange={(e) => setGutterActiveBackground(e.target.value)} style={SELECT_STYLE} type="color" />
        </div>

      </div>
    </CustomDialog>
  );
}

function stateToPropsMapStyleDialog(state) {
  return {
    workspaceStyle: state.documentData.workspaceStyle,
  };
}

export default connect(stateToPropsMapStyleDialog,
  {
    setWorkspaceStyle: setWorkspaceStyleAction,
  })(StyleSettingsDialog);
