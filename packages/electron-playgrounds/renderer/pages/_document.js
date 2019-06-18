import { createHash } from 'crypto'
import Document, { Head, Main, NextScript } from 'next/document'
import React from 'react'
import { ServerStyleSheet } from 'styled-components'

function createCSPHashOf(text) {
  const hash = createHash('sha256')
  hash.update(text)
  return `'sha256-${hash.digest('base64')}'`
}

export default class _Document extends Document {
  static getInitialProps({ renderPage }) {
    // Inject `styled-components` styles
    const sheet = new ServerStyleSheet()
    const page = renderPage((Page) => (props) =>
      sheet.collectStyles(<Page {...props} />),
    )
    const styledEls = sheet.getStyleElement()

    return {
      ...page,
      styledEls,
    }
  }

  render() {
    const shouldEnableHMR = process.env.NODE_ENV === 'development'
    const scriptCSPRule = shouldEnableHMR
      ? "'unsafe-eval' 'unsafe-inline'"
      : createCSPHashOf(NextScript.getInlineScriptSource(this.props))
    const cspRules = [
      "default-src 'self' next:",
      `script-src 'self' ${scriptCSPRule} next:`,
      "style-src 'self' 'unsafe-inline' next:",
      "img-src 'self' next: data:",
      "font-src 'self' next: data:",
    ]

    return (
      <html>
        <Head>
          <meta
            key="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1"
          />
          <meta
            key="csp"
            httpEquiv="Content-Security-Policy"
            content={cspRules.join('; ')}
          />

          {this.props.styledEls}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
