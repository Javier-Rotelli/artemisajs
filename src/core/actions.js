//
// Action creators
//

export const requestTypeFor = type => `${type}_REQUEST`
export const receiveTypeFor = type => `${type}_RECEIVE`
export const errorTypeFor = type => `${type}_ERROR`

export const ApiCallType = {
  REQUEST: 'REQUEST',
  RECEIVE: 'RECEIVE',
  ERROR: 'ERROR'
}

const actionCreator = (callType, typeFn) => action => ({
  originType: action.type,
  type: typeFn(action.type),
  apiCallType: callType,
  path: action.dataApiCall.path
})

export const onRequestActionCreator = actionCreator(ApiCallType.REQUEST, requestTypeFor)
export const onReceiveActionCreator = action => data => ({
  ...actionCreator(ApiCallType.RECEIVE, receiveTypeFor)(action),
  data
})

export const onErrorActionCreator = action => error => ({
  ...actionCreator(ApiCallType.ERROR, errorTypeFor)(action),
  error
})

/** Gets the "call" object from an action, populating the token if necesary */
export const callFromAction = (store, action) => {
  const call = action.dataApiCall
  if (call.requiresAuthentication) {
    call.token = getAuthToken(store.getState())
  }
  return call
}

// HARDCODED: coupled with our app. This is the only point to become
// apiCalls an external library
const getAuthToken = state => (state.login ? state.login.token : undefined)

export const simulateDataReceive = (action, data) => onReceiveActionCreator(action)(data)

//
// Checking
// 

export const isApiCall = action => action.dataApiCall

export const isDerivedActionFor = (action, apiActionType) => action.originType === apiActionType

const isApiCallOfType = expected => action => action.apiCallType === expected
export const isRequest = isApiCallOfType(ApiCallType.REQUEST)
export const isReceive = isApiCallOfType(ApiCallType.RECEIVE)
export const isError = isApiCallOfType(ApiCallType.ERROR)
