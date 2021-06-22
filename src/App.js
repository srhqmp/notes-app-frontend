import React, { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import loginService from './services/login'
import Notification from './components/Notification'
import Footer from './components/Footer'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, setNotes] = useState([])
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

  const handleLogout = () => {
    try {
      window.localStorage.clear()
      const message = 'You are logged out'
      setErrorMessage(message)
      setTimeout(() => setErrorMessage(null), 5000)
      setUser(null)
    } catch (e) {
      setErrorMessage(e.response.data.error)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event) => {
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

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm
          handleSubmit={handleSubmit}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
          username={username}
          password={password}
        />
      </Togglable>
    )
  }

  const noteFormRef = useRef()

  const createNote = (note) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(note)
      .then((note) => {
        setNotes(notes.concat(note))
      })
      .catch((err) => {
        setErrorMessage(err.response.data.error)
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const noteForm = () => (
    <Togglable buttonLabel="add note" ref={noteFormRef}>
      <NoteForm createNote={createNote} />
    </Togglable>
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
      .catch(() => {
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
          <p>
            {user.name} logged-in <button onClick={handleLogout}>logout</button>
          </p>
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
