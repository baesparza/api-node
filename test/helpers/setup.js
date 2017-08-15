"use strict"

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

GLOBAL.AssertionError = chai.AssertionError;
GLOBAL.exprect = chai.exprect;