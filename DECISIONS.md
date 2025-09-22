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
  - They overwrite the content previously in the cell.
- How does editing end? (Enter, Tab, Esc, click away?)
  - Esc cancels what was edited during this selection and keeps whaat was previously there, Enter commits the value to the sheet and selects the cell below, Tab commits the value and moves to the Cell in the next column.
- Will you show different states for viewing vs editing?
  - I'm not clear about this question, but one click shows the cell in the formular bar. If the user starts typing they overwrite the content.

### Keyboard Navigation  
**Which keys do what?**
- Arrow keys behavior?
  - Arrow keys navigate through the grid in the direction of the arrow
- Tab/Shift+Tab?
  - Tab moves to the right, Shift+Tab moves to the left
- Enter key (commit and move down, or just commit)?
  - Commit and move down
- Any shortcuts you're adding or skipping?
  - Esc to undo the current editing

### Technical Choices
**How will you implement this?**
- State management approach (useState, useReducer, context)?
  - I'm using zodstand as a state manager. This library is a lighter approach than Redux
- How will you handle focus management?
  - useRef and useEffect Hooks
- Event handler strategy (bubbling vs individual)?
  - Individual event handling

## Priority 2: Visual Design Decisions

### Visual Hierarchy
**How will users understand the interface?**
- How do headers differ from data cells?
  - Typography and design hierarchy through colors
- How does selected cell stand out?
  - A bright blue border outlines the selected cell
- How do formulas vs values look different?
  - Formula cells have a slightly diffent background color
- Error state appearance?
  - Error cells appear with a light red background

### Spacing System
**Your grid dimensions:**
- Cell width and height?
  - width and height are fixed
- Padding inside cells?
  - No
- Grid gaps or borders?
  - No gaps, light gray borders
- Why these specific measurements?
  - They staty true to my vision of what the design should look like based on the references given.

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
- Font for data cells (monospace or proportional)?
  - san serif
- Font for UI elements?
  - Inter
- Size scale (how many sizes, what are they)?
  - 3xl for page titles and md for normal elements
- Weight variations?
  - Bold for page titles

### Motion & Transitions
**How will things move?**
- Will you use transitions? On what?
  - No
- Animation duration if any?
  - spinning animations on loading elements
- Hover states?
  - yes buttons and main menu sections

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
1. Most important aspect?
   1. Functionality, which means cell editing, keyboard navigation, relation between cell and formular bar.
2. Second priority?
   1. Style for sure, besides a decent functionality, the frontend style is what matters the most to me
3. Third priority?

### What I Sacrificed
1. What did you skip and why?
   1. I wanted more time to think about performance optimization and apply more advanced techniques, but I prioritized having it work before being perfect
2. What would you add with more time?
   1. Transitions and animations for the pages transitions and button clicks
3. What was harder than expected?
   1. The different behaviours of the cell depending on the user interation (one click, two clicks, commit, escape)

### Technical Debt
**Shortcuts taken:**
- TODO: What's not production-ready?
  - The Formulas
- TODO: What would need refactoring?
  - Formulas
- TODO: Performance implications?
  - Yes the rendering of the cells need a performance boost

### Proud Moments
**What worked well:**
- Best implementation detail?
  - the trick to handle Cell rendering as a div and only render a input over it when the Cell is selected
- Clever solution?
  - Optimized Cell rendering
- Clean abstraction?
  - The state management: zodstand

### Learning Experience
**What you learned:**
- New technique discovered?
  - I just loved build a spreadsheet, something I never done before
- What surprised you?
  - How a simple navigation control in a spreadsheet can be so tricky
- What would you do differently?
  - If I had more time to research I would definetly implement and use the helper functions, but I just didn't have the time

## Time Breakdown

**How you spent your time:**
- Setup & Planning: 20 min
- Core Functionality: 180 minutes  
- Visual Design: 10 minutes
- Formula Engine: 0 minutes
- Testing & Polish: 20 minutes
- Documentation: 10 minutes

**If you had 1 more hour:**
- What would you add/fix/improve?
  - polish navigation bugs taking better advantage of helper functions

## Final Notes

Dear Ryan,

I really enjoyed this challenge, and I believe even though the product is not 100% finished it is a good display of the techniques I can employ specially in the frontend. 
I took advantage of some react techniques of optimization like useMemo and useCallback hooks, along with a memo wrapper. These help the tiny grid not get overloaded when the spreadsheets start scalling.
With more time I would clean up the bugs in the navigation and editing features, and implement the Formulas in the spreadsheet. I would like to take more advantage of the helper functions, but I had a race against the clock so I didn't.
The minimal design with only shades of gray, black and white are a personal choice based on the refferences and what I understand is the best design for a spreadsheet.
I hope I have the chance to discuss any questions you might have about this challenge. 

Best,
Silas