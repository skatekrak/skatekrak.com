declare module 'express-validation' {
    export default function(validation: object);

    class ValidationError extends Error {
        errors: Error[];
    }
}
