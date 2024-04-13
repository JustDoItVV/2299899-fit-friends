import { RotatingLines } from 'react-loader-spinner';

export default function Loading(): JSX.Element {
  return (
    <RotatingLines
      visible={true}
      width='40'
    />
  );
}
