import { getIn } from 'formik'
import MuiTextField from '@material-ui/core/TextField'
import React from 'react'

const fieldToDateTextField = ({
  backgroundColor,
  custom,
  disabled,
  field: { onBlur: fieldOnBlur, ...field },
  form: { errors, isSubmitting, touched },
  helperText,
  onBlur,
  variant,
  warning,
  ...props
}) => {
  const dirty = getIn(touched, field.name)
  const fieldError = getIn(errors, field.name)
  const showError = dirty && !!fieldError
  const inputProps = {
    type: 'date',
  }

  return {
    variant: variant,
    error: showError,
    helperText: showError ? fieldError : warning ?? helperText,
    disabled: disabled ?? isSubmitting,
    onBlur: (event) => onBlur ?? fieldOnBlur(event ?? field.name),
    ...custom,
    ...field,
    ...props,
    InputProps: inputProps
  }
}

export const DateTextField = ({ children, ...props }) =>
  <MuiTextField {...fieldToDateTextField(props)}>
    {children}
  </MuiTextField>


export default DateTextField

DateTextField.displayName = 'FormikDateTextField'
DateTextField.tabIndex = 0