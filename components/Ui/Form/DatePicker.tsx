import React from 'react';
import DatePicker from 'react-datepicker';
import { Field } from 'react-final-form';

const DatePickerForm = (props: any) => (
    <Field name={props.name}>
        {({ input, meta }) => {
            let date = input.value || undefined;
            if (typeof input.value === 'string' && input.value !== '') {
                date = new Date(input.value);
            }
            return (
                <div className="form-element">
                    {props.label && (
                        <div className="form-element-label">
                            <label htmlFor={props.name}>{props.label}</label>
                        </div>
                    )}
                    <div className="form-element-field">
                        <DatePicker
                            selected={date}
                            onChange={input.onChange}
                            dateFormat="d MMMM yyyy"
                            showMonthDropdown={true}
                            showYearDropdown={true}
                            dropdownMode="select"
                            className="form-control"
                        />
                    </div>
                </div>
            );
        }}
    </Field>
);

export default DatePickerForm;
