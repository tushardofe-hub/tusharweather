import React from 'react';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onDismiss,
}) => {
  return (
    <div
      role="alert"
      className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-4 sm:p-5 flex items-start justify-between gap-4 text-rose-200 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="p-1 rounded-lg bg-rose-500/20 text-rose-400 mt-0.5 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Weather Service Notice</h4>
          <p className="text-xs sm:text-sm text-rose-200/90 mt-0.5 leading-relaxed">
            {message}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-rose-600/80 hover:bg-rose-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-400 hover:text-white p-1 rounded-md transition-colors"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
