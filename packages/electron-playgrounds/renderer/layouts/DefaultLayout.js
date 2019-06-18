import '../styles/style.css'
import Head from 'next/head'
import React from 'react'
import PropTypes from 'prop-types'

export default function DefaultLayout({ children, title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  )
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
}

DefaultLayout.defaultProps = {
  title: '',
}
