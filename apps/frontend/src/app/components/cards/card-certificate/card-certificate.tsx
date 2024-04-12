import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { memo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { CatalogItem, fetchCertificate, useFetchFileUrl } from '@2299899-fit-friends/frontend-core';
import { User } from '@2299899-fit-friends/types';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type CardCertificateProps = {
  item: CatalogItem;
  path: string;
  changeable?: boolean;
};

export default memo(function CardCertificate(props: CardCertificateProps): JSX.Element {
  const { path } = props;
  const user = props.item as User;
  const changeable = props.changeable ?? false;
  const fileUrl = useFetchFileUrl(fetchCertificate, { id: user.id, path }, 'img/content/placeholder.png');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleChangeButtonClick = () => {
    setIsEditing(true);
  };

  const handleSaveButtonClick = () => {
    setIsEditing(false);
  };

  return (
    <li className="personal-account-coach__item">
      <div className="certificate-card certificate-card--edit">
        <div className="certificate-card__image" style={{ overflow: 'hidden' }}>
          <Document file={fileUrl} className='certificate-card__pdf-page'>
            <Page pageNumber={1} width={294} canvasBackground='transparent'/>
          </Document>
        </div>
        {
          isEditing
          ? <div className="certificate-card__buttons">
              <button
                className="btn-flat btn-flat--underlined"
                type="button"
                onClick={handleSaveButtonClick}
              >
                <svg width={12} height={12} aria-hidden="true">
                  <use xlinkHref="#icon-edit" />
                </svg>
                <span>Сохранить</span>
              </button>
              <div className="certificate-card__controls">
                <button
                  className="btn-icon certificate-card__control"
                  type="button"
                  aria-label="next"
                >
                  <svg width={16} height={16} aria-hidden="true">
                    <use xlinkHref="#icon-change" />
                  </svg>
                </button>
                <button
                  className="btn-icon certificate-card__control"
                  type="button"
                  aria-label="next"
                >
                  <svg width={14} height={16} aria-hidden="true">
                    <use xlinkHref="#icon-trash" />
                  </svg>
                </button>
              </div>
            </div>
        : <div className="certificate-card__buttons">
            {
              changeable &&
              <button
                className="btn-flat btn-flat--underlined"
                type="button"
                onClick={handleChangeButtonClick}
              >
                <svg width={12} height={12} aria-hidden="true">
                  <use xlinkHref="#icon-edit" />
                </svg>
                <span>Изменить</span>
              </button>
            }
          </div>
        }
      </div>
    </li>
  );
});
