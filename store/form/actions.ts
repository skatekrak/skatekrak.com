import { action } from 'typesafe-actions';

import { RESET_FORM, UPDATE_FORM_STATE } from '../constants';

export const updateFormState = (form, state) => action(UPDATE_FORM_STATE, { form, state });
export const resetForm = () => action(RESET_FORM);
