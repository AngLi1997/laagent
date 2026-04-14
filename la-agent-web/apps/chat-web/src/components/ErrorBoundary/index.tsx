import { Component } from 'react';

/**
 * 捕获其子组件中发生的 JavaScript 错误，并显示一个备用 UI
 */
export class ErrorBoundary extends Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ hasError: true });
    console.error(error, errorInfo);
  }

  render() {
    // @ts-expect-error
    if (this.state.hasError) {
      return (
        <div>
          Oops! An error occurred. This could be due to an ECharts runtime error or invalid SVG content.
          {' '}
          <br />
          (see the browser console for more information)
        </div>
      );
    }

    // @ts-expect-error
    return this.props.children;
  }
}
