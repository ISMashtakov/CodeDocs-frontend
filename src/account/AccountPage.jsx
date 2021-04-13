import React from 'react';
import { connect } from 'react-redux';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';

import { MainUser } from '../helpers/user';
import { toLogin } from '../helpers/auth_helper';
import { setMainUserAction } from '../redux/actions';
import { setChangePasswordIsOpenAction, setChangeEmailIsOpenAction, setChangeUsernameIsOpenAction } from './actions';
import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import * as mainStyle from '../style/style';
import Avatar from '../general_items/Avatar';
import ChangePasswordWindow from './ChangePasswordWindow';
import ChangeEmailWindow from './ChangeEmailWindow';
import ChangeUsernameWindow from './ChangeUsernameWindow';
import { DOWNLOAD_STATE } from '../helpers/general_helpers';
import usersApi from '../helpers/users_helper';
import CustomDialog from '../general_items/CustomDialog';
import removeFileIcon from '../images/icons/file_remove_blue.png';
import FileCreateField from '../general_items/FileCreateField';
import { ACCESS_TYPES_NUMBER_TO_STRING } from '../helpers/file';

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
        float: 'left', backgroundColor: COLORS.WHITE, padding: '20px 15px', width: 354, height: 378, borderRadius: '6px', boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)', position: 'fixed',
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
          ...FONTS.H1, textTransform: 'none', padding: '10px 0px 10px 0px', marginTop: 25, width: BUTTON_WIDTH, color: COLORS.TEXT_DARK_GRAY,
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

function mapStateToPropsFileRow(state) {
  return {
    mainUser: state.generalData.mainUser,
  };
}

const FileRow = connect(mapStateToPropsFileRow, {
  setMainUser: setMainUserAction,
})(({
  file, selected, mainUser, setMainUser, onClick,
}) => {
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  async function clickToDelete() {
    const response = await usersApi.deleteFile(mainUser, file.id);
    if (response.isGood) {
      mainUser.deleteFile(file.id);
      setMainUser(mainUser);
    } else if (response.reason.length > 0) {
      enqueueSnackbar({ text: response.reason.join('\n'), type: 'error' });
    }
  }

  function DeleteConfirm() {
    return (
      <CustomDialog
        icon={removeFileIcon}
        title="Delete file"
        onCancel={() => setDialogIsOpen(false)}
        isOpen={dialogIsOpen}
        onAction={clickToDelete}
        actionText="Delete"
      >
        <div style={{
          ...FONTS.H3, color: COLORS.TEXT_DARK_GRAY, margin: '20px 0px', width: 470,
        }}
        >
          Are you sure you want to delete the file?
        </div>
      </CustomDialog>
    );
  }

  function FileButton() {
    if (file.isOwner) {
      return (<Button style={{ ...RED_BUTTON_STYLE, width: 80 }} onClick={() => setDialogIsOpen(true)} variant="outlined">DELETE</Button>);
    }
    return (<Button style={{ ...BLUE_BUTTON_STYLE, width: 80 }} variant="outlined">LEAVE</Button>);
  }

  return (
    <TableRow onClick={onClick} onDoubleClick={() => file.open(mainUser)} style={{ ...(selected ? { backgroundColor: COLORS.GRAY2 } : {}), cursor: 'pointer' }}>
      <TableCell style={{ ...FILE_ROW_STYLE }}><img src={file.icon} alt="logo" style={{ height: 24, width: 'auto' }} /></TableCell>
      <TableCell style={{ ...FILE_ROW_STYLE, width: 188, wordBreak: 'break-all' }}>{file.name}</TableCell>
      <TableCell style={{ ...FILE_ROW_STYLE }}>{file.language}</TableCell>
      <TableCell style={{ ...FILE_ROW_STYLE }}>
        {ACCESS_TYPES_NUMBER_TO_STRING[file.access]}
      </TableCell>
      <TableCell style={{ ...FILE_ROW_STYLE }}><FileButton /></TableCell>
      <DeleteConfirm />
    </TableRow>
  );
});

function mapStateToPropsNewFilesPanel(state) {
  return {
    mainUser: state.generalData.mainUser,
    filesIsUpdated: state.generalData.mainUser.filesIsUpdated,
    count: state.generalData.mainUser.filesLength,
  };
}

