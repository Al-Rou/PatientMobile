var PORT = (process.env.PORT || 5000)
var HOST = '127.0.0.1'
var SERVER_NAME = 'patient-mobile-application'
var HEROKU_URL = 'https://patient-mobile-application.herokuapp.com/'

var http = require ('http');
var mongoose = require ("mongoose");

// set database to connect to MongoDB localhost, database : "data"
//var uristring = 'mongodb://127.0.0.1:27017/data';

var uristring = 'mongodb+srv://mongoAtlas:mongoAtlas2021@cluster0.o1yqn.mongodb.net/data?retryWrites=true&w=majority'
// make an asynchronous connection.
mongoose.connect(uristring, {useNewUrlParser: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // connection successfull
  console.log("!!!! Connected to db: " + uristring)
});

// This is the schema for the Patients
var patientSchema = new mongoose.Schema({
		firstName: String,
		lastName: String,
		dateOfBirth: String,
		doctor: String,
    department: String,
    servicePlan: String,
    address: String,
    phone: String
});

// This is the schema for the Tests
// readings is an array that an contain diastolic/systolic  values or a single value
var testSchema = new mongoose.Schema({
    patientId: String,
    dateTime: String,
    nurseName: String,
    type: String,
    category: String,
    readings: {
      singleValue: String
    }
});

// Compile the schemas into models, 'Patients' and 'Tests' collection
// in the MongoDB database
var Patient = mongoose.model('Patient', patientSchema);
var Test = mongoose.model('Test', testSchema);

var errors = require('restify-errors');
const { setFlagsFromString } = require('v8');
var restify = require('restify')
  // Create the restify SERVER
  , server = restify.createServer({ name: SERVER_NAME})

	// if (typeof ipaddress === "undefined") {
	// 	//  Log errors on OpenShift but continue w/ 127.0.0.1 - this
	// 	//  allows us to run/test the app locally.
	// 	console.warn('No process.env.IP var, using default: ' + HOST);
	// 	ipaddress = HOST;
	// };

	// if (typeof port === "undefined") {
	// 	console.warn('No process.env.PORT var, using default port: ' + PORT);
	// 	port = PORT;
	// };


  if(PORT === 5000){
      console.log('-------------------->LOCALHOST<-------------------')
      server.listen(PORT, HOST, function () {
      console.log('==================================================')
      console.log('Server %s listening at %s', server.name, server.url)
      console.log('==================================================')
      console.log('Resources:')
      console.log('--------------------------------------------------')
      console.log('%s/patients method: POST - {"firstName": "John", "lastName":"Doe", "dateOfBirth":"01/01/2001", "doctor":"Max Powers", "department":"emergency", "servicePlan":"NN", "address":"123 Some Street", "phone":"123456789"}', server.url)
      console.log('%s/patients method: GET', server.url)
      console.log('%s/patients/:id method: GET', server.url)
      console.log('%s/patients/:servicePlan/:firstName/:lastName method: GET', server.url)
      console.log('--------------------------------------------------')
      console.log('%s/patients/:id/tests method: POST - {"dateTime": "2016-05-18T16:00:00Z", "nurseName":"Laura Palmer", "type":"weekly", "category":"Blood Pressure", "singleValue":"120/60mmHg"}', server.url)
      console.log('%s/patients/:id/tests method: GET', server.url)
      console.log('--------------------------------------------------')
    })
  }else{
    server.listen(PORT, function () {
      console.log('-------------------->HEROKU<----------------------')
      console.log('==================================================')
      console.log('Server listening at %s' , HEROKU_URL)
      console.log('==================================================')
      console.log('Resources:')
      console.log('--------------------------------------------------')
      console.log('%spatients method: POST - {"firstName": "John", "lastName":"Doe", "dateOfBirth":"01/01/2001", "doctor":"Max Powers", "department":"emergency", "servicePlan":"NN", "address":"123 Some Street", "phone":"123456789"}', HEROKU_URL)
      console.log('%spatients method: GET', HEROKU_URL)
      console.log('%spatients/:id method: GET', HEROKU_URL)
      console.log('%spatients/:servicePlan/:firstName/:lastName method: GET', HEROKU_URL)
      console.log('--------------------------------------------------')
      console.log('%spatients/:id/tests method: POST - {"dateTime": "2016-05-18T16:00:00Z", "nurseName":"Laura Palmer", "type":"weekly", "category":"Blood Pressure", "singleValue":"120/60mmHg"}', HEROKU_URL)
      console.log('%spatients/:id/tests method: GET', HEROKU_URL)
      console.log('--------------------------------------------------')
    })
  }


