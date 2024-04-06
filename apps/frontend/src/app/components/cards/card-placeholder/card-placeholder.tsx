type CardPlaceholderProps = {
  classNameInfix: string;
  imagePath: string;
}

export default function CardPlaceholder({ classNameInfix, imagePath }: CardPlaceholderProps): JSX.Element {
  return (
    <div className={`thumbnail-${classNameInfix}`}>
      <div className={`thumbnail-${classNameInfix}__image`}>
        <picture>
          <source
            type="image/webp"
            srcSet={`${imagePath}.webp, ${imagePath}@2x.webp 2x`}
          />
          <img
            src={`${imagePath}.jpg`}
            srcSet={`${imagePath}@2x.jpg 2x`}
            width={330}
            height={190}
            alt=""
          />
        </picture>
      </div>
      <div className={`thumbnail-${classNameInfix}__header`} style={{ alignContent: 'center' }}>
        <h3 className={`thumbnail-${classNameInfix}__title`}>
          Скоро здесь появится что - то полезное
        </h3>
      </div>
    </div>
  );
}
