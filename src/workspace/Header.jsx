import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import { useSnackbar } from 'notistack';
import Divider from '@material-ui/core/Divider';
import { Scrollbars } from 'react-custom-scrollbars';
import Checkbox from '@material-ui/core/Checkbox';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import logo from '../images/logo.png';
import Avatar from '../general_items/Avatar';
import * as mainStyle from '../style/style';
import CustomDialog from '../general_items/CustomDialog';
import createFileIcon from '../images/icons/create_file_blue.png';
import changeFileIcon from '../images/icons/change_file_blue.png';
import FileCreateField from '../general_items/FileCreateField';
import File, { ACCESS_TYPES } from '../helpers/file';
import usersApi from '../helpers/users_helper';
import { toLogin } from '../helpers/auth_helper';
import { openPage, downloadFile } from '../helpers/general_helpers';
import { ACCOUNT_PAGE_NAME } from '../constants';
import { sendFileSettings, sendRunFile, sendStopFile } from './connectionActions';
import ShareDialog from './ShareDialog';
import textEditor from './textEditor';
import StyleSettingsDialog from './StyleSettingsDialog';

export const HEADER_HEIGHT = 75;
const MAX_SHOWED_USERS = 5;

const HEADER_BUTTON_STYLE = {
  ...mainStyle.OUTLINED_BUTTON_STYLE, ...FONTS.H3, textTransform: 'none',
};

const POPOVER_BUTTON_STYLE = {
  ...mainStyle.OUTLINED_BUTTON_STYLE, ...FONTS.BODY, textTransform: 'none', height: 35,
};

function CreateFileDialog({
  user, open, onClose, fileId,
}) {
  const [filename, setFilename] = React.useState('');
  const [language, setLanguage] = React.useState('python');
  const [saveCol, setSaveCol] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  async function clickToCreate() {
    if (filename.length <= 0) {
      enqueueSnackbar({ text: 'Filename can not be empty!!!', type: 'error' });
      return;
    }

    const response = await usersApi.createFile(
      user,
      filename,
      language,
      saveCol ? fileId : undefined,
    );
    if (response.isGood) {
      const file = new File(response.id, filename, language, ACCESS_TYPES.OWNER);
      file.open(user);
    } else if (response.reason.length > 0) {
      enqueueSnackbar({ text: response.reason.join('\n'), type: 'error' });
    }
  }

  return (
    <CustomDialog
      icon={createFileIcon}
      title="Create file"
      onCancel={onClose}
      isOpen={open}
      onAction={clickToCreate}
      actionText="Create"
    >
      <div style={{ margin: '40px 0px' }}>
        <FileCreateField
          id="workspace_Header_CreateFileDialog_createTextField"
          filename={filename}
          onChangeFilename={(event) => setFilename(event.target.value)}
          language={language}
          onChangeLanguage={(event) => { setLanguage(event.target.value); }}
        />
        <div>
          <Checkbox
            checked={saveCol}
            onChange={(e) => setSaveCol(e.target.checked)}
            style={{ color: COLORS.BUTTON_BLUE }}
          />
          <span style={FONTS.BODY}>
            Remember participants
          </span>
        </div>
      </div>
    </CustomDialog>
  );
}

function stateToPropsMap(state) {
  return {
    file: state.documentData.file,
  };
}

const FileSettingsDialog = connect(stateToPropsMap)(({ open, onClose, file }) => {
  const [filename, setFilename] = React.useState('');
  const [language, setLanguage] = React.useState('python');
  const [needUpdate, setNeedUpdate] = React.useState(true);
  const { enqueueSnackbar } = useSnackbar();

  function close() {
    onClose();
    setTimeout(() => setNeedUpdate(true), 200);
  }

  async function clickToSave() {
    if (filename.length <= 0) {
      enqueueSnackbar({ text: 'Filename can not be empty!!!', type: 'error' });
      return;
    }

    sendFileSettings(filename, language);
    close();
  }

  React.useEffect(() => {
    if (needUpdate && file !== null) {
      setFilename(file.name);
      setLanguage(file.language);
      setNeedUpdate(false);
    }
  });
  return (
    <CustomDialog
      icon={changeFileIcon}
      title="Change file configrations"
      onCancel={close}
      isOpen={open}
      onAction={clickToSave}
      actionText="Save"
    >
      <div style={{ margin: '40px 0px' }}>
        <FileCreateField
          id="workspace_Header_FileSettingsDialog_fileTextField"
          filename={filename}
          onChangeFilename={(event) => setFilename(event.target.value)}
          language={language}
          onChangeLanguage={(event) => { setLanguage(event.target.value); }}
        />
      </div>
    </CustomDialog>
  );
});

