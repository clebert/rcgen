export interface ManagedGeneratedFile {
  readonly filename: string;
  readonly versioned?: boolean;
}

export interface UnmanagedGeneratedFile {
  readonly pattern: string;
  readonly versioned?: boolean;
}

export interface NonGeneratedUnversionedFile {
  readonly pattern: string;
}

export interface Project {
  readonly nodeVersion?: string;
  readonly managedGeneratedFiles?: ManagedGeneratedFile[];
  readonly unmanagedGeneratedFiles?: UnmanagedGeneratedFile[];
  readonly nonGeneratedUnversionedFiles?: NonGeneratedUnversionedFile[];
}
