import axios from 'axios'
const baseUrl = '/api/notes'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  return axios.get(baseUrl).then((response) => {
    const notes = response.data
    const sampleNote = {
      content: 'this will cause error',
      id: 500,
      date: new Date().toISOString(),
      important: true,
    }

    return notes.concat(sampleNote)
  })
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data)
}

// eslint-disable-next-line
export default { getAll, create, update, setToken }
