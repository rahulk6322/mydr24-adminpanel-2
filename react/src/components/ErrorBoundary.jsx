import { Component } from 'react';

/**
 * ErrorBoundary — prevents a single failing screen from taking down the panel.
 * Provides a friendly recovery UI and logs the error for diagnostics.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[MyDR24] Render error', error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-2xl text-white mb-4"
            style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>
            <i className="fa-solid fa-triangle-exclamation" />
          </div>
          <div className="section-title text-lg">This screen hit an error</div>
          <p className="text-muted text-sm mt-2 max-w-md mx-auto">{String(this.state.error?.message || this.state.error)}</p>
          <button className="btn btn-primary mt-5" onClick={this.reset}><i className="fa-solid fa-rotate-right" /> Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
