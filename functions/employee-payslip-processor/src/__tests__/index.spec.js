/*
Tests for sales calculation global market
*/
const supertest = require("supertest");

process.env.EMPLOYEE_PAYSLIP_API_KEY = "v0Jik3Ab2M1Ju7WQKXxcNaHF9VUtO1c13ds1Nh4A";

const url = "https://q93cjtw0ae.execute-api.us-east-1.amazonaws.com";
const TIMEOUT = 5000;

describe("Test Employee Payslip API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test("provide event and sent to API without API key; return 403", (done) => {
    supertest(url)
      .post("/default/EmpPayslipPostFunction")
      .send({})
      .expect(403)
      .end((err) => {
        if (err) {
         // console.error("err", err);
          done(err)
        }
        done();
      });
  });

  test("POST method with invalid request body, return 400", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "Andrew",
            "annualSalary": 60050, 
            "superRate": "9%", 
            "payPeriod": "032022",
            "payEndDate": "3032022"
          },
          {
            "firstName": "Claire", 
            "lastName": "Wong", 
            "annualSalary": 120000, 
            "superRate": "10%", 
            "payPeriod": "032022",
            "payEndDate": "3032022"
          }
        ]
      };
      const expectedErr =  `"Error: [{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/required\\",\\"keyword\\":\\"required\\",\\"params\\":{\\"missingProperty\\":\\"lastName\\"},\\"message\\":\\"must have required property 'lastName'\\"}]"`;
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);
      expect(resp.statusCode).toMatch("400");
      expect(resp.body).toMatch(expectedErr);
    } catch (err) {
      expect(err).toMatch("400");
    }
  });
  
  test("POST method with invalid superRate - not within 0% to 12%, return 400", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "Andrew",
            "annualSalary": 60050, 
            "superRate": "13%", 
            "payPeriod": "032022",
            "payEndDate": "3032022"
          },
          {
            "firstName": "Claire", 
            "lastName": "Wong", 
            "annualSalary": 120000, 
            "superRate": "0.0%", 
            "payPeriod": "032022",
            "payEndDate": "3032022"
          }
        ]
      };
      const expectedErr =  `"Error: [{\\"instancePath\\":\\"\\",\\"schemaPath\\":\\"#/required\\",\\"keyword\\":\\"required\\",\\"params\\":{\\"missingProperty\\":\\"lastName\\"},\\"message\\":\\"must have required property 'lastName'\\"},{\\"instancePath\\":\\"/superRate\\",\\"schemaPath\\":\\"#/properties/superRate/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^(?:([1-9]|1[012])d?%|0%)$\\"},\\"message\\":\\"must match pattern \\\\\\"^(?:([1-9]|1[012])d?%|0%)$\\\\\\"\\"}]"`;
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);
      expect(resp.statusCode).toMatch("400");
      expect(resp.body).toMatch(expectedErr);
    } catch (err) {
      expect(err).toMatch("400");
    }
  });

  test("POST method with invalid payPeriod - 132022, return 400", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "Andrew",
            "lastName": "Smith",
            "annualSalary": 60050, 
            "superRate": "13%", 
            "payPeriod": "132022",
            "payEndDate": "3032022"
          }
        ]
      };
      const expectedErr =  '"Error: [{\\"instancePath\\":\\"/superRate\\",\\"schemaPath\\":\\"#/properties/superRate/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"^(?:([1-9]|1[012])d?%|0%)$\\"},\\"message\\":\\"must match pattern \\\\\\"^(?:([1-9]|1[012])d?%|0%)$\\\\\\"\\"},{\\"instancePath\\":\\"/payPeriod\\",\\"schemaPath\\":\\"#/properties/payPeriod/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"(0[1-9]|10|11|12)20[0-9]{2}$\\"},\\"message\\":\\"must match pattern \\\\\\"(0[1-9]|10|11|12)20[0-9]{2}$\\\\\\"\\"}]"';
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);
      expect(resp.statusCode).toMatch("400");
      expect(resp.body).toMatch(expectedErr);
    } catch (err) {;
      expect(err).toMatch("400");
    }
  });

  test("POST method with invalid payPeriod - 011999, return 400", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "Claire", 
            "lastName": "Wong", 
            "annualSalary": 120000, 
            "superRate": "0%", 
            "payPeriod": "011999"
          }
        ]
      };
      const expectedErr =  '"Error: [{\\"instancePath\\":\\"/payPeriod\\",\\"schemaPath\\":\\"#/properties/payPeriod/pattern\\",\\"keyword\\":\\"pattern\\",\\"params\\":{\\"pattern\\":\\"(0[1-9]|10|11|12)20[0-9]{2}$\\"},\\"message\\":\\"must match pattern \\\\\\"(0[1-9]|10|11|12)20[0-9]{2}$\\\\\\"\\"}]"';
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);
      expect(resp.statusCode).toMatch("400");
      expect(resp.body).toMatch(expectedErr);
    } catch (err) {
      expect(err).toMatch("400");
    }
  });

  test("POST method with valid request body, return 200", async () => {
     try {
       const { handler } = require("../index");
       const event = {
         "httpMethod": "POST",
         "body": [
           {
             "firstName": "Andrew", 
             "lastName": "Smith", 
             "annualSalary": 60050, 
             "superRate": "9%", 
             "payPeriod": "032022",
             "payEndDate": "3032022"
           },
           {
             "firstName": "Claire", 
             "lastName": "Wong", 
             "annualSalary": 120000, 
             "superRate": "10%", 
             "payPeriod": "032022",
             "payEndDate": "3032022"
           }
         ]
       };
       const context = {};
       event.body = JSON.stringify(event.body);
       const resp = await handler(event, context);
       expect(resp.statusCode).toMatch("200");
     } catch (err) {
       expect(err).toMatch("400");
     }
   });

  test("POST method with valid request body that have not required attributes, return 200", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "Andrew", 
            "lastName": "Smith", 
            "annualSalary": 60050, 
            "superRate": "9%", 
            "payPeriod": "032022",
            "payEndDate": "3032022",
            "age": 50
          },
          {
            "firstName": "Claire", 
            "lastName": "Wong", 
            "annualSalary": 120000, 
            "superRate": "10%", 
            "payPeriod": "032022",
            "payEndDate": "3032022"
          }
        ]
      };
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);
      expect(resp.statusCode).toMatch("200");

    } catch (err) {
      expect(err).toMatch("400");
    }  
  });

  test("POST method with valid request body - income bracket between 0 to 18200, return 200", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "David", 
            "lastName": "Steve", 
            "annualSalary": 17800, 
            "superRate": "7%", 
            "payPeriod": "032022"
          }
        ]
      };
      const expectedBody =  '[{"name":"David Steve","payPeriod":"1/3/2022 - 30/3/2022","grossIncome":1483,"incomeTax":0,"netIncome":1483,"superAmount":104}]';
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);
      expect(resp.statusCode).toMatch("200");
      expect(resp.body).toMatch(expectedBody);
    } catch (err) {
      expect(err).toMatch("400");
    }  
  });

  test("POST method with valid request body - income bracket between 18001 to 37000, return 200", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "Bala", 
            "lastName": "Ramasamy", 
            "annualSalary": 35500, 
            "superRate": "8%", 
            "payPeriod": "032022"
          }
        ]
      };
      const expectedBody =  '[{"name":"Bala Ramasamy","payPeriod":"1/3/2022 - 30/3/2022","grossIncome":2958,"incomeTax":274,"netIncome":2684,"superAmount":237}]';
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);
      expect(resp.statusCode).toMatch("200");
      expect(resp.body).toMatch(expectedBody);
    } catch (err) {
      expect(err).toMatch("400");
    }  
  });

  test("POST method with valid request body - income bracket between 37001 to 87000, return 200", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "Andrew", 
            "lastName": "Smith", 
            "annualSalary": 60050, 
            "superRate": "9%", 
            "payPeriod": "032022"
          }
        ]
      };
      const expectedBody =  '[{"name":"Andrew Smith","payPeriod":"1/3/2022 - 30/3/2022","grossIncome":5004,"incomeTax":922,"netIncome":4082,"superAmount":450}]';
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);
      expect(resp.statusCode).toMatch("200");
      expect(resp.body).toMatch(expectedBody);
    } catch (err) {
      expect(err).toMatch("400");
    }  
  });

  test("POST method with valid request body - income bracket between 87001 to 180000, return 200", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "Claire", 
            "lastName": "Wong", 
            "annualSalary": 120000, 
            "superRate": "10%", 
            "payPeriod": "032022"
          }
        ]
      };
      const expectedBody =  '[{"name":"Claire Wong","payPeriod":"1/3/2022 - 30/3/2022","grossIncome":10000,"incomeTax":2669,"netIncome":7331,"superAmount":1000}]';
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);
      expect(resp.statusCode).toMatch("200");
      expect(resp.body).toMatch(expectedBody);
    } catch (err) {
      expect(err).toMatch("400");
    }  
  });

  test("POST method with valid request body - income bracket between 180001 and over, return 200", async () => {
    try {
      const { handler } = require("../index");
      const event = {
        "httpMethod": "POST",
        "body": [
          {
            "firstName": "Jack", 
            "lastName": "Marshal", 
            "annualSalary": 210000, 
            "superRate": "10%", 
            "payPeriod": "012022"
          }
        ]
      };
      const expectedBody =  '[{"name":"Jack Marshal","payPeriod":"1/1/2022 - 28/1/2022","grossIncome":17500,"incomeTax":5644,"netIncome":11856,"superAmount":1750}]';
      const context = {};
      event.body = JSON.stringify(event.body);
      const resp = await handler(event, context);;
      expect(resp.statusCode).toMatch("200");
      expect(resp.body).toMatch(expectedBody);
    } catch (err) {
      expect(err).toMatch("400");
    }  
  });
});

