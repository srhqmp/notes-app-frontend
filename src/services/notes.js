import axios from "axios";
const baseUrl = "http://localhost:5000/notes";

const getAll = () => {
  return axios.get(baseUrl).then((response) => {
    const notes = response.data;
    const sampleNote = {
      content: "this will cause error",
      id: 500,
      date: new Date().toISOString(),
      important: true,
    };

    return notes.concat(sampleNote);
  });
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then((response) => response.data);
};

const update = (id, newObject) => {
  return axios
    .put(`${baseUrl}/${id}`, newObject)
    .then((response) => response.data);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, create, update };
