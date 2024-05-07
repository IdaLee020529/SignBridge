import style from './ProfilePage.module.css';
import PersonalInfo from './components/PersonalInfo/PersonalInfo';
import AccountForm from './components/AccountForm/AccountForm';
import SignInfo from './components/SignInfo/SignInfo';
import * as Tabs from '@radix-ui/react-tabs';

const ProfilePage = () => {
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
                  <Tabs.Trigger className={style.TabsTrigger} value='SignInfo'>Sign Text</Tabs.Trigger>
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
                <Tabs.Content value='form'>
                  <div className={style.accountContent}>
                    <h1>Form</h1>
                  </div>
                </Tabs.Content>
                <Tabs.Content value='score'>
                  <div className={style.accountContent}>
                    <h1>Score</h1>
                  </div>
                </Tabs.Content>
                <Tabs.Content value='notification'>
                  <div className={style.accountContent}>
                    <h1>Notification</h1>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
          </div>
        </div>
    </div>
  );
};

export default ProfilePage;