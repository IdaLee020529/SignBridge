import * as React from 'react';
import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { fetchLogsByUser, deleteAllLogsByUser } from "../../services/communication.service";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material"; // Import Material-UI components
import styles from "../Library/Admin/LibraryAdmin.module.css";
import { toast } from "react-hot-toast";

type CommunicationlogProps = {
    userId: string;
    moduleType: string;
};

interface LogData {
    text: string;
    timestamp: string;
    log_id: number;
}

const Communicationlog: React.FC<CommunicationlogProps> = ({ userId, moduleType }) => {
    const [logs, setLogs] = useState<LogData[]>([]);

    useEffect(() => {
        const getLogs = async () => {
            try {
                const getData = {
                    module: moduleType,
                    user_id: userId,
                }
                const { data } = await fetchLogsByUser(getData);
                setLogs(data);
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        };

        getLogs();
    }, [moduleType, userId]);

    return (
        <List>
            {logs
                .sort((a, b) => b.log_id - a.log_id) // Sort logs by descending log_id
                .map((log) => (
                    <ListItem key={log.log_id} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {log.log_id}
                            </ListItemIcon>
                            <ListItemText primary={log.text} secondary={log.timestamp} />
                        </ListItemButton>
                    </ListItem>
                ))}
        </List>
    );
};

type Anchor = 'right';

const AnchorTemporaryDrawer: React.FC<CommunicationlogProps> = ({ userId, moduleType }) => {
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false); // State for delete confirmation dialog
    const [state, setState] = React.useState({
        right: false,
    });

    const confirmDeleteLogs = async () => {
        try {
            const delData = {
                module: moduleType,
                user_id: userId,
            }
            await deleteAllLogsByUser(delData);
            toast.success("History logs cleared successfully");
        } catch (error) {
            toast.error("Error deleting logs");
        } finally {
            setOpenDeleteConfirm(false);
        }
    };

    const toggleDrawer = (anchor: Anchor, open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
        >

<button onClick={() => setOpenDeleteConfirm(true)}>Delete All</button>
            <button onClick={toggleDrawer(anchor, false)}>Close</button>
            <Dialog className={styles.dialog_overlay} open={openDeleteConfirm} onClose={() => setOpenDeleteConfirm(false)}>
                <DialogContent className={styles.dialog_content2}>
                    <DialogTitle className={styles.dialog_title}>Confirm Delete</DialogTitle>
                    <DialogContentText className={styles.dialog_description2}>
                        Are you sure you want to delete this Category?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <div className={styles.buttonsConfirmation}>
                        <button
                            className={styles.noButton}
                            onClick={() => setOpenDeleteConfirm(false)}>No</button>
                        <button
                            className={styles.yesButton}
                            onClick={confirmDeleteLogs}>Yes</button>
                    </div>
                </DialogActions>
            </Dialog>

            <Divider />
            <Communicationlog userId={userId} moduleType={moduleType} />
        </Box>
    );

    return (
        <div>
            <React.Fragment key={'right'}>
                <button onClick={toggleDrawer('right', true)} className="communicationlog-btn">
                    <img
                        src="./images/history.png"
                        className="communicationlog-img"
                    />
                </button>
                <Drawer
                    anchor={'right'}
                    open={state['right']}
                    onClose={toggleDrawer('right', false)}
                >
                    {list('right')}
                </Drawer>
            </React.Fragment>
        </div>
    );
};

export default AnchorTemporaryDrawer;
