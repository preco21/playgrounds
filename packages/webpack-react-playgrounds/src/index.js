import './styles/style.css'
import React from 'react'
import { hydrate, render } from 'react-dom'
import { renderToString } from 'react-dom/server'
import { BrowserRouter as Router, StaticRouter } from 'react-router-dom'
import { Routes } from './pages/_routes'

function Root() {
  return (
    <Router>
      <Routes />
    </Router>
  )
}

// eslint-disable-next-line
function RootServer({ path }) {
  return (
    <StaticRouter location={path}>
      <Routes />
    </StaticRouter>
  )
}

if (typeof window !== 'undefined') {
  const rootEl = document.getElementById('__root__')
  if (rootEl && rootEl.hasChildNodes()) {
    hydrate(<Root />, rootEl)
  } else {
    render(<Root />, rootEl)
  }
}

export default (params) => renderToString(<RootServer {...params} />)
