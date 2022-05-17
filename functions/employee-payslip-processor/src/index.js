/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 */
const { taxableIncome } = require("../../../packages/common/taxableIncomeHelper");
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true});
const STATUS_REJECTED = "rejected";
const schema = {
  type: "object",
  properties: {
    firstName: {type: "string"},
    lastName: {type: "string"},
    annualSalary: {type: "integer"},
    superRate: {type: "string", pattern: '^(?:([1-9]|1[012])\d?%|0%)$'},
    payPeriod: {type: "string", pattern: '(0[1-9]|10|11|12)20[0-9]{2}$'}
  },
  required: ["firstName", "lastName", "annualSalary", "superRate", "payPeriod"],
  additionalProperties: true
};

const validateEvent = async (item) => {
  let validate = ajv.compile(schema);
  const valid = validate(item);
  if (!valid) {
    console.log(JSON.stringify(validate.errors));
    throw new Error(JSON.stringify(validate.errors));
  }
  return valid;
};

module.exports.handler = async (event, context) => {
    let body;
    const empPayslipResp = [];
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };
 
    try {
        switch (event.httpMethod) {
            case 'POST':
                body = JSON.parse(event.body);
                //console.log(JSON.parse(event.body));
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }

        const promiseList = body.map(async (item) => {
          const resp = await validateEvent(item);
          console.log({ resp }); 
          if (resp && Boolean(resp) === true) {
            const incomeResp = await taxableIncome(item);
            console.log( {incomeResp});
            empPayslipResp.push(incomeResp);
          }       
        });
        await Promise.allSettled(promiseList).then(async (settledResults) => {
          for (let index = 0; index < settledResults.length; index += 1) {
            const result = settledResults[index];
            const { status } = result;
         //   console.log({result});
            if (status === STATUS_REJECTED) {
             // console.log("rejected ###################");
              throw new Error(result.reason);
            }
          }
        });
        body = empPayslipResp;
    } catch (err) {
       // console.log({err});
        statusCode = '400';
        body = err.message;
    } 

   // await Promise.all(promiseAll);
   // console.log({ statusCode });
    body = JSON.stringify(body);
    return {
      statusCode,
      body,
      headers,
  };
};
