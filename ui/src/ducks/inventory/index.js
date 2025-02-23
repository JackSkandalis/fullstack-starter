import axios from 'axios'
import { openSuccess } from '../alerts/index'
import { createAction, handleActions } from 'redux-actions'


const actions = {
  INVENTORY_GET_ALL: 'inventory/get_all',
  INVENTORY_GET_ALL_PENDING: 'inventory/get_all_PENDING',
  INVENTORY_CREATE: 'inventory/create',
  INVENTORY_DELETE: 'inventory/delete',
  INVENTORY_UPDATE: 'inventory/update',
  INVENTORY_REFRESH: 'inventory/refresh'
}

const frontendToBackendMapping = {
  'Cup(s)': 'CUP',
  'Gallon(s)': 'GALLON',
  'Ounce(s)': 'OUNCE',
  'Pint(s)': 'PINT',
  'Pound(s)': 'POUND',
  'Quart(s)': 'QUART'
}

export let defaultState = {
  all: [],
  fetched: false,
}

export const findInventory = createAction(actions.INVENTORY_GET_ALL, () =>
  (dispatch, getState, config) => axios
    .get(`${config.restAPIUrl}/inventory`)
    .then((suc) => dispatch(refreshInventory(suc.data)))
)

export const createInventory = createAction(actions.INVENTORY_CREATE, (inventory) =>
  (dispatch, getState, config) => {
    const backendEnumValue = frontendToBackendMapping[inventory.unitOfMeasurement]
    const fullTime = inventory.bestBeforeDate
    const inventoryWithBackendUnit = {
      ...inventory,
      unitOfMeasurement: backendEnumValue,
      bestBeforeDate: fullTime.trim() + 'T00:00:00.000Z'
    }

    return axios
      .post(`${config.restAPIUrl}/inventory`, inventoryWithBackendUnit)
      .then((suc) => {
        const invs = []
        getState().inventory.all.forEach(inv => {
          if (inv.id !== suc.data.id) {
            invs.push(inv)
          }
        })
        invs.push(suc.data)
        dispatch(refreshInventory(invs))
        dispatch(openSuccess('Inventory successfully saved!'))
      })
  }
)

export const deleteInventory = createAction(actions.INVENTORY_DELETE, (ids) =>
  (dispatch, getState, config) => axios
    .delete(`${config.restAPIUrl}/inventory`, { data: ids })
    .then((suc) => {
      const invs = []
      getState().inventory.all.forEach(inv => {
        if (!ids.includes(inv.id)) {
          invs.push(inv)
        }
      })
      dispatch(refreshInventory(invs))
      dispatch(openSuccess('Inventory successfully deleted!'))
    })
)

export default handleActions({
  [actions.INVENTORY_GET_ALL_PENDING]: (state) => ({
    ...state,
    fetched: false
  }),
  [actions.INVENTORY_REFRESH]: (state, action) => ({
    ...state,
    all: action.payload,
    fetched: true,
  })
}, defaultState)

export const refreshInventory = createAction(actions.INVENTORY_REFRESH, (payload) =>
  (dispatcher, getState, config) =>
    payload.sort((inventoryA, inventoryB) =>
      inventoryA.name < inventoryB.name ? -1 : inventoryA.name > inventoryB.name ? 1 : 0)
)