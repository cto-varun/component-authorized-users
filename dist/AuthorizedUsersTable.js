"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AuthorizedUsersTable;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/es.regexp.to-string.js");
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _componentMessageBus = require("@ivoyant/component-message-bus");
require("./styles.css");
var _icons = require("@ant-design/icons");
const _excluded = ["properties", "datasources"],
  _excluded2 = ["editing", "dataIndex", "title", "inputType", "record", "index", "children"];
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
function AuthorizedUsersTable(_ref) {
  var _props$data, _lineLevelAuthorizedU, _lineLevelAuthorizedU2, _accountAuthorizedUse, _subLevelFlag$reasons;
  let {
      properties,
      datasources
    } = _ref,
    props = _objectWithoutProperties(_ref, _excluded);
  const [searchText, setSearchText] = (0, _react.useState)('');
  const {
    workflows,
    maxAuthorizedUsersLength
  } = properties;
  const {
    accountAuthorizedUsersFlag,
    lineLevelAuthorizedUsersFlag
  } = props === null || props === void 0 ? void 0 : (_props$data = props.data) === null || _props$data === void 0 ? void 0 : _props$data.data;
  const subLevelFlag = lineLevelAuthorizedUsersFlag === null || lineLevelAuthorizedUsersFlag === void 0 ? void 0 : (_lineLevelAuthorizedU = lineLevelAuthorizedUsersFlag.find(_ref2 => {
    var _window$sessionStorag;
    let {
      ctn
    } = _ref2;
    return ctn === ((_window$sessionStorag = window[sessionStorage.tabId]) === null || _window$sessionStorag === void 0 ? void 0 : _window$sessionStorag.NEW_CTN);
  })) === null || _lineLevelAuthorizedU === void 0 ? void 0 : (_lineLevelAuthorizedU2 = _lineLevelAuthorizedU.features) === null || _lineLevelAuthorizedU2 === void 0 ? void 0 : _lineLevelAuthorizedU2.find(_ref3 => {
    let {
      feature
    } = _ref3;
    return feature === 'authorizedUsers';
  });
  const showAuthUsers = (accountAuthorizedUsersFlag === null || accountAuthorizedUsersFlag === void 0 ? void 0 : accountAuthorizedUsersFlag.enable) && (subLevelFlag === null || subLevelFlag === void 0 ? void 0 : subLevelFlag.enable);
  let reasons = accountAuthorizedUsersFlag !== null && accountAuthorizedUsersFlag !== void 0 && (_accountAuthorizedUse = accountAuthorizedUsersFlag.reasons) !== null && _accountAuthorizedUse !== void 0 && _accountAuthorizedUse.length ? accountAuthorizedUsersFlag.reasons : subLevelFlag !== null && subLevelFlag !== void 0 && (_subLevelFlag$reasons = subLevelFlag.reasons) !== null && _subLevelFlag$reasons !== void 0 && _subLevelFlag$reasons.length ? subLevelFlag === null || subLevelFlag === void 0 ? void 0 : subLevelFlag.reasons : [];
  const EditableCell = _ref4 => {
    let {
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children
      } = _ref4,
      restProps = _objectWithoutProperties(_ref4, _excluded2);
    const inputNode = inputType === 'number' ? /*#__PURE__*/_react.default.createElement(_antd.InputNumber, {
      autoComplete: "off"
    }) : /*#__PURE__*/_react.default.createElement(_antd.Input, {
      autoComplete: "off"
    });
    return /*#__PURE__*/_react.default.createElement("td", restProps, editing ? /*#__PURE__*/_react.default.createElement(_antd.Tooltip, {
      trigger: ['focus'],
      title: 'Authorized username should match what is reflected on their government-issued ID',
      placement: "bottom",
      overlayClassName: "numeric-input"
    }, /*#__PURE__*/_react.default.createElement(_antd.Form.Item, {
      name: dataIndex,
      style: {
        margin: 0
      },
      placeholder: title,
      autoComplete: "off",
      rules: [{
        required: dataIndex === 'firstName' || dataIndex === 'lastName' ? true : false,
        message: "Please Input ".concat(title)
      }]
    }, inputNode)) : children);
  };
  const [form] = _antd.Form.useForm();
  const [data, setData] = (0, _react.useState)([]);
  const [editingKey, setEditingKey] = (0, _react.useState)('');
  const [deletingKey, setDeletingKey] = (0, _react.useState)(null);
  const [loading, setLoading] = (0, _react.useState)(false);
  const [selectedRowKeys, setSelectedRowKeys] = (0, _react.useState)([]);
  const [check, setCheck] = (0, _react.useState)(false);
  const [addKey, setAddKey] = (0, _react.useState)('');
  const [loadData, setLoadData] = (0, _react.useState)(true);
  const [error, setError] = (0, _react.useState)(null);
  const isEditing = record => record.key === editingKey;
  const edit = record => {
    form.setFieldsValue(_objectSpread({
      firstName: '',
      lastName: '',
      middleInitial: '',
      suffix: ''
    }, record));
    setAddKey('');
    setSelectedRowKeys(["".concat(record.key)]);
    setEditingKey(record.key);
  };
  const handleAdd = () => {
    const key = "".concat(data === null || data === void 0 ? void 0 : data.length);
    setData([...data, {
      key: key,
      firstName: '',
      lastName: '',
      middleInitial: '',
      suffix: '',
      new: true
    }]);
    form.setFieldsValue({
      firstName: '',
      lastName: '',
      middleInitial: '',
      suffix: ''
    });
    setAddKey(key);
    setSelectedRowKeys(["".concat(key)]);
    setEditingKey(key);
  };
  const cancel = () => {
    setEditingKey('');
    setSelectedRowKeys([]);
  };
  const handleDelete = key => {
    handleCalls('delete', key, data);
  };
  const save = async function save(key) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'update';
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, _objectSpread(_objectSpread({}, item), row));
        handleCalls(type, key, newData);
      } else {
        newData.push(row);
        handleCalls(type, key, newData);
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  (0, _react.useEffect)(() => {
    if (loadData && showAuthUsers) {
      getAuthorizedUsers();
      const timer = setTimeout(() => {
        getAuthorizedUsers();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loadData, showAuthUsers]);
  const getAuthorizedUsers = () => {
    var _window$sessionStorag2;
    const {
      workflow,
      datasource,
      responseMapping,
      successStates,
      errorStates
    } = workflows === null || workflows === void 0 ? void 0 : workflows.get;
    const ban = (_window$sessionStorag2 = window[sessionStorage.tabId]) === null || _window$sessionStorag2 === void 0 ? void 0 : _window$sessionStorag2.NEW_BAN;
    const registrationId = workflow.concat('.').concat(ban);
    setLoading(true);
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: registrationId,
        workflow: workflow,
        eventType: 'INIT'
      }
    });
    _componentMessageBus.MessageBus.subscribe(registrationId, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handleAuthorizedUsers(successStates, errorStates));
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
      header: {
        registrationId: registrationId,
        workflow: workflow,
        eventType: 'SUBMIT'
      },
      body: {
        datasource: datasources[datasource],
        request: {
          params: {
            ban: ban
          }
        },
        responseMapping
      }
    });
  };
  const handleAuthorizedUsers = (successStates, errorStates) => (subscriptionId, topic, eventData, closure) => {
    const isSuccess = successStates.includes(eventData.value);
    const isError = errorStates.includes(eventData.value);
    if (isSuccess || isError) {
      var _eventData$event, _eventData$event$data, _eventData$event$data2;
      if (isSuccess && eventData !== null && eventData !== void 0 && (_eventData$event = eventData.event) !== null && _eventData$event !== void 0 && (_eventData$event$data = _eventData$event.data) !== null && _eventData$event$data !== void 0 && (_eventData$event$data2 = _eventData$event$data.data) !== null && _eventData$event$data2 !== void 0 && _eventData$event$data2.length) {
        var _eventData$event2, _eventData$event2$dat, _eventData$event2$dat2;
        const successData = eventData === null || eventData === void 0 ? void 0 : (_eventData$event2 = eventData.event) === null || _eventData$event2 === void 0 ? void 0 : (_eventData$event2$dat = _eventData$event2.data) === null || _eventData$event2$dat === void 0 ? void 0 : (_eventData$event2$dat2 = _eventData$event2$dat.data) === null || _eventData$event2$dat2 === void 0 ? void 0 : _eventData$event2$dat2.map(_ref5 => {
          let {
            id,
            name
          } = _ref5;
          return _objectSpread({
            key: id
          }, name);
        });
        setData(successData);
      }
      if (isError) {
        var _eventData$event3, _eventData$event3$dat;
        setError((eventData === null || eventData === void 0 ? void 0 : (_eventData$event3 = eventData.event) === null || _eventData$event3 === void 0 ? void 0 : (_eventData$event3$dat = _eventData$event3.data) === null || _eventData$event3$dat === void 0 ? void 0 : _eventData$event3$dat.message) || 'No authorized users found!');
      }
      setLoadData(false);
      setLoading(false);
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    }
  };
  const handleCalls = (type, key, data) => {
    var _window$sessionStorag3;
    const {
      workflow,
      datasource,
      responseMapping,
      successStates,
      errorStates
    } = workflows[type];
    setLoading(true);
    const registrationId = workflow.concat('.').concat(key);
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
      header: {
        registrationId: registrationId,
        workflow: workflow,
        eventType: 'INIT'
      }
    });
    _componentMessageBus.MessageBus.subscribe(registrationId, 'WF.'.concat(workflow).concat('.STATE.CHANGE'), handleResponse(type, key, data, successStates, errorStates));
    const currentUser = data === null || data === void 0 ? void 0 : data.find(user => key === user.key);
    let request = {
      params: {
        ban: (_window$sessionStorag3 = window[sessionStorage.tabId]) === null || _window$sessionStorag3 === void 0 ? void 0 : _window$sessionStorag3.NEW_BAN,
        id: currentUser === null || currentUser === void 0 ? void 0 : currentUser.key
      }
    };
    const name = {
      firstName: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.firstName) || '',
      lastName: currentUser === null || currentUser === void 0 ? void 0 : currentUser.lastName,
      middleInitial: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.middleInitial) || '',
      suffix: (currentUser === null || currentUser === void 0 ? void 0 : currentUser.suffix) || ''
    };
    if (type === 'update') {
      request.body = {
        id: currentUser === null || currentUser === void 0 ? void 0 : currentUser.key,
        name: name
      };
    } else if (type === 'add') {
      request.body = {
        name: name
      };
    }
    _componentMessageBus.MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
      header: {
        registrationId: registrationId,
        workflow: workflow,
        eventType: 'SUBMIT'
      },
      body: {
        datasource: datasources[datasource],
        request: request,
        responseMapping
      }
    });
  };
  const handleResponse = (type, key, newData, successStates, errorStates) => (subscriptionId, topic, eventData, closure) => {
    const isSuccess = successStates.includes(eventData.value);
    const isError = errorStates.includes(eventData.value);
    if (isSuccess || isError) {
      if (isSuccess) {
        if (type === 'delete') {
          setData(data.filter(item => item.key !== key));
          setDeletingKey(null);
        } else {
          const finalData = newData === null || newData === void 0 ? void 0 : newData.map(item => {
            if (item.new) {
              delete item.new;
            }
            return item;
          });
          setData(finalData);
        }
        setEditingKey('');
        setAddKey('');
        setSelectedRowKeys([]);
        if (type === 'add') {
          getAuthorizedUsers();
        }
        setCheck(false);
        _antd.notification['success']({
          message: "".concat(type.charAt(0).toUpperCase() + type.slice(1), " Authorized User"),
          description: "Successfully ".concat(type === 'add' ? "".concat(type, "ed") : "".concat(type, "d"), " the authorized user!")
        });
      }
      if (isError) {
        var _eventData$event4, _eventData$event4$dat;
        _antd.notification['error']({
          message: "".concat(type.charAt(0).toUpperCase() + type.slice(1), " Authorized User"),
          description: (eventData === null || eventData === void 0 ? void 0 : (_eventData$event4 = eventData.event) === null || _eventData$event4 === void 0 ? void 0 : (_eventData$event4$dat = _eventData$event4.data) === null || _eventData$event4$dat === void 0 ? void 0 : _eventData$event4$dat.message) || "Error while ".concat(type, " authorized user!")
        });
      }
      setLoading(false);
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    }
  };
  const columns = [{
    title: 'First Name *',
    dataIndex: 'firstName',
    editable: true
  }, {
    title: 'Last Name *',
    dataIndex: 'lastName',
    editable: true
  }, {
    title: 'Middle Intial',
    dataIndex: 'middleInitial',
    editable: true
  }, {
    title: 'Suffix',
    dataIndex: 'suffix',
    editable: true
  }, {
    title: '',
    dataIndex: 'operation',
    render: (_, record) => {
      const editable = isEditing(record);
      return editable && !(record !== null && record !== void 0 && record.new) ? /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("a", {
        href: "#!",
        onClick: () => save(record.key),
        style: {
          marginRight: 8
        }
      }, "Save"), /*#__PURE__*/_react.default.createElement(_antd.Popconfirm, {
        title: "Sure to cancel?",
        onConfirm: cancel,
        okText: "yes",
        cancelText: "No"
      }, /*#__PURE__*/_react.default.createElement("a", null, "Cancel"))) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
        type: "link",
        shape: "circle",
        disabled: (deletingKey || editingKey !== '' || addKey !== '') && !record.new,
        onClick: () => {
          if (record !== null && record !== void 0 && record.new) {
            setData(data.filter(item => item.key !== (record === null || record === void 0 ? void 0 : record.key)));
            setEditingKey('');
            setAddKey('');
            setSelectedRowKeys([]);
            setDeletingKey(null);
          } else {
            setSelectedRowKeys(["".concat(record.key)]);
            setDeletingKey(record.key);
          }
        },
        icon: /*#__PURE__*/_react.default.createElement(_icons.DeleteOutlined, null)
      }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
        type: "link",
        shape: "circle",
        disabled: deletingKey || editingKey !== '' || (record === null || record === void 0 ? void 0 : record.new),
        onClick: () => edit(record),
        icon: /*#__PURE__*/_react.default.createElement(_icons.EditOutlined, null)
      }));
    }
  }];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return _objectSpread(_objectSpread({}, col), {}, {
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    });
  });
  const handleSearch = value => {
    setSearchText(value);
  };
  const filteredData = data === null || data === void 0 ? void 0 : data.filter(_ref6 => {
    var _firstName$toLowerCas, _lastName$toLowerCase;
    let {
      firstName,
      lastName
    } = _ref6;
    return searchText === '' || (firstName === null || firstName === void 0 ? void 0 : (_firstName$toLowerCas = firstName.toLowerCase()) === null || _firstName$toLowerCas === void 0 ? void 0 : _firstName$toLowerCas.includes(searchText === null || searchText === void 0 ? void 0 : searchText.toLowerCase())) || (lastName === null || lastName === void 0 ? void 0 : (_lastName$toLowerCase = lastName.toLowerCase()) === null || _lastName$toLowerCase === void 0 ? void 0 : _lastName$toLowerCase.includes(searchText === null || searchText === void 0 ? void 0 : searchText.toLowerCase()));
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "px-1"
  }, !showAuthUsers ? /*#__PURE__*/_react.default.createElement(_antd.Alert, {
    message: "Authorized Users flow is disabled ".concat((reasons === null || reasons === void 0 ? void 0 : reasons.length) > 0 ? "due to ".concat(reasons.toString()) : ''),
    type: "info",
    showIcon: true
  }) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_antd.Col, {
    span: 24
  }, /*#__PURE__*/_react.default.createElement(_antd.Row, {
    className: "mb-2 justify-content-space-between"
  }, /*#__PURE__*/_react.default.createElement(_antd.Col, null, /*#__PURE__*/_react.default.createElement(_antd.Input, {
    placeholder: "Search By name",
    suffix: /*#__PURE__*/_react.default.createElement(_icons.SearchOutlined, {
      style: {
        color: 'rgba(0, 0, 0, 0.45)'
      }
    }),
    value: searchText,
    onChange: e => handleSearch(e.target.value)
  })))), /*#__PURE__*/_react.default.createElement(_antd.Row, null, /*#__PURE__*/_react.default.createElement(_antd.Col, {
    span: 24
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "table-wrapper"
  }, /*#__PURE__*/_react.default.createElement(_antd.Form, {
    form: form,
    component: false
  }, /*#__PURE__*/_react.default.createElement(_antd.Table, {
    loading: loading,
    className: "authorized-users-table",
    components: {
      body: {
        cell: EditableCell
      }
    },
    bordered: true,
    dataSource: filteredData || [],
    columns: mergedColumns,
    rowClassName: "editable-row",
    expandable: {
      expandedRowKeys: selectedRowKeys,
      expandedRowRender: record => {
        return (record === null || record === void 0 ? void 0 : record.key) === deletingKey ? /*#__PURE__*/_react.default.createElement("div", {
          className: "expandable-row-container"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "expandable-row-item"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "port-protect-proceed-text"
        }, "Delete \"", record === null || record === void 0 ? void 0 : record.firstName, ' ', record === null || record === void 0 ? void 0 : record.lastName, "\" from the authorized user list?"), /*#__PURE__*/_react.default.createElement("div", {
          className: "port-protect-text"
        }, "This user will be immediately deleted. You can't undo this action"), /*#__PURE__*/_react.default.createElement("div", {
          style: {
            float: 'right'
          }
        }, /*#__PURE__*/_react.default.createElement(_antd.Button, {
          style: {
            marginRight: 12
          },
          type: "primary",
          onClick: () => handleDelete(record.key)
        }, "Delete"), /*#__PURE__*/_react.default.createElement(_antd.Button, {
          onClick: () => {
            setSelectedRowKeys([]);
            setAddKey('');
            setDeletingKey(null);
          }
        }, "Cancel")))) : (record === null || record === void 0 ? void 0 : record.key) === addKey && /*#__PURE__*/_react.default.createElement("div", {
          className: "expandable-row-container"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "expandable-row-item"
        }, /*#__PURE__*/_react.default.createElement("div", null, "By checking this box, you acknowledge that the customer understands that any designated Authorized Users will have access to the account, including the ability to make authorized payments and account changes."), /*#__PURE__*/_react.default.createElement(_antd.Checkbox, {
          checked: check,
          onChange: e => setCheck(e.target.checked)
        }, "Yes, I acknowledge this message"), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_antd.Button, {
          style: {
            marginTop: 8
          },
          disabled: !check,
          type: "primary",
          onClick: () => save(record === null || record === void 0 ? void 0 : record.key, 'add')
        }, "Save"))));
      }
    },
    locale: {
      emptyText: error || 'No authorized users found!'
    },
    pagination: false
  }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    disabled: addKey !== '' || deletingKey || editingKey !== '' || (data === null || data === void 0 ? void 0 : data.length) >= maxAuthorizedUsersLength,
    style: {
      border: 'none'
    },
    icon: /*#__PURE__*/_react.default.createElement(_icons.PlusCircleOutlined, null),
    onClick: handleAdd
  }, "Add Authorized User"))))), /*#__PURE__*/_react.default.createElement(_antd.Divider, {
    dashed: true,
    className: "mt-2"
  })));
}