import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import auth from "../../firebase/firebase.config";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
    const [registerError, setRegisterError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = (e) => {
        //! prevent reload the page when click on submit
        e.preventDefault();
        //! Reset Error
        setRegisterError("");
        //! Reset Success
        setSuccess("");

        const name = e.target.NamE.value;
        const email = e.target.emaiL.value;
        const password = e.target.passworD.value;
        const accepted = e.target.terms.checked;
        console.log("from Register...", name, email, password, accepted);

        // console.log(typeof password);
        if (password.length < 6) {
            setRegisterError("Password should be at least 6 characters or Longer");
            return;
        } else if (!/[A-Z]/.test(password)) {
            setRegisterError("Your password should have at least one Upper Case characters.");
            return;
        } else if (!accepted) {
            setRegisterError("Please accept our terms and conditions!");
            return;
        }

        //! Create User
        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const user = result.user;
                console.log("from Register user...", user);

                //! set success
                setSuccess("User Created Successfully.");

                //! update profile
                //! https://firebase.google.com/docs/auth/web/manage-users?hl=en&authuser=0#update_a_users_profile
                updateProfile(result.user, {
                    displayName: name,
                    photoURL: "https://example.com/jane-q-user/profile.jpg",
                })
                    .then(() => {
                        console.log("profile updated");
                    })
                    .catch((error) => {
                        console.log(error);
                    });

                //! send verification email
                //! https://firebase.google.com/docs/auth/web/manage-users?hl=en&authuser=0#send_a_user_a_verification_email
                sendEmailVerification(result.user).then(() => {
                    alert("Please check Your email and verify your account");
                });
            })
            .catch((error) => {
                console.error(error);

                //! set error
                setRegisterError(error.message);
            });
    };

    return (
        <div className="border">
            <div className="mx-auto md:w-1/2 border">
                <h2 className="text-3xl mb-8">Please Register</h2>
                <form onSubmit={handleRegister}>
                    {/* //!add input field */}
                    <input className="mb-4 w-full py-2 px-4" type="text" placeholder="Your name" name="NamE" id="" required />
                    <br />
                    <input className="mb-4 w-full py-2 px-4" type="email" placeholder="Email Address" name="emaiL" id="" required />
                    <br />
                    <div className="mb-4 relative">
                        <input className="w-full py-2 px-4" type={showPassword ? "text" : "password"} placeholder="Password" name="passworD" id="" required />
                        {/* //!Toggle Eye Icon  */}
                        <span className="absolute top-3 right-2" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                    <br />
                    {/* //! Terms and Conditions */}
                    <div>
                        <input type="checkbox" name="terms" id="teerrmmss" />
                        <label className="ml-2" htmlFor="teerrmmss">
                            Accept our
                            <a href="" className="underline">
                                Terms and Conditions
                            </a>
                        </label>
                    </div>
                    <br />
                    <input className="btn btn-secondary mb-4 w-full" type="submit" value="Register" />
                </form>

                {/* //!Showing The Error Message */}
                {registerError && <p className="text-red-700">{registerError}</p>}

                {/* //!Showing The Success Message */}
                {success && <p className="text-green-600">{success}</p>}

                <p>
                    Already have an account? Please
                    <Link to="/login" className="underline">
                        {" "}
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
