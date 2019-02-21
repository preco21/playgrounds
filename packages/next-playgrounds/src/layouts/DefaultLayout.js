import '../styles/style.css';
import Head from 'next/head';
import React from 'react';
import PropTypes from 'prop-types';
import iconImage from '../images/icon.png';

export default function DefaultLayout({children, title}) {
  return (
    <>
      <Head>
        <title>{title}</title>

        <meta name="theme-color" content="#daedae" />

        <link rel="icon" sizes="192x192" href={iconImage} />
        <link rel="apple-touch-icon" href={iconImage} />
      </Head>
      {children}
    </>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
};

DefaultLayout.defaultProps = {
  title: '',
};
