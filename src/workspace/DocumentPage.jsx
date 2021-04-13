import React from 'react';
import { connect } from 'react-redux';

import Header, { HEADER_HEIGHT } from './Header';
import COLORS from '../style/colors';
import Workspace from './Workspace';
import Console from './Console';
import { setMainUserAction } from '../redux/actions';
import { DOWNLOAD_STATE } from '../helpers/general_helpers';
import { MainUser } from '../helpers/user';
import { toLogin } from '../helpers/auth_helper';
import connection from './Connection';
import { requestFileInfo, requestActiveUsers, requestAllUsers } from './connectionActions';

function DocumentPage({ mainUser, setMainUser, file }) {
  const [userValid, setUserValid] = React.useState(false);
  const [updateState, setUpdateState] = React.useState(DOWNLOAD_STATE.NEED_DOWNLOAD);

  React.useEffect(async () => {
    if (updateState === DOWNLOAD_STATE.DOWNLOAD) {
      if (!connection.isConnect) {
        connection.connect(mainUser);
        requestFileInfo();
        requestActiveUsers();
        requestAllUsers();
      }
    }

    if (updateState !== DOWNLOAD_STATE.NEED_DOWNLOAD) return;

    setUpdateState(DOWNLOAD_STATE.DOWNLOADING);
    if (mainUser === null) {
      const user = new MainUser();
      user.loadFromLocalStorage();
      const isValid = await user.isValid();
      if (isValid) {
        setMainUser(user);
        setUserValid(true);
      } else {
        user.deleteFromLocalStorage();
        toLogin();
      }
    } else if (await mainUser.isValid()) {
      setUserValid(true);
    } else {
      mainUser.deleteFromLocalStorage();
      toLogin();
    }
    setUpdateState(DOWNLOAD_STATE.DOWNLOAD);
  });

  if (!userValid || file === null) {
    return (<div />);
  }

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

function mapStateToProps(state) {
  return {
    mainUser: state.generalData.mainUser,
    file: state.documentData.file,
  };
}

export default connect(mapStateToProps, {
  setMainUser: setMainUserAction,
})(DocumentPage);
