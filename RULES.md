# Teacher Induction Log - Permissions Rules

## Overview

The Teacher Induction Log application uses a role-based permissions system to control who can edit different parts of the form. The system is designed around the teacher induction process, where new teachers (mentees) complete activities under the guidance of experienced teachers (mentors) and administrative oversight (admins).

## User Roles

### 1. Admin
**Full System Access**
- Can edit all form fields including verification and signature sections
- Has complete administrative oversight of the induction process
- Can approve, verify, and finalize induction logs
- Manages user accounts and role assignments

### 2. Mentor
**Verification and Oversight Role**
- Can edit verification fields to initial/approve completed activities
- Can edit signature sections for official approvals
- **Cannot** edit activity data entered by mentees (dates, topics, etc.)
- Provides guidance and verification of mentee progress

### 3. Mentee
**Primary Data Entry Role**
- Can edit all activity data (dates, topics, assignments, etc.)
- **Cannot** edit verification fields (these require mentor/admin approval)
- **Cannot** edit signature sections (these require official approval)
- Primary user responsible for logging induction activities

## Permission Logic

The permissions are enforced through the `canEdit(role, sectionId, fieldKey)` function in `src/lib/permissions.ts`:

```typescript
export function canEdit(
  role: UserRole,
  sectionId: string,
  fieldKey: string
): boolean {
  if (role === 'admin') {
    return true; // Admin can edit everything
  }

  if (role === 'mentor') {
    if (fieldKey === 'verification' || sectionId === 'signatures') {
      return true; // Mentor can edit verifications and signatures
    }
    return false; // Mentor cannot edit other fields
  }

  if (role === 'mentee') {
    if (fieldKey === 'verification' || sectionId === 'signatures') {
      return false; // Mentee cannot edit verifications or signatures
    }
    return true; // Mentee can edit all other fields
  }

  return false; // Default deny
}
```

## Section-Specific Rules

### Cover Page (Basic Information)
- **Admin**: Can edit all fields
- **Mentor**: Read-only access
- **Mentee**: Can edit inductee name, building, assignment, mentor teacher, school years

### Activity Sections
All activity sections (Summer Academy, Induction Seminars, Mentor Meetings, Team Meetings, Classroom Visits, Other Activities) follow the same pattern:

#### Data Fields (dates, topics, activities)
- **Admin**: Full edit access
- **Mentor**: Read-only access
- **Mentee**: Full edit access

#### Verification Fields
- **Admin**: Full edit access
- **Mentor**: Full edit access (can initial/verify activities)
- **Mentee**: Read-only access

### Signatures Section
The signatures section contains official approvals from:
- Mentor Teacher
- Building Principal  
- Superintendent
- Date of completion

#### All Signature Fields
- **Admin**: Full edit access
- **Mentor**: Full edit access
- **Mentee**: Read-only access

## Field Types

### Editable Fields (for mentees)
- `inductee` - Inductee name
- `building` - School building assignment
- `assignment` - Grade/subject assignment  
- `mentorTeacher` - Assigned mentor teacher
- `schoolYearOne` - First year of induction
- `schoolYearTwo` - Second year of induction
- Activity data fields (dates, topics, etc.)

### Verification Fields (mentor/admin only)
- `verification` - Initials/approval for completed activities
- All fields in activity arrays where `fieldKey === 'verification'`

### Signature Fields (mentor/admin only)
- `signatures.mentorTeacher` - Mentor teacher signature
- `signatures.buildingPrincipal` - Principal signature
- `signatures.superintendent` - Superintendent signature
- `signatures.date` - Completion date

## Implementation Notes

### Current State vs Target State
The application is transitioning from a legacy system using nested `editable` objects in the JSON data to a centralized `canEdit()` function. The current `log.json` still contains the old `editable` structure for backward compatibility:

```json
{
  "userRole": "teacher", // Legacy role, being replaced with admin/mentor/mentee
  "editable": {
    // Legacy nested editability flags
    "verifications": {
      // Nested verification permissions
    }
  }
}
```

### Migration Path
1. **Phase 1**: Implement `canEdit()` function (✅ Complete)
2. **Phase 2**: Update UI components to use `canEdit()` (🔄 In Progress)
3. **Phase 3**: Remove legacy `editable` objects from data model
4. **Phase 4**: Update user role from "teacher" to specific roles (admin/mentor/mentee)

### Security Considerations
- Permissions are enforced in the UI layer through conditional rendering
- Server-side validation should mirror these rules when implemented
- Role assignment should be controlled by system administrators
- Verification fields serve as an audit trail for completed activities

## Testing

Comprehensive permission tests are located in `src/lib/permissions.test.ts` covering:
- All role and field combinations
- Edge cases and invalid inputs
- Integration with UI components

## Related Files

- `src/lib/permissions.ts` - Core permission logic
- `src/lib/permissions.test.ts` - Permission tests
- `src/lib/components/sections/Signatures.svelte` - Example usage
- `public/log.json` - Data structure with legacy permissions
- `TASKS.md` - Migration tasks and technical debt
- `CLAUDE.md` - Implementation notes and user role descriptions
