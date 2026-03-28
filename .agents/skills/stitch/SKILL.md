---
name: stitch
description: Use Stitch MCP to generate, edit, and manage UI screens and design systems for the Kubeview project.
---

# Stitch MCP Skill

Stitch is a UI design generation tool accessible via MCP. Use it to create screens, apply design systems, and generate variants.

## Workflow

### 1. Create or find a project
- Use `list_projects` to find existing Stitch projects.
- Use `create_project` to create a new one if none exists.

### 2. Generate screens
- Use `generate_screen_from_text` with a detailed prompt describing the screen layout, purpose, and data shown.
- Always specify `deviceType: "DESKTOP"` for Kubeview (it's a web dashboard).
- Be patient — generation can take 1-2 minutes. DO NOT retry.

### 3. Edit screens
- Use `edit_screens` with the screen ID(s) and a prompt describing what to change.

### 4. Design system
- Use `create_design_system` or `update_design_system` to set the visual theme.
- Then call `apply_design_system` to apply it to screens.

### 5. Variants
- Use `generate_variants` to produce multiple design alternatives for a screen.

## Kubeview Design Guidelines

- **App name**: Kubeview
- **Theme**: Dark mode only, professional security tooling aesthetic
- **Primary color**: Violet/purple accent (`#7C3AED`)
- **Background**: Near-black (`#09090B` canvas, `#18181B` elevated)
- **Text**: Off-white (`#FAFAFA` primary, `#A1A1AA` secondary)
- **Font**: Inter (body), JetBrains Mono (code/IDs)
- **Borders**: Subtle zinc (`#27272A`)
- **Success**: Green (`#16A34A`), Danger: Red (`#DC2626`)
- **Style**: Minimal, data-dense, no gradients on UI chrome

## Key Screens to Generate

1. **Landing page** — Hero, features, stats, CTA
2. **Login / Signup** — Auth forms
3. **Dashboard — Overview** — Stats cards + graph canvas
4. **Dashboard — Attack Paths** — Path list + highlighted graph
5. **Dashboard — Vulnerabilities** — Table of CVEs per node
6. **Dashboard — Critical Node** — Single node highlight + simulation
7. **Dashboard — Report** — Markdown report viewer
8. **Settings** — User profile, kubeconfig connection

## Notes

- Always read the full tool response before acting on it.
- If `output_components` contains suggestions, show them to the user.
- Store project ID and screen IDs in task notes for reuse.
