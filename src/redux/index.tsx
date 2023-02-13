import { configureStore } from '@reduxjs/toolkit'
import { bindActionCreators } from 'redux'

const CAKE_ORDERED = 'CAKE_ORDERED'
const CAKE_RESTOCKED = 'CAKE_RESTOCKED'

//action
function orderCake() {
  return {
    type: CAKE_ORDERED,
    payload: 1,
  }
}

function restockCake(qty = 1) {
  return {
    type: CAKE_RESTOCKED,
    payload: qty,
  }
}

const initialState = {
  numOfCakes: 10,
  anotherProperty: 0,
}

//reducer
const reducers = (state = initialState, action: any) => {
  switch (action.type) {
    case CAKE_ORDERED:
      return { ...state, numOfCakes: state.numOfCakes - 1 }
    case CAKE_RESTOCKED:
      return { ...state, numOfCakes: state.numOfCakes + action.payload }
    default:
      return state
  }
}

export const IndexRedux = () => {
  //store
  const store = configureStore({ reducer: reducers })
  console.log('Initial state ' + JSON.stringify(store.getState()))
  const unsubscribe = store.subscribe(() =>
    console.log('Update state ' + JSON.stringify(store.getState())),
  )

  const actions = bindActionCreators({ orderCake, restockCake }, store.dispatch)
  /*  store.dispatch(orderCake())
  store.dispatch(orderCake())
  store.dispatch(orderCake())
  store.dispatch(restockCake(5)) */
  actions.orderCake()
  actions.orderCake()
  actions.restockCake(2)

  unsubscribe()
}
