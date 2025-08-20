# SMS Setup Guide - Resolving API Error 1003

## Issue Description

You're getting error code 1003 with message "Please Required all fields, or Contact Your System Administrator" from the BulkSMS BD API.

## Root Causes & Solutions

### 1. Missing or Invalid API Key

**Problem**: The `BULKSMS_API_KEY` environment variable is not set or is invalid.

**Solution**:

1. Get your API key from [BulkSMS BD](https://bulksmsbd.net/)
2. Add it to your `.env` file:
   ```
   BULKSMS_API_KEY=your_actual_api_key_here
   ```
3. Restart your application

### 2. Phone Number Format Issues

**Problem**: Phone numbers might not be in the correct format expected by the API.

**Solution**: The updated code now automatically formats phone numbers:

- Removes the `+` prefix if present
- Ensures the number starts with `88` (Bangladesh country code)
- Example: `+8801234567890` → `8801234567890`

### 3. API Request Format Issues

**Problem**: The BulkSMS BD API might require specific request formats or additional fields.

**Solution**: The updated code now includes:

- **Dual format support**: Tries form data first, then JSON as fallback
- **Additional required fields**: campaign, schedule, unicode
- **Proper Content-Type headers**: application/x-www-form-urlencoded and application/json
- **Request timeout**: 10 seconds
- **Better error handling and logging**

### 4. API Key Validation

**Problem**: The API key might be invalid or the account might have insufficient balance.

**Solution**: 
- Verify your API key is active and valid
- Check your BulkSMS BD account balance
- Ensure your sender ID is approved

## Testing the Setup

### 1. Check Environment Variable

```bash
# In your terminal, check if the variable is set
echo $BULKSMS_API_KEY
```

### 2. Test with a Valid Phone Number

Use a valid Bangladeshi phone number format:

- `+8801234567890`
- `8801234567890`
- `01234567890` (will be automatically formatted)

### 3. Monitor Logs

The updated code provides detailed logging:

- API request data (with masked API key)
- API response
- Error details if any

## Development Mode

If SMS fails, the system will automatically fall back to development mode and log the OTP to the console, so you can still test the functionality.

## Common API Response Codes

- `1000`: Success
- `1003`: Missing required fields
- `1004`: Invalid API key
- `1005`: Invalid phone number format
- `1006`: Insufficient balance

## Troubleshooting Steps

1. **Verify API Key**: Ensure your BulkSMS BD API key is valid and active
2. **Check Balance**: Ensure your BulkSMS BD account has sufficient balance
3. **Phone Format**: Use proper Bangladeshi phone number format
4. **Network**: Ensure your server can reach `https://bulksmsbd.net/api/smsapi`
5. **Rate Limits**: Check if you've exceeded API rate limits

## Alternative SMS Providers

If BulkSMS BD continues to have issues, consider:

- Twilio
- MessageBird
- Vonage (formerly Nexmo)
- Local Bangladeshi SMS providers

## Support

If issues persist, contact BulkSMS BD support with your API key and the exact error response.
