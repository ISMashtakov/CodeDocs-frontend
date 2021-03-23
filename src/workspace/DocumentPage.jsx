import React from 'react';
import { connect } from 'react-redux';

import Header, { HEADER_HEIGHT } from './Header';
import COLORS from '../style/colors';
import Workspace from './Workspace';
import Console from './Console';

function DocumentPage() {
  return (
    <div>
      <Header />
      <div style={{
        background: COLORS.LIGHT_GRAY, display: 'block', width: '100%', height: `calc(100vh - ${HEADER_HEIGHT}px)`,
      }}
      >
        <Workspace />
        <Console />
      </div>
    </div>
  );
}
function mapToState() {
  return {

  };
}
export default connect(mapToState)(DocumentPage);
