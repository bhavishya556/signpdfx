'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const { getCertificates } = require('../dist/lib/index.js');

const FIXTURE_PDF = path.join(__dirname, '..', 'lib', 'test.pdf');

test('valid signed PDF: extracts issuer, subject and validity for every certificate', () => {
    const pdfBuffer = readFileSync(FIXTURE_PDF);
    const certificates = getCertificates(pdfBuffer);

    assert.ok(Array.isArray(certificates));
    assert.ok(certificates.length > 0, 'expected at least one certificate');
    assert.equal(certificates[0].clientCertificate, true);

    for (const cert of certificates) {
        assert.ok(cert.issuedTo.commonName, 'issuedTo should have a commonName');
        assert.ok(cert.issuedBy.commonName, 'issuedBy should have a commonName');
        assert.ok(cert.validityPeriod.notBefore instanceof Date);
        assert.ok(cert.validityPeriod.notAfter instanceof Date);
        assert.ok(
            cert.validityPeriod.notBefore.getTime() < cert.validityPeriod.notAfter.getTime(),
            'notBefore should precede notAfter',
        );
        assert.match(cert.certificateData, /^-----BEGIN CERTIFICATE-----/);
    }
});

test('valid signed PDF: signature chain surfaces more than one certificate', () => {
    const pdfBuffer = readFileSync(FIXTURE_PDF);
    const certificates = getCertificates(pdfBuffer);

    // The fixture's signature embeds a full chain (leaf + intermediate + root),
    // exercising the same code path multi-signer PDFs rely on: getCertificates
    // returning every certificate it can find rather than just one.
    assert.ok(certificates.length > 1, 'expected the certificate chain to contain more than one entry');
});

test('PDF with no signature dictionary throws a parse error', () => {
    const unsignedPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF');

    assert.throws(
        () => getCertificates(unsignedPdf),
        (err) => {
            assert.equal(err.message, 'Failed to locate ByteRange.');
            assert.equal(err.type, 'TYPE_PARSE');
            return true;
        },
    );
});

test('malformed/truncated signature blob throws rather than returning garbage', () => {
    const malformedPdf = Buffer.from(
        '%PDF-1.4\n/ByteRange [0 10 20 10]\n/Contents <deadbeefcafebabe>\n%%EOF',
    );

    assert.throws(() => getCertificates(malformedPdf));
});

test('rejects non-Buffer input', () => {
    assert.throws(() => getCertificates(undefined), /PDF buffer is required/);
    assert.throws(() => getCertificates('not a buffer'), /PDF buffer is required/);
    assert.throws(() => getCertificates(null), /PDF buffer is required/);
});
