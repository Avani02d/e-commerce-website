import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="page empty"><p className="eyebrow">Something went wrong</p><h1>We hit a small bump.</h1><p>Please refresh the page and try again.</p><button className="button" onClick={() => window.location.reload()}>Refresh <span>↻</span></button></main>;
  }
}
