import { RematchDispatch, RematchRootState } from "@rematch/core"
import React from "react"
import { connect } from "react-redux"

import { ColumnContainer } from "../components"
import { DragAllCardHandle, ProjectColumn } from "../components"
import { Button, Flexbox } from "../components/parts"
import { createProjectSlug, isSameProject } from "../misc/github"
import {
  GitHubProjectCard,
  GitHubProjectColumnIdentifier,
} from "../models/github.types"
import { CreateProjectContentCardOpt, MoveProjectCardOpt } from "../models/ops"
import { models } from "../store"

export interface ProjectColumnProps {
  identifier: GitHubProjectColumnIdentifier
  panelIndex: number
}
type Props = ReturnType<typeof mergeProps>

class View extends React.PureComponent<Props> {
  private onDropCards = (
    column: GitHubProjectColumnIdentifier,
    cards: GitHubProjectCard[],
  ) => {
    const { identifier, moveProjectCard, createProjectContentCard } = this.props
    if (isSameProject(column.project, identifier.project)) {
      const opts = cards.map(c => ({
        columnId: identifier.id,
        cardId: c.id,
      }))
      // move
      moveProjectCard(opts)
    } else {
      // copy
      const opts = cards.map(c => ({
        columnId: identifier.id,
        contentId: c.issue ? c.issue.id : "",
      }))
      createProjectContentCard(opts)
    }
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.ops.running && !this.props.ops.running) {
      const error = this.props.ops.error
      if (error) {
        this.props.setError(error)
      } else {
        this.props.setSuccess({ message: "Success φ(•ᴗ•๑)" })
        window.setTimeout(() => this.props.clearNotification(), 2000)
      }
      this.props.fetchColumn()
    }
  }

  public componentDidMount() {
    this.props.fetchColumn()
  }

  public render() {
    const {
      columnState,
      identifier,
      moveToLeftColumn,
      moveToRightColumn,
      removeColumn,
      ops: { running },
    } = this.props

    const { loading, column, error } = columnState

    const header: string = (() => {
      if (loading) {
        return "Loading"
      }
      if (error) {
        return error.message
      }
      if (column) {
        return column.name
      }
      return ""
    })()
    return (
      <ColumnContainer
        header={header}
        description={`${createProjectSlug(identifier.project)}\n${
          identifier.project.number
        }`}
        onClickClose={removeColumn}
      >
        {column && (
          <DragAllCardHandle identifier={identifier} cards={column.cards}>
            <ProjectColumn
              loading={running}
              onDropCards={this.onDropCards}
              column={column}
              identifier={identifier}
            />
          </DragAllCardHandle>
        )}
        <Flexbox>
          <Button onClick={moveToLeftColumn} transparent={true}>
            {"<"}
          </Button>
          <Button onClick={moveToRightColumn} transparent={true}>
            {">"}
          </Button>
        </Flexbox>
      </ColumnContainer>
    )
  }
}

const mapState = (
  { auth: { token }, ops, columnLoader }: RematchRootState<models>,
  { panelIndex, identifier }: ProjectColumnProps,
) => ({
  panelIndex,
  identifier,
  columnState: columnLoader[identifier.id] || {},
  token: token || "",
  ops,
})
const mapDispatch = ({
  columns: { removeColumn, moveColumn },
  notification: { clear, setError, setSuccess },
  ops: { createProjectContentCard, moveProjectCard },
  columnLoader: { fetchColumn },
}: RematchDispatch<models>) => ({
  fetchColumn,
  removeColumn,
  moveColumn,
  createProjectContentCard,
  moveProjectCard,
  clearNotification: clear,
  setError,
  setSuccess,
})

const mergeProps = (
  { identifier, token, panelIndex, ...rest }: ReturnType<typeof mapState>,
  {
    fetchColumn,
    removeColumn,
    moveColumn,
    createProjectContentCard,
    moveProjectCard,
    ...fns
  }: ReturnType<typeof mapDispatch>,
) => {
  return {
    ...rest,
    ...fns,
    identifier,
    panelIndex,
    fetchColumn: () => fetchColumn({ identifier, token }),
    moveProjectCard: (opts: MoveProjectCardOpt[]) =>
      moveProjectCard({ token, opts }),
    createProjectContentCard: (opts: CreateProjectContentCardOpt[]) =>
      createProjectContentCard({ token, opts }),
    moveToLeftColumn: () =>
      moveColumn({ index: panelIndex, column: identifier, add: -1 }),
    moveToRightColumn: () =>
      moveColumn({ index: panelIndex, column: identifier, add: 1 }),
    removeColumn: () => removeColumn({ index: panelIndex, column: identifier }),
  }
}

export default connect(
  mapState,
  mapDispatch,
  mergeProps,
)(View)
