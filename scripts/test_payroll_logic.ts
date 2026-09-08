import { strict as assert } from "node:assert";
import { calculateAdvanceDeduction, calculateCarryForward, uniqueIncomingRecords } from "../src/lib/payrollLogic";

const base = { workerId: "w1", date: "2026-09-08", attendance: "full" as const, allowance: 0, advancePayment: 0, delayMinutes: 0, note: "" };
const result = uniqueIncomingRecords([base, { ...base, note: "duplicate in same migration" }], [{ ...base, id: "legacy-1" }]);
assert.equal(result.accepted.length, 0);
assert.equal(result.skipped.length, 2);
assert.equal(calculateAdvanceDeduction("w1", "2026-09", [{ id: "a1", workerId: "w1", amount: 1000, paidAmount: 250, date: "2026-09-01", note: "", deductionMethod: "automatic", status: "active" }]), 750);
assert.equal(calculateCarryForward(5000, 3500), 1500);
console.log("payroll logic tests passed");
