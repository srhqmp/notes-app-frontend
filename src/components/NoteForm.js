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
      important: Math.random() < 0.5,
      date: new Date().toISOString(),
    })

    setNewNote('')
  }

  return (
    <form onSubmit={addNote}>
      <h2>Create a new note</h2>
      <input type="text" value={newNote} onChange={handleNewNote} />
      <button type="submit">save</button>
    </form>
  )
}

export default NoteForm
