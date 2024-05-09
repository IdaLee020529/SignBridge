import React, { useEffect, useState } from "react";
import style from "./Notification.module.css";
import NotifBox from "../../components/NotifBox/NotifBox";
import NotifFilter from "../../components/NotifFilter/NotifFilter";
import { useNotificationFilterStore } from "../../store/notificationFilter";
import Cookies from "js-cookie";
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { toast } from "react-hot-toast";
import { CreateNotification, GetUserIdByEmail, GetNotificationsById, GetSenderInfoBySenderId, DeleteNotification, UpdateNotificationStatus } from "../../services/notification.service";

let isUndoing = false

const Notification: React.FC = () => {
  // const roleAccess = Cookies.get("role_access");
  const email = Cookies.get("email");
  const [userIds, setUserIds] = useState("");
  const useFilterStore = useNotificationFilterStore();

  //  used for sending notification
  const [notification, setNotification] = useState({
    receiver_id: 2,
    sender_id: 0,
    message: "",
    sign_text: "",
    status: 0,
    type: "",
    type_value: "",
    created_at: "",
    notification_id: 0,
  });

  const filterData = () => {
    let newData: any[] = [];

    if (useFilterStore.filter.includes("newtask")){
      // add the data that has newtask value
      for (let i = 0; i < useFilterStore.data.length; i++) {
        if (useFilterStore.data[i].type_value === "newtask") {
          newData.push(useFilterStore.data[i]);
        }
      }
    }

    if (useFilterStore.filter.includes("accepted")) {
      // add the data that has accepted value, it should be added to the new data instead of replacing it
      for (let i = 0; i < useFilterStore.data.length; i++) {
        if (useFilterStore.data[i].type_value === "accepted") {
          newData.push(useFilterStore.data[i]);
        }
      }
    }

    if (useFilterStore.filter.includes("rejected")){
      // add the data that has rejected value, it should be added to the new data instead of replacing it
      for (let i = 0; i < useFilterStore.data.length; i++) {
        if (useFilterStore.data[i].type_value === "rejected") {
          newData.push(useFilterStore.data[i]);
          
        }
      }
    }

    if (useFilterStore.filter.includes("newtext")){
      // add the data that has newtext value
      for (let i = 0; i < useFilterStore.data.length; i++) {
        if (useFilterStore.data[i].type_value === "newtext") {
          newData.push(useFilterStore.data[i]);
        }
      }
    }

    if (useFilterStore.filter.includes("waitingforverification")){
      // add the data that has waitingforverification value
      for (let i = 0; i < useFilterStore.data.length; i++) {
        if (useFilterStore.data[i].type_value === "waitingforverification") {
          newData.push(useFilterStore.data[i]);
        }
      }
    }

    newData = newData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    useFilterStore.setModifiedData(newData);
  }

  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  let timerId: NodeJS.Timeout | null = null;

  // get user_id by email (for sending notification sender_id)
  useEffect(() => {
    const getUserId = async () => {
      const res = await GetUserIdByEmail(email);
      setUserIds(res.data);
      setNotification(prev => ({...prev, sender_id: parseInt(res.data)}));
      console.log(userIds);
    };
    getUserId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      console.log("isUndoing: ", isUndoing);
      if (isUndoing) {
        console.log("Undoing...");
        return () => clearInterval(interval);
      }

      try {
        const userIdResponse = await GetUserIdByEmail(email);
        const notificationsResponse = await GetNotificationsById(parseInt(userIdResponse.data));
        const notificationsWithUsernames = await Promise.all(
          notificationsResponse.data.map(async (notification: any) => {
            const senderInfo = await GetSenderInfoBySenderId(notification.sender_id);
            return { ...notification, sender_username: senderInfo.data.username, sender_avatar: senderInfo.data.picture};
          })
        );
        // Sort the notifications by the 'created_at' field in descending order
        let data = notificationsWithUsernames.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        useFilterStore.setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterData();
  }, [useFilterStore.data])

  const formatDate = (date: string) => {
    const today = new Date();
    const newDate = new Date(date);
    if (
      today.getDate() === newDate.getDate() &&
      today.getMonth() === newDate.getMonth() &&
      today.getFullYear() === newDate.getFullYear()
    ) {
      return new Date(date).toLocaleTimeString();
    } else {
      return new Date(date).toLocaleDateString();
    }
  };

  // const handleAdminButtonClick = async () => {
  //   console.log("Admin upload");
  //   try {
  //     const notificationData = {
  //       receiver_id: 2,
  //       sender_id: parseInt(userIds),
  //       message: "has uploaded the avatar.",
  //       sign_text: "acceptlala",
  //       status: 0,
  //       type: "Waiting for Verification",
  //       type_value: "waitingforverification",
  //       created_at: new Date().toISOString(),
  //     };
  //     console.log(userIds);
  //     await CreateNotification(notificationData);
  //     toast.success("Notification sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //     toast.error("Failed to send notification.");
  //   }
  // };

  // const handleSignExpertAcceptPublicButtonClick = async () => {
  //   console.log("Sign Expert Accept Public");
  //   try {
  //     const notificationData = {
  //       receiver_id: 4,
  //       sender_id: parseInt(userIds),
  //       message: "has accepted your text.",
  //       sign_text: "acceptlala",
  //       status: 0,
  //       type: "Text Verification",
  //       type_value: "accepted",
  //       created_at: new Date().toISOString(),
  //     };
  //     console.log(userIds);
  //     await CreateNotification(notificationData);
  //     toast.success("Notification sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //     toast.error("Failed to send notification.");
  //   }
  //   try {
  //     const notificationData = {
  //       receiver_id: 1,
  //       sender_id: parseInt(userIds),
  //       message: "has assigned new text.",
  //       sign_text: "acceptlala",
  //       status: 0,
  //       type: "New Task",
  //       type_value: "newtask",
  //       created_at: new Date().toISOString(),
  //     };
  //     console.log(userIds);
  //     await CreateNotification(notificationData);
  //     toast.success("Notification sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //     toast.error("Failed to send notification.");
  //   }
  // };

  // const handleSignExpertRejectPublicButtonClick = async () => {
  //   console.log("Sign Expert Reject Public");
  //   try {
  //     const notificationData = {
  //       receiver_id: 4,
  //       sender_id: parseInt(userIds),
  //       message: "has rejected your text.",
  //       sign_text: "rejectlala",
  //       status: 0,
  //       type: "Text Verification",
  //       type_value: "rejected",
  //       created_at: new Date().toISOString(),
  //     };
  //     console.log(userIds);
  //     await CreateNotification(notificationData);
  //     toast.success("Notification sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //     toast.error("Failed to send notification.");
  //   }
  // };

  // const handleSignExpertAcceptAdminButtonClick = async () => {
  //   console.log("Sign Expert Accept Admin");
  //   try {
  //     const notificationData = {
  //       receiver_id: 1,
  //       sender_id: parseInt(userIds),
  //       message: "has accepted your avatar.",
  //       sign_text: "acceptlala",
  //       status: 0,
  //       type: "Task Confirmation",
  //       type_value: "accepted",
  //       created_at: new Date().toISOString(),
  //     };
  //     console.log(userIds);
  //     await CreateNotification(notificationData);
  //     toast.success("Notification sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //     toast.error("Failed to send notification.");
  //   }
  // };

  // const handleSignExpertRejectAdminButtonClick = async () => {
  //   console.log("Sign Expert Reject Admin");
  //   try {
  //     const notificationData = {
  //       receiver_id: 1,
  //       sender_id: parseInt(userIds),
  //       message: "has rejected your avatar.",
  //       sign_text: "rejectlala",
  //       status: 0,
  //       type: "Task Confirmation",
  //       type_value: "rejected",
  //       created_at: new Date().toISOString(),
  //     };
  //     console.log(userIds);
  //     await CreateNotification(notificationData);
  //     toast.success("Notification sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //     toast.error("Failed to send notification.");
  //   }
  // };

  // const handleSubmitButtonClick = async () => {
  //   console.log("Public Submit");
  //   try {
  //     const notificationData = {
  //       receiver_id: 2,
  //       sender_id: parseInt(userIds),
  //       message: "has submitted new text.",
  //       sign_text: "kaki",
  //       status: 0,
  //       type: "New Text",
  //       type_value: "newtext",
  //       created_at: new Date().toISOString(),
  //     };
  //     console.log(userIds);
  //     await CreateNotification(notificationData);
  //     toast.success("Notification sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //     toast.error("Failed to send notification.");
  //   }
  // };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Select all notifications
      const allNotificationIds = useFilterStore.modifiedData.map((notification) => notification.notification_id);
      setSelectedNotifications(allNotificationIds);
      console.log("allNotificationIds", allNotificationIds);
    } else {
      // Deselect all notifications
      setSelectedNotifications([]);
    }
  };

  // handle the delete icon function
  const handleDeleteNotification = async (notificationIds: number[]) => {
    isUndoing = true;
    handleDelete(notificationIds);
    try {
      const originalData = [...useFilterStore.modifiedData];
      const updatedData = useFilterStore.modifiedData.filter(notification => !notificationIds.includes(notification.notification_id));
      useFilterStore.setModifiedData(updatedData);

      toast.success((t) => (
        <span>
          Notification deleted successfully!
          <Button onClick={() => {
            useFilterStore.setModifiedData(originalData);
            handleUndo();
            toast.dismiss(t.id);
          }}>
            UNDO
          </Button>
        </span>
      ));
      
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification.");
    }
  };

  const handleDelete = async (notificationIds: number[]) => {
    if (!timerId) {
      const id = setTimeout(async () => {
        await DeleteNotification(notificationIds);
        timerId = null;
        isUndoing = false;
      }, 5000);
      timerId = id;
    }
  };

  const handleUndo = () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
      isUndoing = false;
    }
  };

  // handle the make as read icon function
  const handleMakeAsRead = async (notificationIds: number[]) => {
    try {
      await UpdateNotificationStatus(notificationIds, 1);
      toast.success("Notification marked as read successfully!");
    } catch (error) {
      console.error("Error updating notification status:", error);
      toast.error("Failed to mark notification as read.");
    }
  };

  return (
    <>
      <div className={style.notifocationBigContainer}>
        {/* ---------- Button ---------- */}
        {/* {roleAccess === "admin" && (
          <div className={style.buttonContainer}>
            <Button variant="contained" onClick={handleAdminButtonClick}>Upload</Button>
          </div>
        )}
        {roleAccess === "signexpert" && (
          <div className={style.buttonContainer}>
            <Button variant="contained" onClick={handleSignExpertAcceptPublicButtonClick}>Accept Public</Button>
            <Button variant="contained" onClick={handleSignExpertRejectPublicButtonClick}>Reject Public</Button>
            <Button variant="contained" onClick={handleSignExpertAcceptAdminButtonClick}>Accept Admin</Button>
            <Button variant="contained" onClick={handleSignExpertRejectAdminButtonClick}>Reject Admin</Button>
          </div>
        )}
        {roleAccess === "public" && (
          <div className={style.buttonContainer}>
            <Button variant="contained" onClick={handleSubmitButtonClick}>Submit</Button>
          </div>
        )} */}
        {/* ----------Dummy Buttons ---------- */}
        <div className={style.notifocationHeader}>
          <h1 className={style.notifocationHeaderText}>Notification</h1>
        </div>
        <div className={style.notifocationWholeContainer}>
          <NotifFilter/>
          <div className={style.notificationContainer}>
            {/* Tools container */}
            <div className={style.toolsContainer}>
              <div className={style.toolsItem}>
                <Tooltip title="Select All" arrow followCursor>
                  <Checkbox
                    checked={selectedNotifications.length === useFilterStore.modifiedData.length && useFilterStore.modifiedData.length > 0}
                    indeterminate={selectedNotifications.length > 0 && selectedNotifications.length < useFilterStore.modifiedData.length}
                    onChange={handleSelectAll}
                  />
                </Tooltip>
                <div className={style.toolsIcon}>
                  <Tooltip title="Delete" arrow followCursor>
                    <i className="fa-regular fa-trash-can" onClick={() => handleDeleteNotification(selectedNotifications)}></i>
                  </Tooltip>
                </div>
                <div className={style.toolsIcon}>
                  <Tooltip title="Make as read" arrow followCursor>
                    <i className="fa-regular fa-envelope-open" onClick={() => handleMakeAsRead(selectedNotifications)}></i>
                  </Tooltip>
                </div>
              </div>
            </div>
            {useFilterStore.modifiedData.length > 0 ? (
              useFilterStore.modifiedData.map((notification, index) => (
                <NotifBox
                  key={index}
                  sender_username={notification.sender_username}
                  sender_avatar={notification.sender_avatar}
                  message={notification.message}
                  created_at={formatDate(notification.created_at)}
                  sign_text={notification.sign_text}
                  status={notification.status}
                  checked={selectedNotifications.includes(notification.notification_id)}
                  handleCheckboxChange={(e) => {
                    if (e.target.checked) {
                      setSelectedNotifications([...selectedNotifications, notification.notification_id]);
                    } else {
                      setSelectedNotifications(selectedNotifications.filter((id) => id !== notification.notification_id));
                    }
                  }}
                />
              ))
            ) : (
              <div className={style.noNotificationsContainer}>
                <p>You don't have any notifications yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Notification;