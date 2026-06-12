import http from "./http-common";

const API_URL = "/api/send-email";

const request3DFile = (data) => {
  return http.post(`${API_URL}/request3d`, data);
};

const sendEmailService = {
  request3DFile,
};

export default sendEmailService;
