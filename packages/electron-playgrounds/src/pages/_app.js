import 'modern-normalize';
import '../styles/style.css';
import App, {Container} from 'next/app';
import React from 'react';

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
