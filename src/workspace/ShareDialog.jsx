import React from 'react';
import { connect } from 'react-redux';

import CustomDialog from '../general_items/CustomDialog';
import shareFileIcon from '../images/icons/share_file_blue.png';
import LinkField, { AccessSelect } from '../general_items/LinkField';
import { changeLinkAccess, changeUserAccess } from './connectionActions';
import Avatar from '../general_items/Avatar';
import FONTS from '../style/fonts';

function UserRow({ user, mainUser }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'inline-block', marginRight: 15 }}><Avatar user={user} /></div>
      <span style={FONTS.BODY}>{user.username}</span>
      <div style={{ display: 'inline-block', float: 'right' }}>
        <AccessSelect
          access={user.access}
          canEdit={mainUser.username !== user.username && user.access <= mainUser.access}
          onChange={(event) => changeUserAccess(user.id, event.target.value)}
        />
      </div>
    </div>
  );
}

function ShareDialog({
  open, onClose, allUsers, file, mainUser,
}) {
  async function onChangeDefaultAccess(event) {
    changeLinkAccess(event.target.value);
  }

  if (file === null) return null;

  return (
    <CustomDialog
      icon={shareFileIcon}
      title={`Share ${file.name}`}
      onCancel={onClose}
      isOpen={open}
    >
      <div style={{ margin: '20px 0px' }}>
        <LinkField
          style={{ marginBottom: 20 }}
          access={file.defaultAccess}
          onChangeAccess={onChangeDefaultAccess}
          mainUser={mainUser}
        />
        {allUsers.map((user) => <UserRow user={user} key={user.username} mainUser={mainUser} />)}
      </div>
    </CustomDialog>
  );
}

function mapStateToProps(state) {
  return {
    mainUser: state.generalData.mainUser,
    allUsers: state.documentData.allUsers,
    file: state.documentData.file,
    ...(state.documentData.file !== null ? {
      filename: state.documentData.file.name,
      defaultAccess: state.documentData.file.defaultAccess,
    } : {}),
  };
}

export default connect(mapStateToProps)(ShareDialog);
