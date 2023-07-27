import Button from '@material-ui/core/Button'
import DateTextField from '../Form/DateTextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { ErrorMessage } from 'formik'
import Grid from '@material-ui/core/Grid'
import { MeasurementUnits } from '../../constants/units'
import NumberTextField from '../Form/NumberTextField'
import React from 'react'
import TextField from '../Form/TextField'
import { useSelector } from 'react-redux'
import { Checkbox, FormControlLabel, MenuItem } from '@material-ui/core'
import { Field, Form, Formik } from 'formik'

class InventoryFormModal extends React.Component {
  render() {
    const {
      formName,
      handleDialog,
      handleInventory,
      title,
      initialValues,
      handleProductToggle,
      handleUnitToggle,
      selectedProduct,
      selectedUnit
    } = this.props
    const defaultInitialValues = {
      unitOfMeasurement: '',
      productType: ''
    }
    const mergedInitialValues = { ...defaultInitialValues, ...initialValues }
    return (
      <Dialog
        open={this.props.isDialogOpen}
        maxWidth='sm'
        fullWidth={true}
        onClose={() => { handleDialog(true) }}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={values => {
            handleInventory(values)
            handleDialog(true)
          }}
          validate={(values) => {
            const errors = {}
            if (!values.name) {
              errors.name = 'Name is required.'
            }
            if (!values.productType) {
              errors.productType = 'Product Type is required.'
            }
            if (!values.unitOfMeasurement) {
              errors.unitOfMeasurement = 'Unit of Measurement is required.'
            }
            return errors
          }}>
          {helpers =>
            <Form
              noValidate
              autoComplete='off'
              id={formName}
            >
              <DialogTitle id='alert-dialog-title'>
                {`${title} Inventory`}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='name'
                      label='Name'
                      component={TextField}
                    />
                    <ErrorMessage name='name' component='div' />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='productType'
                      label='Product Type'
                      component={TextField}
                      select
                      value={selectedProduct}
                      defaultValue={mergedInitialValues.productType}
                    >
                      {useSelector(state => state.products.all).map((value, index) =>
                        <MenuItem button onClick={handleProductToggle(value)} key={index} value={value.name}>
                          {value.name}
                        </MenuItem>
                      )}
                    </Field>
                    <ErrorMessage name='productType' component='div' />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='description'
                      label='Description'
                      component={TextField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='averagePrice'
                      label='Average Price'
                      component={NumberTextField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='amount'
                      label='Amount'
                      component={NumberTextField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='unitOfMeasurement'
                      label='Unit Of Measurment'
                      component={TextField}
                      select
                      value={selectedUnit}
                      defaultValue={mergedInitialValues.unitOfMeasurement}
                    >
                      {Object.keys(MeasurementUnits).map((value) =>
                        <MenuItem button onClick={handleUnitToggle} key={value} value={MeasurementUnits[value].name}>
                          {MeasurementUnits[value].name}
                        </MenuItem>
                      )}
                    </Field>
                    <ErrorMessage name='unitOfMeasurement' component='div' />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      custom={{ variant: 'outlined', fullWidth: true, }}
                      name='bestBeforeDate'
                      label='Best Before Date'
                      component={DateTextField}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Field
                      name='neverExpires'
                      type='checkbox'
                    >
                      {({ field }) =>
                        <FormControlLabel
                          control={<Checkbox {...field} />}
                          label='Never Expires'
                          labelPlacement='start'
                        />
                      }
                    </Field>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => { handleDialog(true) }} color='secondary'>Cancel</Button>
                <Button
                  disableElevation
                  variant='contained'
                  type='submit'
                  form={formName}
                  color='secondary'
                  disabled={!helpers.dirty}>
                  Save
                </Button>
              </DialogActions>
            </Form>
          }
        </Formik>
      </Dialog>
    )
  }
}

export default InventoryFormModal