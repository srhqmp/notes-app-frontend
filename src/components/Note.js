import React from "react";

const Notes = ({ note, toggleImportance }) => {
  return (
    <li>
      {note.content} <button onClick={toggleImportance} value={note.id} >{note.important ? "make not important" : "make important"}</button>
    </li>
  );
};

export default Notes;
