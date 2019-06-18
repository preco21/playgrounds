import React from 'react'
import styled from 'styled-components'
import DefaultLayout from '../layouts/DefaultLayout'

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function IndexPage() {
  return (
    <DefaultLayout>
      <Centered>
        <h1>Hello!</h1>
        <button
          type="button"
          onClick={async () => {
            const pong = await ipc.ping()
            console.log(pong)
          }}
        >
          Ping
        </button>
      </Centered>
    </DefaultLayout>
  )
}
