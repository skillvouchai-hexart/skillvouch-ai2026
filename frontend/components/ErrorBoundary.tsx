import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error in React component tree:', error, errorInfo);

        // Auto-reload once if it's a chunk load error
        if (error.message.includes('dynamically imported module') || error.message.includes('fetch')) {
            const hasReloaded = sessionStorage.getItem('chunk_failed_reload');
            if (!hasReloaded) {
                sessionStorage.setItem('chunk_failed_reload', 'true');
                window.location.reload();
            }
        }
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 m-4">
                    <div className="bg-red-500/10 p-4 rounded-full mb-4">
                        <AlertTriangle className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-slate-400 max-w-md mb-6">
                        We encountered an unexpected error while loading this component. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Reload Page
                    </button>
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <pre className="mt-8 p-4 bg-black/50 rounded text-left text-red-400 text-xs overflow-auto max-w-full">
                            {this.state.error.message}
                        </pre>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}
