import 'reactjs-popup/dist/index.css';

import { Helmet } from 'react-helmet-async';
import Popup from 'reactjs-popup';

type PopupCertificatesProps = {
  children: JSX.Element,
};

export default function PopupCertificates(props: PopupCertificatesProps): JSX.Element {
  return (
    <Popup
      modal
      trigger={props.children}
      lockScroll={true}
    >
        <Helmet><title>Попап сертификатов — FitFriends</title></Helmet>
        <div className="popup__wrapper">
          <div className="popup-head">
            head
          </div>
          <div className="popup__content popup__content--purchases">
            content
          </div>
        </div>
    </Popup>
  );
}
