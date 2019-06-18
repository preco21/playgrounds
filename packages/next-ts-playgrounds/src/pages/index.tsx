import React from 'react'
import styled from 'styled-components'
import DefaultLayout from '../layouts/DefaultLayout'

const Centered = styled.div`
  display: flex;
  justify-content: center;
`

export default function IndexPage() {
  return (
    <DefaultLayout>
      <Centered>
        <h1>Hello!</h1>
      </Centered>
    </DefaultLayout>
  )
}
