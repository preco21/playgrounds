import 'modern-normalize';
import NProgress from 'nprogress';
import App, {Container} from 'next/app';
import Router from 'next/router';
import React from 'react';

NProgress.configure({showSpinner: false});
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default class _App extends App {
  static getInitialProps({Component, ctx}) {
    return {
      pageProps: Component.getInitialProps
        ? Component.getInitialProps(ctx)
        : {},
    };
  }

  render() {
    const {props: {Component, pageProps}} = this;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}
