import { CellAddress, toCellAddress } from "@/types";

// Convert column index to letter(s) (0 -> A, 25 -> Z, 26 -> AA)
export function colToLetter(col: number): string {
  // TODO: Implement column index to letter conversion
  // 0 -> A, 1 -> B, ..., 25 -> Z, 26 -> AA, 27 -> AB, etc.
  throw new Error("Not implemented");
}

// Convert letter(s) to column index (A -> 0, Z -> 25, AA -> 26)
export function letterToCol(letters: string): number {
  // TODO: Implement letter to column index conversion
  throw new Error("Not implemented");
}

// Parse a cell address with absolute/relative refs ($A$1, A$1, $A1, A1)
export function parseAddress(addr: string): {
  col: number;
  row: number;
  absoluteCol: boolean;
  absoluteRow: boolean;
} {
  // TODO: Parse addresses like A1, $A$1, A$1, $A1
  throw new Error("Not implemented");
}

// Format a cell address with absolute/relative refs
export function formatAddress(
  col: number,
  row: number,
  absoluteCol: boolean = false,
  absoluteRow: boolean = false
): CellAddress {
  // TODO: Format address with $ for absolute refs
  throw new Error("Not implemented");
}

// Parse a range (A1:B3)
export function parseRange(range: string): {
  start: CellAddress;
  end: CellAddress;
} {
  // TODO: Parse range string into start and end addresses
  throw new Error("Not implemented");
}

// Get all cells in a range
export function getCellsInRange(
  startAddr: CellAddress,
  endAddr: CellAddress
): CellAddress[] {
  // TODO: Return all cell addresses in the rectangular range
  throw new Error("Not implemented");
}

// Adjust a cell reference when rows/columns are inserted or deleted
export function adjustReference(
  addr: CellAddress,
  insertedAt: { row?: number; col?: number },
  deletedAt: { row?: number; col?: number },
  isAbsolute: { col: boolean; row: boolean }
): CellAddress {
  // TODO: Adjust cell reference based on insert/delete operations
  // Respect absolute references (don't adjust if absolute)
  throw new Error("Not implemented");
}

// Transform a formula when copying/pasting (relative refs change, absolute don't)
export function transformFormula(
  formula: string,
  fromCell: CellAddress,
  toCell: CellAddress
): string {
  // TODO: Transform formula references based on relative offset
  // Parse formula, adjust all relative refs, preserve absolute refs
  throw new Error("Not implemented");
}

// Check if a cell address is valid for given sheet dimensions
export function isValidAddress(
  addr: CellAddress,
  maxRows: number,
  maxCols: number
): boolean {
  // TODO: Validate that address is within sheet bounds
  throw new Error("Not implemented");
}

// Get neighboring cell address (for arrow key navigation)
// absoluteCol and absoluteRow indicate if the column or row is absolute (e.g., $A$1 vs A1).
// They are used for formula/reference logic, but do not affect navigation here.
export function getNeighbor(
  addr: CellAddress,
  direction: "up" | "down" | "left" | "right",
  maxRows: number,
  maxCols: number
): CellAddress | null {
  const {
    col,
    row,
    absoluteCol = false,
    absoluteRow = false,
  } = parseAddress(addr);

  // Check if the current address is already at the edge
  if (
    (col < 0 && direction === "left") ||
    (row < 0 && direction === "up") ||
    (col >= maxCols && direction === "right") ||
    (row >= maxRows && direction === "down")
  ) {
    return null;
  }

  let newCol = col;
  let newRow = row;

  switch (direction) {
    case "up":
      if (row <= 0) return null;
      newRow -= 1;
      break;
    case "down":
      if (row >= maxRows - 1) return null;
      newRow += 1;
      break;
    case "left":
      if (col <= 0) return null;
      newCol -= 1;
      break;
    case "right":
      if (col >= maxCols - 1) return null;
      newCol += 1;
      break;
  }

  return formatAddress(newCol, newRow, absoluteCol, absoluteRow);
}
