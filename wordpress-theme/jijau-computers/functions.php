<?php
/**
 * Jijau Computers Theme Functions & Setup
 *
 * @package Jijau_Computers
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Load Jijau 1:1 Admin Management Hub
require_once get_template_directory() . '/inc/admin-panel.php';

if (!function_exists('jijau_computers_setup')) {
    function jijau_computers_setup() {
        // Enable Title tag & Featured Images
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
        add_theme_support('custom-logo');
        add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
        
        // Enable WooCommerce
        add_theme_support('woocommerce');
        add_theme_support('wc-product-gallery-zoom');
        add_theme_support('wc-product-gallery-lightbox');
        add_theme_support('wc-product-gallery-slider');

        // Register Nav Menus
        register_nav_menus(array(
            'primary-menu' => __('Primary Navigation Menu', 'jijau-computers'),
            'mobile-menu'  => __('Mobile Navigation Menu', 'jijau-computers'),
            'footer-menu'  => __('Footer Quick Links', 'jijau-computers'),
        ));
    }
    add_action('after_setup_theme', 'jijau_computers_setup');
}

if (!function_exists('jijau_computers_scripts')) {
    /**
     * Enqueue Styles and Scripts
     */
    function jijau_computers_scripts() {
        // Tailwind CSS via CDN for rapid responsive layout
        wp_enqueue_script('tailwind-cdn', 'https://cdn.tailwindcss.com', array(), null, false);
        
        // Lucide Icons
        wp_enqueue_script('lucide-icons', 'https://unpkg.com/lucide@latest', array(), null, true);

        // Theme Styles
        wp_enqueue_style('jijau-main-style', get_stylesheet_uri(), array(), '1.0.0');

        // Interactive Front-end Application Script
        wp_enqueue_script('jijau-interactive-app', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true);

        // Pass Dynamic Data & Live Database to Frontend JS
        $liveDb = jijau_get_full_store_database();
        wp_localize_script('jijau-interactive-app', 'jijauSettings', array(
            'ajaxUrl'   => admin_url('admin-ajax.php'),
            'whatsapp'  => get_theme_mod('jijau_whatsapp', $liveDb['settings']['whatsapp'] ?? '918805607908'),
            'phone'     => get_theme_mod('jijau_phone', $liveDb['settings']['phone'] ?? '+91 88056 07908'),
            'upiId'     => get_theme_mod('jijau_upi_id', $liveDb['settings']['upiId'] ?? '8805607908@ybl'),
            'upiName'   => get_theme_mod('jijau_upi_name', $liveDb['settings']['upiName'] ?? 'Jijau Computers'),
            'siteUrl'   => home_url(),
            'liveDb'    => $liveDb,
        ));
    }
    add_action('wp_enqueue_scripts', 'jijau_computers_scripts');
}

if (!function_exists('jijau_ajax_place_public_order')) {
    /**
     * Public Order Placement AJAX
     */
    function jijau_ajax_place_public_order() {
        $orderData = isset($_POST['order']) ? json_decode(stripslashes($_POST['order']), true) : null;
        if ($orderData) {
            $db = jijau_get_full_store_database();
            if (!isset($db['orders']) || !is_array($db['orders'])) {
                $db['orders'] = array();
            }
            array_unshift($db['orders'], $orderData);
            update_option('jijau_full_store_database', $db);
            wp_send_json_success(array('orderId' => $orderData['orderNumber'] ?? 'JC-ORD'));
        }
        wp_send_json_error('Invalid order payload');
    }
    add_action('wp_ajax_nopriv_jijau_place_order', 'jijau_ajax_place_public_order');
    add_action('wp_ajax_jijau_place_order', 'jijau_ajax_place_public_order');
}

