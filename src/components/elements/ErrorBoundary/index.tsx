import { ErrorInfo, PureComponent, ReactNode } from 'react';

import { Alert } from '../Alert';

type StatusMessages = { [status: number]: string };
type Props = {
  children: React.ReactNode;
  statusMessages?: StatusMessages;
  onError?: () => void;
};
type State = { hasError: boolean; error: Error | null };
const DEFAULT_MESSAGES: StatusMessages = { 0: 'サーバエラー' };

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
    const messages = { ...DEFAULT_MESSAGES, ...statusMessages };

    if (hasError) {
      // TODO: HTTPErrorやほかのErrorに対応する
      return (
        <Alert
          status="error"
          title={messages[0]}
          description="URL・直前に行った動作など、提供できるすべての情報を管理者に連絡・提供してください。"
        />
      );
    }

    return children;
  }
}
