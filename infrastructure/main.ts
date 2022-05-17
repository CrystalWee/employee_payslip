import { App } from "aws-cdk-lib";
import { MyStack } from "./stacks";

const app = new App();

new MyStack(app, "EmployeePayslipStack", {
  env: { region: "us-east-1", account: "00000000000" },
});
