import style from './ProfilePage.module.css';
import { useEffect, useState } from 'react';
import PersonalInfo from './components/PersonalInfo/PersonalInfo';
import AccountForm from './components/AccountForm/AccountForm';
import SignInfo from './components/SignInfo/SignInfo';
import AdminStatistic from './components/AdminStatistic/AdminStatistic';
import * as Tabs from '@radix-ui/react-tabs';
import Cookies from "js-cookie";
import { GetUserByEmail, } from "../../services/account.service";


const ProfilePage = () => {
  const email = Cookies.get("email");
  const [roleAccess, setRoleAccess] = useState("");

  async function getRoleAccess() {
    const response = await GetUserByEmail(email ?? "");
    setRoleAccess(response.data.role_access);
  }

  useEffect(() => {
    getRoleAccess();
  }, []);

  return (
    <div className={style.profilePageContainer}>
        <div className={style.profileContentContainer}>
          <div className={style.PersonalInfoContainer}>
              <PersonalInfo />
          </div>
          <div className={style.SignInfoContainer}>
              <Tabs.Root defaultValue='account'>
                <Tabs.List className={style.TabsList}>
                  <Tabs.Trigger className={style.TabsTrigger} value='account'>Account</Tabs.Trigger>
                  {(roleAccess === "public" || roleAccess === "signexpert") && (
                    <Tabs.Trigger className={style.TabsTrigger} value='SignInfo'>Sign Text</Tabs.Trigger>
                  )}
                  {roleAccess === "admin"  && (
                    <Tabs.Trigger className={style.TabsTrigger} value='Statistic'>Statistic</Tabs.Trigger>
                  )}
                  {/* <Tabs.Trigger className={style.TabsTrigger} value='form'>Form</Tabs.Trigger>
                  <Tabs.Trigger className={style.TabsTrigger} value='score'>Score</Tabs.Trigger>
                  <Tabs.Trigger className={style.TabsTrigger} value='notification'>Notification</Tabs.Trigger> */}
                </Tabs.List>
                <Tabs.Content value='account'>
                  <AccountForm />
                </Tabs.Content>
                <Tabs.Content value='SignInfo'>
                  <SignInfo />
                </Tabs.Content>
                <Tabs.Content value='Statistic'>
                  <AdminStatistic />
                </Tabs.Content>
              </Tabs.Root>
          </div>
        </div>
    </div>
  );
};

export default ProfilePage;