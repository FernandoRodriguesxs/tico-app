const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function localKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayKey(): string {
  return localKey(new Date());
}

function daysBetween(fromKey: string, toKey: string): number {
  const from = new Date(`${fromKey}T00:00:00`).getTime();
  const to = new Date(`${toKey}T00:00:00`).getTime();
  return Math.round((to - from) / 86400000);
}

function ddmm(dateKey: string): string {
  const [, month, day] = dateKey.split('-');
  return `${day}/${month}`;
}

function weekday(dateKey: string): string {
  return WEEKDAYS[new Date(`${dateKey}T00:00:00`).getDay()];
}

export function dayLabel(dateKey: string): string {
  const diff = daysBetween(dateKey, todayKey());
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  const wd = weekday(dateKey);
  return `${wd.charAt(0).toUpperCase()}${wd.slice(1)} · ${ddmm(dateKey)}`;
}

export function daySubtitle(dateKey: string): string {
  return `${weekday(dateKey)} · ${ddmm(dateKey)}`;
}
