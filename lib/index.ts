
import { getCertificatesInfoFromPDF } from './certificateDetails.js';
import { CertificateDetails } from './types.js';


/**
 * Extract certificates from PDF buffer
 * @param pdf - PDF buffer
 * @returns Array of certificate details
 */
export const getCertificates = (pdf: Buffer): CertificateDetails[] => {
    if (!pdf || !Buffer.isBuffer(pdf)) {
        throw new Error('PDF buffer is required');
    }
    return getCertificatesInfoFromPDF(pdf);
};

// Export as default
export default getCertificates;
