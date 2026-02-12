# Contributing to MindfulDesk

First off, thank you for considering contributing to MindfulDesk! It's people like you that make MindfulDesk such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**

### Pull Requests

- Fill in the required template
- Follow the Rust and TypeScript style guides
- Include appropriate test cases
- Update documentation as needed
- End all files with a newline

## Development Process

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** if you've added code that should be tested
4. **Ensure the test suite passes**: `cargo test` and `npm test`
5. **Format your code**: `cargo fmt` and `npm run format`
6. **Make sure your code lints**: `cargo clippy`
7. **Write a good commit message**

## Coding Standards

### Rust
- Follow the [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Write documentation comments for public APIs
- Add tests for new functionality

### TypeScript/React
- Use TypeScript strict mode
- Follow React best practices and hooks guidelines
- Use functional components over class components
- Prefer const over let where applicable
- Use meaningful variable and function names

### Commit Messages
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

## Project Structure

```
MindfulDesk/
├── src/                    # React frontend
├── src-tauri/             # Rust backend
├── docs/                  # Documentation
└── tests/                 # Test files
```

## Testing

### Rust Tests
```bash
cd src-tauri
cargo test
```

### Frontend Tests
```bash
npm test
```

## Documentation

- Update README.md if you change functionality
- Update DEVELOPMENT.md for developer-facing changes
- Add JSDoc comments for TypeScript functions
- Add Rust doc comments for public APIs

## Release Process

Maintainers will handle releases. The process includes:

1. Update version numbers
2. Update CHANGELOG.md
3. Create a git tag
4. Build binaries
5. Create GitHub release
6. Publish to distribution channels

## Questions?

Feel free to open an issue with the "question" label or reach out to the maintainers.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project website (when available)

Thank you for contributing to MindfulDesk! 🎉
