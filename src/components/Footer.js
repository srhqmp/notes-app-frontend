/* eslint-disable react/react-in-jsx-scope */
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2021
      </em>
      <br />
      @srhqmp
    </div>
  )
}

export default Footer
