export type RedactionKind =
  | 'email'
  | 'phone'
  | 'possibleAddress'
  | 'sensitiveToken';

export interface RedactionMatch {
  kind: RedactionKind;
  token: string;
  replacement: string;
}

export interface RedactionResult {
  text: string;
  matches: RedactionMatch[];
}

export interface LocalDataPolicyItem {
  key: string;
  label: string;
  storage: 'browserLocalStorage' | 'notStored' | 'serverTransient';
  purpose: string;
  userVisible: boolean;
  clearable: boolean;
}

export interface CoachContextPrivacySummary {
  includedFields: string[];
  excludedFields: string[];
  notes: string[];
}
