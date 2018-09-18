import { RematchDispatch, RematchRootState } from "@rematch/core"
import GithubFaceIcon from "mdi-react/GithubFaceIcon"
import React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { models } from "../store"
import { Button, Flexbox, Icon } from "../UX"

const Container = styled(Flexbox)`
  margin-top: 20vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  ::after {
    content: "";
    border-bottom: solid 2px;
    margin-bottom: 0.6em;
    display: block;
  }
`

type Props = ReturnType<typeof mapDispatch>

const View = ({ signIn }: Props) => {
  return (
    <Container>
      <Title>chlorogenic</Title>
      <Button onClick={signIn} size="big">
        <Icon>
          <GithubFaceIcon />
        </Icon>
        Sign in with GitHub
      </Button>
    </Container>
  )
}

const mapState = ({  }: RematchRootState<models>) => ({})
const mapDispatch = ({ auth: { signIn } }: RematchDispatch<models>) => ({
  signIn,
})

export default connect(
  mapState,
  mapDispatch,
)(View)