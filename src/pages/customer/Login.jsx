import { useState } from "react";
import { login } from "../../services/authService";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login({
                email,
                password,
            });

            console.log(response.data);
            alert("Login Successful");
        } catch (error) {
            console.log(error);

            if (error.response) {
                console.log("Status:", error.response.status);
                console.log("Data:", error.response.data);
                alert(error.response.data.message);
            } else {
                console.log(error.message);
                alert(error.message);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleLogin}
                className="bg-white w-full max-w-md rounded-xl shadow-lg p-8"
            >

                <h1 className="text-3xl font-bold text-center mb-8">
                    Welcome Back
                </h1>

                <div className="mb-5">
                    <label className="block mb-2 font-medium">
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter email"
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="block mb-2 font-medium">
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="text-right mb-6">
                    <button
                        type="button"
                        className="text-purple-600 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
                >
                    Login
                </button>

                <p className="text-center mt-6">
                    Don't have an account?{" "}
                    <span className="text-purple-600 cursor-pointer hover:underline">
                        Register
                    </span>
                </p>

            </form>

        </div>
    );
}

export default Login;