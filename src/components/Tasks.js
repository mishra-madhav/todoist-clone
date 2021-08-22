import React, { useState } from "react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import dateFnsFormat from "date-fns/format";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import addDays from "date-fns/addDays";
import isToday from "date-fns/isToday";

const FORMAT = "dd/MM/yyyy";
function formatDate(date, format, locale) {
  return dateFnsFormat(date, format, { locale });
}

const AddTask = ({ onCancel, onAddTask }) => {
  const [text, setText] = useState("");
  const [date, setDate] = useState(null);
  return (
    <div className="add-task-dialog">
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <div className="add-task-actions-container">
        <div className="btns-container">
          <button
            className="add-btn"
            disabled={!text}
            onClick={() => {
              onAddTask(text, date);
              onCancel();
              setText("");
            }}
          >
            Add Task
          </button>
          <button
            className="cancel-btn"
            onClick={() => {
              onCancel();
              setText("");
            }}
          >
            Cancel
          </button>
        </div>
        <div className="icons-container">
          <DayPickerInput
            onDayChange={(day) => setDate(day)}
            placeholder={dateFnsFormat(new Date(), FORMAT)}
            formatDate={formatDate}
            format={FORMAT}
            dayPickerProps={{
              modifiers: {
                disabled: [{ before: new Date() }],
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

const TaskItems = ({ tasks, selectedTab }) => {
  let tasksToRender = [...tasks];
  if (selectedTab === "NEXT_7") {
    tasksToRender = tasksToRender.filter(
      (task) =>
        isAfter(task.date, new Date()) &&
        isBefore(task.date, addDays(new Date(), 7))
    );
  }

  if (selectedTab === "TODAY") {
    tasksToRender = tasksToRender.filter((task) => isToday(task.date));
  }

  return (
    <div className="task-items-container">
      {tasksToRender.map((task) => (
        <div className="task-item">
          <p>{task.text}</p>
          <p>{dateFnsFormat(task.date, FORMAT)}</p>
        </div>
      ))}
    </div>
  );
};

const TASKS_HEADER_MAPPING = {
  INBOX: "Inbox",
  TODAY: "Today",
  NEXT_7: "Next 7 days",
};

const Tasks = ({ selectedTab }) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  const addTaskHandler = (text, date) => {
    const newTask = { text, date: date || new Date() };
    setTasks((prevState) => [...prevState, newTask]);
  };

  return (
    <div className="tasks">
      <h2>{TASKS_HEADER_MAPPING[selectedTab]}</h2>
      {selectedTab === "INBOX" && (
        <div
          className="add-task-btn"
          onClick={() => setShowAddTask((prevState) => !prevState)}
        >
          <span className="plus">+</span>
          <span className="add-task-text">Add Task</span>
        </div>
      )}
      {showAddTask && (
        <AddTask
          onAddTask={addTaskHandler}
          onCancel={() => setShowAddTask(false)}
        />
      )}
      {tasks.length > 0 ? (
        <TaskItems tasks={tasks} selectedTab={selectedTab} />
      ) : (
        <p>
          No tasks yet. <span className="span">Add Task</span> to begin.
        </p>
      )}
    </div>
  );
};

export default Tasks;
