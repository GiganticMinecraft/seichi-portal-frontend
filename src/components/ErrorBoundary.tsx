import { HTTPError } from 'ky';
import { ErrorInfo, PureComponent, ReactNode } from 'react';

import { Alert } from './Alert';

type StatusMessages = { [status: number]: string };
type Props = {
  children: ReactNode;
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

    console.error(error, info); // eslint-disable-line no-console
  }

  render(): ReactNode {
    const { children, statusMessages = {} } = this.props;
    const { hasError, error } = this.state;
    const messages = { ...DEFAULT_MESSAGES, ...statusMessages };

    if (hasError) {
      // TODO: HTTPError以外に対応する
      const statusCode = (error as HTTPError)?.response?.status;

      if (statusCode && Object.keys(messages).includes(String(statusCode))) {
        return <Alert status="error" title={messages[statusCode]} />;
      }

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
