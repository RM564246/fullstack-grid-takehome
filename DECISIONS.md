# Design Decisions

Please fill out this document with your design decisions and rationale as you implement TinyGrid.

## Design Analysis

### V7 Labs Study
After reviewing [v7labs.com](https://v7labs.com):

**What I liked:**
- What aspects of their design appeal to you?
  - Minimalist design with focus on the data not the platform
- Which specific UI patterns would work well for a spreadsheet?
  - Cell selection with clear visual feedback (border or background highlight)
  - Inline cell editing (double-click, Enter, or F2 to edit)
  - Keyboard navigation (arrow keys, Tab/Shift+Tab, Enter)
  - Formula bar above the grid for editing/viewing the active cell
  - Fixed headers for rows and columns (A, B, C... / 1, 2, 3...)
  - Resizable columns and rows via drag handles
  - Visual feedback for formula errors or invalid cells
- What makes their data presentation effective?
  - Minimalist design

**What I would adapt differently:**
- What doesn't translate well to spreadsheet UX?
  - Search Bar
- What would you change for this use case?
  - Search bar
  - Make the cells smaller

### Paradigm Study  
After reviewing [paradigm.co](https://paradigm.co):

**What I liked:**
- What design principles stand out?
  - straightfoward design, contrasty colors, white space.
- How do they handle information density?
  - Info density looks low everywhere except when it comes to a single cell/card
- What about their typography/spacing system?
  - The Type is very modern and simple, the white space / low density stands out in a pleasing manner.

**What I would adapt differently:**
- What's too much for a spreadsheet interface?
  -  As much as the color schema is pleasing it can be too much for a spreadsheet.
- Where would you simplify?
  - Color Schema

### My Design Synthesis
**How I'll blend both influences:**
- What will you take from each?
  - The spreadsheet core from 'v7 labs' and their minimal design
  - Use of white space / low density from 'paradigm' + Typography
- What will be uniquely yours?
  - Smaller window for the spreadsheet + More direct approach (MVP)
- What's your color palette and why?
  - I'll use something light, closer to v7 labs with a few spins of my own.
- What's your typography strategy?
  - San Serif to convey a more modern look and translate agility as the main idea for a spreadsheet on the browser

## Priority 1: Core Functionality Decisions

### Cell Selection
**How will selection work?**
- Single click behavior?
  - A single click selects a cell. To remove the selection press 'Esc'
- Visual feedback (border, background, both)?
  - I will use a very thin border and a lighter tone for the backgroud feedback
- How will you show the active cell?
  - The active cell will have a border of different collors than the others and display in the formula bar.

### Cell Editing
**Your editing strategy:**
- How does editing start? (double-click, F2, direct typing, all?)
  - One-click or double click.
- What happens when user types directly?
  - They overright the content previously in the cell.
- How does editing end? (Enter, Tab, Esc, click away?)
  - Esc cancels what was edited during this selection and keeps whaat was previously there, Enter commits the value to the sheet and selects the cell below, Tab commits the value and moves to the Cell in the next column.
- Will you show different states for viewing vs editing?
  - I'm not clear about this question, but one click shows the cell in the formular bar. If the user starts typing they overright the content.

### Keyboard Navigation  
**Which keys do what?**
- TODO: Arrow keys behavior?
- TODO: Tab/Shift+Tab?
- TODO: Enter key (commit and move down, or just commit)?
- TODO: Any shortcuts you're adding or skipping?

### Technical Choices
**How will you implement this?**
- TODO: State management approach (useState, useReducer, context)?
- TODO: How will you handle focus management?
- TODO: Event handler strategy (bubbling vs individual)?

## Priority 2: Visual Design Decisions

### Visual Hierarchy
**How will users understand the interface?**
- TODO: How do headers differ from data cells?
- TODO: How does selected cell stand out?
- TODO: How do formulas vs values look different?
- TODO: Error state appearance?

### Spacing System
**Your grid dimensions:**
- TODO: Cell width and height?
- TODO: Padding inside cells?
- TODO: Grid gaps or borders?
- TODO: Why these specific measurements?

### Color Palette
**Your chosen colors:**
```css
/* TODO: Fill in your actual color values */
--bg-primary: ???;      /* Cell background */
--bg-secondary: ???;    /* Page background */
--border-default: ???;  /* Grid lines */
--border-selected: ???; /* Selection */
--text-primary: ???;    /* Main text */
--error: ???;          /* Error states */
/* Add more as needed */
```

### Typography
**Your type choices:**
- TODO: Font for data cells (monospace or proportional)?
- TODO: Font for UI elements?
- TODO: Size scale (how many sizes, what are they)?
- TODO: Weight variations?

### Motion & Transitions
**How will things move?**
- TODO: Will you use transitions? On what?
- TODO: Animation duration if any?
- TODO: Hover states?

## Priority 3: Formula Engine Decisions

### Formula Selection
**Which 3-5 formulas did you choose?**
1. TODO: Formula 1 - Why?
2. TODO: Formula 2 - Why?
3. TODO: Formula 3 - Why?
4. TODO: Formula 4 - Why?
5. TODO: Formula 5 - Why?

### Why These Formulas?
**Your rationale:**
- TODO: What do these formulas demonstrate about your engine?
- TODO: How do they work together?
- TODO: What edge cases do they expose?
- TODO: What did you NOT choose and why?

### Parser Implementation
**Your parsing approach:**
- TODO: Tokenizer/Lexer approach?
- TODO: Parser type (recursive descent, Pratt, etc)?
- TODO: How do you handle precedence?
- TODO: How do you handle errors?

### Evaluation Strategy
**How formulas get calculated:**
- TODO: Dependency tracking method?
- TODO: Recalculation strategy (everything or just affected)?
- TODO: Cycle detection approach?
- TODO: Error propagation?

## Trade-offs & Reflection

### What I Prioritized
1. TODO: Most important aspect?
2. TODO: Second priority?
3. TODO: Third priority?

### What I Sacrificed
1. TODO: What did you skip and why?
2. TODO: What would you add with more time?
3. TODO: What was harder than expected?

### Technical Debt
**Shortcuts taken:**
- TODO: What's not production-ready?
- TODO: What would need refactoring?
- TODO: Performance implications?

### Proud Moments
**What worked well:**
- TODO: Best implementation detail?
- TODO: Clever solution?
- TODO: Clean abstraction?

### Learning Experience
**What you learned:**
- TODO: New technique discovered?
- TODO: What surprised you?
- TODO: What would you do differently?

## Time Breakdown

**How you spent your time:**
- Setup & Planning: ??? minutes
- Core Functionality: ??? minutes  
- Visual Design: ??? minutes
- Formula Engine: ??? minutes
- Testing & Polish: ??? minutes
- Documentation: ??? minutes

**If you had 1 more hour:**
- TODO: What would you add/fix/improve?

## Final Notes

TODO: Any additional thoughts, explanations, or context you want to share?