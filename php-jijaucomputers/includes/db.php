<?php
/**
 * Universal Database Connection (SQLite & MySQL)
 * Resilient against shared hosting permission restrictions
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database configuration
define('DB_DRIVER', getenv('DB_DRIVER') ?: 'sqlite');
define('DB_SQLITE_PATH', __DIR__ . '/../database/jijau.db');

define('DB_MYSQL_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_MYSQL_NAME', getenv('DB_NAME') ?: 'jijaucomputers');
define('DB_MYSQL_USER', getenv('DB_USER') ?: 'root');
define('DB_MYSQL_PASS', getenv('DB_PASS') ?: '');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    try {
        if (DB_DRIVER === 'mysql' || (getenv('DB_HOST') && getenv('DB_NAME'))) {
            $dsn = "mysql:host=" . DB_MYSQL_HOST . ";dbname=" . DB_MYSQL_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_MYSQL_USER, DB_MYSQL_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } else {
            // Default: SQLite database
            $dbPath = DB_SQLITE_PATH;
            
            // Ensure database directory exists
            $dbDir = dirname($dbPath);
            if (!is_dir($dbDir)) {
                @mkdir($dbDir, 0777, true);
            }

            $pdo = new PDO("sqlite:" . $dbPath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);

            // Safe PRAGMAs wrapped in try/catch to avoid crash on shared hosting file locks
            try {
                @$pdo->exec("PRAGMA foreign_keys = ON;");
            } catch (Exception $e) {}
        }
        return $pdo;
    } catch (PDOException $e) {
        // Fallback: return a dummy or render friendly error
        die("<div style='font-family:sans-serif;padding:30px;max-width:600px;margin:40px auto;background:#fee2e2;color:#991b1b;border-radius:12px;border:1px solid #f87171;'>
            <h2 style='margin-top:0;'>⚠️ Database Connection Issue</h2>
            <p>Could not connect to database. Please ensure file permissions for <code>database/jijau.db</code> are writable (chmod 777 or 755).</p>
            <p><small>" . htmlspecialchars($e->getMessage()) . "</small></p>
        </div>");
    }
}
