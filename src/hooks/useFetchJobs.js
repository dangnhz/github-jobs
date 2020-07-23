import { useEffect, useReducer } from 'react';
import axios from 'axios';

const ACTIONS = {
  MAKE_REQUEST: 'make-request',
  GET_DATA: 'get-data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page',
};

const BASE_URL =
  'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { jobs: [], isLoading: true };

    case ACTIONS.GET_DATA:
      return { ...state, jobs: action.payload.jobs, isLoading: false };

    case ACTIONS.ERROR:
      return { ...state, isLoading: false, error: action.payload.error };

    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage };

    default:
      return state;
  }
}

export default function (params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], isLoading: true });

  useEffect(() => {
    // dispatch make request
    dispatch({ type: ACTIONS.MAKE_REQUEST });

    // fetch data from API
    const cancelToken1 = axios.CancelToken.source();
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken1.token,
        params: { markdown: true, page: page, ...params },
      })
      .then((res) => res.data)
      .then((data) => {
        // console.log(data);
        dispatch({
          type: ACTIONS.GET_DATA,
          payload: {
            jobs: data,
          },
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        dispatch({
          type: ACTIONS.ERROR,
          payload: {
            error: err,
          },
        });
      });

    // check if hasNextPage

    const cancelToken2 = axios.CancelToken.source();
    axios
      .get(BASE_URL, {
        cancelToken: cancelToken2.token,
        params: { markdown: true, page: page + 1, ...params },
      })
      .then((res) => res.data)
      .then((data) => {
        // console.log(data);
        dispatch({
          type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
          payload: {
            hasNextPage: data?.length > 0,
          },
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        dispatch({
          type: ACTIONS.ERROR,
          payload: {
            error: err,
          },
        });
      });

    return () => {
      cancelToken1.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);

  return state;
}
