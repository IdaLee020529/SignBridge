import style from './SignInfo.module.css';

const SignInfo = () => {
    return (
        <div className={style.horizontalContainer}>
            <div className={style.signInfoContainer}>
                <div className={style.slot}>
                    <h1 className={style.title}>Submitted</h1>
                    <p className={style.number}>0</p>
                </div>
                <div className={style.divider}></div>
                <div className={style.slot}>
                    <h1 className={style.title}>Approved</h1>
                    <p className={style.number}>0</p>
                </div>
                <div className={style.divider}></div>
                <div className={style.slot}>
                    <h1 className={style.title}>Rejected</h1>
                    <p className={style.number}>0</p>
                </div>
            </div>
        </div>
    );
};

export default SignInfo;