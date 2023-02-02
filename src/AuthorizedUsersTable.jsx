import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Table,
    Input,
    Divider,
    Button,
    InputNumber,
    Popconfirm,
    Form,
    Tooltip,
    Checkbox,
    notification,
    Alert,
} from 'antd';
import { MessageBus } from '@ivoyant/component-message-bus';
import './styles.css';
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
} from '@ant-design/icons';

export default function AuthorizedUsersTable({
    properties,
    datasources,
    ...props
}) {
    const [searchText, setSearchText] = useState('');
    const { workflows, maxAuthorizedUsersLength } = properties;
    const {
        accountAuthorizedUsersFlag,
        lineLevelAuthorizedUsersFlag,
    } = props?.data?.data;

    const subLevelFlag = lineLevelAuthorizedUsersFlag
        ?.find(({ ctn }) => ctn === window[sessionStorage.tabId]?.NEW_CTN)
        ?.features?.find(({ feature }) => feature === 'authorizedUsers');
    const showAuthUsers =
        accountAuthorizedUsersFlag?.enable && subLevelFlag?.enable;
    let reasons = accountAuthorizedUsersFlag?.reasons?.length
        ? accountAuthorizedUsersFlag.reasons
        : subLevelFlag?.reasons?.length
        ? subLevelFlag?.reasons
        : [];

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode =
            inputType === 'number' ? (
                <InputNumber autoComplete="off" />
            ) : (
                <Input autoComplete="off" />
            );
        return (
            <td {...restProps}>
                {editing ? (
                    <Tooltip
                        trigger={['focus']}
                        title={
                            'Authorized username should match what is reflected on their government-issued ID'
                        }
                        placement="bottom"
                        overlayClassName="numeric-input"
                    >
                        <Form.Item
                            name={dataIndex}
                            style={{
                                margin: 0,
                            }}
                            placeholder={title}
                            autoComplete="off"
                            rules={[
                                {
                                    required:
                                        dataIndex === 'firstName' ||
                                        dataIndex === 'lastName'
                                            ? true
                                            : false,
                                    message: `Please Input ${title}`,
                                },
                            ]}
                        >
                            {inputNode}
                        </Form.Item>
                    </Tooltip>
                ) : (
                    children
                )}
            </td>
        );
    };

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [deletingKey, setDeletingKey] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [check, setCheck] = useState(false);
    const [addKey, setAddKey] = useState('');
    const [loadData, setLoadData] = useState(true);
    const [error, setError] = useState(null);

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            firstName: '',
            lastName: '',
            middleInitial: '',
            suffix: '',
            ...record,
        });
        setAddKey('');
        setSelectedRowKeys([`${record.key}`]);
        setEditingKey(record.key);
    };

    const handleAdd = () => {
        const key = `${data?.length}`;
        setData([
            ...data,
            {
                key: key,
                firstName: '',
                lastName: '',
                middleInitial: '',
                suffix: '',
                new: true,
            },
        ]);
        form.setFieldsValue({
            firstName: '',
            lastName: '',
            middleInitial: '',
            suffix: '',
        });
        setAddKey(key);
        setSelectedRowKeys([`${key}`]);
        setEditingKey(key);
    };

    const cancel = () => {
        setEditingKey('');
        setSelectedRowKeys([]);
    };

    const handleDelete = (key) => {
        handleCalls('delete', key, data);
    };

    const save = async (key, type = 'update') => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                handleCalls(type, key, newData);
            } else {
                newData.push(row);
                handleCalls(type, key, newData);
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    useEffect(() => {
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
            errorStates,
        } = workflows?.get;
        const ban = window[sessionStorage.tabId]?.NEW_BAN;
        const registrationId = workflow.concat('.').concat(ban);
        setLoading(true);
        MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
            header: {
                registrationId: registrationId,
                workflow: workflow,
                eventType: 'INIT',
            },
        });
        MessageBus.subscribe(
            registrationId,
            'WF.'.concat(workflow).concat('.STATE.CHANGE'),
            handleAuthorizedUsers(successStates, errorStates)
        );
        MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
            header: {
                registrationId: registrationId,
                workflow: workflow,
                eventType: 'SUBMIT',
            },
            body: {
                datasource: datasources[datasource],
                request: {
                    params: {
                        ban: ban,
                    },
                },
                responseMapping,
            },
        });
    };

    const handleAuthorizedUsers = (successStates, errorStates) => (
        subscriptionId,
        topic,
        eventData,
        closure
    ) => {
        const isSuccess = successStates.includes(eventData.value);
        const isError = errorStates.includes(eventData.value);
        if (isSuccess || isError) {
            if (isSuccess && eventData?.event?.data?.data?.length) {
                const successData = eventData?.event?.data?.data?.map(
                    ({ id, name }) => {
                        return { key: id, ...name };
                    }
                );
                setData(successData);
            }
            if (isError) {
                setError(
                    eventData?.event?.data?.message ||
                        'No authorized users found!'
                );
            }
            setLoadData(false);
            setLoading(false);
            MessageBus.unsubscribe(subscriptionId);
        }
    };

    const handleCalls = (type, key, data) => {
        const {
            workflow,
            datasource,
            responseMapping,
            successStates,
            errorStates,
        } = workflows[type];
        setLoading(true);
        const registrationId = workflow.concat('.').concat(key);
        MessageBus.send('WF.'.concat(workflow).concat('.INIT'), {
            header: {
                registrationId: registrationId,
                workflow: workflow,
                eventType: 'INIT',
            },
        });
        MessageBus.subscribe(
            registrationId,
            'WF.'.concat(workflow).concat('.STATE.CHANGE'),
            handleResponse(type, key, data, successStates, errorStates)
        );
        const currentUser = data?.find((user) => key === user.key);
        let request = {
            params: {
                ban: window[sessionStorage.tabId]?.NEW_BAN,
                id: currentUser?.key,
            },
        };
        const name = {
            firstName: currentUser?.firstName || '',
            lastName: currentUser?.lastName,
            middleInitial: currentUser?.middleInitial || '',
            suffix: currentUser?.suffix || '',
        };
        if (type === 'update') {
            request.body = { id: currentUser?.key, name: name };
        } else if (type === 'add') {
            request.body = { name: name };
        }
        MessageBus.send('WF.'.concat(workflow).concat('.SUBMIT'), {
            header: {
                registrationId: registrationId,
                workflow: workflow,
                eventType: 'SUBMIT',
            },
            body: {
                datasource: datasources[datasource],
                request: request,
                responseMapping,
            },
        });
    };

    const handleResponse = (type, key, newData, successStates, errorStates) => (
        subscriptionId,
        topic,
        eventData,
        closure
    ) => {
        const isSuccess = successStates.includes(eventData.value);
        const isError = errorStates.includes(eventData.value);
        if (isSuccess || isError) {
            if (isSuccess) {
                if (type === 'delete') {
                    setData(data.filter((item) => item.key !== key));
                    setDeletingKey(null);
                } else {
                    const finalData = newData?.map((item) => {
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
                notification['success']({
                    message: `${
                        type.charAt(0).toUpperCase() + type.slice(1)
                    } Authorized User`,
                    description: `Successfully ${
                        type === 'add' ? `${type}ed` : `${type}d`
                    } the authorized user!`,
                });
            }
            if (isError) {
                notification['error']({
                    message: `${
                        type.charAt(0).toUpperCase() + type.slice(1)
                    } Authorized User`,
                    description:
                        eventData?.event?.data?.message ||
                        `Error while ${type} authorized user!`,
                });
            }
            setLoading(false);
            MessageBus.unsubscribe(subscriptionId);
        }
    };

    const columns = [
        {
            title: 'First Name *',
            dataIndex: 'firstName',
            editable: true,
        },
        {
            title: 'Last Name *',
            dataIndex: 'lastName',
            editable: true,
        },
        {
            title: 'Middle Intial',
            dataIndex: 'middleInitial',
            editable: true,
        },
        {
            title: 'Suffix',
            dataIndex: 'suffix',
            editable: true,
        },
        {
            title: '',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable && !record?.new ? (
                    <span>
                        <a
                            href="#!"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </a>
                        <Popconfirm
                            title="Sure to cancel?"
                            onConfirm={cancel}
                            okText="yes"
                            cancelText="No"
                        >
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Button
                            type="link"
                            shape="circle"
                            disabled={
                                (deletingKey ||
                                    editingKey !== '' ||
                                    addKey !== '') &&
                                !record.new
                            }
                            onClick={() => {
                                if (record?.new) {
                                    setData(
                                        data.filter(
                                            (item) => item.key !== record?.key
                                        )
                                    );
                                    setEditingKey('');
                                    setAddKey('');
                                    setSelectedRowKeys([]);
                                    setDeletingKey(null);
                                } else {
                                    setSelectedRowKeys([`${record.key}`]);
                                    setDeletingKey(record.key);
                                }
                            }}
                            icon={<DeleteOutlined />}
                        />
                        <Button
                            type="link"
                            shape="circle"
                            disabled={
                                deletingKey || editingKey !== '' || record?.new
                            }
                            onClick={() => edit(record)}
                            icon={<EditOutlined />}
                        />
                    </>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const handleSearch = (value) => {
        setSearchText(value);
    };

    const filteredData = data?.filter(
        ({ firstName, lastName }) =>
            searchText === '' ||
            firstName?.toLowerCase()?.includes(searchText?.toLowerCase()) ||
            lastName?.toLowerCase()?.includes(searchText?.toLowerCase())
    );

    return (
        <div className="px-1">
            {!showAuthUsers ? (
                <Alert
                    message={`Authorized Users flow is disabled ${
                        reasons?.length > 0
                            ? `due to ${reasons.toString()}`
                            : ''
                    }`}
                    type="info"
                    showIcon
                />
            ) : (
                <>
                    <Col span={24}>
                        <Row className="mb-2 justify-content-space-between">
                            <Col>
                                <Input
                                    placeholder="Search By name"
                                    suffix={
                                        <SearchOutlined
                                            style={{
                                                color: 'rgba(0, 0, 0, 0.45)',
                                            }}
                                        />
                                    }
                                    value={searchText}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Row>
                        <Col span={24}>
                            <div className="table-wrapper">
                                <Form form={form} component={false}>
                                    <Table
                                        loading={loading}
                                        className="authorized-users-table"
                                        components={{
                                            body: {
                                                cell: EditableCell,
                                            },
                                        }}
                                        bordered
                                        dataSource={filteredData || []}
                                        columns={mergedColumns}
                                        rowClassName="editable-row"
                                        expandable={{
                                            expandedRowKeys: selectedRowKeys,
                                            expandedRowRender: (record) => {
                                                return record?.key ===
                                                    deletingKey ? (
                                                    <div className="expandable-row-container">
                                                        <div className="expandable-row-item">
                                                            <div className="port-protect-proceed-text">
                                                                Delete "
                                                                {
                                                                    record?.firstName
                                                                }{' '}
                                                                {
                                                                    record?.lastName
                                                                }
                                                                " from the
                                                                authorized user
                                                                list?
                                                            </div>
                                                            <div className="port-protect-text">
                                                                This user will
                                                                be immediately
                                                                deleted. You
                                                                can't undo this
                                                                action
                                                            </div>
                                                            <div
                                                                style={{
                                                                    float:
                                                                        'right',
                                                                }}
                                                            >
                                                                <Button
                                                                    style={{
                                                                        marginRight: 12,
                                                                    }}
                                                                    type="primary"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            record.key
                                                                        )
                                                                    }
                                                                >
                                                                    Delete
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        setSelectedRowKeys(
                                                                            []
                                                                        );
                                                                        setAddKey(
                                                                            ''
                                                                        );
                                                                        setDeletingKey(
                                                                            null
                                                                        );
                                                                    }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    record?.key === addKey && (
                                                        <div className="expandable-row-container">
                                                            <div className="expandable-row-item">
                                                                <div>
                                                                    By checking
                                                                    this box,
                                                                    you
                                                                    acknowledge
                                                                    that the
                                                                    customer
                                                                    understands
                                                                    that any
                                                                    designated
                                                                    Authorized
                                                                    Users will
                                                                    have access
                                                                    to the
                                                                    account,
                                                                    including
                                                                    the ability
                                                                    to make
                                                                    authorized
                                                                    payments and
                                                                    account
                                                                    changes.
                                                                </div>
                                                                <Checkbox
                                                                    checked={
                                                                        check
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setCheck(
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        )
                                                                    }
                                                                >
                                                                    Yes, I
                                                                    acknowledge
                                                                    this message
                                                                </Checkbox>
                                                                <div>
                                                                    <Button
                                                                        style={{
                                                                            marginTop: 8,
                                                                        }}
                                                                        disabled={
                                                                            !check
                                                                        }
                                                                        type="primary"
                                                                        onClick={() =>
                                                                            save(
                                                                                record?.key,
                                                                                'add'
                                                                            )
                                                                        }
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                );
                                            },
                                        }}
                                        locale={{
                                            emptyText:
                                                error ||
                                                'No authorized users found!',
                                        }}
                                        pagination={false}
                                    />
                                    <Button
                                        disabled={
                                            addKey !== '' ||
                                            deletingKey ||
                                            editingKey !== '' ||
                                            data?.length >=
                                                maxAuthorizedUsersLength
                                        }
                                        style={{ border: 'none' }}
                                        icon={<PlusCircleOutlined />}
                                        onClick={handleAdd}
                                    >
                                        Add Authorized User
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                    <Divider dashed className="mt-2" />
                </>
            )}
        </div>
    );
}
