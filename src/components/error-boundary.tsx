import { Component, type ReactNode } from "react";
import { resetToSeed } from "@/lib/store";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  reset = () => this.setState({ error: null });

  handleResetData = () => {
    try {
      localStorage.clear();
      resetToSeed();
    } catch {}
    this.setState({ error: null });
    window.location.href = "/";
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
        <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            This page didn't load
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong. You can try refreshing, resetting app data, or heading home.
          </p>

          {error?.message && (
            <div className="mt-4 rounded border border-destructive/20 bg-destructive/10 p-3 text-left">
              <p className="font-mono text-xs text-destructive break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                this.reset();
                window.location.reload();
              }}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
            <button
              onClick={this.handleResetData}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Reset app data
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