server
// Allow the use of POST
.use(restify.plugins.fullResponse())

// Maps req.body to req.params
.use(restify.plugins.bodyParser())


// Get all patients in the system
server.get('/patients', function (req, res, next) {
  console.log('--------------------------------------------------')
  console.log('GET request: patients');
  console.log('--------------------------------------------------')
  // Find every entity within the given collection
  Patient.find({}).exec(function (error, result) {
    if (error) return next(new Error(JSON.stringify(error.errors)))
    res.send(200,result);
  });
})


  // Get a single patient by their patient id
  server.get('/patients/:id', function (req, res, next) {
    console.log('--------------------------------------------------')
    console.log('GET request: patients/' + req.params.id);
    console.log('--------------------------------------------------')

    // Find a single patient by their id
    Patient.find({ _id: req.params.id }).exec(function (error, patient) {
      if (patient) {
        // Send the patient if no issues
        res.send(patient)
      } else {
        // Send 404 header if the patient doesn't exist
        res.send(404)
      }
    })
  })
  

  // Get a single patient by their Health ID
  server.get('/patients/:servicePlan/:firstName/:lastName', function (req, res, next) {

    console.log('--------------------------------------------------')
    console.log('GET request: patients/' + req.params.servicePlan + '/' + req.params.firstName + '/' + req.params.lastName);
    console.log('--------------------------------------------------')

    // Find a single patient by their Health ID
    console.log(req.params)
    if ((req.params.lastName === '')&&(req.params.firstName !== '')&&(req.params.servicePlan !== '')){
      var servicePlanNoCapital = req.params.servicePlan.toLowerCase()
      var firstNameNoCapital = req.params.firstName.toLowerCase()
    Patient.find({ servicePlan: { $in: [ req.params.servicePlan,servicePlanNoCapital ] } , firstName: { $in: [ req.params.firstName,firstNameNoCapital ] } }).exec(function (error, patient) {
      if (patient) {
        // Send the patient if no issues
        res.send(patient)
      } else {
        // Send 404 header if the patient doesn't exist
        res.send(404)
      }
    })
    } else if ((req.params.firstName === '')&&(req.params.lastName !== '')&&(req.params.servicePlan !== '')){
      var servicePlanNoCapital = req.params.servicePlan.toLowerCase()
      var lastNameNoCapital = req.params.lastName.toLowerCase()
      Patient.find({ servicePlan: { $in: [ req.params.servicePlan,servicePlanNoCapital ] } , lastName: { $in: [ req.params.lastName,lastNameNoCapital ] } }).exec(function (error, patient) {
        if (patient) {
          // Send the patient if no issues
          res.send(patient)
        } else {
          // Send 404 header if the patient doesn't exist
          res.send(404)
        }
      })
    } else if ((req.params.servicePlan === '')&&(req.params.firstName !== '')&&(req.params.lastName !== '')){
      var lastNameNoCapital = req.params.lastName.toLowerCase()
      var firstNameNoCapital = req.params.firstName.toLowerCase()
      Patient.find({ firstName: { $in: [ req.params.firstName,firstNameNoCapital ] } , lastName: { $in: [ req.params.lastName,lastNameNoCapital ] } }).exec(function (error, patient) {
        if (patient) {
          // Send the patient if no issues
          res.send(patient)
        } else {
          // Send 404 header if the patient doesn't exist
          res.send(404)
        }
      })
    } else if ((req.params.servicePlan === '')&&(req.params.firstName === '')&&(req.params.lastName !== '')) {
      var lastNameNoCapital = req.params.lastName.toLowerCase()
      Patient.find({ lastName: { $in: [ req.params.lastName,lastNameNoCapital ] } }).exec(function (error, patient) {
        if (patient) {
          // Send the patient if no issues
          res.send(patient)
        } else {
          // Send 404 header if the patient doesn't exist
          res.send(404)
        }
      })
    } else if ((req.params.servicePlan === '')&&(req.params.firstName !== '')&&(req.params.lastName === '')) {
      var firstNameNoCapital = req.params.firstName.toLowerCase()
      Patient.find({ firstName: { $in: [ req.params.firstName,firstNameNoCapital ] } }).exec(function (error, patient) {
        if (patient) {
          // Send the patient if no issues
          res.send(patient)
        } else {
          // Send 404 header if the patient doesn't exist
          res.send(404)
        }
      })
    } else if ((req.params.servicePlan !== '')&&(req.params.firstName === '')&&(req.params.lastName === '')) {
      var servicePlanNoCapital = req.params.servicePlan.toLowerCase()
      Patient.find({ servicePlan: { $in: [ req.params.servicePlan,servicePlanNoCapital ] } }).exec(function (error, patient) {
        if (patient) {
          // Send the patient if no issues
          res.send(patient)
        } else {
          // Send 404 header if the patient doesn't exist
          res.send(404)
        }
      })
    } else {
      var servicePlanNoCapital = req.params.servicePlan.toLowerCase()
      var firstNameNoCapital = req.params.firstName.toLowerCase()
      var lastNameNoCapital = req.params.lastName.toLowerCase()
      Patient.find({ servicePlan: { $in: [ req.params.servicePlan,servicePlanNoCapital ] } , firstName: { $in: [ req.params.firstName,firstNameNoCapital ] } , lastName: { $in: [ req.params.lastName,lastNameNoCapital ] } }).exec(function (error, patient) {
        if (patient) {
          // Send the patient if no issues
          res.send(patient)
        } else {
          // Send 404 header if the patient doesn't exist
          res.send(404)
        }
      })
    }
  })

  // Create a new patient
  server.post('/patients', function (req, res, next) {
    console.log('--------------------------------------------------')
    console.log('POST request: patients params=>' + JSON.stringify(req.params));
    console.log('POST request: patients body=>' + JSON.stringify(req.body));
    console.log('--------------------------------------------------')
    // Make sure name is defined
    if (req.body.firstName === undefined) {
      // If there are any errors, pass them to next in the correct format
      return next(new errors.BadRequestError('firstName must be supplied'))
    }
    if (req.body.lastName === undefined) {
      // If there are any errors, pass them to next in the correct format
      return next(new errors.BadRequestError('lastName must be supplied'))
    }

    // Creating new patient.
    var newPatient = new Patient({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dateOfBirth: req.body.dateOfBirth,
      doctor: req.body.doctor,
      department: req.body.department,
      servicePlan: req.body.servicePlan,
      address: req.body.address,
      phone: req.body.phone
    });

    // Create the patient and saving to db
    newPatient.save(function (error, result) {
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new Error(JSON.stringify(error.errors)))
      // Send the patient if no issues
      res.send(201, result)
      })
    })

  // Get a patient tests in the system
  server.get('/patients/:id/tests', function (req, res, next) {
    console.log('--------------------------------------------------')
    console.log('GET request: patients/' + req.params.id + '/tests');
    console.log('--------------------------------------------------')

    // Find patients test by their id
    Test.find({patientId: req.params.id }).exec(function (error, result) {
      if (error) return next (new Error(JSON.stringify(error.errors)))
        // Send the patient tests if no issues
        res.send(result);
    })
  })

  // Create a new test
  server.post('/patients/:id/tests', function (req, res, next) {
    console.log('--------------------------------------------------')
    console.log('POST request: tests params=>' + JSON.stringify(req.params));
    console.log('POST request: tests body=>' + JSON.stringify(req.body));
    console.log('--------------------------------------------------')

    // Validate category is defined
    if (req.body.category === undefined) {
      // If there are any errors, pass them to next in the correct format
      return next(new errors.BadRequestError('category must be supplied'))
    }

    //validate correct category supplied
    //"Blood Pressure" "Respiratory Rate" "Blood Oxygen Level" "Heart Beat Rate"
    const validCategories = ["Blood Pressure", "Respiratory Rate", "Blood Oxygen Level", "Heart Beat Rate"];
    if(!validCategories.includes(req.body.category)){
      return next(new errors.BadRequestError('categories are "Blood Pressure" "Respiratory Rate" "Blood Oxygen Level" "Heart Beat Rate"'))
    }


    //  check for singleValue
      if(req.body.singleValue === undefined){
            // If there are any errors, pass them to next in the correct format
            return next(new errors.BadRequestError('singleValue must be supplied'))
    }

    // Creating new test.
    var newTest = new Test({
      patientId: req.params.id,
      dateTime: req.body.dateTime,
      nurseName: req.body.nurseName,
      type: req.body.type,
      category: req.body.category,
      readings: {
                  singleValue: req.body.singleValue
                }
    });

    // Create the test and saving to db
    newTest.save(function (error, result) {
      // If there are any errors, pass them to next in the correct format
      if (error) return next(new Error(JSON.stringify(error.errors)))
      // Send the patient if no issues
      res.send(201, result)
    })
  })
