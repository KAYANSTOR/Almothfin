import { Advance, DailyRecord, Worker } from "../types";

export const recordKey = (record: Pick<DailyRecord, "workerId" | "date">) =>
  `${record.workerId}:${record.date}`;

export function uniqueIncomingRecords(
  incoming: Omit<DailyRecord, "id">[],
  existing: DailyRecord[],
) {
  const seen = new Set(existing.map(recordKey));
  const accepted: Omit<DailyRecord, "id">[] = [];
  const skipped: Omit<DailyRecord, "id">[] = [];
  for (const record of incoming) {
    const key = recordKey(record);
    if (seen.has(key)) skipped.push(record);
    else {
      seen.add(key);
      accepted.push(record);
    }
  }
  return { accepted, skipped };
}

export function calculateAdvanceDeduction(
  workerId: string,
  month: string,
  advances: Advance[],
) {
  return advances
    .filter(
      (advance) =>
        advance.workerId === workerId &&
        advance.deductionMethod === "automatic" &&
        advance.status === "active" &&
        advance.date <= `${month}-31`,
    )
    .reduce((sum, advance) => sum + Math.max(0, advance.amount - advance.paidAmount), 0);
}

export function calculateCarryForward(netSalary: number, settledAmount: number) {
  return Math.round(netSalary - settledAmount);
}

export function getWorkerName(workers: Worker[], workerId: string) {
  return workers.find((worker) => worker.id === workerId)?.name || "غير معروف";
}
