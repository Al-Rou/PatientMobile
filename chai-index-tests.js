
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = chai.expect;
let should = chai.should();
chai.use(chaiHttp);

server = 'http://127.0.0.1:5000'

general_patientId ='61a128da71232b9fb3b61ff7'

/* Post Patient (Positive) */
describe("when we issue a 'Post' to /patients with  complete patient Object ", function(){
    it('it should POST a patient ', function(done)  {
        let patient = {
            firstName: "Shirin", 
            lastName: "Sancho", 
            dateOfBirth: "2021/01/01",
            doctor: "Ali",
            department: "test",
            servicePlan: "test",
            address: "test",
            phone: "6476756745"
        }
      chai.request(server)
          .post('/patients')
          .send(patient)
          .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('firstName');
                res.body.should.have.property('lastName');
                res.body.should.have.property('dateOfBirth');
                res.body.should.have.property('doctor');
                res.body.should.have.property('department');
                res.body.should.have.property('servicePlan');
                res.body.should.have.property('address');
                res.body.should.have.property('phone');
            done();
        });
    });
});
/* Post Patient (Negative) */
describe("when we issue a 'Post' to /patients with  patient with empty firstname  ", function(){
    it('it should POST a patient ', function(done)  {
        let patient = {
            lastName: "Sancho", 
            dateOfBirth: "2021/01/01",
            doctor: "Ali",
            department: "test",
            servicePlan: "test",
            address: "test",
            phone: "6476756745"
        }
      chai.request(server)
          .post('/patients')
          .send(patient)
          .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('firstName must be supplied');  
            done();
        });
    });
});
 



 /* Get Patient (Positive) */
 describe("when we issue a 'Get' to /patients which should return an array of patients", function(){
    it('it should Get All the Patiens', function(done)  {
      chai.request(server)
          .get('/patients')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].should.have.property('firstName');
            res.body[0].should.have.property('lastName');
            res.body[0].should.have.property('dateOfBirth');
            res.body[0].should.have.property('doctor');
            res.body[0].should.have.property('department');
            res.body[0].should.have.property('servicePlan');
            res.body[0].should.have.property('address');
            res.body[0].should.have.property('phone');
            res.body[0].should.have.property('_id');
            done();
        });
    });
});
/* Get Patient (Negative) */
describe("when we issue a 'Get' to /patients which should return an array of patients which should not be empty", function(){
    it('it should Get All the Patiens', function(done)  {
      chai.request(server)
          .get('/patients')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.not.be.eql(0);
            done();
        });
    });
});


 /* Get Patient by Id (Positive) */
 describe("when we issue a 'Get' to /patients/Id which should return a patient with the Requested Id", function(){
    it('it should Get a Patiens by Id', function(done)  {

      chai.request(server)
          .get('/patients/'+ general_patientId)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            res.body[0].should.have.property('_id').eql(general_patientId);
            done();
        });
    });
});
 /* Get Patient by Id (Negative) */
 describe("when we issue a 'Get' to /patients/Id which the lentgh of array should not be zero or more than 1", function(){
    it('it should Get a Patiens by Id', function(done)  {
      chai.request(server)
          .get('/patients/'+ general_patientId)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.not.be.eql(0);
            res.body.length.should.not.be.above(1)
            done();
        });
    });
}); 

/* Post Test (Positive) */
describe("when we issue a 'Post' to Patient/Id/Test with the complete Test Object ", function(){
    it('it should POST a Test ', function(done)  {
        let Test = {
            patientId: general_patientId, 
            dateTime:"2021/01/01", 
            nurseName: "Jeniffer",
            type: "test",
            category: "Blood Pressure",
            diastolic : "test",
            systolic : "8",
             singleValue:  "10"
        }
      chai.request(server)
          .post('/patients/'+Test.patientId+'/tests')
          .send(Test)
          .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('patientId');
                res.body.should.have.property('dateTime');
                res.body.should.have.property('nurseName');
                res.body.should.have.property('type');
                res.body.should.have.property('category');
                res.body.should.have.property('_id');
                res.body.should.have.property('patientId').eql(Test.patientId);
            
            done();
        });
    });
}); 
/* Post Test (Negative) */
describe("when we issue a 'Post' to Patient/Id/Test with the Incorrect Test Object ", function(){
    it('it should POST a Test ', function(done)  {
        let Test = {
            patientId: general_patientId, 
            dateTime:"2021/01/01", 
            nurseName: "Jeniffer",
            type: "test",
            diastolic : "test",
            systolic : "8",
            singleValue:  "10"
        }
      chai.request(server)
          .post('/patients/'+Test.patientId+'/tests')
          .send(Test)
          .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('category must be supplied');  
            done();
        });
    });
});
 
  /* Get Test by PatientId  (Positive) */
  describe("when we issue a 'Get' to /patients_tests/patient_id which should return a Test with the Requested patientId", function(){
    it('it should Get a Test by PatiensId', function(done)  {
      chai.request(server)
          .get('/patients/'+general_patientId+'/tests')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body[0].should.have.property('patientId').eql(general_patientId);
            done();
        });
    });
});

 /* Get Test by PatientId (Negative) */
 describe("when we issue a 'Get' to /patients/Id by wrong PatienId and the  length of the the reult should be zero ", function(){
    it('it should Get a Test by PatiensId', function(done)  {
        let patient_id='618b3e3a2c63eb6ab49b1235'
      chai.request(server)
      .get('/patients/'+patient_id+'/tests')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0)
            done();
        });
    });
}); 