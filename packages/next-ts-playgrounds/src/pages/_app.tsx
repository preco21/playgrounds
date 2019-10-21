import 'modern-normalize'
import '../styles/nprogress.css'
import NProgress from 'nprogress'
import App from 'next/app'
import Router from 'next/router'
import React from 'react'

if (typeof window !== 'undefined') {
  const browserUpdate = require('browser-update')
  browserUpdate({
    required: { e: -2, f: -2, o: -2, s: -2, c: -2 },
    insecure: true,
    unsupported: true,
    api: 2019.08,
  })
}

NProgress.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default class _App extends App {
  public render() {
    const { Component, pageProps } = this.props
    return <Component {...pageProps} />
  }
}
