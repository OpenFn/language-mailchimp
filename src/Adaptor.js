/** @module Adaptor */
import {
  execute as commonExecute,
  composeNextState,
  expandReferences,
} from 'language-common';
import axios from 'axios';
import client from '@mailchimp/mailchimp_marketing';
import md5 from 'md5';
import { resolve } from 'path';

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @constructor
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null,
  };

  return state => {
    return commonExecute(...operations)({
      ...initialState,
      ...state,
    });
  };
}

/**
 * Make a POST request
 * @example
 * upsertMembers(params)
 * @constructor
 * @param {object} params - data to make the fetch
 * @returns {Operation}
 */
export function upsertMembers(params) {
  return state => {
    const { apiKey, server } = state.configuration;
    const { listId, users, options } = expandReferences(params)(state);

    client.setConfig({ apiKey, server });

    return Promise.all(
      users.map(user =>
        client.lists
          .setListMember(listId, md5(user.email), {
            email_address: user.email,
            status_if_new: user.status,
            merge_fields: user.mergeFields,
          })
          .then(response => {
            state.references.push(response);
          })
      )
    ).then(() => {
      return state;
    });
  };
}

export function tagMembers(params) {
  return state => {
    const { apiKey, server } = state.configuration;
    const { listId, tagId, members } = expandReferences(params)(state);

    client.setConfig({ apiKey, server });

    return client.lists
      .batchSegmentMembers({ members_to_add: members }, listId, tagId)
      .then(response => {
        const nextState = composeNextState(state, response);
        return nextState;
      });
  };
}

// Note that we expose the entire axios package to the user here.
exports.axios = axios;

// What functions do you want from the common adaptor?
export {
  alterState,
  dataPath,
  dataValue,
  each,
  field,
  fields,
  lastReferenceValue,
  merge,
  sourceValue,
} from 'language-common';
