const { chai, server, should } = require("./testConfig");
const UserModel = require("../models/UserModel");

/**
 * Test cases to test all the authentication APIs
 * Covered Routes:
 * (1) Login
 * (2) Register
 */

describe("Auth", () => {
  // Prepare data for testing
  const testData = {
    firstName: "Monalitest",
    lastName: "Doshi",
    email: "monalitest@gmail.com",
    password: "Monali123",
    threshold: 300,
    location: "Beijing",
  };

  /*
   * Test the /POST route
   */
  describe("/POST Register", () => {
    it("It should send validation error for Register", (done) => {
      chai
        .request(server)
        .post("/auth/register")
        .send({ email: testData.email })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST Register", () => {
    it("It should Register user", (done) => {
      chai
        .request(server)
        .post("/auth/register")
        .send(testData)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Registration Success.");
          testData._id = res.body.data._id;
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST Login", () => {
    it("it should Send failed user Login", (done) => {
      chai
        .request(server)
        .post("/auth/login")
        .send({ email: "testing@gmail.com", password: "Test123" })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST Login", () => {
    it("it should do user Login", (done) => {
      chai
        .request(server)
        .post("/auth/login")
        .send({ email: testData.email, password: testData.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("message").eql("Login Success.");
          done();
        });
    });
  });
});
