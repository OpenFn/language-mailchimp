"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.upsertMembers = upsertMembers;
exports.tagMembers = tagMembers;
exports.startBatch = startBatch;
exports.listBatches = listBatches;
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function get() {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function get() {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function get() {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function get() {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.lastReferenceValue;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function get() {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.sourceValue;
  }
});

var _languageCommon = require("language-common");

var _axios = _interopRequireDefault(require("axios"));

var _mailchimp_marketing = _interopRequireDefault(require("@mailchimp/mailchimp_marketing"));

var _md = _interopRequireDefault(require("md5"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
function execute() {
  for (var _len = arguments.length, operations = new Array(_len), _key = 0; _key < _len; _key++) {
    operations[_key] = arguments[_key];
  }

  var initialState = {
    references: [],
    data: null
  };
  return function (state) {
    return _languageCommon.execute.apply(void 0, operations)(_objectSpread(_objectSpread({}, initialState), state));
  };
}
/**
 * Add members to a particular audience
 * @example
 * upsertMembers(params)
 * @constructor
 * @param {object} params - a listId, users, and options
 * @returns {Operation}
 */


function upsertMembers(params) {
  return function (state) {
    var _state$configuration = state.configuration,
        apiKey = _state$configuration.apiKey,
        server = _state$configuration.server;

    var _expandReferences = (0, _languageCommon.expandReferences)(params)(state),
        listId = _expandReferences.listId,
        users = _expandReferences.users,
        options = _expandReferences.options;

    _mailchimp_marketing["default"].setConfig({
      apiKey: apiKey,
      server: server
    });

    return Promise.all(users.map(function (user) {
      return _mailchimp_marketing["default"].lists.setListMember(listId, (0, _md["default"])(user.email), {
        email_address: user.email,
        status_if_new: user.status,
        merge_fields: user.mergeFields
      }).then(function (response) {
        state.references.push(response);
      });
    })).then(function () {
      return state;
    });
  };
}
/**
 * Tag members with a particular tag
 * @example
 * tagMembers(params)
 * @constructor
 * @param {object} params - a tagId, members, and a list
 * @returns {Operation}
 */


function tagMembers(params) {
  return function (state) {
    var _state$configuration2 = state.configuration,
        apiKey = _state$configuration2.apiKey,
        server = _state$configuration2.server;

    var _expandReferences2 = (0, _languageCommon.expandReferences)(params)(state),
        listId = _expandReferences2.listId,
        tagId = _expandReferences2.tagId,
        members = _expandReferences2.members;

    _mailchimp_marketing["default"].setConfig({
      apiKey: apiKey,
      server: server
    });

    return _mailchimp_marketing["default"].lists.batchSegmentMembers({
      members_to_add: members
    }, listId, tagId).then(function (response) {
      var nextState = (0, _languageCommon.composeNextState)(state, response);
      return nextState;
    });
  };
}
/**
 * Tag members with a particular tag
 * @example
 * startBatch(params)
 * @constructor
 * @param {object} params - operations batch job
 * @returns {Operation}
 */


function startBatch(params) {
  return function (state) {
    var _state$configuration3 = state.configuration,
        apiKey = _state$configuration3.apiKey,
        server = _state$configuration3.server;

    var _expandReferences3 = (0, _languageCommon.expandReferences)(params)(state),
        operations = _expandReferences3.operations;

    _mailchimp_marketing["default"].setConfig({
      apiKey: apiKey,
      server: server
    });

    return _mailchimp_marketing["default"].batches.start({
      operations: _toConsumableArray(operations)
    }).then(function (response) {
      console.log(response);
      var nextState = (0, _languageCommon.composeNextState)(state, response);
      return nextState;
    });
  };
}

function listBatches(params) {
  return function (state) {
    var _state$configuration4 = state.configuration,
        apiKey = _state$configuration4.apiKey,
        server = _state$configuration4.server;

    _mailchimp_marketing["default"].setConfig({
      apiKey: apiKey,
      server: server
    });

    return _mailchimp_marketing["default"].batches.list().then(function (response) {
      console.log(response);
      var nextState = (0, _languageCommon.composeNextState)(state, response);
      return nextState;
    });
  };
} // Note that we expose the entire axios package to the user here.


exports.axios = _axios["default"];
exports.md5 = _md["default"]; // What functions do you want from the common adaptor?
