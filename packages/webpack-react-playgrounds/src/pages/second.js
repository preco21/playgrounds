import React from 'react';
import {hot} from 'react-hot-loader';
import {Link} from 'react-router-dom';

function SecondPage() {
  return (
    <div>
      <h2>Second Page</h2>
      <div>
        <img src="images/icon.png" />
      </div>
      <Link to="/">Go to /</Link>
    </div>
  );
}

export default hot(module)(SecondPage);
