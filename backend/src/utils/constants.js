require('dotenv').config({ path: '.env' })

const PORT = process.env.PORT || 8081
const JWT_SECRET = process.env.JWT_SECRET
const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_PASS = process.env.GMAIL_PASS
const FROM_EMAIL = process.env.FROM_EMAIL
const TEAM_EMAIL = process.env.TEAM_EMAIL
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD

module.exports = {
    PORT,
    JWT_SECRET,
    GMAIL_USER,
    GMAIL_PASS,
    FROM_EMAIL,
    TEAM_EMAIL,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY,
    DEFAULT_ADMIN_PASSWORD
}