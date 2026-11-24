import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/latest/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 7 },
    { duration: '1m', target: 50 },
    { duration: '1m30s', target: 92 }
  ],
  thresholds: {
    http_req_duration: ['p(90)<6800'],
    http_req_failed: ['rate<0.25']
  }
};

export function handleSummary(data) {
  return {
    './src/output/index.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true })
  };
}

export default function () {
  const baseUrl = 'https://fixer.io/';

  const res = http.get(baseUrl);

  check(res, {
    'GET Home - Status 200': (r) => r.status === 200
  });
}