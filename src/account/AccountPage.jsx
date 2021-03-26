import React from 'react';
import { connect } from 'react-redux';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

import { MainUser } from '../helpers/user';
import { toLogin } from '../helpers/auth_helper';
import { setMainUserAction } from '../redux/actions';
import { setChangePasswordIsOpenAction, setChangeEmailIsOpenAction, setChangeUsernameIsOpenAction } from './actions';
import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import * as mainStyle from '../style/style';
import Avatar from '../general_items/Avatar';
import ACCESS_TYPES from '../helpers/access_types';
import logo from '../images/logo.png';
import ChangePasswordWindow from './ChangePasswordWindow';
import ChangeEmailWindow from './ChangeEmailWindow';
import ChangeUsernameWindow from './ChangeUsernameWindow';

const RIGHT_ARROW_STYLE = {
  width: 12,
  height: 18,
  color: COLORS.BACKGROUND_GRAY3,
  position: 'relative',
  float: 'right',
  marginTop: 5,
  right: 15,
};

const BUTTON_STYLE = {
  ...mainStyle.OUTLINED_BUTTON_STYLE,
  width: 354,
  height: 37,
};

const RED_BUTTON_STYLE = {
  ...BUTTON_STYLE,
  color: COLORS.BUTTON_RED,
  borderColor: COLORS.BUTTON_RED,
};

const BLUE_BUTTON_STYLE = {
  ...BUTTON_STYLE,
  color: COLORS.BUTTON_BLUE,
  borderColor: COLORS.BUTTON_BLUE,
};

const FILE_TYPE_BUTTON_STYLE = {
  ...FONTS.H2,
  display: 'inline-block',
  borderRadius: '10px',
  cursor: 'pointer',
  padding: '10px 20px',
  backgroundColor: COLORS.WHITE,
  color: COLORS.BACKGROUND_GRAY3,
};

const SELECTED_FILE_TYPE_BUTTON_STYLE = {
  ...FILE_TYPE_BUTTON_STYLE,
  backgroundColor: COLORS.BACKGROUND_GRAY3,
  color: COLORS.WHITE,
};

const FILE_ROW_STYLE = {
  ...FONTS.H3,
  borderBottom: 'none',
  textAlign: 'center',
};

const BUTTON_WIDTH = 354;

function mapStateToPropsAccountCard(state) {
  return {
    mainUser: state.generalData.mainUser,
    username: state.generalData.mainUser.username,
    mail: state.generalData.mainUser.username,
  };
}

const AccountCard = connect(mapStateToPropsAccountCard, {
  setChangePasswordIsOpen: setChangePasswordIsOpenAction,
  setChangeEmailIsOpen: setChangeEmailIsOpenAction,
  setChangeUsernameIsOpen: setChangeUsernameIsOpenAction,
})(({
  mainUser, setChangePasswordIsOpen, setChangeEmailIsOpen, setChangeUsernameIsOpen,
}) => {
  function clickToLogout() {
    mainUser.deleteFromLocalStorage();
    toLogin();
  }

  return (
    <div
      style={{
        float: 'left', backgroundColor: COLORS.WHITE, padding: '20px 15px', width: 354, height: 378, borderRadius: '6px', boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
      }}
      id="account_AccountPage_AccountCard_div"
    >
      <Avatar
        user={mainUser}
        style={{
          ...FONTS.H1, marginLeft: 'auto', marginRight: 'auto', height: 90, width: 90,
        }}
      />

      <Button
        onClick={() => setChangeUsernameIsOpen(true)}
        style={{
          ...FONTS.H1, textTransform: 'none', padding: '10px 0px 10px 26px', marginTop: 25, width: BUTTON_WIDTH, color: COLORS.TEXT_DARK_GRAY,
        }}
        id="account_AccountPage_AccountCard_usernameButton"
      >
        <div style={{ width: 354 }}>
          {mainUser.username}
          <ArrowForwardIosIcon style={{ ...RIGHT_ARROW_STYLE }} />
        </div>
      </Button>

      <Button
        onClick={() => setChangeEmailIsOpen(true)}
        style={{
          ...FONTS.H3, textTransform: 'none', padding: '10px 0px 10px 26px', marginTop: 10, width: BUTTON_WIDTH, color: COLORS.TEXT_DARK_GRAY,
        }}
        id="account_AccountPage_AccountCard_emailButton"
      >
        <div style={{ width: 354, textAlign: 'start' }}>
          {`Email: ${mainUser.mail}`}
          <ArrowForwardIosIcon style={{ ...RIGHT_ARROW_STYLE }} />
        </div>
      </Button>

      <Button
        onClick={() => setChangePasswordIsOpen(true)}
        style={{
          ...FONTS.H3, textTransform: 'none', padding: '10px 0px 10px 26px', width: BUTTON_WIDTH, color: COLORS.TEXT_DARK_GRAY,
        }}
        id="account_AccountPage_AccountCard_passwordButton"
      >
        <div style={{ width: 354, textAlign: 'start' }}>
          Password: *********
          <ArrowForwardIosIcon style={{ ...RIGHT_ARROW_STYLE }} />
        </div>
      </Button>

      <Button style={{ ...BLUE_BUTTON_STYLE, marginTop: 15, width: BUTTON_WIDTH }} variant="outlined" onClick={clickToLogout} id="account_AccountPage_AccountCard_logoutButton">LOG OUT</Button>
      <Button style={{ ...RED_BUTTON_STYLE, marginTop: 30, width: BUTTON_WIDTH }} variant="outlined" id="account_AccountPage_AccountCard_deleteButton">DELETE ACCOUNT</Button>
    </div>
  );
});

