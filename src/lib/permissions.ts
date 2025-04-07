export type UserRole = 'admin' | 'mentor' | 'mentee';

export function canEdit(
  role: UserRole,
  sectionId: string,
  fieldKey: string
): boolean {
  if (role === 'admin') {
    return true;
  }

  if (role === 'mentor') {
    if (fieldKey === 'verification' || sectionId === 'signatures') {
      return true;
    }
    return false;
  }

  // mentee
  if (role === 'mentee') {
    if (fieldKey === 'verification' || sectionId === 'signatures') {
      return false;
    }
    return true;
  }

  return false;
}