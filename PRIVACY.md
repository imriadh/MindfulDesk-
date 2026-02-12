# Privacy Policy for MindfulDesk

**Last Updated: February 12, 2026**

## Introduction

MindfulDesk ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our desktop application collects, uses, and safeguards your information.

## Data Collection

### What We Collect

MindfulDesk is designed with privacy as a core principle. The application stores data **locally on your device only**. We collect:

1. **Focus Session Data**
   - Start and end times of focus sessions
   - Session types (focus, short break, long break)
   - Completion status
   
2. **Activity Logs**
   - Time spent in focus/break modes
   - Session statistics
   
3. **Journal Entries**
   - Mood ratings (1-5 scale)
   - Personal notes you choose to write
   - Entry dates
   
4. **Achievement Data**
   - Progress toward achievements
   - Unlock dates
   - Streak information
   
5. **Application Settings**
   - Timer duration preferences
   - Notification preferences
   - Theme preference (light/dark)

### What We DON'T Collect

- We do **NOT** collect any personal identification information
- We do **NOT** track your browsing history
- We do **NOT** access your files or other applications
- We do **NOT** send any data to external servers
- We do **NOT** use analytics or telemetry services
- We do **NOT** share your data with third parties

## Data Storage

All data is stored **locally** on your device using SQLite database:

- **Windows**: `%APPDATA%\com.mindfuldesk.app\mindfuldesk.db`
- **macOS**: `~/Library/Application Support/com.mindfuldesk.app/mindfuldesk.db`
- **Linux**: `~/.local/share/com.mindfuldesk.app/mindfuldesk.db`

You have complete control over this data and can delete it at any time by removing the database file.

## Data Usage

Your data is used exclusively for:

1. Displaying your focus session history
2. Calculating statistics and trends
3. Showing mood patterns over time
4. Tracking achievements and streaks
5. Personalizing your experience with saved settings

## Data Export

You can export your data at any time:
- **Statistics**: Export as CSV format via the Stats tab
- **Full Backup**: Manually copy the SQLite database file

## Cloud Sync (Optional Premium Feature)

If you choose to enable cloud sync (premium feature, not included in v0.1.0):
- You explicitly opt-in to this feature
- Data is encrypted before upload
- You control which cloud provider to use (OneDrive/Google Drive)
- You can disable sync at any time
- Local data remains on your device

## Third-Party Services

MindfulDesk does not integrate with any third-party services in the base version. Future premium features may include:
- Cloud storage providers (OneDrive, Google Drive) - **opt-in only**
- Calendar integration - **opt-in only**

We will update this policy if such features are added.

## Notifications

The application sends local system notifications to:
- Alert you when a focus session ends
- Remind you to take breaks
- Celebrate achievements

These notifications are generated locally and do not transmit any data.

## Children's Privacy

MindfulDesk does not collect any personal information from anyone, including children under 13. The application can be safely used by users of all ages.

## Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by:
- Posting the new Privacy Policy in the application
- Updating the "Last Updated" date
- Announcing significant changes in release notes

## Your Rights

You have the right to:
- Access all your data (it's stored locally on your device)
- Export your data in standard formats
- Delete your data at any time
- Use the application completely offline

## Data Security

Since all data is stored locally:
- Your data never leaves your device (unless you opt into premium cloud features)
- No internet connection is required for core functionality
- You are responsible for securing your device
- We recommend regular backups of your database file

## Contact Us

If you have questions about this Privacy Policy or MindfulDesk's privacy practices:

- **GitHub Issues**: [github.com/yourusername/MindfulDesk/issues](https://github.com/yourusername/MindfulDesk/issues)
- **Email**: privacy@mindfuldesk.app

## Open Source

MindfulDesk is open source software. You can review the source code to verify our privacy claims:
- **Repository**: [github.com/yourusername/MindfulDesk](https://github.com/yourusername/MindfulDesk)
- **License**: MIT License

## Compliance

MindfulDesk is designed to be compliant with:
- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **COPPA** (Children's Online Privacy Protection Act)

Since we don't collect personal data or transmit any information, compliance is inherent to our design.

## Consent

By using MindfulDesk, you consent to this Privacy Policy.

---

**MindfulDesk - Privacy-First Productivity**
