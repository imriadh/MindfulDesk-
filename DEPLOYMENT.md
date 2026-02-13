# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Code Quality
- [x] All TypeScript errors fixed
- [x] No console.error in production
- [x] Error boundaries implemented
- [x] Loading states for all async operations
- [x] Input validation on all forms

### 2. Testing
- [ ] Manual testing of all features
- [ ] Test on Windows 10/11
- [ ] Test on macOS (Intel & Apple Silicon)
- [ ] Test on Linux (Ubuntu/Debian)
- [ ] Test database migrations
- [ ] Test notification permissions
- [ ] Test all keyboard shortcuts

### 3. Build Configuration
- [ ] Update version in `package.json`
- [ ] Update version in `src-tauri/Cargo.toml`
- [ ] Update version in `src-tauri/tauri.conf.json`
- [ ] Configure signing certificates (Windows/macOS)
- [ ] Set up auto-updater (optional)

### 4. Assets & Icons
- [x] App icons for all platforms
- [ ] Screenshots for store listings
- [ ] App preview videos (optional)
- [ ] Updated README with latest features

### 5. Documentation
- [x] User guide (QUICKSTART.md)
- [x] Developer documentation (DEVELOPMENT.md)
- [x] Contributing guidelines
- [x] Privacy policy
- [ ] Terms of service (if needed)

### 6. Performance
- [ ] Bundle size optimization
- [ ] Database query optimization
- [ ] Memory leak checks
- [ ] Startup time < 3 seconds
- [ ] CPU usage monitoring

### 7. Security
- [ ] No sensitive data in logs
- [ ] Secure data storage (SQLite encryption optional)
- [ ] Input sanitization
- [ ] XSS protection
- [ ] No hardcoded credentials

### 8. Analytics & Monitoring (Optional)
- [ ] Error tracking (Sentry)
- [ ] Usage analytics (privacy-friendly)
- [ ] Crash reporting

## Build Commands

### Development Build
```bash
npm run tauri:dev
```

### Production Build
```bash
npm run tauri:build
```

### Build for Specific Platform
```bash
# Windows
npm run tauri:build -- --target windows

# macOS
npm run tauri:build -- --target macos

# Linux
npm run tauri:build -- --target linux
```

## Release Process

1. **Version Bump**
   ```bash
   npm version patch|minor|major
   ```

2. **Update Changelog**
   - Document all changes in CHANGELOG.md
   - Follow semantic versioning

3. **Create Git Tag**
   ```bash
   git tag -a v0.1.0 -m "Release v0.1.0"
   git push origin v0.1.0
   ```

4. **Build Installers**
   - GitHub Actions will automatically build for all platforms
   - Check Actions tab for build status

5. **Test Release Builds**
   - Download artifacts from GitHub Actions
   - Test on clean machines
   - Verify all features work

6. **Publish Release**
   - Create GitHub Release from tag
   - Attach installer files
   - Write release notes

7. **Distribution**
   - Microsoft Store (see MS_STORE_GUIDE.md)
   - Mac App Store (requires Apple Developer account)
   - Linux package managers (AUR, Flathub, Snap)
   - Direct download from GitHub

## Post-Release

1. Monitor for crash reports
2. Check user feedback/issues
3. Plan hotfix if critical bugs found
4. Update documentation if needed
5. Announce release (Twitter, blog, etc.)

## Rollback Plan

If critical issues are discovered:

1. Revert to previous stable tag
2. Build hotfix version
3. Release patch version
4. Communicate with users

## Environment Variables for Production

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Signing Certificates

### Windows
- Requires code signing certificate (EV certificate recommended)
- Configure in `src-tauri/tauri.conf.json`

### macOS
- Requires Apple Developer account
- Need Apple Developer ID certificate
- Notarization required for macOS 10.15+

### Linux
- No code signing required
- GPG signing for package repositories (optional)

## Update Channels (Future)

- **Stable**: Production releases
- **Beta**: Testing new features
- **Nightly**: Automated builds from main branch

## Support Channels

- GitHub Issues: Bug reports
- GitHub Discussions: Feature requests, Q&A
- Email: support@mindfuldesk.com (if applicable)
- Discord: Community support (optional)
