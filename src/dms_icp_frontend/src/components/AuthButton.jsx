import { useState } from "react";
import { connectPlug } from "../services/icpService";

function AuthButton() {
    const [principal, setPrincipal] = useState(null);

    async function handleConnect() {
        const userPrincipal = await connectPlug();
        if (userPrincipal) {
            setPrincipal(userPrincipal);
        }
    }

    return (
        <div>
            {principal ? (
                <p>Connected: {principal}</p>
            ) : (
                <button onClick={handleConnect} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Connect with Plug
                </button>
            )}
        </div>
    );
}

export default AuthButton;
