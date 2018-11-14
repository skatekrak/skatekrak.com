import React from 'react';

type Props = {
    message?: string;
};

const ErrorMessage = ({ message }: Props) => <span className="form-element-error">{message}</span>;

export default ErrorMessage;
