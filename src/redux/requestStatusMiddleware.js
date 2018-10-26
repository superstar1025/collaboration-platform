import invariant from 'invariant';
import { startCase, last } from 'lodash';

/**
 * requestStatusMiddleware takes an API Request action and handles updating the state
 * when requesting as well as dispatching actions for success and failure cases.
 */
export default function requestStatusMiddleware({ dispatch }) {
  return next => async (action) => {
    const { types, apiCall, payload = {}, notification, args } = action;

    // requestStatusMiddleware requires 3 action types, *_REQUEST, *_SUCCESS, *_FAILURE.
    // If the `types` key is absent, pass this action along to the next middleware.
    if (!types) {
      return next(action);
    }

    // The `types` key must be an array of 3 strings. If not, throw an error.
    invariant(
      Array.isArray(types) &&
        types.length === 3 &&
        types.every(type => typeof type === 'string'),
      'requestStatusMiddleware expected `types` to be an array of 3 strings',
    );

    // The `apiCall` key must be a function.
    invariant(
      typeof apiCall === 'function',
      'requestStatusMiddleware expected `apiCall` to be a function',
    );

    const [requestType, successType, failureType] = types;

    dispatch({ type: requestType, payload });
    const data = await apiCall(...args);
    const { response, error } = data || { error: 'empty' };
    if (error || !response.body) {
      dispatch({
        type: failureType,
        error: true,
        payload: error,
        request: payload,
      });
      if (error.title || error.detail) {
        dispatch({
          type: 'GLOBAL_NOTIFICATION',
          payload: {
            data: error,
            kind: 'error',
          },
        });
      } else {
        dispatch({
          type: 'GLOBAL_NOTIFICATION',
          payload: {
            data: { title: startCase(last(requestType.split('/'))), detail: error },
            kind: 'error',
          },
        });
      }
    } else if (response.body.errors || response.body.error) {
      dispatch({
        type: failureType,
        error: true,
        payload: response.body.errors || response.body.error,
        request: payload,
      });
      dispatch({
        type: 'GLOBAL_NOTIFICATION',
        payload: {
          data: response.body.errors || response.body.error,
          kind: 'error',
        },
      });
    } else {
      dispatch({ type: successType, payload: response.body, request: payload });
      if (notification) {
        dispatch({
          type: 'GLOBAL_NOTIFICATION',
          payload: {
            data: notification,
            kind: 'success',
          },
        });
      }
    }
    return true;
  };
}
