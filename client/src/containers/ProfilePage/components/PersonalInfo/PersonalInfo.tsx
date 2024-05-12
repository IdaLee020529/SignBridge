import { useState, useEffect } from 'react';
import style from './PersonalInfo.module.css';
import Cookies from "js-cookie";
import { GetUserByEmail } from '../../../../services/account.service';
import { useTranslation } from "react-i18next";

type User = {
    username: string;
    email: string;
    picture: string;
    role_access: string;
    user_id: number;
    acc_type: string;
    email_verified: boolean;
    created_at: string;
};

const PersonalInfo = () => {
    const { t, i18n } = useTranslation();
    const email = Cookies.get("email") ?? "";
    const [user, setUser] = useState<User | null>(null);

    const fetchUser = async (email: string) => {
        try {
            const response = await GetUserByEmail(email);
            setUser(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUser(email);
    }, []);

    // format the created_at to Month, year
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const [month, year] = formattedDate.split(' ');
        return `${month}, ${year}`;
    };  
    
    return (
        <div className={style.personalInfoContainer}>
            <div className={style.personalInfoBox}>
                <img src={user?.picture} alt="Profile Picture" className={style.profilePicture} />
                <div className={style.personalInfo}>
                    <h1 className={style.name}>{user?.username}</h1>
                    <p className={style.email}>{user?.email}</p>
                    {/* <button className={style.editButton}>Edit Profile</button> */}
                    <p className={style.joined}>{t("joinedOn")} {formatDate(user?.created_at ?? '')}</p>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;