import React, { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleNewNote = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: false,
      date: new Date().toISOString(),
    })

    setNewNote('')
  }

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input type="text" id="noteForm" value={newNote} onChange={handleNewNote} />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
