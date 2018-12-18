import 'modern-normalize';
import '../styles/style.css';
import '../styles/nprogress.css';
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
    if (Component.getInitialProps) {
      return Component.getInitialProps(ctx);
    }

    return {};
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
