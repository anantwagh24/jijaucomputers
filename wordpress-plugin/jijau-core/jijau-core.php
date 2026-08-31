<?php
/**
 * Plugin Name: Jijau Computers Core
 * Plugin URI: https://jijaucomputers.in
 * Description: Core business logic, REST APIs, Custom Post Types, Demo Importer, and full 1:1 Store Management Admin Hub for Jijau Computers.
 * Version: 2.0.0
 * Author: Jijau Computers Engineering
 * Author URI: https://jijaucomputers.in
 * Text Domain: jijau-core
 * Domain Path: /languages
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('JIJAU_CORE_VERSION', '2.0.0');
define('JIJAU_CORE_PATH', plugin_dir_path(__FILE__));
define('JIJAU_CORE_URL', plugin_dir_url(__FILE__));

// Load Plugin Includes
require_once JIJAU_CORE_PATH . 'includes/class-cpt.php';
require_once JIJAU_CORE_PATH . 'includes/class-api.php';
require_once JIJAU_CORE_PATH . 'includes/class-demo-importer.php';
require_once JIJAU_CORE_PATH . 'includes/class-admin.php';

/**
 * Plugin Activation Hook
 */
function jijau_core_activate() {
    // Seed initial demo store database if not already present
    if (!get_option('jijau_full_store_database')) {
        Jijau_Demo_Importer::seed_default_store_data();
    }
    flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'jijau_core_activate');

/**
 * Plugin Deactivation Hook
 */
function jijau_core_deactivate() {
    flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'jijau_core_deactivate');
