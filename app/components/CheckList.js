import React, { Component, PropTypes } from 'react';
import TaskActionCreators from '../actions/TaskActionCreators.js';

class CheckList extends Component {

  checkInputKeyPress(event) {
    if (event.key == 'Enter') {
      let newTask = { id: Date.now(), name: event.target.value, done: false };
      TaskActionCreators.addTask(this.props.cardId, newTask);
      event.target.value = '';
    }
  }

  render() {
    let tasks = this.props.tasks.map((task, taskIndex) => {
      return <li key={task.id} className="checklist__task">
        <input type="checkbox" defaultChecked={task.done} 
            onChange={TaskActionCreators.toggleTask.bind(null, this.props.cardId, task, taskIndex) } />
        {task.name}
        <a href="#" className="checklist__task--remove" 
          onClick={TaskActionCreators.deleteTask.bind(null, this.props.cardId, task, taskIndex) } />
      </li>
    })

    return <div className="checklist">
      <ul>{tasks}</ul>
      <input type="text" 
             className="checklist--add-task" 
             placeholder="Type then hit Enter to add a task" 
             onKeyPress={this.checkInputKeyPress.bind(this)} />
    </div>
  }
};

CheckList.propTypes = {
  cardId: PropTypes.number,
  tasks: PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object
}

export default CheckList;