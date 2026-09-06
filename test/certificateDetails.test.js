'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { extractCertificatesDetails } = require('../dist/lib/certificateDetails.js');
const { isCertsExpired } = require('../dist/lib/helpers/verification.js');
const { makeSelfSignedCert } = require('../test-utils/makeCert.js');

test('extractCertificatesDetails maps subject/issuer fields and marks the leaf certificate', () => {
    const { cert } = makeSelfSignedCert({ cn: 'Leaf Certificate' });

    const [details] = extractCertificatesDetails([cert]);

    assert.equal(details.clientCertificate, true);
    assert.equal(details.issuedTo.commonName, 'Leaf Certificate');
    assert.equal(details.issuedBy.commonName, 'Leaf Certificate'); // self-signed
    assert.ok(details.validityPeriod.notBefore instanceof Date);
    assert.ok(details.validityPeriod.notAfter instanceof Date);
});

test('only the first certificate in the chain is flagged as the client certificate', () => {
    const { cert: leaf } = makeSelfSignedCert({ cn: 'Leaf' });
    const { cert: root } = makeSelfSignedCert({ cn: 'Root' });

    const [leafDetails, rootDetails] = extractCertificatesDetails([leaf, root]);

    assert.equal(leafDetails.clientCertificate, true);
    assert.equal(rootDetails.clientCertificate, undefined);
});

test('validity window: a certificate that has already expired is detected', () => {
    const { cert } = makeSelfSignedCert({
        notBefore: new Date('2020-01-01T00:00:00Z'),
        notAfter: new Date('2020-06-01T00:00:00Z'),
    });

    assert.equal(isCertsExpired([cert]), true);
});

test('validity window: a certificate that is not yet valid is detected as expired', () => {
    const { cert } = makeSelfSignedCert({
        notBefore: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        notAfter: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000),
    });

    assert.equal(isCertsExpired([cert]), true);
});

test('validity window: a certificate within its validity period is not expired', () => {
    const { cert } = makeSelfSignedCert({
        notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
        notAfter: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    assert.equal(isCertsExpired([cert]), false);
});
