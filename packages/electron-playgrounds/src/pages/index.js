import '../styles/style.css';
import React from 'react';

export default () => (
  <div>
    <button
      type="button"
      onClick={async () => {
        const pong = await ipc.ping();
        console.log(pong);
      }}
    >
      Hello Ping
    </button>
  </div>
);
