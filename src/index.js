const http = require("http");

const PORT = process.env.PORT || 3000;
const LOGS_URL = "/log";
const STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
};
const HTTP_VERBS = {
  POST: "POST",
  OPTIONS: "OPTIONS"
};
const ALLOWED_ORIGIN = "https://www.pedidosya.com*";

const isOptionRequest = req => req.method === HTTP_VERBS.OPTIONS;
const isLogRequest = req =>
  req.method === HTTP_VERBS.POST && req.url === LOGS_URL;
const log = console.log;
const logError = console.error;

function handleHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "*");
}

function finishRequest(res, errorCode) {
  res.writeHead(errorCode);
  res.end();
}

function handleLogRequest(req, res) {
  let body = "";
  req
    .on("data", data => {
      body += data;
    })
    .on("end", () => {
      log(body);
      finishRequest(res, STATUS_CODES.OK);
    })
    .on("error", error => {
      logError(error);
      finishRequest(res, STATUS_CODES.INTERNAL_ERROR);
    });
}

const server = http.createServer((req, res) => {
  try {
    handleHeaders(res);
    if (isOptionRequest(req)) finishRequest(res, STATUS_CODE_OK);
    else if (isLogRequest(req)) handleLogRequest(req, res);
    else finishRequest(res, STATUS_CODES.NOT_FOUND);
  } catch (error) {
    logError(error);
    finishRequest(res, STATUS_CODES.INTERNAL_ERROR);
  }
});

server.listen(PORT, () => {
  log(`Server running on ${PORT}`);
});
