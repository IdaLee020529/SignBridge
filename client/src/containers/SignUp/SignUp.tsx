import "./SignUp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { gapi } from "gapi-script";
import LoginInput from "../../components/LoginInput/LoginInput";
import { SignUpUser, FetchGoogleData, SignUpUserGoogle, LoginUserGoogle } from "../../services/account.service";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const clientId = "52594958094-08qvrugskhjjv34j4h0oi4m2ognjg830.apps.googleusercontent.com";

function SignUp() {
	const navigate = useNavigate(); // For the redirection

	// ---------- Define the variables ----------
	const [username, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(e.target.value);
		validateUsername(e.target.value);
	};

	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
		validateEmail(e.target.value);
	};

	const [password, setPassword] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(e.target.value);
		validatePassword(e.target.value);
	};

	const [confirmPassword, setconfirmPassword] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setconfirmPassword(e.target.value);
		validateConfirmPassword(e.target.value);
	};

	const [loading, setLoading] = useState(false);

	// ---------- Toggle password visibility ----------
	const handleTogglePassword = () => {
		setShowPassword(!showPassword); // Toggle password visibility
	};

	const handleToggleConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword); // Toggle password visibility
	};

	// ---------- Validations ----------
	const validateUsername = (value: string) => {
		let error = "";
		if (value.length === 0) {
			setUsernameError("Username is required");
			error = "Username is required";
			return error;
		}

		if (!value.trim()) {
			setUsernameError("Username is required");
			error = "Username is required";
			return error;
		}

		setUsernameError("");
		return error;
	};

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

	const validatePassword = (value: string) => {
		let error = "";
		if (!value.trim()) {
			error = "Password is required";
			setPasswordError("Password is required");
			return error;
		} else if (password.length < 5) {
			error = "Password must be at least 6 characters long";
			setPasswordError("Password must be at least 6 characters long");
			return error;
		}
		setPasswordError("");
		return error;
	};

	const validateConfirmPassword = (value: string) => {
		let error = "";
		if (!value.trim()) {
			error = "Please confirm your password";
			setConfirmPasswordError("Please confirm your password");
			return error;
		} else if (value !== password) {
			error = "Confirm password does not match";
			setConfirmPasswordError("Confirm password does not match");
			return error;
		}

		setConfirmPasswordError("");
		return error;
	};

	// ---------- Handle form submission ----------
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate all fields and update state with error messages
		const usernameErrors = validateUsername(username);
		const emailErrors = validateEmail(email);
		const passwordErrors = validatePassword(password);
		const confirmPasswordErrors = validateConfirmPassword(confirmPassword);

		// Construct error message for fields that are invalid
		let errorMessage = "";
		if (usernameErrors.length > 0) errorMessage += `- ${usernameErrors}\n`;
		if (emailErrors.length > 0) errorMessage += `- ${emailErrors}\n`;
		if (passwordErrors.length > 0) errorMessage += `- ${passwordErrors}\n`;
		if (confirmPasswordErrors.length > 0) errorMessage += `- ${confirmPasswordErrors}\n`;

		if (usernameErrors.length === 0 && emailErrors.length === 0 && passwordErrors.length === 0 && confirmPasswordErrors.length === 0) {
			const data = {
				username,
				email,
				password,
			};
			setLoading(true);

			try {
				await SignUpUser(data);
				console.log("success");
				toast.success("Verification email sent. Please check your inbox to complete registration.");

				navigate("/login");
			} catch (error: any) {
				console.log("Error registering user:", error);
				toast.error(error.code);
			} finally {
				setLoading(false);
			}
		} else {
			toast.error("Form validation failed:\n" + errorMessage);
		}
	};

	// ---------- Initialize the google client ----------
	useEffect(() => {
		function initGapi() {
			gapi.client.init({
				clientId: clientId,
				scope: "email profile",
			});
		}
		gapi.load("client:auth2", initGapi);
	});

	// ---------- Used for the google sign up button ----------
	const login = useGoogleLogin({
		onSuccess: async credentialResponse => {
			try {
				// save the token in the cookies with name "token"
				// document.cookie = `token=${credentialResponse.access_token}`;
				Cookies.set("token", credentialResponse.access_token, { expires: 30 });

				const res = await FetchGoogleData(credentialResponse.access_token);
				console.log(res);

				// save the name into the cookies
				Cookies.set("name", res.data.name, { expires: 30 });
				Cookies.set("email", res.data.email, { expires: 30 });
				Cookies.set("picture", res.data.picture, { expires: 30 });

				await SignUpUserGoogle(res.data);

				const loginResponse = await LoginUserGoogle(res.data);
				console.log("loginResponse", loginResponse);
				Cookies.set("role_access", loginResponse.data.role_access, { expires: 30 });

				toast.success("Signup successful");
				navigate("/");
			} catch (e) {
				toast.error("Signup failed");
				console.error(e);
			}
		},
		onError: () => {
			toast.error("Signup failed");
		},
	});

	return (
		<div className="sign-up-container">
			<h1>Sign Up</h1>
			<div className="sign-up-form">
				<form onSubmit={handleSubmit}>
					<div className={`login-form-group ${usernameError ? "error" : ""}`}>
						<input type="text" placeholder="" value={username} onChange={handleUsernameChange} />
						<label htmlFor="inp" className="login-form-label">
							Username
						</label>
						{usernameError && <div className="login-error-message">{usernameError}</div>}
					</div>

					<LoginInput type="email" placeholder=" " value={email} onChange={handleEmailChange} error={emailError} label="Email" />

					<LoginInput
						type={showPassword ? "text" : "password"}
						placeholder=" "
						value={password}
						onChange={handlePasswordChange}
						error={passwordError}
						label="Password"
						showPassword={showPassword}
						handleTogglePassword={handleTogglePassword}
					/>

					<LoginInput
						type={showConfirmPassword ? "text" : "password"}
						placeholder=" "
						value={confirmPassword}
						onChange={handleConfirmPasswordChange}
						error={confirmPasswordError}
						label="Confirm Password"
						showPassword={showConfirmPassword}
						handleTogglePassword={handleToggleConfirmPassword}
					/>

					<button className="sign-up-btn" type="submit" disabled={loading}>
						{loading ? (
							<>
								<i className="fa fa-spinner fa-spin"></i> Loading
							</>
						) : (
							"Sign Up"
						)}
					</button>

					<div>or</div>

					<button className="google-sign-up-btn" type="button" onClick={() => login()}>
						<img src="/images/google-logo.png" alt="Google Logo" className="google-logo" />
						Sign Up with Google
					</button>

					<div className="login-link">
						<div>Already have an account?</div> <a href="/login">Login Here</a>
					</div>
				</form>
			</div>
		</div>
	);
}

export default SignUp;
