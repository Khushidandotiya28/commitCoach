import { useState, useContext } from "react";
import { loginUser } from "../api/repoApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const res = await loginUser(email, password);

      if (res.data && res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        navigate("/dashboard");
      } else {
        alert("Server error: Missing user data");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        
        <input
          className="w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-black outline-none"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          className="w-full mb-4 p-2 border rounded focus:ring-2 focus:ring-black outline-none"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/*Navigation link placed OUTSIDE the form */}
      <div className="mt-6 text-center border-t pt-4">
        <p className="text-gray-600 text-sm">
          New User?{" "}
          <Link to="/signup" className="text-black font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;