import React from 'react';

import COLORS from '../style/colors';
import FONTS from '../style/fonts';
import authApi from '../helpers/auth_helper';
import urlParams from '../helpers/url_helper';
import { openPage } from '../helpers/general_helpers';
import { ACCOUNT_PAGE_NAME } from '../constants';
import emailConfirmIcon from '../images/icons/email_confirm.png';

export default function MailActivatePage() {
  async function redirect() {
    await authApi.activateUser(urlParams.getUID(), urlParams.getToken());
    openPage(ACCOUNT_PAGE_NAME);
  }
  React.useEffect(() => {
    redirect()
  });

  return (
    <div>
      <div style={{
        display: 'block', marginLeft: 'auto', marginRight: 'auto', width: 810, paddingTop: 213
      }}
      >
        <div style={{display: 'inline-block', float: 'left'}}>
          <img src={emailConfirmIcon} alt="emailConfirmIcon" style={{ height: 200, width: 'auto'}} />
        </div>

        <div style={{display: 'inline-block', float: 'right', paddingTop: 40}}>
          <span style={{...FONTS.MAIL_ACTIVATE_TITLE, color: COLORS.TEXT_DARK_GRAY}}>
            Your mail has been activated!
          </span>
          <br/>
          <br/>
          <span style={{...FONTS.H1, color: COLORS.TEXT_GRAY}}>
            Don't panic, now you will be redirected to another page.
            <br/>
            If this does not happen click <a href="#" onClick={redirect}>here</a>.
          </span> 
          
          
        </div>

      </div>
    </div>
  );
}
