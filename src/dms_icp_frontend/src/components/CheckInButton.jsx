import React, { useState } from "react";
import { dmsActor } from "../services/icpService";

export default function CheckInButton() {
  const [owner, setOwner] = useState("");

  const checkIn = async () => {
    try {
      await dmsActor.check_in(owner);
      alert("Checked in!");
    } catch (error) {
      console.error("Check-in error:", error);
      alert("Failed to check-in.");
    }
  };

  return (
    <div>
      <h2>Check In</h2>
      <input placeholder="Your Principal ID" onChange={e => setOwner(e.target.value)} />
      <button onClick={checkIn}>Check In</button>
    </div>
  );
}
