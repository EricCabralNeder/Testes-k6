import http from 'k6/http';
import { sleep, check } from 'k6';
import uuid from './libs/uuid.js';

import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '2s', target: 100 }, // below normal load
    { duration: '5s', target: 100 },
    { duration: '2s', target: 200 }, // normal load
    { duration: '5s', target: 200 },
    { duration: '2s', target: 300 }, // around the breaking point
    { duration: '5s', target: 300 },
    { duration: '2s', target: 400 }, // beyond the breaking point
    { duration: '5s', target: 400 },
    { duration: '10s', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95 das requisições devem responder em até 2s
    http_req_failed: ['rate<0.01']  // 1% das requisicoes podem ocorrer erro
  }
}


export default function () {
  const url = 'http://localhost:3333/signup'
  
  const payload = JSON.stringify(
    {email: `${uuid.v4().substring(24)}@qagympass.com`, password: '123321'}
    )
  const headers = {
    'headers': {
      'Content-Type': 'application/json'
    }
  }  
  const  resp = http.post(url, payload, headers)
  //console.log(resp.body)
  check(resp, {
        'status should be 201': (resp) => resp.status === 201
    })

  sleep(1);
}

export function handleSummary(data) {
  return {
    "apicontagem-loadtests.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true })
  };
}
