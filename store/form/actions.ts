import { action } from 'typesafe-actions';

import { UPDATE_FORM_STATE } from '../constants';

export const updateFormState = (form, state) => action(UPDATE_FORM_STATE, { form, state });
