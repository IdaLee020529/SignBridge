import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginInput from "../../../components/LoginInput/LoginInput";
import { UserForgotPassword } from "../../../services/account.service";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();  // For the redirection
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      validateEmail(e.target.value);
    };

    // get token from cookies, if exist, redirect to home
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            navigate("/");
        }
    }, [navigate]);        

    const validateEmail = (value: string) => {
		let error = "";
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!value.trim()) {
			error = "Email is required";
			setEmailError("Email is required");
			return error;
		} else if (!emailRegex.test(value)) {
			setEmailError("Invalid email format");
			return error;
		}
		setEmailError("");
		return error;
	};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const emailErrors = validateEmail(email);

        let errorMessage = "";
        if (emailErrors.length > 0) errorMessage += `- ${emailErrors}\n`;

        let data; 
        if (emailErrors.length === 0){
            data = {
                email
            };
            setLoading(true);
        
            try {
                const response = await UserForgotPassword(data); 
                toast.success(response.data.message); 
            } catch (error: any) { 
                toast.error(error.response.data.error);
            } finally {
                setLoading(false);
            }
        } else {
            toast.error(errorMessage);
        }
    };

    return (
        <div className="sign-up-container">
        <h1>Forgot Password</h1>
            <div className="sign-up-form">
                <form onSubmit={handleSubmit}>
                    <LoginInput
                        label="Email"
                        type="email"
                        placeholder=""
                        value={email}
                        onChange={handleEmailChange}
                        error={emailError}
                    />
                    
                    <button className="sign-up-btn" type="submit" disabled={loading}>
                        {loading ? <><i className="fa fa-spinner fa-spin"></i> Loading</> : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
