export const TYPE_UNKNOWN = 'TYPE_UNKNOWN';
export const TYPE_INPUT = 'TYPE_INPUT';
export const TYPE_PARSE = 'TYPE_PARSE';
export const TYPE_BYTE_RANGE = 'TYPE_BYTE_RANGE';
export const VERIFY_SIGNATURE = 'VERIFY_SIGNATURE';
export const UNSUPPORTED_SUBFILTER = 'UNSUPPORTED_SUBFILTER';

export class VerifyPDFError extends Error {
    public type: string;

    constructor(msg: string, type: string = TYPE_UNKNOWN) {
        super(msg);
        this.type = type;
    }
}

// Shorthand
Object.assign(VerifyPDFError, {
    TYPE_UNKNOWN,
    TYPE_INPUT,
    TYPE_PARSE,
    TYPE_BYTE_RANGE,
    VERIFY_SIGNATURE,
    UNSUPPORTED_SUBFILTER,
});

export default VerifyPDFError;