if (!function_exists('jijau_computers_customizer')) {
    /**
     * Theme Customizer Options (Store Phone, WhatsApp, UPI, Address, Timings)
     */
    function jijau_computers_customizer($wp_customize) {
        // Store Settings Panel
        $wp_customize->add_section('jijau_store_settings', array(
            'title'       => __('Jijau Computers Store Settings', 'jijau-computers'),
            'priority'    => 30,
            'description' => __('Manage store contact details, WhatsApp hotline, and UPI Merchant ID without touching code.', 'jijau-computers'),
        ));

        // Phone
        $wp_customize->add_setting('jijau_phone', array('default' => '+91 88056 07908', 'sanitize_callback' => 'sanitize_text_field'));
        $wp_customize->add_control('jijau_phone', array('label' => __('Phone Number', 'jijau-computers'), 'section' => 'jijau_store_settings', 'type' => 'text'));

        // WhatsApp Number
        $wp_customize->add_setting('jijau_whatsapp', array('default' => '918805607908', 'sanitize_callback' => 'sanitize_text_field'));
        $wp_customize->add_control('jijau_whatsapp', array('label' => __('WhatsApp Number', 'jijau-computers'), 'section' => 'jijau_store_settings', 'type' => 'text'));

        // UPI ID
        $wp_customize->add_setting('jijau_upi_id', array('default' => '8805607908@ybl', 'sanitize_callback' => 'sanitize_text_field'));
        $wp_customize->add_control('jijau_upi_id', array('label' => __('UPI VPA ID', 'jijau-computers'), 'section' => 'jijau_store_settings', 'type' => 'text'));

        // UPI Merchant Name
        $wp_customize->add_setting('jijau_upi_name', array('default' => 'Jijau Computers', 'sanitize_callback' => 'sanitize_text_field'));
        $wp_customize->add_control('jijau_upi_name', array('label' => __('UPI Merchant Name', 'jijau-computers'), 'section' => 'jijau_store_settings', 'type' => 'text'));

        // Physical Address
        $wp_customize->add_setting('jijau_address', array('default' => 'Jijau Computer Sales & Service, Opposite. SBI Bank, Jafrabad, Maharashtra 431206', 'sanitize_callback' => 'sanitize_textarea_field'));
        $wp_customize->add_control('jijau_address', array('label' => __('Physical Address', 'jijau-computers'), 'section' => 'jijau_store_settings', 'type' => 'textarea'));

        // Timings
        $wp_customize->add_setting('jijau_hours', array('default' => 'Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 6:00 PM', 'sanitize_callback' => 'sanitize_text_field'));
        $wp_customize->add_control('jijau_hours', array('label' => __('Store Hours', 'jijau-computers'), 'section' => 'jijau_store_settings', 'type' => 'text'));

        // GSTIN
        $wp_customize->add_setting('jijau_gstin', array('default' => '27AABCJ1234F1Z9', 'sanitize_callback' => 'sanitize_text_field'));
        $wp_customize->add_control('jijau_gstin', array('label' => __('GSTIN Number', 'jijau-computers'), 'section' => 'jijau_store_settings', 'type' => 'text'));
    }
    add_action('customize_register', 'jijau_computers_customizer');
}

if (!function_exists('jijau_register_custom_post_types')) {
    /**
     * Custom Post Types: Repair Requests, Custom PC Builds, B2B Quotations
     */
    function jijau_register_custom_post_types() {
        // 1. Repair Tickets
        register_post_type('repair_ticket', array(
            'labels' => array(
                'name'          => __('Repair Tickets', 'jijau-computers'),
                'singular_name' => __('Repair Ticket', 'jijau-computers'),
                'add_new_item'  => __('Add New Repair Ticket', 'jijau-computers'),
                'edit_item'     => __('Edit Repair Ticket', 'jijau-computers'),
            ),
            'public'      => true,
            'has_archive' => false,
            'show_in_menu'=> true,
            'menu_icon'   => 'dashicons-hammer',
            'supports'    => array('title', 'editor', 'custom-fields'),
        ));

        // 2. Custom PC Build Inquiries
        register_post_type('custom_pc_lead', array(
            'labels' => array(
                'name'          => __('Custom PC Requests', 'jijau-computers'),
                'singular_name' => __('PC Request', 'jijau-computers'),
            ),
            'public'      => true,
            'has_archive' => false,
            'show_in_menu'=> true,
            'menu_icon'   => 'dashicons-desktop',
            'supports'    => array('title', 'editor', 'custom-fields'),
        ));
    }
    add_action('init', 'jijau_register_custom_post_types');
}
