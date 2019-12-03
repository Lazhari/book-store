process.env.NODE_ENV = 'test';

const Author = require('../src/models/author');

// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');

chai.should();

chai.use(chaiHttp);

// Out parent block

describe('Authors', () => {
  beforeEach(done => {
    Author.deleteMany({}, err => {
      if (err) {
        console.warn(err);
      }
      done();
    });
  });

  /**
   * Test the GET /api/authors
   */
  describe('GET /api/authors', () => {
    it('it should GET all the authors', done => {
      chai
        .request(server)
        .get('/api/authors')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /**
   * Test the POST /api/authors
   */
  describe('POST /api/authors', () => {
    it('it should not POST an author without name field', done => {
      const author = {
        birth_year: 1978,
        bio: 'JavaScript Lover',
        country: 'US'
      };
      chai
        .request(server)
        .post('/api/authors')
        .send(author)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('errors');
          res.body.errors.should.have.property('name');
          res.body.errors.name.should.have.property('kind').eql('required');
          done();
        });
    });

    it('it should POST author', done => {
      const author = {
        name: 'Author name',
        birth_year: 1978,
        bio: 'JavaScript Lover',
        country: 'US'
      };
      chai
        .request(server)
        .post('/api/authors')
        .send(author)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property(
            'message',
            'Author successfully added!'
          );
          res.body.should.have.property('author');
          res.body.author.should.be.a('object');
          res.body.author.should.have.property('name');
          res.body.author.should.have.property('birth_year');
          res.body.author.should.have.property('bio');
          res.body.author.should.have.property('country');
          done();
        });
    });
  });

  /**
   * Test The GET /api/authors/:id route
   */
  describe('GET /api/authors/:id', () => {
    it('It Should GET a author by given its id', done => {
      const author = new Author({
        name: 'Author name',
        birth_year: 1978,
        bio: 'JavaScript Lover',
        country: 'US'
      });
      author.save((err, author) => {
        chai
          .request(server)
          .get(`/api/authors/${author.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('name');
            res.body.should.have.property('birth_year');
            res.body.should.have.property('bio');
            res.body.should.have.property('country');
            res.body.should.have.property('_id', author.id);
            done();
          });
      });
    });

    it('It Should GET an error if the author ID is invalid', done => {
      chai
        .request(server)
        .get('/api/authors/90')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('name');
          res.body.should.have.property('kind', 'ObjectId');
          res.body.should.have.property('value', '90');
          res.body.should.have.property('path', '_id');
          done();
        });
    });

    it("it should GET not found if the author ID don't exist", done => {
      chai
        .request(server)
        .get('/api/authors/589e02e559f531603fe40322')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Author not found!');
          res.body.should.have.property('id').eql('589e02e559f531603fe40322');
          done();
        });
    });
  });

  /**
   * Test the PUT /api/authors/:id Route
   */
  describe('PUT /api/authors/:id', () => {
    it('it should UPDATE an author given its id', done => {
      const author = new Author({
        name: 'Author name',
        birth_year: 1988,
        bio: 'JavaScript Lover',
        country: 'US'
      });
      author.save((err, author) => {
        chai
          .request(server)
          .put(`/api/authors/${author.id}`)
          .send({
            birth_year: 1972
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Author updated!');
            res.body.author.should.have.property('birth_year').eql(1972);
            done();
          });
      });
    });

    it('it should return an error if the author birth_year is invalid', done => {
      const author = new Author({
        name: 'Author name',
        birth_year: 1988,
        bio: 'JavaScript Lover',
        country: 'US'
      });
      author.save((err, author) => {
        chai
          .request(server)
          .put(`/api/authors/${author.id}`)
          .send({
            birth_year: '1952a'
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('errors');
            res.body.errors.should.have.property('birth_year');
            res.body.errors.birth_year.should.have
              .property('kind')
              .eql('Number');
            done();
          });
      });
    });

    it('it should return an error if the author ID is not valid', done => {
      chai
        .request(server)
        .put('/api/authors/90')
        .send({
          birth_year: 2009
        })
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

    it("it should return not found if the author ID don't exist", done => {
      chai
        .request(server)
        .put('/api/authors/589e02e559f531603fe40322')
        .send({
          year: 2010
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Author not found!');
          res.body.should.have.property('id').eql('589e02e559f531603fe40322');
          done();
        });
    });
  });

  /**
   * Test the DELETE /api/authors/:id
   */
  describe('DELETE /api/authors/:id', () => {
    it('it should DELETE the author given its id', done => {
      const author = new Author({
        name: 'Author name',
        birth_year: 1988,
        bio: 'JavaScript Lover',
        country: 'US'
      });
      author.save((err, author) => {
        chai
          .request(server)
          .delete(`/api/authors/${author.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have
              .property('message')
              .eql('Author successfully deleted!');
            res.body.result.should.have.property('ok').eql(1);
            res.body.result.should.have.property('n').eql(1);
            done();
          });
      });
    });
    it('it should return an error if the author ID is not valid', done => {
      chai
        .request(server)
        .delete('/api/authors/90')
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

    it("it should return not found if the author ID don't exist", done => {
      chai
        .request(server)
        .delete('/api/authors/589e02e559f531603fe40322')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Author not found!');
          res.body.should.have.property('id').eql('589e02e559f531603fe40322');
          done();
        });
    });
  });
});
