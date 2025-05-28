/**
 * The name of the command line interface.
 */
export const globalCliName = 'bdpa-cron';

/**
 * The CLI-wide namespace that appears in logger output.
 */
export const globalLoggerNamespace = globalCliName;

/**
 * The CLI-wide namespace that appears in debugger output.
 */
export const globalDebuggerNamespace = globalCliName;

/**
 * The HSCC MongoDB Atlas APIs organized by problem statement name.
 *
 * @see {@link TargetDatabase}, {@link TargetYear}
 */
export const TargetProblem = {
  All: 'all',

  Elections: 'elections',
  Airports: 'airports',
  Barker: 'barker',
  Ghostmeme: 'ghostmeme',
  Drive: 'drive',
  Qoverflow: 'qoverflow',
  Blogpress: 'blogpress',
  Inbdpa: 'ganymede',
  ElectionsIrv: 'elections-irv',
  ElectionsCpl: 'elections-cpl',
  Bdpaoverflow: 'bdpaoverflow'
} as const;

export type TargetProblem = typeof TargetProblem;

/**
 * The HSCC MongoDB Atlas APIs organized by problem statement release year.
 *
 * Per-year syntax is: `[sample problem statement, actual problem statement]`
 *
 * @see {@link TargetDatabase}, {@link TargetProblem}
 */
export const TargetYear = {
  2019: [TargetProblem.Elections],
  2020: [TargetProblem.Elections, TargetProblem.Airports],
  2021: [TargetProblem.Barker, TargetProblem.Ghostmeme],
  2022: [TargetProblem.Drive, TargetProblem.Qoverflow],
  2023: [TargetProblem.Blogpress, TargetProblem.Inbdpa],
  2024: [TargetProblem.ElectionsCpl, TargetProblem.ElectionsIrv],
  2025: [TargetProblem.Drive, TargetProblem.Bdpaoverflow]
} as const;

export type TargetYear = typeof TargetYear;

/**
 * The HSCC MongoDB Atlas APIs organized by Atlas server designation.
 *
 * @see {@link TargetProblem}, {@link TargetYear}
 */
export const TargetDatabase = {
  mars: TargetProblem.Elections,
  neptune: TargetProblem.Airports,
  saturn: TargetProblem.Barker,
  pluto: TargetProblem.Ghostmeme,
  venus: TargetProblem.Drive,
  jupiter: TargetProblem.Qoverflow,
  uranus: TargetProblem.Blogpress,
  ganymede: TargetProblem.Inbdpa,
  callisto: TargetProblem.ElectionsCpl,
  io: TargetProblem.ElectionsIrv,
  europa: TargetProblem.Bdpaoverflow
} as const;

export type TargetDatabase = typeof TargetDatabase;

/**
 * @see {@link allActualTargetProblems}
 */
export const allInputTargets = [
  Object.values(TargetProblem),
  Object.keys(TargetYear),
  Object.keys(TargetDatabase)
].flat() as (
  | TargetProblem[keyof TargetProblem]
  | keyof TargetYear
  | keyof TargetDatabase
)[];

/**
 * @see {@link TargetProblem}
 */
export const allActualTargetProblems = Object.values(TargetProblem).filter(
  (target) => target !== TargetProblem.All
);
