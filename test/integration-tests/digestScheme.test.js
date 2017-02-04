'use strict';

const test = require('ava');
const {join} = require('path');
require('../../app');

const {
    responseCodes,
    requestURL,
    endPoints
} = require(join(__dirname, '../../constants'));

const request = require('supertest');

const digestSchemeUrl = endPoints['digestSchemeUrl'];

test.cb('digestScheme endpoint should return 401 and required headers when they are missing', assert => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  assert.plan(2);
  const unauthorized = responseCodes['unauthorized'];
  const req = request.agent(requestURL);
  req
    .get(digestSchemeUrl)
    .set({
      'Authorization': 'Digest username="rambo", realm="https://localhost:3000/api/v1/digestScheme"'
    })
    .expect(res => {
      assert.is(res.status, unauthorized, '401 Status Code should be returned');
      assert.is(
        res.headers['www-authenticate'],
        'Digest realm="https://localhost:3000/api/v1/digestScheme", qop="auth, auth-int", algorithm=MD5, nonce="undefined", opaque="undefined"'
      );
    })
    .end(() => {
      assert.end();
    });
});

test.cb('digestScheme endpoint should return 200 and authentication property', assert => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  assert.plan(2);
  const ok = responseCodes['ok'];
  const req = request.agent(requestURL);
  req
    .get(digestSchemeUrl)
    .set({
      'Authorization': 'Digest username="rambo", realm="https://localhost:3000/api/v1/digestScheme", nonce="Et2azM0urkTJmDb18rZnnwQb3", uri="/api/v1/digestScheme", response="98272be7c8fd10f0131954a3231b1341", opaque="cmFtYm86c29sZGllcjphcm15"'
    })
    .expect(res => {
      assert.is(res.status, ok, '200 Status Code should be returned');
      assert.truthy(res.body.authenticated);
    })
    .end(() => {
      assert.end();
    });
});
