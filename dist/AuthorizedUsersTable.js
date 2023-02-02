"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AuthorizedUsersTable;
var _react = _interopRequireWildcard(require("react"));
var _antd = require("antd");
var _componentMessageBus = require("@ivoyant/component-message-bus");
require("./styles.css");
var _icons = require("@ant-design/icons");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function AuthorizedUsersTable(_ref) {
  let {
    properties,
    datasources,
    ...props
  } = _ref;
  const [searchText, setSearchText] = (0, _react.useState)('');
  const {
    workflows,
    maxAuthorizedUsersLength
  } = properties;
  const {
    accountAuthorizedUsersFlag,
    lineLevelAuthorizedUsersFlag
  } = props?.data?.data;
  const subLevelFlag = lineLevelAuthorizedUsersFlag?.find(_ref2 => {
    let {
      ctn
    } = _ref2;
    return ctn === window[sessionStorage.tabId]?.NEW_CTN;
  })?.features?.find(_ref3 => {
    let {
      feature
    } = _ref3;
    return feature === 'authorizedUsers';
  });
  const showAuthUsers = accountAuthorizedUsersFlag?.enable && subLevelFlag?.enable;
  let reasons = accountAuthorizedUsersFlag?.reasons?.length ? accountAuthorizedUsersFlag.reasons : subLevelFlag?.reasons?.length ? subLevelFlag?.reasons : [];
  const EditableCell = _ref4 => {
    let {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = _ref4;
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
        message: `Please Input ${title}`
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
    form.setFieldsValue({
      firstName: '',
      lastName: '',
      middleInitial: '',
      suffix: '',
      ...record
    });
    setAddKey('');
    setSelectedRowKeys([`${record.key}`]);
    setEditingKey(record.key);
  };
  const handleAdd = () => {
    const key = `${data?.length}`;
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
    setSelectedRowKeys([`${key}`]);
    setEditingKey(key);
  };
  const cancel = () => {
    setEditingKey('');
    setSelectedRowKeys([]);
  };
  const handleDelete = key => {
    handleCalls('delete', key, data);
  };
  const save = async function (key) {
    let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'update';
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
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
    const {
      workflow,
      datasource,
      responseMapping,
      successStates,
      errorStates
    } = workflows?.get;
    const ban = window[sessionStorage.tabId]?.NEW_BAN;
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
      if (isSuccess && eventData?.event?.data?.data?.length) {
        const successData = eventData?.event?.data?.data?.map(_ref5 => {
          let {
            id,
            name
          } = _ref5;
          return {
            key: id,
            ...name
          };
        });
        setData(successData);
      }
      if (isError) {
        setError(eventData?.event?.data?.message || 'No authorized users found!');
      }
      setLoadData(false);
      setLoading(false);
      _componentMessageBus.MessageBus.unsubscribe(subscriptionId);
    }
  };
  const handleCalls = (type, key, data) => {
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
    const currentUser = data?.find(user => key === user.key);
    let request = {
      params: {
        ban: window[sessionStorage.tabId]?.NEW_BAN,
        id: currentUser?.key
      }
    };
    const name = {
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName,
      middleInitial: currentUser?.middleInitial || '',
      suffix: currentUser?.suffix || ''
    };
    if (type === 'update') {
      request.body = {
        id: currentUser?.key,
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
          const finalData = newData?.map(item => {
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
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} Authorized User`,
          description: `Successfully ${type === 'add' ? `${type}ed` : `${type}d`} the authorized user!`
        });
      }
      if (isError) {
        _antd.notification['error']({
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} Authorized User`,
          description: eventData?.event?.data?.message || `Error while ${type} authorized user!`
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
      return editable && !record?.new ? /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement("a", {
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
          if (record?.new) {
            setData(data.filter(item => item.key !== record?.key));
            setEditingKey('');
            setAddKey('');
            setSelectedRowKeys([]);
            setDeletingKey(null);
          } else {
            setSelectedRowKeys([`${record.key}`]);
            setDeletingKey(record.key);
          }
        },
        icon: /*#__PURE__*/_react.default.createElement(_icons.DeleteOutlined, null)
      }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
        type: "link",
        shape: "circle",
        disabled: deletingKey || editingKey !== '' || record?.new,
        onClick: () => edit(record),
        icon: /*#__PURE__*/_react.default.createElement(_icons.EditOutlined, null)
      }));
    }
  }];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  const handleSearch = value => {
    setSearchText(value);
  };
  const filteredData = data?.filter(_ref6 => {
    let {
      firstName,
      lastName
    } = _ref6;
    return searchText === '' || firstName?.toLowerCase()?.includes(searchText?.toLowerCase()) || lastName?.toLowerCase()?.includes(searchText?.toLowerCase());
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "px-1"
  }, !showAuthUsers ? /*#__PURE__*/_react.default.createElement(_antd.Alert, {
    message: `Authorized Users flow is disabled ${reasons?.length > 0 ? `due to ${reasons.toString()}` : ''}`,
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
        return record?.key === deletingKey ? /*#__PURE__*/_react.default.createElement("div", {
          className: "expandable-row-container"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "expandable-row-item"
        }, /*#__PURE__*/_react.default.createElement("div", {
          className: "port-protect-proceed-text"
        }, "Delete \"", record?.firstName, ' ', record?.lastName, "\" from the authorized user list?"), /*#__PURE__*/_react.default.createElement("div", {
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
        }, "Cancel")))) : record?.key === addKey && /*#__PURE__*/_react.default.createElement("div", {
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
          onClick: () => save(record?.key, 'add')
        }, "Save"))));
      }
    },
    locale: {
      emptyText: error || 'No authorized users found!'
    },
    pagination: false
  }), /*#__PURE__*/_react.default.createElement(_antd.Button, {
    disabled: addKey !== '' || deletingKey || editingKey !== '' || data?.length >= maxAuthorizedUsersLength,
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
module.exports = exports.default;