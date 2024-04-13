import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { ChangeEvent, memo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { PlaceholderPath } from '@2299899-fit-friends/consts';
import {
    CatalogItem, checkAuth, fetchCertificate, updateUser, useAppDispatch, useFetchFileUrl
} from '@2299899-fit-friends/frontend-core';
import { User } from '@2299899-fit-friends/types';

import Loading from '../../loading/loading';

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

  const dispatch = useAppDispatch();
  const { fileUrl, setFileUrl } = useFetchFileUrl(
    fetchCertificate,
    { id: user.id, path },
    PlaceholderPath.Image,
    [user, path],
  );

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteCertificate, setDeleteCertificate] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const certificateInputRef = useRef<HTMLInputElement | null>(null);

  const handleChangeButtonClick = () => {
    setIsEditing(true);
  };

  const handleSaveButtonClick = () => {
    if (user.id) {
      const index = user.certificates?.indexOf(path);
      const formData = new FormData();

      if (deleteCertificate) {
        formData.append('deleteCertificate', 'true');
      }
      if (index) {
        formData.append('certificateIndex', index?.toString());
      }
      if (file) {
        formData.append('certificate', file);
      }

      dispatch(updateUser({ id: user.id, data: formData }));
      dispatch(checkAuth());
    }
    setDeleteCertificate(false);
    setIsEditing(false);
  };

  const handleUpdateButtonClick = () => {
    certificateInputRef.current?.click();
  };

  const handleUpdateCertificateInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const files = evt.currentTarget.files;
    if (user.id && files && files.length !== 0) {
      setFile(files[0]);
      const url = URL.createObjectURL(files[0]);
      setFileUrl(url);
    }
  };

  const handleDeleteButtonClick = () => {
    if (user.id) {
      setDeleteCertificate(true);
      setFileUrl('');
    }
  };

  return (
    <div className="personal-account-coach__item">
      <div className="certificate-card certificate-card--edit">
        <div className="certificate-card__image" style={{ overflow: 'hidden' }}>
          <Document file={fileUrl} className='certificate-card__pdf-page' loading={Loading}>
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
                <input
                  className='visually-hidden'
                  ref={certificateInputRef}
                  type="file"
                  name="certificate"
                  tabIndex={-1}
                  accept=".pdf"
                  onChange={handleUpdateCertificateInputChange}
                />
                <button
                  className="btn-icon certificate-card__control"
                  type="button"
                  aria-label="next"
                  onClick={handleUpdateButtonClick}
                >
                  <svg width={16} height={16} aria-hidden="true">
                    <use xlinkHref="#icon-change" />
                  </svg>
                </button>
                <button
                  className="btn-icon certificate-card__control"
                  type="button"
                  aria-label="next"
                  onClick={handleDeleteButtonClick}
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
    </div>
  );
});
