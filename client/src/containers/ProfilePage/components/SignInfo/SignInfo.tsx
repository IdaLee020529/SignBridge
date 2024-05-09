import style from './SignInfo.module.css';
import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { GetUserByEmail, FetchDatasetByUserId, FetchAllDataset } from "../../../../services/account.service";
import { redirect } from 'react-router-dom';

type publicTableData = {
    no: number;
    text_sentence: string;
    status_SE: string;
    submitted_time: string;
}

const SignInfo = () => {
    const email = Cookies.get("email");
    const [roleAccess, setRoleAccess] = useState(""); 
    // For public
    const [submittedValue, setSubmittedValue] = useState(0);
    const [pendingValue, setPendingValue] = useState(0);
    const [acceptedValue, setAcceptedValue] = useState(0);
    const [rejectedValue, setRejectedValue] = useState(0);
    const [publicTableData, setPublicTableData] = useState([]);
    // For sign expert
    const [newTextValue, setNewTextValue] = useState(0);
    const [inProgressValue, setInProgressValue] = useState(0);
    const [awaitingVerificationValue, setAwaitingVerificationValue] = useState(0);
    // For admin
    const [newTaskValue, setNewTaskValue] = useState(0);
    const [waitingVerificationValue, setWaitingVerificationValue] = useState(0);

    async function getSignInfoforPublic() { 
        const user = await GetUserByEmail(email ?? "");
        setRoleAccess(user.data.role_access);
        
        const dataset = await FetchDatasetByUserId(user.data.user_id);
        setPublicTableData(dataset.data);

        setSubmittedValue(dataset.data.filter((data: any) => data.status_SE).length);
        setPendingValue(dataset.data.filter((data: any) => data.status_SE === "New").length);
        setAcceptedValue(dataset.data.filter((data: any) => data.status_SE === "Awaiting Accept" || data.status_SE === "In Progress" || data.status_SE === "Awaiting Verification" || data.status_SE === "Rejected" || data.status_SE === "Verified").length);
        setRejectedValue(dataset.data.filter((data: any) => data.status_SE === "Cancelled").length);
    };

    async function getSignInfoforSignExpert() {
        const dataset = await FetchAllDataset();

        setNewTextValue(dataset.data.filter((data: any) => data.status_SE === "New").length);
        setInProgressValue(dataset.data.filter((data: any) => data.status_SE === "In Progress").length);
        setAwaitingVerificationValue(dataset.data.filter((data: any) => data.status_SE === "Awaiting Verification").length);
    };

    async function getSignInfoforAdmin() {
        const dataset = await FetchAllDataset();

        setNewTaskValue(dataset.data.filter((data: any) => data.status_Admin === "New").length);
        setWaitingVerificationValue(dataset.data.filter((data: any) => data.status_Admin === "Awaiting Verification").length);
    }

    useEffect(() => {
        getSignInfoforPublic();
        getSignInfoforSignExpert();
        getSignInfoforAdmin();
    }, []);

    // For the table
    const columnHelper = createColumnHelper<publicTableData>()

    const columns = [
        columnHelper.accessor('no', {
            header: () => 'No',
            cell: info => info.row.index + 1,
        }),

        columnHelper.accessor('text_sentence', {
            header: () => 'Sign Text',
            cell: info => (
                <div>
                    {info.getValue()}
                </div>
            )
            ,
        }),

        // you can use different approach here
        columnHelper.accessor(row => row.status_SE, {
            id: 'status',
            cell: info => <div className={style.tableStatusCell} style={
                ["In Progress", "Awaiting Accept", "Awaiting Verification", "Verified", "Rejected"].includes(info.getValue()) ? {backgroundColor: "#32CD32"} :
                ["New"].includes(info.getValue()) ? {backgroundColor: "#FFD700"} : {backgroundColor: "#FF6A55"}
            }>{
                ["In Progress", "Awaiting Accept", "Awaiting Verification", "Verified", "Rejected"].includes(info.getValue()) ? "Approved" :
                ["New"].includes(info.getValue()) ? "Pending" : "Rejected"
            }</div>,

            header: () => <div>Status</div>,
        }),
        columnHelper.accessor('submitted_time', {
            header: () => 'Date',
            cell: info => new Date(info.getValue()).toLocaleString(),
        })
    ]

    const table = useReactTable({
        data: publicTableData.reverse(),
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    
    return (
        <>
            {roleAccess === "public" ? (
                <div className={style.horizontalContainer}>
                    <div className={style.signInfoContainer}>
                        <div className={style.slot}>
                            <h1 className={style.title}>Submitted</h1>
                            <p className={style.number}>{submittedValue}</p>
                        </div>
                        <div className={style.divider}></div>
                        <div className={style.slot}>
                            <h1 className={style.title}>Pending</h1>
                            <p className={style.number}>{pendingValue}</p>
                        </div>
                        <div className={style.divider}></div>
                        <div className={style.slot}>
                            <h1 className={style.title}>Approved</h1>
                            <p className={style.number}>{acceptedValue}</p>
                        </div>
                        <div className={style.divider}></div>
                        <div className={style.slot}>
                            <h1 className={style.title}>Rejected</h1>
                            <p className={style.number}>{rejectedValue}</p>
                        </div>
                    </div>
                </div>
            ) : roleAccess === "signexpert" ? (
                <div className={style.horizontalContainer}>
                    <div className={style.signInfoContainer}>
                        <div className={style.slot}>
                            <h1 className={style.title}>New Text</h1>
                            <p className={style.number}>{newTextValue}</p>
                        </div>
                        <div className={style.divider}></div>
                        <div className={style.slot}>
                            <h1 className={style.title}>In progress</h1>
                            <p className={style.number}>{inProgressValue}</p>
                        </div>
                        <div className={style.divider}></div>
                        <div className={style.slot}>
                            <h1 className={style.title}>Awaiting Verification</h1>
                            <p className={style.number}>{awaitingVerificationValue}</p>
                        </div>
                    </div>
                </div>
            ) : roleAccess === "admin" ? (
                <div className={style.horizontalContainer}>
                    <div className={style.signInfoContainer}>
                        <div className={style.slot}>
                            <h1 className={style.title}>New Task</h1>
                            <p className={style.number}>{newTaskValue}</p>
                        </div>
                        <div className={style.divider}></div>
                        <div className={style.slot}>
                            <h1 className={style.title}>Waiting Verification</h1>
                            <p className={style.number}>{waitingVerificationValue}</p>
                        </div>
                    </div>
                </div>
            ) : null}

            {publicTableData.length === 0 && roleAccess === "public" && (
                <div className={style.signTextTableContainer}>
                    <div>
                        <p>No data available. Submit the <a href="/dataset-collection" className={style.linkRedirect}><span>dataset collection form</span></a> to share your words.</p>
                    </div>
                </div>
            )}

            {publicTableData.length !== 0 && (
                <div className={style.signTextTableContainer}>
                    <div className={style.table}>
                        {/* Table header */}
                        {table.getHeaderGroups().map((headerGroup) => (
                            <div
                                key={headerGroup.id}
                                className={style.tableRow}
                            >
                            {headerGroup.headers.map((header) => (
                                <div
                                    key={header.id}
                                    className={style.tableColumn}
                                >
                                {header.isPlaceholder ? null : (
                                    <div
                                    {...{
                                        className: header.column.getCanSort()
                                        ? 'cursor-pointer select-none flex min-w-[36px]'
                                        : '',
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}
                                    >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {{
                                        asc: <span className="pl-2">↑</span>,
                                        desc: <span className="pl-2">↓</span>,
                                    }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                )}
                                </div>
                            ))}
                            </div>
                        ))}
                        
                        {/* Table body */}
                        {table.getRowModel().rows.map(row => (
                            <div key={row.id} className={style.tableRow}>
                                {row.getVisibleCells().map(cell => (
                                    <div key={cell.id} className={style.tableColumn}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default SignInfo;
