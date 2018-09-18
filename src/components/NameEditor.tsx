import React from "react"
import { Button, Flexbox, VFlexbox } from "../UX"
import styled from "../UX/Styled"

const Title = styled.h3`
  margin: 0;
  margin-bottom: 0.4em;
  padding: 0;
`

export interface NameEditorProps {
  defaultName?: string
  onClickOk?(name: string): void
  onClickCancel?(): void
  onClickDelete?(): void
}

class Editor extends React.PureComponent<NameEditorProps> {
  private inputRef = React.createRef<HTMLInputElement>()
  public render() {
    const { defaultName, onClickCancel, onClickOk, onClickDelete } = this.props
    return (
      <VFlexbox>
        <Title>Edit name</Title>
        <input
          autoFocus={true}
          defaultValue={defaultName}
          ref={this.inputRef}
        />
        <Flexbox>
          <Button onClick={onClickDelete} negative={true}>
            Delete
          </Button>
          <Button onClick={onClickCancel}>Cancel</Button>
          <Button
            onClick={() =>
              this.inputRef &&
              onClickOk &&
              onClickOk(this.inputRef.current!.value)
            }
            positive={true}
          >
            Change name
          </Button>
        </Flexbox>
      </VFlexbox>
    )
  }
}

export default Editor

const ModalStyle = styled(Flexbox)`
  margin: 1em;
`

export const ModalEditor = (props: NameEditorProps) => (
  <ModalStyle>
    <Editor {...props} />
  </ModalStyle>
)