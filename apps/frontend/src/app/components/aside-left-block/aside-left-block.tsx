import { useNavigate } from 'react-router-dom';

type AsideLeftBlockProps = {
  className?: string;
  backButtonPath?: string;
  children?: JSX.Element[];
};

export default function AsideLeftBlock(props: AsideLeftBlockProps): JSX.Element {
  const { backButtonPath, children } = props;
  const className = props.className ?? '';

  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <aside className={className}>
      {
        backButtonPath &&
        <button
          className={`btn-flat btn-flat--underlined ${className}__back`}
          type="button"
          onClick={handleBackButtonClick}
        >
          <svg width={14} height={10} aria-hidden="true">
            <use xlinkHref="#arrow-left" />
          </svg>
          <span>Назад</span>
        </button>
      }
      {children}
    </aside>
  );
}
