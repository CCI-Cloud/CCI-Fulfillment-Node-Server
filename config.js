const Joi = require("joi");

// Define a schema to validate the environment variables using Joi.
// The schema describes the expected format and constraints for each environment variable.
const schema = Joi.object({
	CLIENT_ID: Joi.string().required(), // OAuth client ID
	CLIENT_SECRET: Joi.string().required(), // OAuth client secret
	REDIRECT_URI: Joi.string().required(), // OAuth redirect URI after authorization
	OAUTH_STEP_ONE_GET_ENDPOINT: Joi.string().required(), // OAuth first step endpoint (GET method)
	OAUTH_STEP_TWO_POST_ENDPOINT: Joi.string().required(), // OAuth second step endpoint (POST method)
	SCOPE: Joi.string().required(), // OAuth requested scopes
	PROVIDER_DOMAIN: Joi.string().required(), // Cloud provider domain (for cookie settings)
	SERVER_HOST: Joi.string().default("0.0.0.0"), // Server hostname or IP address
	SERVER_PORT: Joi.number().default(process.env.PORT || 3000), // Local fallback; hosts generally provide PORT
	RATE_LIMIT_MINUTES: Joi.number().required(), // Window time for rate limiting (in minutes)
	RATE_LIMIT_MAX_REQUESTS: Joi.number().required(), // Maximum allowed requests in the rate limit window
	NODE_ENV: Joi.string()
		.valid("production", "development") // Application environment. Defaults to 'development' if not provided.
		.default("development"),
	INFO_LOG_LEVEL: Joi.string().required(), // Log level for info messages
	DEBUG_LOG_LEVEL: Joi.string().required(), // Log level for debug messages
	ERROR_LOG_LEVEL: Joi.string().required(), // Log level for error messages
	SERVICE_NAME: Joi.string().required(), // Service or application name
	ERROR_LOG_PATH: Joi.string().required(), // File path to store error logs
	COMBINED_LOG_PATH: Joi.string().required(), // File path to store combined logs (includes errors)
	IDRIVE_ACCESS_KEY_ID: Joi.string().required(), // iDrive access key ID
	IDRIVE_SECRET_ACCESS_KEY: Joi.string().required(), // iDrive secret access key
	IDRIVE_S3_REGION: Joi.string().required(), // iDrive S3 bucket region
	IDRIVE_S3_ACL: Joi.string().required(), // iDrive S3 access control list setting
	IDRIVE_S3_ENDPOINT: Joi.string().required(), // iDrive S3 service endpoint
	IDRIVE_S3_BUCKET_NAME: Joi.string().required(), // iDrive S3 bucket name
	IDRIVE_S3_PICTURES_FOLDER: Joi.string().required(), // iDrive S3 folder for storing pictures
	IDRIVE_S3_SIGNATURES_FOLDER: Joi.string().required(), // iDrive S3 folder for storing signatures
	IDRIVE_S3_PUBLIC_ENDPOINT: Joi.string().required(), // iDrive S3 public endpoint for accessing stored files
}).unknown(true); // Allow for other environment variables not listed in the schema.

// Validate the current environment variables against the schema.
// If validation passes, the `value` contains the validated environment variables.
// If validation fails, an `error` is thrown detailing the validation issue.
const { error, value: validatedEnvConfig } = schema.validate(process.env);

// If there's a validation error, throw an exception to halt the application startup.
if (error) {
	throw new Error(`Config validation error: ${error.message}`);
}

// Export the validated environment variables to be used in the application.
module.exports = validatedEnvConfig;
