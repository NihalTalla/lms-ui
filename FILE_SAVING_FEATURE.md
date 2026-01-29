# Code Practice & Problem Solving - File Saving Feature

## Overview

Students can now save and manage their code files directly from the Monaco Editor in both the **Code Practice Console** and **Problem Solving Editor**. This feature allows students to:

- ✅ **Save code** to browser storage with a custom file name
- 📥 **Load saved files** back into the editor
- 💾 **Download files** as `.js`, `.py`, `.java`, etc.
- 🗑️ **Delete files** they no longer need
- 📊 **Manage up to 50 files** in their library
- ⏰ **Track when files** were last modified

---

## Features

### 1. **Save File**

#### In Code Practice Console:
1. Click the **Save** button in the toolbar
2. Enter a file name (e.g., "my_script")
3. Click "Save File"
4. File is stored in browser's localStorage

#### In Problem Solving Editor:
1. Click the **Save** button in the toolbar
2. A default name is suggested (e.g., "Two Sum - Solution")
3. Edit the name if desired
4. Click "Save Solution"
5. File is linked to the specific problem

### 2. **View Saved Files**

- Click the **Files (X)** button to see all saved files
- For Code Practice: Shows all saved practice files
- For Problem Solving: Shows solutions saved for that specific problem
- Each file shows:
  - File name
  - Programming language
  - Last modified time (e.g., "2h ago", "Just now")

### 3. **Load a Saved File**

1. Click **Files** button
2. Click the **Load** button next to the file you want
3. The code and language are automatically loaded into the editor
4. Dialog closes automatically

### 4. **Download a File**

1. Click **Files** button
2. Click the **Download** button (📥 icon) next to the file
3. File is downloaded with the correct extension:
   - JavaScript → `.js`
   - Python → `.py`
   - Java → `.java`
   - C++ → `.cpp`
   - C# → `.cs`
   - Go → `.go`
   - Rust → `.rs`

### 5. **Delete a File**

1. Click **Files** button
2. Click the **Delete** button (🗑️ icon) next to the file
3. Confirm the action - file is removed from storage

---

## File Management Details

### Storage Capacity
- **Max Files**: 50 files per student
- **Storage Type**: Browser localStorage (persists even after closing the browser)
- **Data Persistence**: Files remain saved until manually deleted

### File Information Stored
```typescript
{
  id: string;              // Unique file identifier
  name: string;           // File name (user-provided)
  code: string;           // Full code content
  language: string;       // Programming language
  timestamp: number;      // When file was created
  lastModified: number;   // Last modification time
  problemId?: string;     // Only in problem editor (links to problem)
}
```

### Naming Conventions
- File names can contain spaces and special characters
- Names are displayed as-is when downloading
- File extensions are automatically added based on language

---

## Use Cases

### For Code Practice Console
**Scenario**: A student is learning JavaScript
1. Student writes a function to calculate Fibonacci
2. Clicks **Save** and names it "Fibonacci Generator"
3. Continues practicing with new code
4. Later, wants to review the Fibonacci solution
5. Clicks **Files**, finds "Fibonacci Generator", and clicks **Load**
6. Can modify and run it again without retyping

### For Problem Solving Editor
**Scenario**: A student is solving the "Two Sum" problem
1. Writes a solution in Python
2. Clicks **Save** (default: "Two Sum - Solution")
3. Runs and submits the code
4. Works on other problems
5. Later, returns to "Two Sum"
6. Clicks **Files**, sees all previous solutions for this problem
7. Can load any previous attempt to review or improve it
8. Downloads the accepted solution as `two-sum-solution.py`

---

## Technical Implementation

### File Manager API

The `FileManager` utility handles all file operations:

```typescript
// Save a file
FileManager.saveFile(name, code, language, problemId?)

// Get all files
FileManager.getAllFiles()

// Get files for a problem
FileManager.getFilesByProblem(problemId)

// Get a specific file
FileManager.getFile(id)

// Delete a file
FileManager.deleteFile(id)

// Rename a file
FileManager.renameFile(id, newName)

// Download file
FileManager.downloadFile(file)

// Format date
FileManager.formatDate(timestamp)

// Clear all files
FileManager.clearAllFiles()
```

### Browser Storage
- Uses **localStorage API**
- Data stored under key: `saved_code_files`
- Survives browser restarts and tabs closing
- **Note**: Data is cleared if browser cache is cleared

---

## Browser Compatibility

✅ Works on all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

⚠️ **Important**: Incognito/Private mode may limit storage persistence

---

## Best Practices

1. **Give meaningful names** to your files:
   - ✅ "Merge Intervals - Two Pointers Approach"
   - ❌ "code1", "solution", "test"

2. **Download important solutions** as backups
3. **Clean up** old or duplicate files regularly
4. **Keep track** of your most efficient solutions
5. **Use version naming** for iterations:
   - "BinarySearch - v1 Linear"
   - "BinarySearch - v2 Optimized"

---

## Troubleshooting

### Files not saving?
- Check if localStorage is enabled in browser settings
- Clear browser cache and try again
- Ensure you have sufficient disk space

### Downloaded file is empty?
- This shouldn't happen, but refresh the page and try again
- Check your browser's download folder

### Maximum files reached?
- Delete some old files first
- The system will auto-delete the oldest file if limit is reached

### Lost all files accidentally?
- Unfortunately, once deleted from localStorage, files cannot be recovered
- Always download important solutions as backups

---

## Future Enhancements

Planned features for this file saving system:
- 📤 Upload/Import files
- 🏷️ Tags and categorization
- 🔍 Search and filter
- ⭐ Favorite/bookmark files
- 👥 Share solutions with peers
- ☁️ Cloud sync across devices
- 📝 Add notes/comments to solutions
- 📊 Track practice statistics

---

## Quick Reference

| Action | Button | Keyboard |
|--------|--------|----------|
| Save File | Click "Save" | Ctrl+S (planned) |
| View Files | Click "Files (X)" | - |
| Load File | Files → Load | - |
| Download | Files → Download (📥) | - |
| Delete | Files → Delete (🗑️) | - |
| Run Code | Click "Run" | Ctrl+Enter |
| Submit | Click "Submit" | - |

---

## Support

For issues or feature requests:
- Contact your instructor
- Report bugs in the student feedback section
- Check documentation in the dashboard help menu
