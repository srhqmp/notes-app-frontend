describe('Note app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Sarah Q.',
      username: 'sarah',
      password: 'sarah',
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  }) //it.only
  it('login fails with wrong password', function () {
    cy.contains('login').click()
    cy.get('#username').type('sarah')
    cy.get('#password').type('wrong pass')
    cy.get('#login-button').click()

    // cy.get('.error').contains('Wrong credentials')
    cy.get('.error')
      .should('contain', 'Wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'Sarah Q. logged in')
  })
  it('front page can be opened', function () {
    cy.contains('Notes')
    cy.contains(
      'Note app, Department of Computer Science, University of Helsinki 2021'
    )
  })

  it('login form can be opened', function () {
    cy.contains('login').click()
  })

  it('user can login', function () {
    cy.contains('login').click()
    cy.get('#username').type('sarah')
    cy.get('#password').type('sarah')
    cy.get('#login-button').click()

    cy.contains('Sarah Q. logged-in')
  })

  describe('when logged in', function () {
    beforeEach(function () {
      // cy.contains('login').click()
      // cy.get('#username').type('sarah')
      // cy.get('#password').type('sarah')
      // cy.get('#login-button').click()
      cy.login({ username: 'sarah', password: 'sarah' })
    })

    it('a new note can be created', function () {
      cy.contains('add note').click()
      cy.get('#noteForm').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })

    describe('add a note exists', function () {
      beforeEach(function () {
        // cy.contains('add note').click()
        // cy.get('#noteForm').type('another note cypress')
        // cy.contains('save').click()
        cy.createNote({
          content: 'another note cypress',
          important: false,
        })
        cy.createNote({
          content: 'second note',
          important: false,
        })
      })

      it('it can be made important', function () {
        cy.contains('another note cypress')
          .parent()
          .contains('make important')
          .click()
        cy.contains('another note cypress')
          .parent()
          .contains('make not important')
      })
      it('other of those can be made important', function () {
        cy.contains('second note').parent().find('button').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').should('contain', 'make not important')
      })
    })
  })
})
