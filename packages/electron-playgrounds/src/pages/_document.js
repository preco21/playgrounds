import React from 'react';
import {ServerStyleSheet} from 'styled-components';
import Document, {Head, Main, NextScript} from 'next/document';

export default class _Document extends Document {
  static getInitialProps({renderPage}) {
    // Inject `styled-components` styles
    const sheet = new ServerStyleSheet();
    const page = renderPage((Page) => (props) => sheet.collectStyles(<Page {...props} />));
    const stylesEl = sheet.getStyleElement();

    return {
      ...page,
      stylesEl,
    };
  }

  render() {
    const {props: {stylesEl}} = this;
    return (
      <html>
        <Head>
          <meta
            httpEquiv="Content-Security-Policy"
            content="default-src 'self' http: https:; script-src 'self' 'unsafe-inline' https:; style-src 'self' http: https: 'unsafe-inline'; img-src 'self' http: https: data:"
          />
          {/* Styles from `next-css` */}
          <link rel="stylesheet" href="/_next/static/style.css" />
          {/* Styles from `styled-components` */}
          {stylesEl}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
