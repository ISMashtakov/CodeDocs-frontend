import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import AceEditor from "react-ace";

import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import { HEADER_HEIGHT } from "./Header";
import {setConsoleHeight, consoleDoubleClick} from './actions';

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

export const CONSOLE_HEADER_HEIGHT = 40
export const CONSOLE_BOTTOM_SPACE = 0
export const CONSOLE_TOP_SPACE = 39


let dragging = false;
let mouseDownY = null;
let mouseMoveListener = null;
let mouseUpListener = null;
let startConsoleHeight = 0;
function Console({consoleHeight, setConsoleHeightDispatched, consoleDoubleClickDispatched}) {

  let onMouseMove = null;
  let onMouseUp = null;

  function onMouseDown(e){
    if (e.button !== 0) return;
    dragging = true;
    mouseMoveListener = onMouseMove;
    mouseUpListener = onMouseUp;
    mouseDownY = e.pageY;
    startConsoleHeight = consoleHeight;
    document.addEventListener('mousemove', mouseMoveListener)
    document.addEventListener('mouseup', mouseUpListener)
    e.stopPropagation();
    e.preventDefault();
  } 
  
  onMouseMove = React.useCallback((e) => {
    if (!dragging) return;
    const delta = e.pageY - mouseDownY;
    setConsoleHeightDispatched(startConsoleHeight - delta)
    e.stopPropagation();
    e.preventDefault();
  })
   
  onMouseUp = React.useCallback((e) => {
    dragging = false;
    document.removeEventListener('mousemove', mouseMoveListener)
    document.removeEventListener('mouseup', mouseUpListener)
    mouseMoveListener = null;
    mouseUpListener = null;
    e.stopPropagation();
    e.preventDefault();
  })

  React.useEffect(()=>{
    function handleResize() {
      setConsoleHeightDispatched(consoleHeight)
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  })
  return(
    <Box style={{position: "absolute", bottom: CONSOLE_BOTTOM_SPACE, height: consoleHeight, left: 70, right:97}}>
        <div style={{height: CONSOLE_HEADER_HEIGHT, backgroundColor: COLORS.GRAY2, cursor: 'ns-resize'}} onMouseDown={onMouseDown} onDoubleClick={consoleDoubleClickDispatched}> 
          <span style={{...FONTS.H3, color: COLORS.TEXT_GRAY, position: "relative", left: 27, top: 7}}>
            Console
          </span>
        </div>
        <div style={{height: consoleHeight - CONSOLE_HEADER_HEIGHT, backgroundColor: COLORS.WHITE}}>

        </div>
    </Box>
  )
  
}

function mapToState(state)
{
  return {
    consoleHeight: state.documentData.consoleHeight,
  }
}

export default connect(mapToState, {
  setConsoleHeightDispatched: setConsoleHeight,
  consoleDoubleClickDispatched: consoleDoubleClick
})(Console);