import {createHash} from 'crypto';
import Document, {Head, Main, NextScript} from 'next/document';
import React from 'react';
import {ServerStyleSheet} from 'styled-components';

function createCSPHashOf(text) {
  const hash = createHash('sha256');
  hash.update(text);
  return `'sha256-${hash.digest('base64')}'`;
}

export default class _Document extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () => originalRenderPage({
      enhanceApp(App) {
        return (props) => sheet.collectStyles(<App {...props} />);
      },
    });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [...initialProps.styles, ...sheet.getStyleElement()],
    };
  }

  render() {
    const isDev = process.env.NODE_ENV === 'development';
    const scriptCSPRule = isDev ? '\'unsafe-eval\' \'unsafe-inline\'' : createCSPHashOf(NextScript.getInlineScriptSource(this.props));
    const cspRules = [
      'default-src \'self\'',
      `script-src 'self' ${scriptCSPRule}`,
      'style-src \'self\' \'unsafe-inline\'',
      'img-src \'self\' data:',
      'font-src \'self\' data:',
      `connect-src 'self' https: http: ${isDev ? 'ws:' : ''}`,
    ].join(';');

    return (
      <html>
        <Head>
          <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1" />
          <meta key="csp" httpEquiv="Content-Security-Policy" content={cspRules} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
