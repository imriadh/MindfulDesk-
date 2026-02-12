# 💰 Microsoft Store Publishing Guide

Complete guide to publishing MindfulDesk on the Microsoft Store.

## Prerequisites

### 1. Microsoft Partner Center Account

- Visit [Microsoft Partner Center](https://partner.microsoft.com/dashboard)
- Cost: **$19 USD** (one-time fee for individual developers)
- Required information:
  - Publisher display name
  - Contact information
  - Payment/banking details (for paid apps)
  - Tax information

### 2. App Requirements

- ✅ Windows 10 version 1809 or higher
- ✅ MSIX package format
- ✅ Valid code signing certificate
- ✅ Privacy policy URL
- ✅ Screenshots and marketing materials
- ✅ Age rating

## Step 1: Reserve App Name

1. Log in to [Partner Center](https://partner.microsoft.com/dashboard)
2. Go to **Apps and games**
3. Click **New product** → **MSIX or PWA app**
4. Enter "**MindfulDesk**" as the app name
5. Check availability and reserve

**Note**: Name reservation lasts 3 months. Reserve as soon as possible!

## Step 2: Generate MSIX Package

### Option A: Using Tauri (Recommended)

```bash
# Build for Windows with MSIX
npm run tauri:build -- --target x64-pc-windows-msvc

# Output location:
# src-tauri/target/release/bundle/msi/MindfulDesk_0.1.0_x64_en-US.msi
```

### Option B: Convert MSI to MSIX

Use the [MSIX Packaging Tool](https://www.microsoft.com/store/productId/9N5LW3JBCXKF):

1. Install MSIX Packaging Tool from Microsoft Store
2. Select "Application package"
3. Choose your MSI file
4. Follow the wizard
5. Sign the package

## Step 3: Code Signing

### Get a Certificate

**Option A**: Purchase from a Certificate Authority
- DigiCert, Sectigo, GlobalSign, etc.
- Cost: ~$200-500/year
- **EV (Extended Validation)** certificates are preferred

**Option B**: Self-sign for testing only
```powershell
# Create self-signed certificate (testing only!)
New-SelfSignedCertificate -Type CodeSigning -Subject "CN=YourName" -CertStoreLocation Cert:\CurrentUser\My
```

### Sign the Package

```powershell
# Using signtool (part of Windows SDK)
signtool sign /fd SHA256 /a /f YourCertificate.pfx /p YourPassword MindfulDesk.msix
```

## Step 4: Create Privacy Policy

### Host Privacy Policy

**Option A: GitHub Pages** (Free)
1. Create `docs/privacy.html` in your repo
2. Enable GitHub Pages in repo settings
3. URL: `https://yourusername.github.io/MindfulDesk/privacy.html`

**Option B: Custom Domain**
- Host on your own website
- Must be publicly accessible HTTPS URL

**Required Content** (see [PRIVACY.md](PRIVACY.md)):
- What data you collect
- How you use it
- Third-party services
- User rights
- Contact information

## Step 5: Prepare Marketing Assets

### Screenshots

**Requirements:**
- **Format**: PNG or JPEG
- **Recommended size**: 1920x1080 or 1366x768
- **Minimum**: 3 screenshots
- **Recommended**: 8-10 screenshots
- **What to capture**:
  1. Focus timer in action
  2. Statistics dashboard with charts
  3. Mood journal with entries
  4. Settings page with achievements
  5. Dark theme variant
  6. Various states (active timer, break, completed session)

**Tips:**
- Use clean, realistic data
- Highlight key features
- Show both light and dark themes
- Remove any personal/test data
- Use high-quality, crisp images

### App Description

**Title** (50 chars max):
```
MindfulDesk - Focus Timer & Wellness Tracker
```

**Short Description** (200 chars max):
```
Boost productivity with Pomodoro timers, track screen time, journal your mood, and build healthy work habits. Privacy-first, all data stored locally.
```

**Full Description**:
```markdown
Transform your work routine with MindfulDesk - the privacy-first productivity companion.

🎯 FOCUS TIMER
Stay productive with customizable Pomodoro sessions. Set your work intervals, take scheduled breaks, and maintain focus without burnout.

📊 TRACK YOUR PROGRESS
Visualize your productivity with beautiful charts. See daily and weekly statistics, monitor your focus time, and export your data anytime.

📔 MOOD JOURNALING
Check in with yourself daily. Rate your mood, add reflections, and discover patterns between your wellbeing and work habits.

🏆 GAMIFICATION
Build streaks, unlock achievements, and level up. Stay motivated with a system that celebrates your consistency.

🎨 BEAUTIFUL INTERFACE
Choose between elegant light and dark themes. Enjoy a clean, distraction-free interface designed for focus.

🔒 PRIVACY FIRST
All your data stays on your device. No cloud requirements, no tracking, no data collection. You're in complete control.

✨ KEY FEATURES
• Customizable Pomodoro timers (25/5/15 min defaults)
• Daily and weekly statistics
• Mood tracking with trend analysis
• Achievement system with streaks
• Data export (CSV format)
• Native system notifications
• Works 100% offline
• Cross-platform (Windows, Mac, Linux)

PERFECT FOR:
- Remote workers seeking better focus
- Students managing study sessions
- Anyone building mindful work habits
- People tracking work-life balance

NO ADS. NO SUBSCRIPTIONS. NO DATA COLLECTION.

Download MindfulDesk today and build a healthier, more focused work routine.
```

### App Icon

- **Size**: 300x300 pixels minimum
- **Format**: PNG with transparency
- **Style**: Should match in-app icon
- **Requirements**: 
  - Clear at all sizes
  - No padding or borders
  - Professional appearance

### Promotional Images (Optional but Recommended)

**Hero Image** (1920x1080):
- Feature image shown in Store
- Showcase key features
- Professional design

**Promotional Banner** (2400x1200):
- Used in Store promotions
- Eye-catching design
- Clear value proposition

## Step 6: Complete Store Listing

### 1. Properties

- **Category**: Productivity
- **Sub-category**: Time Management
- **Pricing**: 
  - **Base App**: Free
  - **Premium Features**: $4.99 (optional IAP)
- **Markets**: Select all relevant countries
- **Age Rating**: Complete questionnaire (likely PEGI 3 / ESRB Everyone)

### 2. Packages

- Upload your signed MSIX file
- Set minimum Windows version: **Windows 10, version 1809 (10.0; Build 17763)**
- Architecture: x64 (and ARM64 if supported)

### 3. Store Listings

For each language (start with English):

- App name: MindfulDesk
- Short description
- Full description (see above)
- Screenshots (3-10)
- App icon
- Privacy policy URL
- Support contact information
- Copyright information

### 4. Pricing and Availability

**Free with Premium Options:**
- Base price: Free
- In-app purchases:
  - Premium Upgrade: $4.99
  - Features: Cloud sync, AI insights, calendar integration

**Or Simple Paid:**
- One-time purchase: $4.99
- No IAPs

### 5. Store Submission Checklist

- [ ] App package uploaded and validated
- [ ] Privacy policy URL added
- [ ] Age rating completed
- [ ] Screenshots uploaded (min 3)
- [ ] App icon uploaded
- [ ] Description written and reviewed
- [ ] Support email/website added
- [ ] Pricing configured
- [ ] Markets selected
- [ ] Test on Windows 10 and 11
- [ ] Accessibility features documented

## Step 7: Submit for Certification

1. Review all information
2. Click **Submit to the Store**
3. Wait for certification (typically 24-48 hours)
4. Respond to any feedback from Microsoft

### Common Certification Issues

- **Crashes on launch**: Test thoroughly first
- **Missing privacy policy**: Ensure URL is accessible
- **Inaccurate age rating**: Answer questionnaire honestly
- **Poor screenshots**: Use clear, high-quality images
- **Misleading description**: Accurately represent features

## Step 8: Post-Publication

### Monitor Performance

- Check download statistics
- Read user reviews
- Monitor crash reports
- Track conversion rates (if paid)

### Responding to Reviews

- Respond to all reviews (especially negative ones)
- Thank users for positive feedback
- Provide solutions for issues
- Direct users to support channels

### Updates

Update process:
1. Increment version number
2. Build new MSIX package
3. Upload to Partner Center
4. Submit updated package
5. Certification (faster for updates)

### Marketing

- Share Store link on social media
- Add badge to website/GitHub
- Create promotional content
- Reach out to tech blogs/reviewers

## Microsoft Store Badge

Add to your README:

```markdown
<a href="https://www.microsoft.com/store/apps/9XXXXXXXXX">
  <img src="https://developer.microsoft.com/store/badges/images/English_get-it-from-MS.png" alt="Get it from Microsoft" height="60"/>
</a>
```

## Pricing Strategy

### Freemium Model (Recommended)

**Free Features:**
- All core functionality
- Focus timer
- Basic statistics
- Mood journal
- Achievements
- Local data storage

**Premium ($4.99 one-time or $2.99/month):**
- Cloud sync
- AI-powered insights
- Advanced analytics
- Calendar integration
- Priority support
- Early access to features

### Benefits of Freemium:
- Larger user base
- Better reviews and ratings
- Word-of-mouth growth
- Users try before buying
- Microsoft Store visibility boost

## Timeline

| Step | Duration |
|------|----------|
| Partner Center Account Setup | 1 hour |
| App Name Reservation | 5 minutes |
| Package Preparation | 2-4 hours |
| Code Signing Setup | 1-2 hours |
| Privacy Policy Creation | 1 hour |
| Screenshot Creation | 2-3 hours |
| Store Listing | 2-3 hours |
| Initial Submission | 5 minutes |
| Certification | 24-48 hours |
| **Total** | **~2-3 days** |

## Helpful Resources

- [Partner Center Dashboard](https://partner.microsoft.com/dashboard)
- [App Certification Requirements](https://docs.microsoft.com/windows/uwp/publish/the-app-certification-process)
- [MSIX Packaging Guide](https://docs.microsoft.com/windows/msix/)
- [Store Policies](https://docs.microsoft.com/windows/uwp/publish/store-policies)
- [Age Ratings](https://docs.microsoft.com/windows/uwp/publish/age-ratings)

## Support

Questions about Store submission? Open an issue on GitHub or contact Microsoft Partner Support.

---

**Good luck with your Microsoft Store launch! 🚀**
