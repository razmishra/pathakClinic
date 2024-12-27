import { STATUS_CODE } from "../constants/responseConstants.js";
import ApiResponse from "../responseModels/ApiResponse.js";

const sendSuccess = (response, result, request) => {
  var result = new ApiResponse(STATUS_CODE.SUCCESS, result, request);
  let statusCode = result.statusCode || 200;
  _sendResponse(response, result, statusCode);
};

const sendError = (response, result, request) => {
  var result = new ApiResponse(STATUS_CODE.ERROR, result, request);
  let statusCode = result.statusCode || 400;
  _sendResponse(response, result, statusCode);
};

const _sendResponse = (response, result, statusCode) => {
  result.status = statusCode || 200;
  return response.status(statusCode == 1 ? 200 : statusCode).send(result);
};

export default {
  sendSuccess,
  sendError,
};
