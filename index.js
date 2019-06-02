import React, { Component } from 'react';
import { render } from 'react-dom';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initData from './data';
import Column from './column'

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = initData;

  onDragStart = start => {
    const homeIndex = this.state.columnOrder.indexOf(start.source.droppableId);

    this.setState({
      homeIndex,
    });
  };

  onDragEnd = result => {

    this.setState({
      homeIndex: null,
    });

    const { destination, source, draggableId } = result;

    if(!destination){
      return;
    }

    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if(start === finish){
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        }
      };

      this.setState(newState);
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      }
    };

    this.setState(newState);
    
  };

  render() {
    return (
      <DragDropContext 
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Container>
          {
            this.state.columnOrder.map((columnID, index) => {
              const column = this.state.columns[columnID];
              const tasks = column.taskIds.map(taskID => this.state.tasks[taskID]);

              console.log(`this.state.homeIndex: ${this.state.homeIndex} index: ${index} columnID: ${columnID}`)

              const isDropDisabled = (this.state.homeIndex - index) > 1 || (this.state.homeIndex - index) < -1;

              return (
                <Column 
                  key={column.id} 
                  column={column} 
                  tasks={tasks} 
                  isDropDisabled={isDropDisabled}
                />
              );
            })
          }
        </Container>
      </DragDropContext>
    )
  }
}

render(<App />, document.getElementById('root'));
