use ic_cdk::storage;
use ic_cdk_macros::{init, update, query};
use std::collections::HashMap;
use ic_cdk::api::time;
use ic_ledger_types::{AccountIdentifier, Memo, Tokens, TransferArgs, DEFAULT_SUBACCOUNT};
use ic_cdk::call;
use candid::Principal;

#[derive(Default)]
struct DeadMansSwitch {
    switches: HashMap<String, Switch>,
}

#[derive(Clone, Debug)]
struct Switch {
    owner: String,
    timeout: u64,
    last_checkin: u64,
    message: String,
    recipient: String,
    icp_amount: u64,  // Amount of ICP to transfer on activation
}

static mut DMS: Option<DeadMansSwitch> = None;

#[init]
fn init() {
    unsafe { DMS = Some(DeadMansSwitch::default()); }
}

#[update]
fn create_switch(owner: String, timeout: u64, message: String, recipient: String, icp_amount: u64) {
    let switch = Switch {
        owner: owner.clone(),
        timeout,
        last_checkin: time(),
        message,
        recipient,
        icp_amount,
    };
    unsafe {
        if let Some(dms) = &mut DMS {
            dms.switches.insert(owner, switch);
        }
    }
}

#[update]
fn check_in(owner: String) {
    unsafe {
        if let Some(dms) = &mut DMS {
            if let Some(switch) = dms.switches.get_mut(&owner) {
                switch.last_checkin = time();
            }
        }
    }
}

#[update]
async fn check_status(owner: String) -> Option<String> {
    unsafe {
        if let Some(dms) = &mut DMS {
            if let Some(switch) = dms.switches.get(&owner) {
                let current_time = time();
                if current_time > switch.last_checkin + switch.timeout {
                    let transfer_result = transfer_icp(switch.recipient.clone(), switch.icp_amount).await;
                    return Some(format!("Switch triggered! Message to {}: {}. ICP Transfer: {:?}", switch.recipient, switch.message, transfer_result));
                }
            }
        }
    }
    None
}

async fn transfer_icp(to: String, amount: u64) -> Result<(), String> {
    let to_account = AccountIdentifier::from_hex(&to)
        .map_err(|e| format!("Invalid account identifier: {:?}", e))?;

    let args = TransferArgs {
        memo: Memo(0),
        amount: Tokens::from_e8s(amount),
        fee: Tokens::from_e8s(10_000),
        from_subaccount: None,
        to: to_account,
        created_at_time: None,
    };

    let ledger_canister = Principal::from_text("ryjl3-tyaaa-aaaaa-aaaba-cai")
        .map_err(|e| format!("Invalid ledger principal: {:?}", e))?;

    let result: Result<(), (ic_cdk::api::call::RejectionCode, String)> =
        call(ledger_canister, "icrc1_transfer", (args,)).await;

    result.map_err(|e| format!("ICP Transfer failed: {:?}", e))
}