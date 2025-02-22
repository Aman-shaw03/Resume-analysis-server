# Resume Analysis and Enrichment API

[![Node.js](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404D59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-black?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/gemini-api)

## Project Overview

This is a backend API built with Node.js and Express.js designed to **analyze and enrich resume data from PDF documents**. The API automates the process of extracting text from resumes hosted at URLs, leverages the power of **Google Gemini AI** for intelligent data extraction and structuring, and stores the enriched applicant information in a **MongoDB database**.

**Key Features:**

*   **Resume PDF Processing:**  Fetches PDF resumes from provided URLs and extracts text content.
*   **AI-Powered Data Enrichment:** Utilizes Google Gemini AI (via a custom integration) to intelligently parse the extracted text and identify key applicant information such as:
    *   Name
    *   Email
    *   Education History
    *   Work Experience
    *   Skills
    *   Summary/Objective
*   **Structured Data Storage:**  Saves the enriched applicant data into a MongoDB database, organized using a defined `Applicant` model for easy querying and management.
*   **Applicant Search API:** Provides an endpoint to search for applicants by name, allowing for efficient retrieval of stored resume data.
*   **Data Encryption for Sensitive Information:** Implements **AES-256-CBC encryption** to protect sensitive applicant data:
    *   **Email Encryption:**  Email addresses are encrypted **at rest** in the database and **in transit** within API responses to enhance data privacy.
    *   **Pragmatic Searchability:**  Applicant names are stored unencrypted in the database to enable efficient searching by name via the API. This represents a practical trade-off between search functionality and comprehensive data-at-rest encryption for all fields.
*   **Backend API Focus:**  This project is designed as a standalone backend API service. It is ready to be integrated with frontend applications or other services that require resume analysis and applicant data management.

**Technologies Used:**

*   **Node.js:**  Backend runtime environment.
*   **Express.js:**  Web application framework for building the API.
*   **MongoDB:**  Database for storing applicant data.
*   **`pdf.js-extract`:**  Node.js library for extracting text content from PDF files.
*   **`axios`:**  HTTP client for fetching PDFs from URLs.
*   **Google Gemini API:**  Large Language Model for resume data enrichment.
*   **`crypto` (Node.js built-in):** For AES-256-CBC encryption of sensitive data.

**Setup and Deployment:**

**Prerequisites:**

*   Node.js and npm installed.
*   MongoDB database set up and running (or access to a MongoDB Atlas cluster).
*   Google Gemini API access and API key configured (refer to Gemini API documentation).
*   Environment variables configured (see `.env.example` for required variables).

**Local Development Setup:**

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    cd [repository-folder]
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file** in the root directory and configure environment variables (see `.env.example` for the variables you need to set, like MongoDB URI, API keys, encryption key, etc.).
4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    The API should now be running at `http://localhost:[your-port]` (check your server logs for the port).

**Backend API Deployment (Example - General Steps):**

1.  **Choose a hosting provider** (e.g., AWS, Google Cloud, Azure, Heroku, DigitalOcean).
2.  **Prepare your backend for deployment:**
    *   Ensure production dependencies are listed in `package.json`.
    *   Configure environment variables on your hosting platform (especially for database connection, API keys, and encryption key - **securely manage your encryption key!**).
    *   Set up a process manager (like `pm2`) to run your Node.js application in production.
3.  **Deploy your code** to the chosen hosting platform (using Git push, SCP, or other deployment methods provided by your hosting service).
4.  **Test your deployed API** using tools like Postman, `curl`, or online API testing websites to directly send requests to your API endpoints.

**API Endpoints:**

*   **`POST /enrichResume`**
    *   **Request Body:**
        ```json
        {
          "url": "URL_OF_THE_PDF_RESUME"
        }
        ```
    *   **Description:**  Takes a URL of a PDF resume as input.  Downloads the PDF, extracts text, uses Gemini AI to enrich the data, and saves the applicant data to the database.
    *   **Response (200 OK):**  Returns a success message and the enriched applicant data (with email encrypted).

*   **`POST /searchApplicant`**
    *   **Request Body:**
        ```json
        {
          "name": "Applicant Name to Search"
        }
        ```
    *   **Description:**  Searches for applicants in the database by name (using a case-insensitive regex search on the `name` field).
    *   **Response (200 OK):** Returns an array of matched applicant objects (with email decrypted for authorized access).
    *   **Response (404 Not Found):** Returns a 404 status if no applicants are found matching the search criteria.

**Security Considerations:**

*   **Data Encryption:**  Sensitive email data is encrypted using AES-256-CBC both at rest in the database and in API responses to protect user privacy.
*   **Secure Key Management:**  **Important:** In a production environment, you must implement secure key management practices for the encryption key.  Do not hardcode keys in your application. Use environment variables, secure vaults, or key management systems.
*   **HTTPS:**  Ensure your API is served over HTTPS in production to encrypt all communication between clients and your API server.
*   **Input Validation:**  The API includes basic input validation (e.g., checking for a valid URL and PDF content type).  Further input validation and sanitization should be implemented to enhance security and prevent injection vulnerabilities.
*   **Rate Limiting and Authentication:** For a production API, consider implementing rate limiting to prevent abuse and authentication/authorization mechanisms to control access to your API endpoints.

**Potential Future Enhancements:**

*   **More comprehensive data validation:** Implement stricter validation of the data extracted by Gemini AI to ensure data quality.
*   **Advanced Search Features:**  Expand search capabilities to include searching by skills, experience, education, or keywords. Explore techniques for making encrypted fields searchable if stricter security for name is required.
*   **Frontend Application:** Develop a user-friendly frontend interface to consume this API for resume uploading, analysis, and applicant management.
*   **Error Logging and Monitoring:** Implement robust error logging and monitoring to track API usage and identify potential issues.
*   **Scalability and Performance Optimizations:**  Consider optimizations for handling a large volume of resumes and API requests, especially if deploying to production.

---
