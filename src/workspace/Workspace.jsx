import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import AceEditor from 'react-ace';
import { useSnackbar } from 'notistack';

import COLORS from '../style/colors';
import textEditor from './textEditor';
import { HEADER_HEIGHT } from './Header';
import { CONSOLE_BOTTOM_SPACE, CONSOLE_TOP_SPACE } from './Console';
import { getOperations } from './operations';
import { Cursor } from '../helpers/general_helpers';
import CursorPopover, { getStyle, updateMarkers, cursorHoverHandler } from './CursorManager';
import { sendCursorPosition } from './connectionActions';

// languges
// python
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/snippets/python';
// js
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/snippets/javascript';

import 'ace-builds/src-noconflict/ext-language_tools';

// types
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-kr_theme';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-tomorrow_night_bright';

const LANGUAGE_NAMES_MAP = {
  js: 'javascript',
  python: 'python',
  '': '',
};

const scrollbarStyle = `
::-webkit-scrollbar {
  background: none;
  width: 16px;
  height: 16px;
}
::-webkit-scrollbar-thumb {
   border: solid 0 rgba(0, 0, 0, 0);
   border-right-width: 4px;
   border-left-width: 4px;
   -webkit-border-radius: 9px 4px;
   -webkit-box-shadow: inset 0 0 0 1px rgba(128, 128, 128, 0.2), inset 0 0 0 4px rgba(128, 128, 128, 0.2);
}
::-webkit-scrollbar-track-piece {
   margin: 4px 0;
}
::-webkit-scrollbar-thumb:horizontal {
   border-right-width: 0;
   border-left-width: 0;
   border-top-width: 4px;
   border-bottom-width: 4px;
   -webkit-border-radius: 4px 9px;
}
::-webkit-scrollbar-thumb:hover {
   -webkit-box-shadow:
     inset 0 0 0 1px rgba(128,128,128,0.9),
     inset 0 0 0 4px rgba(128,128,128,0.9);
}
::-webkit-scrollbar-corner {
   background: transparent;
}
/* Buttons */
::-webkit-scrollbar-button:vertical:single-button {
    background-color: #eee;
    display: block;
    background-size: 10px;
    background-repeat: no-repeat;
}
/* Up */
::-webkit-scrollbar-button:single-button:vertical:decrement {
    height: 12px;
    width: 16px;
    background-position: center 4px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(73, 73, 73)'><polygon points='50,00 0,50 100,50'/></svg>");
}

::-webkit-scrollbar-button:single-button:vertical:decrement:hover {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(112, 112, 112)'><polygon points='50,00 0,50 100,50'/></svg>");
}

::-webkit-scrollbar-button:single-button:vertical:decrement:active {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(128, 128, 128)'><polygon points='50,00 0,50 100,50'/></svg>");
}

/* Down */
::-webkit-scrollbar-button:single-button:vertical:increment {
    height: 12px;
    width: 16px;
    background-position: center 2px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(73, 73, 73)'><polygon points='0,0 100,0 50,50'/></svg>");
}

::-webkit-scrollbar-button:single-button:vertical:increment:hover {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(112, 112, 112)'><polygon points='0,0 100,0 50,50'/></svg>");
}

::-webkit-scrollbar-button:single-button:vertical:increment:active {
    background-image
}
.ace_scrollbar-h{margin: 0 2px}`;

let lastConsoleHeight = null;
function Workspace({
  consoleHeight, haveAccess, language, workspaceStyle,
}) {
  const editorRef = React.createRef();
  const { enqueueSnackbar } = useSnackbar();

  function onChange(newText) {
    const oldText = textEditor.text;
    textEditor.text = newText;
    const operations = getOperations(oldText, newText);
    operations.forEach((item) => textEditor.addOperation(item));
  }

  function onFocus() {
    if (!haveAccess) {
      if (!textEditor.showedNotification) {
        enqueueSnackbar({ text: 'You are viewer and can`t edit the document', type: 'warning' });
        textEditor.showedNotification = true;
      }
    }
  }

  function onChangeCursor() {
    if (editorRef.current === null) return;

    const pos = editorRef.current.editor.getCursorPosition();
    textEditor.cursor.column = pos.column;
    textEditor.cursor.row = pos.row;
    const anchor = editorRef.current.editor.selection.anchor;
    textEditor.anchor.column = anchor.column;
    textEditor.anchor.row = anchor.row;
    sendCursorPosition(textEditor.cursor.toPos(textEditor.text));
  }

  React.useEffect(() => {
    if (lastConsoleHeight !== consoleHeight) {
      lastConsoleHeight = consoleHeight;
      editorRef.current.editor.resize();
    }

    if (textEditor.cursor === null) {
      textEditor.cursor = new Cursor();
      textEditor.anchor = new Cursor();
      editorRef.current.editor.on('mousemove', cursorHoverHandler);
      onChangeCursor();
    }
    updateMarkers(editorRef.current.editor);
    const selRange = editorRef.current.editor.selection.getRange();
    const range = { start: textEditor.anchor, end: textEditor.cursor };

    if (selRange.start.column === selRange.end.column && selRange.start.row === selRange.end.row) {
      range.start = textEditor.cursor;
    }
    editorRef.current.editor.selection.setRange(range);
  });

  return (
    <Box style={{
      position: 'absolute', bottom: consoleHeight + CONSOLE_BOTTOM_SPACE + CONSOLE_TOP_SPACE, top: HEADER_HEIGHT + 52, left: 70, right: 97, minWidth: 800,
    }}
    >
      <style>
        {`
        ${workspaceStyle.style}
        ${getStyle()}
        ${scrollbarStyle}
      `}
      </style>
      <AceEditor
        ref={editorRef}
        mode={LANGUAGE_NAMES_MAP[language]}
        theme={workspaceStyle.theme}
        value={textEditor.text}
        readOnly={!haveAccess}
        fontSize={22}
        style={{ background: COLORS.WHITE, width: '100%', height: '100%' }}
        onChange={onChange}
        onFocus={onFocus}
        highlightActiveLine={false}
        onCursorChange={onChangeCursor}
        setOptions={{
          showLineNumbers: true,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
      />
      <CursorPopover />
    </Box>
  );
}
function mapToState(state) {
  let haveAccess = false;
  let language = '';

  const user = state.generalData.mainUser;
  if (user) {
    haveAccess = !user.isViewer;
  }

  const file = state.documentData.file;
  if (file) {
    language = file.language;
  }
  return {
    consoleHeight: state.documentData.consoleHeight,
    forUpdate: state.documentData.forUpdate,
    haveAccess,
    language,
    workspaceStyle: state.documentData.workspaceStyle,
  };
}
export default connect(mapToState)(Workspace);
