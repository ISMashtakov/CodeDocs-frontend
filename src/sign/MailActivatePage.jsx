import React from 'react';

import COLORS from '../style/colors';
import authApi from '../helpers/auth_helper';
import urlParams from '../helpers/url_helper';
import { openPage } from '../helpers/general_helpers';
import { ACCOUNT_PAGE_NAME } from '../constants';

export default function MailActivateName() {
  React.useEffect(() => {
    (async () => {
      await authApi.activateUser(urlParams.getUID(), urlParams.getToken());
      openPage(ACCOUNT_PAGE_NAME);
    })();
  });
  return (
    <div>
      <div style={{
        background: COLORS.LIGHT_GRAY, display: 'block', width: '100%', height: 'calc(100vh - 50px)',
      }}
      >
        <div style={{ textAlign: 'center', fontSize: 45 }}>
          Mail successful activated
        </div>
      </div>
    </div>
  );
}
