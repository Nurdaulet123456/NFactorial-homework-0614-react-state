import { useState, useEffect } from "react";
import { v4 as myNewID } from "uuid";

import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];


// const getLocalItems = () => {
//   let item = localStorage.getItem('items')
//   console.log(item);

//   if (item) {
//     return JSON.parse(localStorage.getItem('items') || [])
//   } else {
//     return []
//   }
// }

const getItems = () => {
  let item = localStorage.getItem('items')

  if (item) {
    return JSON.parse(localStorage.getItem('items'))
  } else {
    return []
  }
}

function App() {

  const [itemToDo, setItemToDo] = useState("");
  const [items, setItems] = useState(getItems());
  const [search, setSearch] = useState('');

  // useEffect(() => {
  //   let data = localStorage.setItem('items', JSON.stringify(items))
  //   if (data !== null) setItems(data)
  // }, [])

  // useEffect(() => {
  //   const data = window.localStorage.getItem('items')
    
  //   if (data !== null) setItems(JSON.parse(data))
  // }, [])

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])

  const [filterType, setFilterType] = useState("all");

  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  };

  const handleAddItem = () => {
    const newItem = { key: myNewID(), label: itemToDo };

    setItems((prevElement) => [newItem, ...prevElement]);

    setItemToDo("");

    window.localStorage.setItem('items', JSON.stringify(newItem))
    window.localStorage.getItem('items')
  };

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };



  const hangleDeleteFunction = ({key}) => {
    setItems((prev) => prev.filter((item)=> item.key !== key))
  }

  const hangleChangeItem = ({key}) => {
    setItems((p) => p.map((item) => {
      if (item.key === key) return {...item, change: !item.change}
      else return item
    }))
  }

  const handleFilterChange = ({ type }) => {
    if (filterType === "all") {
        return items
    } 

    else if (filterType === "done") {
      return items.filter((item) => item.done)
    }
  };

  const moreToDo = items.filter((item) => !item.done).length;

  const doneToDo = items.length - moreToDo;

  const filteredArray =
    filterType === "all"
      ? items
      : filterType === "done"
      ? items.filter((item) => item.done)
      : items.filter((item) => !item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {moreToDo} more to do, {doneToDo} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={e => setSearch(e.target.value)}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              key={item.type}
              type="button"
              className={`btn btn-info ${
                filterType === item.type ? "" : "btn-outline-info"
              }`}
              onClick={() => handleFilterChange(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredArray.length > 0 &&
          items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase())).map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item ${item.done ? "done" : ""}`}>
                <span
                  className={`todo-list-item-label ${item.change ? "text-warning": ""}`}
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={() => hangleChangeItem(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => hangleDeleteFunction(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      <div className="item-add-form d-flex">
        <input
          value={itemToDo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleToDoChange}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
