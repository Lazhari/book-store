const Book = require('../app/models/book');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();

chai.use(chaiHttp);

describe('Books', () => {
  beforeEach(done => {
    Book.deleteMany({}, err => {
      if (err) {
        console.warn(err);
      }
      done();
    });
  });

  /**
   * Test the /GET route
   */

  describe('/GET book', () => {
    it('it should GET all the books', done => {
      chai
        .request(server)
        .get('/api/books')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  /**
   * Test the /POST route
   */
  describe('/POST book', () => {
    it('it should not POST a book without pages field', done => {
      const book = {
        title: 'The Lord of the Rings',
        author: 'J.R.R Tolkien',
        year: 1954
      };
      chai
        .request(server)
        .post('/api/books')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('pages');
          res.body.errors.pages.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should POST a book', done => {
      const book = {
        title: 'The Lord of the Rings',
        author: 'J.R.R Tolkien',
        year: 1954,
        pages: 1170
      };
      chai
        .request(server)
        .post('/api/books')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have
            .property('message')
            .eql('Book successfully added!');
          res.body.book.should.have.property('title');
          res.body.book.should.have.property('author');
          res.body.book.should.have.property('pages');
          res.body.book.should.have.property('year');
          done();
        });
    });
  });
  /**
   * Test the GET/:id route
   */
  describe('/GET/:id book', () => {
    it('it should GET a book by the given id', done => {
      const book = new Book({
        title: 'The Lord of the Rings',
        author: 'J.R.R Tolkien',
        year: 1954,
        pages: 1170
      });
      book.save((err, book) => {
        chai
          .request(server)
          .get(`/api/books/${book.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('title');
            res.body.should.have.property('author');
            res.body.should.have.property('pages');
            res.body.should.have.property('year');
            res.body.should.have.property('_id').eql(book.id);
            done();
          });
      });
    });

    it('it should GET an error if the book ID is not valid', done => {
      chai
        .request(server)
        .get('/api/books/90')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('name');
          res.body.should.have.property('kind').eql('ObjectId');
          res.body.should.have.property('value').eql('90');
          res.body.should.have.property('path').eql('_id');
          done();
        });
    });

    it("it should GET not found if the book ID don't exist", done => {
      chai
        .request(server)
        .get('/api/books/589e02e559f531603fe40322')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Book not found!');
          res.body.should.have.property('id').eql('589e02e559f531603fe40322');
          done();
        });
    });
  });
  /**
   * Test the /PUT/:id route
   */
  describe('/PUT/:id book', () => {
    it('it should UPDATE a book given the id', done => {
      const book = new Book({
        title: 'The Chronicles of Narnia',
        author: 'C.S. Lewis',
        year: 1950,
        pages: 778
      });
      book.save((err, book) => {
        chai
          .request(server)
          .put(`/api/books/${book.id}`)
          .send({
            year: 1952
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Book updated!');
            res.body.book.should.have.property('year').eql(1952);
            done();
          });
      });
    });

    it('it should return an error if the book year is invalid', done => {
      const book = new Book({
        title: 'The Chronicles of Narnia',
        author: 'C.S. Lewis',
        year: 1950,
        pages: 778
      });
      book.save((err, book) => {
        chai
          .request(server)
          .put(`/api/books/${book.id}`)
          .send({
            year: '1952a'
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('year');
            res.body.errors.year.should.have.property('kind').eql('Number');
            done();
          });
      });
    });

    it('it should return an error if the book ID is not valid', done => {
      chai
        .request(server)
        .put('/api/books/90')
        .send({
          year: 2009
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('name');
          res.body.should.have.property('kind').eql('ObjectId');
          res.body.value.should.have.property('_id').eql('90');
          res.body.should.have.property('path').eql('_id');
          done();
        });
    });

    it("it should return not found if the book ID don't exist", done => {
      chai
        .request(server)
        .put('/api/books/589e02e559f531603fe40322')
        .send({
          year: 2010
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Book not found!');
          res.body.should.have.property('id').eql('589e02e559f531603fe40322');
          done();
        });
    });
  });

  /**
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id Book', () => {
    it('it should DELETE a book given the id', done => {
      const book = new Book({
        title: 'The Chronicles of Narnia',
        author: 'C.S. Lewis',
        year: 1950,
        pages: 778
      });
      book.save((err, book) => {
        chai
          .request(server)
          .delete(`/api/books/${book.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have
              .property('message')
              .eql('Book successfully deleted!');
            res.body.result.should.have.property('ok').eql(1);
            res.body.result.should.have.property('n').eql(1);
            done();
          });
      });
    });
    it('it should return an error if the book ID is not valid', done => {
      chai
        .request(server)
        .delete('/api/books/90')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('name');
          res.body.should.have.property('kind').eql('ObjectId');
          res.body.should.have.property('value').eql('90');
          res.body.should.have.property('path').eql('_id');
          done();
        });
    });

    it("it should return not found if the book ID don't exist", done => {
      chai
        .request(server)
        .delete('/api/books/589e02e559f531603fe40322')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Book not found!');
          res.body.should.have.property('id').eql('589e02e559f531603fe40322');
          done();
        });
    });
  });
});
