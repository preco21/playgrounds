import { createHash } from 'crypto'
import Document, {
  DocumentContext,
  Head,
  Main,
  NextScript,
} from 'next/document'
import React, { ComponentType } from 'react'
import { ServerStyleSheet } from 'styled-components'

function createCSPHashOf(text: string): string {
  const hash = createHash('sha256')
  hash.update(text)
  return `'sha256-${hash.digest('base64')}'`
}

export default class _Document extends Document {
  public static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const _renderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        _renderPage({
          enhanceApp(App: ComponentType<any>) {
            return (props: any) => sheet.collectStyles(<App {...props} />)
          },
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  public render() {
    const isDev = process.env.NODE_ENV === 'development'

    return (
      <html>
        <Head>
          <meta
            key="viewport"
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1"
          />
          {!isDev && (
            <meta
              key="csp"
              httpEquiv="Content-Security-Policy"
              content={`default-src 'self'; script-src 'self' ${createCSPHashOf(
                (NextScript as any).getInlineScriptSource(this.props),
              )}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https: http:`}
            />
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
