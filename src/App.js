import React, { useState, useEffect } from "react";
import Note from "./components/Note";
import noteService from "./services/notes";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    noteService.getAll().then((note) => setNotes(note));
  }, []);

  const addNote = (e) => {
    e.preventDefault();
    const note = {
      content: newNote,
      important: Math.random() < 0.5,
      date: new Date().toISOString(),
    };
    noteService.create(note).then((note) => {
      setNotes(notes.concat(note));
      setNewNote("");
    });
  };

  const handleNewNote = (e) => {
    const value = e.target.value;
    setNewNote(value);
  };

  const toggleImportance = (e) => {
    const id = e.target.value;
    const noteToChange = notes.find((note) => note.id.toString() === id);
    const changedNote = { ...noteToChange, important: !noteToChange.important };

    noteService
      .update(id, changedNote)
      .then((updatedNote) => {
        setNotes(
          notes.map((note) => (note.id.toString() === id ? updatedNote : note))
        );
      })
      .catch((error) => {
        alert(`note "${noteToChange.content}" was deleted from server`);
        setNotes(notes.filter((n) => n.id.toString() !== id));
      });
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? "Show Important" : "Show All"}
      </button>
      <ul>
        {notesToShow.map((note) => {
          return (
            <Note
              key={note.id}
              note={note}
              toggleImportance={toggleImportance}
            />
          );
        })}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNewNote} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
