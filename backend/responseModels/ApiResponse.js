import { MESSAGES, STATUS_CODE } from "../constants/responseConstants.js";

class ApiResponse {
  constructor(statusCode, result, request) {
    this.statusCode = statusCode;
    if (statusCode === STATUS_CODE.SUCCESS) {
      result ? (this.responseData = result) : MESSAGES.EMPTY;
    } else {
      result ? (this.error = result) : MESSAGES.ERROR;
    }
  }
}

export default ApiResponse