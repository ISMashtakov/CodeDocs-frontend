/* eslint no-undef: 0 */
import React from 'react';
import { connect } from 'react-redux';
import Popover from '@material-ui/core/Popover';

import store from '../redux/store';
import textEditor from './textEditor';

import { Cursor } from '../helpers/general_helpers';
import { setHoverCursorAction } from './actions';
import COLORS from '../style/colors';

const Range = ace.require('ace/range').Range;
const CURSOR_WIDTH = 2;
const CURSOR_HOVER_WIDTH = 5;
const CURSOR_HEIGHT = 26;

let allMarkers = [];
let lastEditor = null;

export function updateMarkers(editor) {
  if (!editor) {
    editor = lastEditor;
  }
  if (!lastEditor && editor) {
    lastEditor = editor;
  }

  const allUsers = store.getState().documentData.allUsers;
  const session = editor.getSession();
  allMarkers.forEach((i) => session.removeMarker(i));
  allMarkers = [];

  Object.keys(textEditor.usersCursorsPositions).forEach((id) => {
    const user = allUsers.filter((i) => i.id * 1 === id * 1)[0];
    if (user) {
      const pos = textEditor.usersCursorsPositions[id];
      const start = Cursor.fromPos(textEditor.text, pos);
      const end = Cursor.fromPos(textEditor.text, pos + 1);
      const newRange = new Range(start.row, start.column, end.row, end.column);
      newRange.start = session.doc.createAnchor(newRange.start);
      newRange.end = session.doc.createAnchor(newRange.end);
      const marker = session.addMarker(newRange, `markerFor${id}`);
      allMarkers.push(marker);
    }
  });
}

export function getStyle() {
  const allUsers = store.getState().documentData.allUsers;
  return `
    {
    }
    ${allUsers.map(({ id, color }) => `.markerFor${id}.ace_start{
      background-color: ${color};   
      position: absolute;
      width: ${CURSOR_WIDTH}px !important;
    }`).join('\n')}`;
}

function isEnter(cur, el) {
  const curPos = { x: cur.clientX, y: cur.clientY };
  if ('movementX' in cur) curPos.x -= cur.movementX;
  if ('movementY' in cur) curPos.y -= cur.movementY;
  return (curPos.x >= el.x && curPos.x <= el.x + CURSOR_HOVER_WIDTH
    && curPos.y >= el.y && curPos.y <= el.y + CURSOR_HEIGHT);
}

export function cursorHoverHandler(e) {
  const allUsers = store.getState().documentData.allUsers;
  const ids = Object.keys(textEditor.usersCursorsPositions);

  for (let i = 0; i < ids.length; i += 1) {
    const id = ids[i];
    const elements = document.getElementsByClassName(`markerFor${id} ace_start`);
    if (elements.length === 0) continue;

    const el = elements[0];
    const elementPos = el.getBoundingClientRect();

    if (isEnter(e, elementPos)) {
      const user = allUsers.filter((j) => j.id * 1 === id * 1)[0];
      if (user) {
        store.dispatch(setHoverCursorAction({ user, element: el }));
        lastEditor.on('mousemove', () => {});
      }
      return;
    }
  }
}

function CursorPopover({ cursor, setHover }) {
  if (!cursor) {
    return null;
  }

  function cursorMoveHandler(e) {
    const pos = cursor.element.getBoundingClientRect();
    if (!isEnter(e, pos)) {
      setHover(null);
      lastEditor.on('mousemove', cursorHoverHandler);
    }
  }

  const elementPos = cursor.element.getBoundingClientRect();
  return (
    <Popover
      open={!!cursor}
      anchorEl={document.body}
      onClose={() => setHover(null)}
      onMouseMove={cursorMoveHandler}
      anchorOrigin={{
        vertical: elementPos.y,
        horizontal: elementPos.x,
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <div style={{ color: COLORS.WHITE, background: cursor.user.color, padding: '7px 10px' }}>
        {cursor.user.username}
      </div>
    </Popover>
  );
}

function mapToState(state) {
  return {
    cursor: state.documentData.hoverCursor,
  };
}
export default connect(mapToState, {
  setHover: setHoverCursorAction,
})(CursorPopover);
