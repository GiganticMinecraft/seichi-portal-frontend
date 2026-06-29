import ErrorDialog from './_components/ErrorDialog';

export const dynamic = 'force-dynamic';

const NotFound = () => (
  <ErrorDialog
    status={404}
    title="ページが見つかりません"
    message="URL を確認してから、もう一度アクセスしてください。"
    showDiagnostics={false}
  />
);

export default NotFound;
