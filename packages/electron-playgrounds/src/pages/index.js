import '../styles/style.css';
import React from 'react';

export default () => (
  <div>
    <button
      type="button"
      onClick={async () => {
        const pong = await ipc.send('ping');
        console.log(pong);
      }}
    >
      Hello Ping
    </button>
  </div>
);
