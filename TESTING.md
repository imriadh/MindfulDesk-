# MindfulDesk Testing Checklist

## 🧪 Manual Testing Guide

### Focus & Break Timers
- [ ] Start a 25-minute focus session
- [ ] Pause and resume timer
- [ ] Stop timer mid-session
- [ ] Complete a focus session - verify notification appears
- [ ] Start a short break (5 min)
- [ ] Start a long break (15 min)
- [ ] Verify motivational quote appears after focus session
- [ ] Check session counter increments
- [ ] Test timer accuracy (compare with system clock)

### Stats & Analytics
- [ ] View weekly focus/break chart
- [ ] Verify completed sessions counter
- [ ] Check streak counter updates
- [ ] Verify active/idle time tracking
- [ ] Export stats as CSV
- [ ] Verify exported data is correct
- [ ] Check charts render correctly
- [ ] Test with zero data (fresh install)

### Journal & Mood Tracking
- [ ] Add new journal entry
- [ ] Select mood (1-5 stars)
- [ ] Add notes to entry
- [ ] Edit existing entry
- [ ] Delete entry
- [ ] View mood trends chart
- [ ] Filter entries by date
- [ ] Test with empty state
- [ ] Test with many entries (50+)

### Distraction Blocker
- [ ] Enable/disable blocker
- [ ] Add blocked website manually
- [ ] Quick-add popular site
- [ ] Toggle individual blocked item
- [ ] Remove blocked item
- [ ] Request 5-minute override
- [ ] Verify override timer counts down
- [ ] End override manually
- [ ] Test with focus mode active
- [ ] Verify settings persist after restart

### Health Reminders
- [ ] Enable/disable all reminders
- [ ] Toggle individual reminder
- [ ] Edit reminder interval
- [ ] Edit reminder message
- [ ] Add custom reminder
- [ ] Delete custom reminder
- [ ] Verify notifications appear at correct intervals
- [ ] Test with "only during focus" setting
- [ ] Verify default reminders can't be deleted

### Settings & Achievements
- [ ] Change work duration
- [ ] Change break durations
- [ ] Toggle auto-start options
- [ ] Enable/disable notifications
- [ ] Enable/disable sound
- [ ] Save settings - verify they persist
- [ ] View achievements list
- [ ] Check achievement progress
- [ ] Unlock an achievement
- [ ] Verify achievement unlock notification

### Theme & UI
- [ ] Toggle dark/light theme
- [ ] Verify theme persists after restart
- [ ] Check all tabs are accessible
- [ ] Test responsive layout (resize window)
- [ ] Verify minimum window size
- [ ] Check all icons display correctly
- [ ] Test all buttons are clickable
- [ ] Verify proper focus states (keyboard nav)

### Error Handling
- [ ] Test with no internet (offline mode)
- [ ] Test with database error
- [ ] Verify error boundary catches React errors
- [ ] Check loading states appear appropriately
- [ ] Test with denied notification permission
- [ ] Try invalid input in forms
- [ ] Test edge cases (0 duration, empty fields)

### Performance
- [ ] Check app startup time (< 3 seconds)
- [ ] Monitor CPU usage (should be minimal when idle)
- [ ] Check memory usage (< 150MB typical)
- [ ] Test with long-running session (8+ hours)
- [ ] Verify no memory leaks
- [ ] Check responsiveness during background tasks

### Data Persistence
- [ ] Add data, restart app - verify data persists
- [ ] Test database cleanup (old entries)
- [ ] Export data backup
- [ ] Import data from backup (if implemented)
- [ ] Clear app data - verify clean slate
- [ ] Test database migration (version upgrade)

### Platform-Specific Tests

#### Windows
- [ ] Test on Windows 10
- [ ] Test on Windows 11
- [ ] Verify system tray integration
- [ ] Test startup on boot (if configured)
- [ ] Check UAC prompts (should be none)
- [ ] Verify installer works
- [ ] Test update mechanism

#### macOS
- [ ] Test on Intel Mac
- [ ] Test on Apple Silicon Mac
- [ ] Verify menu bar integration
- [ ] Test dock icon behavior
- [ ] Check permissions (notifications, screen)
- [ ] Verify .dmg installer
- [ ] Test update mechanism

#### Linux
- [ ] Test on Ubuntu 22.04+
- [ ] Test on Fedora
- [ ] Test on Arch Linux
- [ ] Verify system notifications work
- [ ] Check .deb installer
- [ ] Check .AppImage works
- [ ] Test different desktop environments (GNOME, KDE, XFCE)

### Accessibility
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Verify screen reader compatibility
- [ ] Check color contrast (WCAG AA)
- [ ] Test with high contrast mode
- [ ] Verify focus indicators visible
- [ ] Test with large text/zoom
- [ ] Check keyboard shortcuts listed

### Security
- [ ] No sensitive data in logs
- [ ] Database file properly secured
- [ ] No XSS vulnerabilities
- [ ] Input validation on all forms
- [ ] No SQL injection risks
- [ ] Check for dependency vulnerabilities (`npm audit`)

## 🤖 Automated Testing (Future)

### Unit Tests
- [ ] Timer logic tests
- [ ] Data calculations tests
- [ ] Storage utility tests
- [ ] Date/time formatting tests

### Integration Tests
- [ ] Database operations
- [ ] API-like Tauri commands
- [ ] Settings persistence
- [ ] Notification triggering

### E2E Tests (with Playwright or similar)
- [ ] Complete focus session flow
- [ ] Journal entry creation flow
- [ ] Settings update flow
- [ ] Export data flow

## 📊 Test Coverage Goals
- Unit tests: 70%+
- Integration tests: 50%+
- E2E tests: Critical paths covered

## 🐛 Bug Reporting Template

When reporting issues, include:
1. OS and version
2. App version
3. Steps to reproduce
4. Expected behavior
5. Actual behavior
6. Screenshots/logs
7. Reproducibility (always/sometimes/rare)

## ✅ Pre-Release Verification

Before each release:
1. Run full manual test suite
2. Check for console errors
3. Verify no unhandled promise rejections
4. Test clean install on all platforms
5. Verify update mechanism works
6. Check all links in documentation
7. Spell check all user-facing text
8. Verify version numbers consistent
