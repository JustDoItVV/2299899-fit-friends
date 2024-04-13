import './loading.css';

import { RotatingLines } from 'react-loader-spinner';

export default function Loading(): JSX.Element {
  return (
    <div className='loading-spinner'>
      <RotatingLines
        visible={true}
        width='40'
      />
    </div>
  );
}
