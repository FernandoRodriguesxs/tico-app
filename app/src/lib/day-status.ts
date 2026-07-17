import { COLORS, fmt } from './theme';

export type DayStatusKind = 'hit' | 'under' | 'over';

export type DayStatus = {
  kind: DayStatusKind;
  label: string;
  textColor: string;
  bgColor: string;
};

export function dayStatus(consumed: number, goal: number): DayStatus {
  if (consumed > goal) {
    return { kind: 'over', label: `passou ${fmt(consumed - goal)}`, textColor: COLORS.over, bgColor: COLORS.overBg };
  }
  if (goal > 0 && consumed >= goal * 0.9) {
    return { kind: 'hit', label: 'bateu a meta 🎉', textColor: COLORS.success, bgColor: COLORS.hitBg };
  }
  return { kind: 'under', label: `faltaram ${fmt(goal - consumed)}`, textColor: COLORS.underText, bgColor: COLORS.underBg };
}
