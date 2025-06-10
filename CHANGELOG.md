# Changelog

All notable changes to the Teacher Induction Log project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [25.06.05] - 2025-06-10

### Added
- **JSON_CLOB Format Support**: Complete implementation of PowerSchool JSON_CLOB data format
  - New `parseFormConfig()` function for parsing JSON_CLOB wrapped data
  - `isJsonClobFormat()` detection function for automatic format identification
  - `JsonClobEntry` and `RawFormConfig` TypeScript interfaces for type safety
  - Backward compatibility with legacy JSON format
  - Comprehensive error handling with graceful fallback
- **Enhanced Test Coverage**: Added 8 new JSON_CLOB specific tests
  - Tests for format detection, parsing, error handling, and integration
  - Increased overall test coverage to 84.44% (220 tests passing)
- **PowerSchool Integration**: Updated configuration files for JSON_CLOB format
  - Admin SQL query updated to use `JSON_ARRAYAGG(JSON_OBJECT('JSON_CLOB' VALUE json_clob))`
  - Teacher configuration converted to escaped JSON string format
  - Public configuration updated for development compatibility

### Changed
- **Enhanced App.svelte**: Improved data loading logic to handle both data formats automatically
- **formStore.ts**: Significant updates to support dual format parsing
- **Data Flow**: Modified to transparently handle JSON_CLOB format throughout the application

### Technical Details
- **Parser Logic**: Automatic detection and parsing of PowerSchool JSON_CLOB format
- **Data Structure**: Support for array-wrapped JSON with escaped string content
- **Error Resilience**: Graceful degradation when JSON_CLOB parsing fails
- **Type Safety**: Full TypeScript support with proper interface definitions
- **Production Ready**: Verified build process and deployment compatibility

### Documentation
- Updated README.md with JSON_CLOB format documentation
- Enhanced MERMAID.md with detailed data flow diagrams
- Updated TASKS.md to reflect completion and current status
- Added comprehensive code comments and type annotations

## [Previous Versions]

### [25.06.04] and earlier
- Core Svelte 5 application development
- PowerSchool custom element integration
- Form sections and UI components
- Role-based permissions system
- Print functionality and responsive design
- Initial test suite implementation