const NewFilesPanel = connect(mapStateToPropsNewFilesPanel, {
  setMainUser: setMainUserAction,
})(({ mainUser, setMainUser }) => {
  const [filename, setFilename] = React.useState('');
  const [language, setLanguage] = React.useState('python');
  const { enqueueSnackbar } = useSnackbar();

  async function clickToCreate() {
    if (filename.length <= 0) {
      enqueueSnackbar({ text: 'Filename can not be empty!!!', type: 'error' });
      return;
    }

    const response = await usersApi.createFile(mainUser, filename, language);
    if (response.isGood) {
      mainUser.addFile(response.id, filename, language);
      setMainUser(mainUser);
      setFilename('');
    } else if (response.reason.length > 0) {
      enqueueSnackbar({ text: response.reason.join('\n'), type: 'error' });
    }
  }

  return (
    <div style={{
      backgroundColor: COLORS.WHITE, marginTop: 30, width: 651, padding: 20,
    }}
    >
      <FileCreateField
        id="account_AccountPage_FilesPanel_filenameTextField"
        filename={filename}
        onChangeFilename={(event) => setFilename(event.target.value)}
        language={language}
        onChangeLanguage={(event) => { setLanguage(event.target.value); }}
      />
      <Button
        id="account_AccountPage_FilesPanel_createFileButton"
        variant="contained"
        style={{
          ...mainStyle.BUTTON_STYLE, width: 157, marginLeft: 15, boxShadow: '0 0 0 0', height: 55,
        }}
        onClick={clickToCreate}
      >
        CREATE FILE
      </Button>
    </div>
  );
});

function mapStateToPropsFilesPanel(state) {
  return {
    mainUser: state.generalData.mainUser,
    filesIsUpdated: state.generalData.mainUser.filesIsUpdated,
    count: state.generalData.mainUser.filesLength,
  };
}

const FilesPanel = connect(mapStateToPropsFilesPanel, {
  setMainUser: setMainUserAction,
})(({ mainUser, setMainUser }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [updateFilesState, setUpdateFilesState] = React.useState(DOWNLOAD_STATE.NEED_DOWNLOAD);
  const [selectedFile, setSelectedFile] = React.useState(null);

  React.useEffect(async () => {
    if (updateFilesState !== DOWNLOAD_STATE.NEED_DOWNLOAD) return;

    if (!mainUser.filesIsUpdated) {
      setUpdateFilesState(DOWNLOAD_STATE.DOWNLOADING);
      const isGood = await mainUser.updateFilesFromServer();
      if (isGood) {
        setMainUser(mainUser);
      } else {
        setUpdateFilesState(DOWNLOAD_STATE.FAIL);
        // alert("problem during getting files")
      }
    }
    setUpdateFilesState(DOWNLOAD_STATE.DOWNLOAD);
  });

  let files = (selectedTab === 0) ? mainUser.files : mainUser.myFiles;
  if (files) files = files.slice().reverse();

  return (
    <div style={{ float: 'left', marginLeft: 79 + 354 }} id="account_AccountPage_FilesPanel_div">
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
      <NewFilesPanel />
      <Box
        style={{
          bottom: 0, backgroundColor: COLORS.WHITE, marginTop: 24, borderRadius: '6px', width: 691,
        }}
        overflow="auto"
        id="account_AccountPage_FilesPanel_BoxWithTable"
      >
        <Table>
          <TableBody>
            {
              (mainUser.filesIsUpdated)
                ? files.map((file) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    onClick={() => setSelectedFile(file.id)}
                    selected={selectedFile === file.id}
                  />
                ))
                : (
                  <TableRow>
                    <TableCell>
                      <CircularProgress style={{ color: COLORS.BUTTON_BLUE }} size={20} />
                    </TableCell>
                  </TableRow>
                )
            }
          </TableBody>
        </Table>
      </Box>

    </div>
  );
});

function AccountPage({ mainUser, setMainUser }) {
  const [userValid, setUserValid] = React.useState(false);
  const [updateState, setUpdateState] = React.useState(DOWNLOAD_STATE.NEED_DOWNLOAD);

  React.useEffect(async () => {
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

  if (!userValid) {
    return (<div />);
  }
  return (
    <form autoComplete="off">
      <div
        style={{
          width: '100%', background: COLORS.LIGHT_BLUE, minWidth: 1254, minHeight: '100vh',
        }}
        id="account_AccountPage_div"
      >
        <div style={{ height: 60 }} />
        <div style={{ margin: '0 auto', width: 1154 }}>
          <AccountCard />
          <FilesPanel />
          <div style={{ clear: 'both' }} />
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
