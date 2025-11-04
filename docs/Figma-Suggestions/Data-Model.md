# PocketBase Data Model

This document describes the PocketBase collections supporting the LMS roles with emphasis on Teachers, Students, and Guardians. It reflects the UX structure in `docs/Figma-Suggestions/UX_STRUCTURE.md`.

## Core Collections

### 1. `users` (auth collection)
- **Purpose**: Single source for authentication and MFA.
- **Key Fields**
  - `role` (select: `admin`, `teacher`, `student`, `guardian`)
  - `status` (select: `active`, `invited`, `inactive`)
  - `school_id` (relation → `schools`, optional)
  - `preferred_locale`, `avatar`
- **Indexes**: `role`, `(role, school_id)`
- **Rules**
  - List/View: `@request.auth.role = 'admin'`
  - Create: admin only (migration seeding or invite flow)
  - Update/Delete: owner can edit profile fields, admins manage status

### 2. `schools` (base)
- **Purpose**: Support multi-campus deployments.
- **Fields**: name, code, address, timezone.
- **Relations**: referenced by `users`, `classes`.

## Teacher Domain

### `teachers` (base)
- **Relation**: `user_id` (1‑1 relation → `users`, `maxSelect:1`)
- **Profile Fields**
  - `display_name`
  - `subjects_taught` (select[], values from `subjects`)
  - `grade_levels` (select[], values K–6)
  - `bio_md` (editor, markdown)
  - `certifications` (text[])
  - `employment_status` (select: full_time, part_time, substitute)
  - `availability_blocks` (json)
- **Operational Metrics**
  - `primary_class_count` (number, computed hook)
  - `pending_reviews` (number, computed hook)
- **Rules**
  - List/View: `@request.auth.role = 'admin' || ( @request.auth.role = 'teacher' && user_id = @request.auth.id )`
  - Create: admin only
  - Update/Delete: owner or admin

### `class_assignments` (base)
- **Purpose**: Map teachers to classes and their roles.
- **Fields**
  - `class_id` (relation → `classes`)
  - `teacher_id` (relation → `teachers`)
  - `role` (select: primary, assistant, specialist)
  - `workload_weight` (number)
  - `start_date`, `end_date`
- **Rules**
  - Create/Update/Delete: teacher or admin where `teacher_id.user_id = @request.auth.id`
  - List/View: teachers see own; admins see all.
- **Indexes**: unique `(class_id, teacher_id)`

## Student Domain

### `students` (base)
- **Relation**: `user_id` (1‑1 relation → `users`)
- **Identity Fields**
  - `first_name`, `last_name`
  - `preferred_name`
  - `student_id` (text, unique per school)
  - `dob`
  - `grade_level` (select)
  - `homeroom_class` (relation → `classes`)
- **Support Fields**
  - `support_flags` (select[], e.g., ELL, IEP, medical_alert)
  - `iep_plan` (file, optional)
  - `medical_notes_md` (editor, optional)
- **Dashboard Metrics**
  - `current_gpa` (number, computed hook)
  - `missing_work_count` (number)
- **Rules**
  - View: `@request.auth.id != '' && user_id = @request.auth.id` (students view own profile)
  - Create/Update/Delete: teacher/admin with `@request.auth.role ?= ['teacher','admin']`

### `enrollments` (base)
- **Purpose**: Join table linking students to classes.
- **Fields**
  - `class_id` (relation → `classes`)
  - `student_id` (relation → `students`)
  - `status` (select: active, waitlisted, withdrawn)
  - `start_date`, `end_date`
- **Rules**
  - List/View: teachers with `class_assignments_via_class_id.teacher_id.user_id = @request.auth.id`
  - Create/Update/Delete: teachers assigned to class, or admins.
- **Indexes**: unique `(class_id, student_id)`

### `student_progress_snapshots` (base)
- **Purpose**: Daily aggregates for dashboards.
- **Fields**: `student_id`, `snapshot_date`, `gpa`, `attendance_pct`, `missing_work_count`, `alerts[]`.
- **Population**: nightly JS hook reading gradebook/attendance.
- **Rules**: guardians/students limited via `student_id.user_id = @request.auth.id` or `student_guardians`.

## Guardian Domain

### `guardians` (base)
- **Relation**: `user_id` (1‑1 relation → `users`)
- **Contact Fields**
  - `primary_phone`
  - `secondary_phone`
  - `preferred_contact_method` (select: email, sms, phone)
  - `language` (select)
  - `address`
- **Notification Preferences**
  - `notify_grade_updates` (bool)
  - `notify_missing_work` (bool)
  - `notify_announcements` (bool)
- **Household Grouping**
  - `household_id` (relation → `households`, optional)  
    Use for multi-guardian families.
- **Rules**
  - View/Update: `user_id = @request.auth.id`
  - Create/Delete: admin only

### `student_guardians` (base)
- **Purpose**: Many-to-many link between students and guardians.
- **Fields**
  - `student_id` (relation → `students`)
  - `guardian_id` (relation → `guardians`)
  - `relationship` (select: mother, father, grandparent, other)
  - `is_primary_contact` (bool)
  - `has_legal_rights` (bool)
  - `communication_notes_md` (editor)
- **Rules**
  - List/View: guardians with `guardian_id.user_id = @request.auth.id`, plus teachers/admins.
  - Create/Update/Delete: teachers/admins.
- **Indexes**: unique `(student_id, guardian_id)`
  - Add a hook preventing removal of the last guardian for active students.

### `guardian_alerts` (base)
- **Purpose**: Queue of actionable notifications.
- **Fields**: `guardian_id`, `student_id`, `category` (select), `severity` (select), `title`, `details_md`, `status` (open, acknowledged, dismissed), `auto_dismiss_at`.
- **Rules**: guardians see only their records; teachers create/resolve alerts for linked students.

## Supporting Collections

- `classes`: schedule, grade level, homeroom teacher, calendar blocks.
- `subjects`: controlled vocabulary for lesson planning.
- `gradebook_entries`: references `enrollments`, `teachers`.
- `assignments`, `submissions`: tie into students and classes for progress reporting.

## Access Control Summary

| Role | Capabilities |
| --- | --- |
| `teacher` | Manage related `teachers`, `class_assignments`, `enrollments`, read/write students they teach, create `guardian_alerts`. |
| `student` | View own `students` profile, `enrollments`, `student_progress_snapshots`, related assignments and grades. |
| `guardian` | View linked `students`, `student_guardians`, `student_progress_snapshots`, `guardian_alerts` for their household. |
| `admin` | Full access across collections. |

## Implementation Notes

- **Creation Flow**: Provision auth records → create profile (`teachers`, `students`, `guardians`) → create bridge records (`class_assignments`, `enrollments`, `student_guardians`).
- **Hooks**: Use PocketBase JS hooks to compute `primary_class_count`, `pending_reviews`, `current_gpa`, and populate `student_progress_snapshots`.
- **Expansions**: Standard expands for dashboards:  
  - Teacher dashboard: `expand=class_assignments(class_id,enrollments.student_id)`  
  - Student dashboard: `expand=enrollments.class_id,class_id.lesson_plan`  
  - Guardian dashboard: `expand=student_guardians.student_id.student_progress_snapshots`
- **Data Integrity**: Disable cascade deletes; rely on `status` fields and hooks to enforce referential safety.
- **Indexes**: Add composite indexes to bridge collections to keep dashboards responsive and ensure uniqueness.

