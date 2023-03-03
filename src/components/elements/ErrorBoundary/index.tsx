import { ErrorInfo, PureComponent, ReactNode } from 'react';

import { Alert } from '../Alert';

type StatusMessages = { [status: number]: string };
type Props = {
  children: React.ReactNode;
  statusMessages?: StatusMessages;
  onError?: () => void;
};
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError = (error: Error): State => ({
    hasError: true,
    error,
  });

  componentDidCatch(error: Error, info: ErrorInfo) {
    const { onError } = this.props;
    if (onError) onError();

    // eslint-disable-next-line no-console
    console.error(error, info);
  }

  render(): ReactNode {
    const { children, statusMessages = {} } = this.props;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hasError, error } = this.state;

    if (hasError) {
      // TODO: HTTPErrorやほかのErrorに対応する
      return (
        <Alert
          status="error"
          title={statusMessages[0] ?? 'サーバーエラーです'}
          description="URL・直前に行った動作など、提供できるすべての情報を管理者に連絡・提供してください。"
        />
      );
    }

    return children;
  }
}
