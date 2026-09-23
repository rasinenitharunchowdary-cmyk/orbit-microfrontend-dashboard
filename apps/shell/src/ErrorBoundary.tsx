import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@mfe/ui';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Remote module failed', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="remote-fallback">
          <ErrorState
            title="Module unavailable"
            message="This micro-frontend could not be loaded. The rest of the application is still available."
            onRetry={() => location.reload()}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
