import { Suspense } from 'react';
import QrCodeUser from './QrCodeUser';

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <QrCodeUser />
    </Suspense>
  );
}
