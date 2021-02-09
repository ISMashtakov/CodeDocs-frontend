import React from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import AceEditor from "react-ace";

import COLORS from '../style/colors';

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";

function Workspace({text}) {

  return(
    <Box style={{position: "absolute", bottom: 70, top: 130, left: 30, right:30}}>
        <div style={{height: "100%", width: "100%", background: COLORS.WHITE}}> 
        <AceEditor
            mode="python"
            theme="github"
            value={text}
            style={{width: "100%", height: "100%"}}
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                }}
        />
        </div>
    </Box>
  )
  
}
function mapToState(state)
{
  return {
    text: state.documentData.text
  }
}
export default connect(mapToState)(Workspace);