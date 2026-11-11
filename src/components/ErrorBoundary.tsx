import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public reset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 my-4 bg-rose-50/80 border border-rose-200 rounded-3xl text-center max-w-lg mx-auto shadow-sm">
          <h3 className="font-bold text-sm text-rose-900 mb-1">
            {this.props.fallbackTitle || "此區塊載入暫時發生異常"}
          </h3>
          <p className="text-xs text-rose-700 mb-3">
            請點擊下方按鈕重試或重新整理頁面。
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="px-4 py-1.5 bg-[#992545] text-white text-xs font-bold rounded-full hover:bg-[#801b36] transition-all cursor-pointer shadow-xs"
          >
            重試恢復
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
