import tls from 'tls';
import forge from 'node-forge';
import { readFileSync } from 'fs';
import { join } from 'path';

// Use __dirname for CommonJS
const rootCAs = JSON.parse(readFileSync(join(__dirname, 'rootCAs.json'), 'utf8'));

const getRootCAs = (): string[] => (tls.rootCertificates as string[]) || (rootCAs as string[]);

const verifyRootCertImpl = (chainRootInForgeFormat: forge.pki.Certificate): boolean => !!getRootCAs()
    .find((rootCAInPem) => {
        try {
            const rootCAInForgeCert = forge.pki.certificateFromPem(rootCAInPem);
            return forge.pki.certificateToPem(chainRootInForgeFormat) === rootCAInPem
                || rootCAInForgeCert.issued(chainRootInForgeFormat);
        } catch (e) {
            return false;
        }
    });

export const verifyCaBundle = (certs: forge.pki.Certificate[]): boolean => !!certs
    .find((cert, i) => certs[i + 1] && certs[i + 1].issued(cert));

export const isCertsExpired = (certs: forge.pki.Certificate[]): boolean => !!certs
    .find(({ validity: { notAfter, notBefore } }) => notAfter.getTime() < Date.now()
        || notBefore.getTime() > Date.now());

export const authenticateSignature = (certs: forge.pki.Certificate[]): boolean => verifyCaBundle(certs)
    && verifyRootCertImpl(certs[certs.length - 1]);

export const verifyRootCert = verifyRootCertImpl;
