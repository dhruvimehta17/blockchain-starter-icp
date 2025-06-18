import React, { useState } from "react";
import { dmsActor } from "../services/icpService";

export default function StatusDisplay() {
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState("");

  const checkStatus = async () => {
    try {
      const result = await dmsActor.check_status(owner);
      setStatus(result || "Switch is still active.");
    } catch (error) {
      console.error("Error checking status:", error);
      setStatus("Failed to fetch status.");
    }
  };

  return (
    <div>
      <h2>Check Switch Status</h2>
      <input placeholder="Your Principal ID" onChange={e => setOwner(e.target.value)} />
      <button onClick={checkStatus}>Check Status</button>
      <p>{status}</p>
    </div>
  );
}
