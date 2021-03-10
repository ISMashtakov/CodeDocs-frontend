import React from 'react';

import Header from '../workspace/Header';
import COLORS from '../style/colors';
import authApi from '../helpers/auth_helper';
import urlParams from '../helpers/url_helper';


export default function MailActivateName() {
    React.useEffect(()=>{
        (async () => {
            const result = await authApi.activateUser(urlParams.getUID(), urlParams.getToken())
            console.log(result)
        })();
    })
    return(
        <div>
          <Header/>
          <div style={{background: COLORS.LIGHT_GRAY, display: "block", width: "100%", height: "calc(100vh - 50px)"}}>
              <div style={{textAlign: "center", fontSize: 45}}>
                  Mail successful activated
              </div>
          </div>
        </div>
    )
}