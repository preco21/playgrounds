import React from 'react';
import {hot} from 'react-hot-loader';
import {Link} from 'react-router-dom';

function IndexPage() {
  return (
    <div>
      <h2>Index Page</h2>
      <div>
        <img src="images/icon.png" />
      </div>
      <Link to="/second">Go to /second</Link>
    </div>
  );
}

export default hot(module)(IndexPage);
