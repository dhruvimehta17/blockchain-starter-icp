import React, { useState } from "react";
import { dmsActor } from "../services/icpService";

export default function CreateSwitch() {
  const [owner, setOwner] = useState("");
  const [timeout, setTimeout] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [icpAmount, setIcpAmount] = useState("");

  const createSwitch = async () => {
    try {
      await dmsActor.create_switch(owner, Number(timeout), message, recipient, Number(icpAmount));
      alert("Switch Created!");
    } catch (error) {
      console.error("Error creating switch:", error);
      alert("Failed to create switch.");
    }
  };

  return (
    <div>
      <h2>Create Dead Man's Switch</h2>
      <input placeholder="Your Principal ID" onChange={e => setOwner(e.target.value)} />
      <input placeholder="Timeout (seconds)" onChange={e => setTimeout(e.target.value)} />
      <input placeholder="Message" onChange={e => setMessage(e.target.value)} />
      <input placeholder="Recipient's Principal ID" onChange={e => setRecipient(e.target.value)} />
      <input placeholder="ICP Amount (e8s)" onChange={e => setIcpAmount(e.target.value)} />
      <button onClick={createSwitch}>Create</button>
    </div>
  );
}
