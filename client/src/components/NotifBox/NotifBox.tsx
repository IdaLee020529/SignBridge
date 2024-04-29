import style from "./NotifBox.module.css";
import Checkbox from '@mui/material/Checkbox';

interface NotifBoxProps {
  sender_username: string;
  sender_avatar: string;
  message: string;
  created_at: string;
  sign_text: string;
  status: number;
  checked: boolean;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NotifBox: React.FC<NotifBoxProps> = ({
  sender_username,
  sender_avatar,
  message,
  created_at,
  sign_text,
  status,
  checked,
  handleCheckboxChange,
}) => {
  return (
    <div className={style.notifItem}>
      <div className={style.notifCheckbox}>
        <Checkbox checked={checked} onChange={handleCheckboxChange} />
      </div>
      <div className={style.notifAvatar}>
        <img src={sender_avatar} alt="avatar" />
      </div>
      <div className={style.notifContent}>
        <div className={style.notifHeader}>
          <p className={style.notifTitle}>
            {sender_username}
            <span> {message}</span>
          </p>
          <p className={style.notifDate}>{created_at}</p>
        </div>
        <p className={style.notifText}>Text: {sign_text}</p>
      </div>
      <div className={style.notifIcon}>
        <div
          className={style.newDot}
          style={{
            backgroundColor: status === 0 ? 'rgb(63, 140, 255)' : 'transparent',
          }}
        ></div>
      </div>
    </div>
  );
};

export default NotifBox;