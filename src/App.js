import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then((note) => setNotes(note))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const addNote = (e) => {
    e.preventDefault()
    const note = {
      content: newNote,
      important: Math.random() < 0.5,
      date: new Date().toISOString(),
    }
    noteService
      .create(note)
      .then((note) => {
        setNotes(notes.concat(note))
        setNewNote('')
      })
      .catch((err) => {
        setErrorMessage(err.response.data.error)
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username{' '}
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password{' '}
        <input
          type="text"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleNewNote = (e) => {
    const value = e.target.value
    setNewNote(value)
  }

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input type="text" value={newNote} onChange={handleNewNote} />
      <button type="submit">save</button>
    </form>
  )

  const toggleImportance = (e) => {
    const id = e.target.value
    const noteToChange = notes.find((note) => note.id.toString() === id)
    const changedNote = { ...noteToChange, important: !noteToChange.important }

    noteService
      .update(id, changedNote)
      .then((updatedNote) => {
        setNotes(
          notes.map((note) => (note.id.toString() === id ? updatedNote : note))
        )
      })
      .catch((error) => {
        const errMessage = `note "${noteToChange.content}" was deleted from server`
        setErrorMessage(errMessage)
        setTimeout(() => setErrorMessage(null), 5000)
        setNotes(notes.filter((n) => n.id.toString() !== id))
      })
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
        </div>
      )}

      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Show Important' : 'Show All'}
      </button>
      <ul>
        {notesToShow.map((note) => {
          return (
            <Note
              key={note.id}
              note={note}
              toggleImportance={toggleImportance}
            />
          )
        })}
      </ul>

      <Footer />
    </div>
  )
}

export default App
