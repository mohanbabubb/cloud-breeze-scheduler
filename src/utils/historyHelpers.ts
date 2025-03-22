
import { Shift } from "./rosterHelpers";

export interface HistoryEntry {
  id: string;
  actionType: "create" | "update" | "delete";
  timestamp: Date;
  employeeName: string;
  counterName: string;
  oldStart?: Date;
  oldEnd?: Date;
  newStart?: Date;
  newEnd?: Date;
  details: string;
}

// Initialize with empty history
let shiftHistory: HistoryEntry[] = [];

// Function to add an entry to history
export const addHistoryEntry = (
  actionType: "create" | "update" | "delete",
  oldShift?: Shift,
  newShift?: Shift
): void => {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    actionType,
    timestamp: new Date(),
    employeeName: newShift?.title.split(" - ")[0] || oldShift?.title.split(" - ")[0] || "Unknown",
    counterName: newShift?.location || oldShift?.location || "Unknown",
    details: generateHistoryDetails(actionType, oldShift, newShift),
  };

  if (actionType === "update" && oldShift && newShift) {
    entry.oldStart = oldShift.start;
    entry.oldEnd = oldShift.end;
    entry.newStart = newShift.start;
    entry.newEnd = newShift.end;
  } else if (actionType === "create" && newShift) {
    entry.newStart = newShift.start;
    entry.newEnd = newShift.end;
  } else if (actionType === "delete" && oldShift) {
    entry.oldStart = oldShift.start;
    entry.oldEnd = oldShift.end;
  }

  // Add to history
  shiftHistory = [entry, ...shiftHistory];
};

// Function to get history entries
export const getHistoryEntries = (): HistoryEntry[] => {
  return shiftHistory;
};

// Helper to generate human-readable description
const generateHistoryDetails = (
  actionType: "create" | "update" | "delete",
  oldShift?: Shift,
  newShift?: Shift
): string => {
  switch (actionType) {
    case "create":
      return `Created new shift for ${newShift?.title.split(" - ")[0]} at ${newShift?.location}`;
    case "update":
      if (oldShift && newShift) {
        if (oldShift.counterId !== newShift.counterId) {
          return `Moved from ${oldShift.location} to ${newShift.location}`;
        } else {
          return `Updated shift time for ${newShift.title.split(" - ")[0]} at ${newShift.location}`;
        }
      }
      return "Updated shift details";
    case "delete":
      return `Deleted shift for ${oldShift?.title.split(" - ")[0]} at ${oldShift?.location}`;
    default:
      return "Modified shift";
  }
};
