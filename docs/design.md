**design.md**

```markdown
# EduSMS Admin Portal — Design System & Guidelines

**Version:** 1.0  
**Last Updated:** October 2023  
**Design Style:** Branded Neumorphic 3D Depth (Soft Extruded Cards)  
**Accessibility Target:** WCAG 2.1 Level AA

---

## 1. Design Philosophy

EduSMS uses a **clean, trustworthy, and professional** visual language with subtle 3D depth. The design prioritizes:

- **Clarity** over decoration
- **Depth** through soft shadows instead of heavy gradients
- **Accessibility** as a core constraint (not an afterthought)
- **Consistency** across all admin modules

The interface should feel **premium yet approachable** for school administrators.

---

## 2. Color Palette

### Primary Colors
| Token              | Hex Code   | Usage                              | Contrast |
|--------------------|------------|------------------------------------|----------|
| `primary-900`      | `#1E40AF`  | Headings, Primary Buttons, Active Nav | 9.3:1   |
| `primary-700`      | `#1E3A8A`  | Hover states, Links                | —       |
| `primary-100`      | `#DBEAFE`  | Light badges, Background accents   | —       |
| `neutral-50`       | `#F8FAFC`  | Main background                    | —       |
| `neutral-100`      | `#F1F5F9`  | Card backgrounds                   | —       |
| `neutral-700`      | `#334155`  | Body text                          | 12.6:1  |

### Status Colors (Always Pair with Text)
| Status     | Hex Code   | Text Color    | Usage                     |
|------------|------------|---------------|---------------------------|
| Success    | `#15803D`  | `#166534`     | Attendance, Paid          |
| Warning    | `#B45309`  | `#92400E`     | Due, Pending              |
| Danger     | `#B91C1C`  | `#991B1B`     | Overdue, Critical         |
| Info       | `#0369A1`  | `#075985`     | Notifications             |

**Rule:** Never rely on color alone. Always include text labels.

---

## 3. Typography

- **Font Family:** Inter (or system-ui fallback)
- **Heading Hierarchy:**
  - `h1`: 28px / 700 — Page titles
  - `h2`: 20px / 600 — Section titles
  - `h3`: 16px / 600 — Card titles
- **Body:** 14px / 400
- **Small Text:** 12px / 500

**Line Height:** 1.5 for body, 1.3 for headings

---

## 4. Layout System

### Grid Structure
- **Sidebar:** Fixed 260px (left)
- **Navbar:** Fixed height 64px (top)
- **Main Content:** Flexible with max-width `1280px`
- **Card Gap:** 20px
- **Page Padding:** 32px (desktop)

### Responsive Breakpoints
- Desktop: `≥ 1280px`
- Tablet: `768px – 1279px`
- Mobile: `< 768px` (Sidebar becomes drawer)

---

## 5. Component System

### 5.1 Cards (Neumorphic Style)
```css
.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1),
    0 10px 15px -3px rgb(0 0 0 / 0.05);
  border: 1px solid #f1f5f9;
}
```

**Depth Levels:**
- Level 1 (Default): Soft shadow
- Level 2 (Important): Slightly stronger shadow + subtle lift
- Level 3 (Interactive): Hover state with increased elevation

### 5.2 Buttons
| Type              | Background       | Text     | Shadow                     | Use Case                  |
|-------------------|------------------|----------|----------------------------|---------------------------|
| Primary           | `#1E40AF`        | White    | Medium                     | Main actions              |
| Secondary         | `#F1F5F9`        | `#334155`| None                       | Cancel / Secondary        |
| Quick Action      | White            | `#1E40AF`| Neumorphic                 | Dashboard quick actions   |
| Danger            | `#B91C1C`        | White    | Medium                     | Destructive actions       |

**Touch Target:** Minimum 44×44px

### 5.3 Status Badges
- Always use **text + color**
- Example: `30% Present` (not just green dot)
- Use `primary-900` text on `primary-100` badges (not white)

### 5.4 Charts
- Use **Donut + Bar** charts with clear legends
- Colors must match status palette
- Always include data labels or tooltips

---

## 6. Navigation

### Sidebar
- Active item: `primary-900` background + white text
- Icons: 20px, consistent stroke weight
- All icons must have `aria-label` or visible text

### Top Navbar
- Search bar (prominent)
- Notification bell + Profile avatar
- Keep branding minimal (left side)

---

## 7. Accessibility Rules (Mandatory)

| Rule | Requirement |
|------|-------------|
| **Headings** | Use proper `<h1>`, `<h2>`, `<h3>` hierarchy |
| **Color** | Never use color as the only indicator |
| **Focus** | High-contrast focus rings (minimum 3px) |
| **Touch** | Minimum 44×44px interactive areas |
| **Labels** | All form inputs must have visible labels |
| **Reduced Motion** | Provide toggle to disable 3D depth effects |
| **Text Contrast** | Minimum 4.5:1 for normal text |

### Recommended Toggle
Add a **"Simplify View"** toggle in Settings that:
- Removes 3D shadows
- Uses flat borders instead of extruded cards
- Reduces animation

---

## 8. Page Structure Template

Every page should follow this structure:

```html
<!-- Navbar -->
<!-- Sidebar -->

<main>
  <h1>Page Title</h1>

  <!-- KPI / Summary Cards Row -->
  <div class="grid grid-cols-4 gap-5">
    <!-- KPI Cards -->
  </div>

  <!-- Action Banner (if needed) -->
  <div class="action-banner">
    <!-- Warning / Info -->
  </div>

  <!-- Main Content Area -->
  <div class="grid grid-cols-12 gap-5">
    <!-- Charts / Tables / Lists -->
  </div>

  <!-- Quick Actions (if applicable) -->
  <div class="quick-actions">
    <!-- Grid of action buttons -->
  </div>
</main>
```

---

## 9. Page-Specific Guidelines

### Students Page
- Use table with sticky header
- Show status badges with text ("Active", "Inactive")
- Include bulk actions with clear labels

### Finance Page
- Heavy use of status colors + text
- Show "Collected vs Due" with both visual and numeric values
- Fee cards should show "Due Date" prominently

### Reports Page
- Keep layout clean
- Use card-based report selectors
- Download buttons must be clearly labeled

### Academics / Timetable
- Use calendar or grid layout
- Maintain high contrast for time slots

---

## 10. Animation & Motion

- Use **subtle** transitions (150–200ms)
- Avoid excessive movement in cards
- Respect `prefers-reduced-motion`
- Hover effects should be gentle lifts, not dramatic

---

## 11. Do’s and Don’ts

**Do’s**
- Always pair color with text labels
- Use consistent card styling across pages
- Maintain 20px gaps between cards
- Use proper heading hierarchy
- Test with high contrast mode

**Don’ts**
- Don’t use white text on light blue badges
- Don’t create deep nested shadows that reduce readability
- Don’t hide important information behind hover states
- Don’t use only icons for navigation without labels

---

## 12. Future Considerations

- Dark mode support (optional)
- Mobile-first responsive version
- Keyboard navigation improvements
- Screen reader testing checklist

---

**This document should be used as the single source of truth when designing new pages (Students, Teachers, Finance, Reports, etc.).**