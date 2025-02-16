import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import styled from 'styled-components';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const ErrorDashboard = () => {
    const [errors, setErrors] = useState([]);

    const fetchErrors = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/error-capture/errors');
            setErrors(response.data);
            console.log('RESPONSE ::', response.data);
        } catch (error) {
            console.error('Error fetching errors:', error);
        }
    };

    useEffect(() => {
        fetchErrors();
        socket.on('newError', (newError) => {
            setErrors(prevErrors => [newError, ...prevErrors]);
        });

        return () => {
            socket.off('newError');
        };
    }, []);

    const columns = React.useMemo(
        () => [
            {
                Header: 'Timestamp',
                accessor: 'timestamp',
                Cell: ({ cell: { value } }) => new Date(value).toLocaleString(),
            },
            {
                Header: 'Service Name',
                accessor: 'serviceName',
            },
            {
                Header: 'Error Message',
                accessor: 'errorMessage',
            },
            {
                Header: 'Stack Trace',
                accessor: 'stackTrace',
                Cell: ({ cell: { value } }) => (
                    <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{value}</pre>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: errors });


    return (
        <div>
            <h1>Error Dashboard</h1>
            <Table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
`;

export default ErrorDashboard;