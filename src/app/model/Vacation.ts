export class Vacation {
  vcnId?: number; 
  startDate!: string;
  endDate!: string;
  reason!: string;
  status!: "pending" | "approved" | "rejected";
 user!: {id: number;fullName?: string;};
totalDays: any;
}