function activeUsersstateToPropsMap(state) {
  return {
    activeUsers: state.documentData.activeUsers,
  };
}

const ActiveUsersList = connect(activeUsersstateToPropsMap)(({ activeUsers }) => {
  const [anchorElUsers, setAnchorElUsers] = React.useState(null);
  const ref = React.createRef();
  function MoreUsers() {
    if (activeUsers.length <= 5) {
      return null;
    }
    return (
      <div
        style={{
          display: 'inline-block', position: 'relative', zIndex: 5,
        }}
      >
        <Avatar
          id="workspace_Header_userAvatars_MoreUsers"
          user={{ color: COLORS.GRAY2, shortName: `+${activeUsers.length - 5}` }}
          style={{ color: COLORS.TEXT_GRAY }}
          onClick={() => { setAnchorElUsers(ref.current); }}
        />
      </div>

    );
  }

  return (
    <div ref={ref} id="workspace_Header_userAvatars" style={{ float: 'right', marginTop: 12, marginRight: 10 }}>
      {
        activeUsers.slice(0, MAX_SHOWED_USERS).map((item, i) => (
          <div
            key={JSON.stringify(item)}
            style={{
              display: 'inline-block', position: 'relative', left: 10 * (Math.min(activeUsers.length, MAX_SHOWED_USERS) - i - (activeUsers.length > 5 ? 0 : 1)), zIndex: i,
            }}
          >
            <Avatar showTip user={item} id={`workspace_Header_userAvatar_${item.username}`} />
          </div>
        ))
    }
      <MoreUsers />

      <Popover // Users popover
        open={!!anchorElUsers}
        anchorEl={anchorElUsers}
        onClose={() => setAnchorElUsers(null)}
        anchorOrigin={{
          vertical: 60,
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Scrollbars thumbSize={40} style={{ height: 300, width: 250, paddingTop: 5 }}>
          {
          activeUsers.map((item) => (
            <div style={{ padding: '5px 10px' }} key={JSON.stringify(item)}>
              <div
                style={{
                  display: 'inline-block', position: 'relative',
                }}
              >
                <Avatar user={item} showAccess />
              </div>
              <span style={{
                ...FONTS.BODY, color: COLORS.BLACK, display: 'inline-block', minWidth: 178, textAlign: 'center',
              }}
              >
                {item.username}
              </span>
            </div>
          ))
        }
        </Scrollbars>
      </Popover>
    </div>
  );
});

function Header({
  user, file, fileIsRunned,
}) {
  const [isOpenCreateFileDialog, setIsOpenCreateFileDialog] = React.useState(false);
  const [isOpenFileSettingsDialog, setIsOpenFileSettingsDialog] = React.useState(false);
  const [isOpenStyleSettingsDialog, setIsOpenStyleSettingsDialog] = React.useState(false);
  const [isOpenShareDialog, setIsOpenShareDialog] = React.useState(false);
  const [anchorElSettings, setAnchorElSettings] = React.useState(null);
  const [anchorElAccount, setAnchorElAccount] = React.useState(null);

  function downloadHandler() {
    if (!textEditor.text || !file.name) return;

    downloadFile(textEditor.text, file.name);
  }

  return (
    <div id="workspace_Header" style={{ width: '100%', height: HEADER_HEIGHT, background: COLORS.WHITE }}>
      <img
        id="workspace_Header_logo"
        src={logo}
        alt="logo"
        style={{
          display: 'inline-block', height: 55, width: 'auto', float: 'left', marginLeft: 25, marginTop: 7,
        }}
      />
      <div style={{ float: 'left', marginTop: 5, marginLeft: 20 }}>
        <div id="workspace_Header_filename" style={{ ...FONTS.H2, color: COLORS.TEXT_GRAY, marginLeft: 14 }}>{(file) ? file.name : 'Unknown'}</div>
        <div style={{}}>
          <Button id="workspace_Header_NewButton" style={HEADER_BUTTON_STYLE} onClick={() => setIsOpenCreateFileDialog(true)}>New</Button>
          {
            fileIsRunned
              ? <Button id="workspace_Header_RunButton" style={HEADER_BUTTON_STYLE} onClick={() => { sendStopFile(); }}>Stop</Button>
              : <Button id="workspace_Header_RunButton" style={HEADER_BUTTON_STYLE} onClick={() => { sendRunFile(); }}>Run</Button>
          }
          <Button id="workspace_Header_DownloadButton" style={HEADER_BUTTON_STYLE} onClick={downloadHandler}>Download</Button>
          <Button id="workspace_Header_SettingsButton" style={HEADER_BUTTON_STYLE} onClick={(event) => setAnchorElSettings(event.currentTarget)}>Settings</Button>
        </div>
      </div>

      {(user)
        ? <Avatar id="workspace_Header_MyAvatar" user={user} style={{ float: 'right', marginRight: 32, marginTop: 12 }} onClick={(event) => setAnchorElAccount(event.currentTarget)} showTip />
        : null}
      <Button
        style={{
          ...mainStyle.BUTTON_STYLE, float: 'right', height: 37, width: 118, marginTop: 19, marginRight: 35,
        }}
        id="workspace_Header_ShareButton"
        onClick={() => setIsOpenShareDialog(true)}
      >
        SHARE CODE
      </Button>

      <ActiveUsersList />

      <CreateFileDialog
        user={user}
        open={isOpenCreateFileDialog}
        fileId={file ? file.id : undefined}
        onClose={() => setIsOpenCreateFileDialog(false)}
      />
      <FileSettingsDialog
        open={isOpenFileSettingsDialog}
        onClose={() => setIsOpenFileSettingsDialog(false)}
      />
      <ShareDialog open={isOpenShareDialog} onClose={() => setIsOpenShareDialog(false)} />
      <StyleSettingsDialog
        open={isOpenStyleSettingsDialog}
        onClose={() => setIsOpenStyleSettingsDialog(false)}
      />
      <Popover // settings popover
        open={!!anchorElSettings}
        anchorEl={anchorElSettings}
        onClose={() => setAnchorElSettings(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Button
          id="workspace_Header_SettingsPopover_ChangeFileButton"
          style={POPOVER_BUTTON_STYLE}
          fullWidth
          onClick={() => {
            setIsOpenFileSettingsDialog(true);
            setAnchorElSettings(null);
          }}
        >
          Change file configurations
        </Button>
        <br />
        <Button
          fullWidth
          style={{ ...POPOVER_BUTTON_STYLE, justifyContent: 'left' }}
          onClick={() => {
            setIsOpenStyleSettingsDialog(true);
            setAnchorElSettings(null);
          }}
        >
          Change style
        </Button>
      </Popover>
      <Popover // Main user popover
        open={!!anchorElAccount}
        anchorEl={anchorElAccount}
        PaperProps={{
          style: mainStyle.POPOVER_STYLE,
        }}
        onClose={() => setAnchorElAccount(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div style={{ padding: 10, width: 154 }}>
          <div style={{ ...FONTS.H3, color: COLORS.BLACK }}>{user.username}</div>
          <Button id="workspace_Header_mainAvatarPopover_ViewProfileButton" style={{ ...POPOVER_BUTTON_STYLE, padding: 0, justifyContent: 'left' }} fullWidth onClick={() => { openPage(ACCOUNT_PAGE_NAME); }}>View profile</Button>
          <Divider />
          <Button id="workspace_Header_mainAvatarPopover_LogoutButton" style={{ ...POPOVER_BUTTON_STYLE, padding: 0, justifyContent: 'left' }} fullWidth onClick={() => { toLogin(false); }}>Log out</Button>
        </div>
      </Popover>
    </div>
  );
}
function mapToState(state) {
  return {
    user: state.generalData.mainUser,
    file: state.documentData.file,

    activeUsers: state.documentData.activeUsers,
    countActiveUsers: state.documentData.activeUsers.length,
    fileIsRunned: state.documentData.fileIsRunned,
  };
}
export default connect(mapToState)(Header);
