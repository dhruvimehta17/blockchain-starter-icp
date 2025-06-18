import { Actor } from "@dfinity/agent";
import { idlFactory, canisterId } from "../../../declarations/dms_icp_backend";

let dmsActor = null;

export async function connectPlug() {
    if (!window.ic || !window.ic.plug) {
        alert("Plug Wallet not installed! Get it from https://plugwallet.ooo/");
        return false;
    }

    try {
        await window.ic.plug.requestConnect({
            whitelist: [canisterId], 
            host: "https://icp0.io", 
        });

        const principal = await window.ic.plug.agent.getPrincipal();
        console.log("Connected with Plug! Principal:", principal.toText());
        
        return principal.toText();
    } catch (error) {
        console.error("Plug connection failed:", error);
        return false;
    }
}

export async function createAuthenticatedActor() {
    if (!window.ic || !window.ic.plug) {
        console.error("Plug Wallet is not installed.");
        return null;
    }

    const isConnected = await window.ic.plug.isConnected();
    if (!isConnected) {
        console.error("Plug Wallet is not connected.");
        return null;
    }

    dmsActor = await window.ic.plug.createActor({
        canisterId,
        interfaceFactory: idlFactory,
    });

    console.log("DMS Actor initialized:", dmsActor);
    return dmsActor;
}

// Function to create a switch with Plug authentication
export async function createSwitch(timeout, message, recipient, icpAmount) {
    if (!dmsActor) {
        dmsActor = await createAuthenticatedActor();
    }
    if (!dmsActor) {
        console.error("Failed to create Plug-authenticated actor.");
        return;
    }

    try {
        const owner = await window.ic.plug.agent.getPrincipal();
        const response = await dmsActor.create_switch(owner.toText(), timeout, message, recipient, icpAmount);
        console.log("Switch created:", response);
        return response;
    } catch (error) {
        console.error("Error creating switch:", error);
        return null;
    }
}

// Export the initialized actor
export { dmsActor };
