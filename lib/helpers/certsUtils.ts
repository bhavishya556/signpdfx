import * as forge from 'node-forge';

const issued = (cert: forge.pki.Certificate) => (anotherCert: forge.pki.Certificate): boolean =>
    cert !== anotherCert && anotherCert.issued(cert);

const getIssuer = (certsArray: forge.pki.Certificate[]) => (cert: forge.pki.Certificate): forge.pki.Certificate | undefined =>
    certsArray.find(issued(cert));

const inverse = <T>(f: (x: T) => boolean) => (x: T): boolean => !f(x);

const hasNoIssuer = (certsArray: forge.pki.Certificate[]) => (cert: forge.pki.Certificate) => !getIssuer(certsArray)(cert);

const getChainRootCertificateIdx = (certsArray: forge.pki.Certificate[]): number =>
    certsArray.findIndex(hasNoIssuer(certsArray));

const isIssuedBy = (cert: forge.pki.Certificate) => (anotherCert: forge.pki.Certificate): boolean =>
    cert !== anotherCert && cert.issued(anotherCert);

const getChildIdx = (certsArray: forge.pki.Certificate[]) => (parent: forge.pki.Certificate): number =>
    certsArray.findIndex(isIssuedBy(parent));

export const sortCertificateChain = (certs: forge.pki.Certificate[]): forge.pki.Certificate[] => {
    const certsArray = Array.from(certs);
    const rootCertIndex = getChainRootCertificateIdx(certsArray);
    const certificateChain = certsArray.splice(rootCertIndex, 1);
    while (certsArray.length) {
        const lastCert = certificateChain[0];
        let childCertIdx = getChildIdx(certsArray)(lastCert);
        if (childCertIdx === -1) childCertIdx = 0;
        const [childCert] = certsArray.splice(childCertIdx, 1);
        certificateChain.unshift(childCert);
    }
    return certificateChain;
};

export const getClientCertificate = (certs: forge.pki.Certificate[]): forge.pki.Certificate =>
    sortCertificateChain(certs)[0];
