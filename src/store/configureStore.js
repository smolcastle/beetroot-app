import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './rootReducer'

function configureStore() {
  const middlewareEnhancer = applyMiddleware(thunk)
  const composedEnhancers = compose(middlewareEnhancer)
  return createStore(rootReducer, {}, composedEnhancers)
}

export { configureStore }
