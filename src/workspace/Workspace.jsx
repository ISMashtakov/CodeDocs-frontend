import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import AceEditor from 'react-ace';
import { useSnackbar } from 'notistack';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import textEditor from './textEditor';
import { HEADER_HEIGHT } from './Header';
import { CONSOLE_BOTTOM_SPACE, CONSOLE_TOP_SPACE } from './Console';
import { getOperations } from './operations';
import { Cursor } from '../helpers/general_helpers';

import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-min-noconflict/ext-searchbox';

function Workspace({ consoleHeight, haveAccess }) {
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
  }

  React.useEffect(() => {
    if (textEditor.cursor === null) {
      textEditor.cursor = new Cursor();
      textEditor.anchor = new Cursor();
      onChangeCursor();
    }
    const selRange = editorRef.current.editor.selection.getRange();
    const range = { start: textEditor.anchor, end: textEditor.cursor };

    if (selRange.start.column === selRange.end.column && selRange.start.row === selRange.end.row) {
      range.start = textEditor.cursor;
    }
    editorRef.current.editor.selection.setRange(range);
  });

  return (
    <Box style={{
      position: 'absolute', bottom: consoleHeight + CONSOLE_BOTTOM_SPACE + CONSOLE_TOP_SPACE, top: HEADER_HEIGHT + 52, left: 70, right: 97,
    }}
    >
      <AceEditor
        ref={editorRef}
        mode="python"
        theme="github"
        value={textEditor.text}
        readOnly={!haveAccess}
        fontSize={FONTS.BODY.fontSize}
        style={{ background: COLORS.WHITE, width: '100%', height: '100%' }}
        onChange={onChange}
        onFocus={onFocus}
        highlightActiveLine={false}
        onCursorChange={onChangeCursor}
        setOptions={{
          showLineNumbers: true,
        }}
      />
    </Box>
  );
}
function mapToState(state) {
  let haveAccess = false;
  const user = state.generalData.mainUser;
  if (user) {
    haveAccess = !user.isViewer;
  }
  return {
    consoleHeight: state.documentData.consoleHeight,
    forUpdate: state.documentData.forUpdate,
    haveAccess,
  };
}
export default connect(mapToState)(Workspace);