const FILES = [
  {
    id: 1, name: 'File_1.py', language: 'Python 3', access: 'Owner',
  },
  {
    id: 2, name: 'Example.py', language: 'Python 3', access: 'Viewer',
  },
  {
    id: 3, name: 'Very_big_and_greate_filename.cpp', language: 'C++', access: 'Viewer',
  },
  {
    id: 4, name: 'new_file.hs', language: 'Haskell', access: 'Owner',
  },
  {
    id: 5, name: 'File_1.py', language: 'Python 3', access: 'Owner',
  },
  {
    id: 6, name: 'Example.py', language: 'Python 3', access: 'Viewer',
  },
  {
    id: 7, name: 'Very_big_and_greate_filename.cpp', language: 'C++', access: 'Viewer',
  },
  {
    id: 8, name: 'new_file.hs', language: 'Haskell', access: 'Owner',
  },
];

function FileRow({ file }) {
  function FileButton() {
    if (file.access === ACCESS_TYPES.OWNER) {
      return (<Button style={{ ...RED_BUTTON_STYLE, width: 80 }} variant="outlined">DELETE</Button>);
    }
    return (<Button style={{ ...BLUE_BUTTON_STYLE, width: 80 }} variant="outlined">LEAVE</Button>);
  }

  return (
    <TableRow>
      <TableCell style={{ ...FILE_ROW_STYLE }}><img src={logo} alt="logo" style={{ height: 24, width: 'auto' }} /></TableCell>
      <TableCell style={{ ...FILE_ROW_STYLE, width: 188, wordBreak: 'break-all' }}>{file.name}</TableCell>
      <TableCell style={{ ...FILE_ROW_STYLE }}>{file.language}</TableCell>
      <TableCell style={{ ...FILE_ROW_STYLE }}>{file.access}</TableCell>
      <TableCell style={{ ...FILE_ROW_STYLE }}><FileButton /></TableCell>
    </TableRow>
  );
}

function FilesPanel() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [filename, setFilename] = React.useState('');

  let files = [];
  if (selectedTab === 0) {
    files = FILES;
  } else if (selectedTab === 1) {
    files = FILES.filter((item) => item.access === ACCESS_TYPES.OWNER);
  }

  return (
    <div style={{ float: 'left', marginLeft: 79 }} id="account_AccountPage_FilesPanel_div">
      <div id="account_AccountPage_FilesPanel_filetypesDiv">
        <div
          style={{
            ...(selectedTab === 0
              ? SELECTED_FILE_TYPE_BUTTON_STYLE
              : FILE_TYPE_BUTTON_STYLE),
          }}
          onClick={() => setSelectedTab(0)}
        >
          All files
        </div>
        <div
          style={{
            ...(selectedTab === 1
              ? SELECTED_FILE_TYPE_BUTTON_STYLE
              : FILE_TYPE_BUTTON_STYLE),
            marginLeft: 20,
          }}
          onClick={() => setSelectedTab(1)}
        >
          My files
        </div>
      </div>
      <Box
        style={{
          backgroundColor: COLORS.WHITE, marginTop: 24, borderRadius: '6px', maxHeight: 338, width: 691,
        }}
        overflow="auto"
        id="account_AccountPage_FilesPanel_BoxWithTable"
      >
        <Table>
          <TableBody>
            {files.map((file) => <FileRow key={file.id} file={file} />)}
          </TableBody>
        </Table>
      </Box>
      <div style={{
        backgroundColor: COLORS.WHITE, marginTop: 30, width: 651, padding: 20,
      }}
      >
        <TextField
          id="account_AccountPage_FilesPanel_filenameTextField"
          style={{ width: 479 }}
          label="Filename"
          value={filename}
          variant="outlined"
          onChange={(event) => setFilename(event.target.value)}
          InputProps={{
            style: { height: 46 },
          }}
          InputLabelProps={{
            // style: {transform: "translate(14px, 15px) scale(1)"},
          }}
        />
        <Button
          id="account_AccountPage_FilesPanel_createFileButton"
          variant="contained"
          style={{
            ...mainStyle.BUTTON_STYLE, width: 157, marginLeft: 15, boxShadow: '0 0 0 0',
          }}
          onClick={() => {}}
        >
          CREATE FILE
        </Button>
      </div>
    </div>
  );
}

function AccountPage({ mainUser, setMainUser }) {
  const [userValid, setUserValid] = React.useState(false);
  React.useEffect(async () => {
    if (mainUser === null) {
      const user = new MainUser();
      user.loadFromLocalStorage();
      const isValid = await user.isValid();
      if (isValid) {
        await user.updateInfoFromServer();
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
  });
  if (!userValid) {
    return (<div />);
  }
  return (
    <form autoComplete="off">
      <div
        style={{
          height: '100vh', width: '100%', background: COLORS.LIGHT_BLUE, minWidth: 1254,
        }}
        id="account_AccountPage_div"
      >
        <div style={{ height: 60 }} />
        <div style={{ margin: '0 auto', width: 1154 }}>
          <AccountCard />
          <FilesPanel />
        </div>
        <ChangePasswordWindow />
        <ChangeEmailWindow />
        <ChangeUsernameWindow />
      </div>
    </form>
  );
}

function mapStateToProps(state) {
  return {
    mainUser: state.generalData.mainUser,
  };
}

export default connect(mapStateToProps, {
  setMainUser: setMainUserAction,
})(AccountPage);
