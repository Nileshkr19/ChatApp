# Auth Controller Tests - Cypress Only

This project uses **Cypress** as the single testing framework for both unit-style tests and end-to-end integration tests.

## Why Cypress Only?

- ✅ **Single Framework**: No need to learn/maintain multiple testing tools
- ✅ **Unified Approach**: Same syntax for all tests
- ✅ **Visual Debugging**: Cypress GUI for easy debugging
- ✅ **Built-in Assertions**: Comprehensive assertion library
- ✅ **Real Browser Environment**: Tests run in actual browser context

## Test Structure

### E2E Integration Tests

- **Purpose**: Test complete HTTP request/response cycles
- **Covers**: API endpoints, database operations, authentication flows

### Unit-Style Logic Tests

- **Purpose**: Test individual functions and logic in isolation
- **Covers**: Data validation, calculations, business logic, edge cases

## Running Tests

### Install Dependencies

```bash
npm install
```

### Run Tests

```bash
# Run all tests (requires server running)
npm run test

# Run only auth controller tests
npm run test:auth

# Open Cypress GUI for interactive testing
npm run cy:open

# Run tests headless
npm run cy:run

# Start server and run tests automatically
npm run cy:test
```

## Test Coverage

### 🔐 **Authentication Flow Tests**

- ✅ User registration with OTP
- ✅ OTP verification (valid/invalid/expired)
- ✅ User login/logout
- ✅ Protected route access
- ✅ Complete authentication workflow

### ⏰ **OTP Expiration Logic (15 minutes)**

- ✅ OTP expires exactly 15 minutes after creation
- ✅ Expired OTP detection and handling
- ✅ Valid OTP detection within 15-minute window
- ✅ Edge cases (almost expired, just expired)
- ✅ Date/time calculation validation

### 🧮 **Business Logic Validation**

- ✅ Email format validation (regex patterns)
- ✅ Password strength requirements
- ✅ OTP generation (6-digit numbers)
- ✅ String comparison logic for OTP verification
- ✅ JWT token expiration calculations
- ✅ Cookie security configuration

### 🗃️ **Database Transaction Logic**

- ✅ User creation workflow
- ✅ OTP cleanup after verification
- ✅ Refresh token management
- ✅ Transaction rollback scenarios

### 🚨 **Error Handling**

- ✅ Missing required fields
- ✅ Invalid email formats
- ✅ Weak passwords
- ✅ Duplicate user registration
- ✅ Wrong login credentials
- ✅ Invalid/expired OTPs
- ✅ Unauthorized access attempts

## Key Features Verified

### OTP System ⏱️

```javascript
// OTP expires in exactly 15 minutes
otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000);

// Validation logic
if (String(user.otp) !== String(otp) || user.otpExpiresAt < new Date()) {
  throw new ApiError(400, "Invalid or expired OTP");
}
```

### Security Features 🔒

- Password hashing with bcrypt
- JWT token generation and validation
- Secure HTTP-only cookies
- CSRF protection with SameSite cookies
- Email verification workflow

### Database Operations 💾

- Prisma transaction management
- Soft delete patterns
- Data cleanup and validation
- Relationship handling

## Test Organization

```
cypress/
├── e2e/
│   ├── auth.controller.test.cy.js  # Complete auth tests
│   ├── chat.test.cy.js            # Chat functionality
│   └── message.test.cy.js         # Message handling
└── support/
    ├── helpers.js                 # Reusable test functions
    └── commands.js                # Custom Cypress commands
```

## Environment Setup

- **Development**: Tests use development database
- **CI/CD**: Configurable for different environments
- **Isolation**: Each test cleans up after itself

## Best Practices Used

- 🔄 **Test Isolation**: Each test is independent
- 🧹 **Cleanup**: Proper cleanup between tests
- 📊 **Assertions**: Comprehensive validation
- 🎯 **Focus**: Tests target specific functionality
- 📝 **Documentation**: Clear test descriptions
- 🚀 **Performance**: Optimized test execution

## Test Results Summary

- **Total Tests**: 25+ comprehensive test cases
- **Coverage**: All auth controller functions
- **OTP Logic**: Fully validated 15-minute expiration
- **Security**: All security features tested
- **Error Handling**: Complete error scenario coverage

Run `npm run test:auth` to execute all auth controller tests and verify your 15-minute OTP expiration is working correctly! 🎉
