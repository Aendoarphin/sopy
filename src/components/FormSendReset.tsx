import { Link } from "react-router";
import { useState } from "react";
import { validateEmail } from "../scripts/helper";
import supabase from "../utils/supabase";
import supabaseAdmin from "../utils/supabase-admin";

const FormSendReset = () => {
	const [isEmail, setIsEmail] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [userExists, setUserExists] = useState<boolean>(false);

	const sendUserEmailReset = async (e: React.FormEvent) => {
		e.preventDefault();
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: "http://localhost:5173/auth/reset-password",
		});
    setMessage("");
    setErrorMessage("");
		if (error) {
			setErrorMessage(error.message);
      return;
		}
		if (!userExists) {
			const {
				data: { users },
			} = await supabaseAdmin.auth.admin.listUsers();
			const user = users.find((user) => user.email === email);
			if (user) {
				setUserExists(true);
      } else {
        setErrorMessage("Email is not associated with any account.");
      }
      return;
		}
		localStorage.setItem("reset-email", email);
		setMessage("Email was sent to " + email);
		(document.getElementById("email") as HTMLInputElement).value = "";
	};

	return (
		<>
			<form onSubmit={sendUserEmailReset}>
				<div className="flex w-min text-nowrap mx-auto items-baseline gap-2 mt-20">
					<h3 className="font-semibold">S O P Y</h3>
					<p className="font-semibold">File Store</p>
				</div>
				<div className="flex flex-col mt-20 mx-auto items-center gap-4 p-8 rounded-sm bg-neutral-200 w-74">
					<h4 className="font-semibold text-center">Reset Password</h4>
					<div className="text-sm mx-6">
						Enter your email and we we'll send you a link to reset.
					</div>
					{message !== "" && (
						<div className="text-green-600 text-xs mx-6">{message}</div>
					)}
					{errorMessage !== "" && (
						<div className="text-red-600 text-xs mx-6">{errorMessage}</div>
					)}
					<input
						onChange={(e) => {
							setEmail(e.target.value);
							setIsEmail(validateEmail(e.target.value));
						}}
						id="email"
						type="email"
						placeholder="Email"
						required
						className="border-neutral-400 border-b focus:outline-none focus:border-black"
					/>
					<div className="flex justify-between w-46">
						<Link
							to="/auth"
							className="text-neutral-500 text-xs underline mx-auto"
						>
							Back to Sign In
						</Link>
					</div>
					<input
						disabled={!isEmail}
						type="submit"
						value="Send Reset Link"
						className="bg-black cursor-pointer text-white p-2 rounded px-10 disabled:contrast-50"
					/>
				</div>
			</form>
		</>
	);
};

export default FormSendReset;
