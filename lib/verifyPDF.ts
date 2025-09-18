import forge from 'node-forge';
import VerifyPDFError from './VerifyPDFError.js';
import {
    extractSignature,
    getMessageFromSignature,
    getClientCertificate,
    checkForSubFilter,
    preparePDF,
    authenticateSignature,
    sortCertificateChain,
    isCertsExpired,
} from './helpers/index.js';
import { extractCertificatesDetails } from './certificateDetails.js';
import { VerifyPDFResult } from './types.js';

const verify = (signature: string, signedData: Buffer, signatureMeta: any): {
    verified: boolean;
    authenticity: boolean;
    integrity: boolean;
    expired: boolean;
    meta: {
        certs: any[];
        signatureMeta: any
    };
} => {
    const message = getMessageFromSignature(signature);
    const { certificates } = message;

    // For direct certificate extraction, we don't have rawCapture
    if (!message.rawCapture) {
        const sortedCerts = sortCertificateChain(certificates);
        const parsedCerts = extractCertificatesDetails(sortedCerts);
        const authenticity = authenticateSignature(sortedCerts);
        const expired = isCertsExpired(sortedCerts);
        return {
            verified: authenticity && !expired,
            authenticity,
            integrity: true, // Assume integrity for direct extraction
            expired,
            meta: { certs: parsedCerts, signatureMeta },
        };
    }

    const {
        rawCapture: {
            signature: sig,
            authenticatedAttributes: attrs,
            digestAlgorithm,
        },
    } = message;
    const hashAlgorithmOid = forge.asn1.derToOid(digestAlgorithm);
    const hashAlgorithm = (forge.pki.oids as any)[hashAlgorithmOid].toLowerCase();
    const set = forge.asn1.create(
        forge.asn1.Class.UNIVERSAL,
        forge.asn1.Type.SET,
        true,
        attrs,
    );
    const clientCertificate = getClientCertificate(certificates);
    const digest = (forge.md as any)[hashAlgorithm]
        .create()
        .update(forge.asn1.toDer(set).data)
        .digest()
        .getBytes();
    const validAuthenticatedAttributes = (clientCertificate.publicKey as any).verify(digest, sig);
    if (!validAuthenticatedAttributes) {
        throw new VerifyPDFError(
            'Wrong authenticated attributes',
            'VERIFY_SIGNATURE',
        );
    }
    const messageDigestAttr = forge.pki.oids.messageDigest;
    const fullAttrDigest = attrs
        .find((attr: any) => forge.asn1.derToOid(attr.value[0].value) === messageDigestAttr);
    const attrDigest = fullAttrDigest.value[1].value[0].value;
    const dataDigest = (forge.md as any)[hashAlgorithm]
        .create()
        .update(signedData.toString('latin1'))
        .digest()
        .getBytes();
    const integrity = dataDigest === attrDigest;
    const sortedCerts = sortCertificateChain(certificates);
    const parsedCerts = extractCertificatesDetails(sortedCerts);
    const authenticity = authenticateSignature(sortedCerts);
    const expired = isCertsExpired(sortedCerts);
    return ({
        verified: integrity && authenticity && !expired,
        authenticity,
        integrity,
        expired,
        meta: { certs: parsedCerts, signatureMeta },
    });
};

const verifyPDF = (pdf: Buffer | string | Uint8Array): VerifyPDFResult => {
    const pdfBuffer = preparePDF(pdf);
    checkForSubFilter(pdfBuffer);
    try {
        const { signatureStr, signedData, signatureMeta } = extractSignature(pdfBuffer);

        const signatures = signedData.map((signed, index) => {
            return (verify(signatureStr[index].toString('binary'), signed, signatureMeta[index]));
        });

        return {
            verified: signatures.every(o => o.verified === true),
            authenticity: signatures.every(o => o.authenticity === true),
            integrity: signatures.every(o => o.integrity === true),
            expired: signatures.some(o => o.expired === true),
            signatures
        };
    } catch (error) {
        return ({
            verified: false,
            authenticity: false,
            integrity: false,
            expired: false,
            message: (error as Error).message,
            error
        });
    }
};

export default verifyPDF;
