<?php
/**
 * Custom Post Types and Taxonomies Registration for Jijau Computers Core
 */

if (!defined('ABSPATH')) {
    exit;
}

class Jijau_CPT {

    public static function init() {
        add_action('init', array(__CLASS__, 'register_post_types'));
        add_action('init', array(__CLASS__, 'register_taxonomies'));
    }

    public static function register_post_types() {
        // 1. Repair Tickets
        register_post_type('jijau_repair', array(
            'labels' => array(
                'name' => __('Repair Tickets', 'jijau-core'),
                'singular_name' => __('Repair Ticket', 'jijau-core'),
                'add_new' => __('Add Ticket', 'jijau-core'),
                'add_new_item' => __('Add New Repair Ticket', 'jijau-core'),
                'edit_item' => __('Edit Repair Ticket', 'jijau-core'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-hammer',
            'supports' => array('title', 'editor', 'custom-fields'),
        ));

        // 2. Custom PC Leads
        register_post_type('jijau_custom_pc', array(
            'labels' => array(
                'name' => __('Custom PC Leads', 'jijau-core'),
                'singular_name' => __('Custom PC Lead', 'jijau-core'),
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-desktop',
            'supports' => array('title', 'editor', 'custom-fields'),
        ));

        // 3. B2B Quotations
        register_post_type('jijau_quote', array(
            'labels' => array(
                'name' => __('B2B Quotations', 'jijau-core'),
                'singular_name' => __('Quotation Request', 'jijau-core'),
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-clipboard',
            'supports' => array('title', 'editor', 'custom-fields'),
        ));

        // 4. Hero Banners
        register_post_type('jijau_banner', array(
            'labels' => array(
                'name' => __('Hero Banners', 'jijau-core'),
                'singular_name' => __('Hero Banner', 'jijau-core'),
            ),
            'public' => false,
            'show_ui' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-format-image',
            'supports' => array('title', 'thumbnail', 'custom-fields'),
        ));

        // 5. Promotional Offers & Coupons
        register_post_type('jijau_offer', array(
            'labels' => array(
                'name' => __('Offers & Coupons', 'jijau-core'),
                'singular_name' => __('Offer', 'jijau-core'),
            ),
            'public' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-tickets-alt',
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        ));
    }

    public static function register_taxonomies() {
        // Hardware Device Category
        register_taxonomy('jijau_hardware_category', array('jijau_repair', 'jijau_offer'), array(
            'labels' => array(
                'name' => __('Hardware Categories', 'jijau-core'),
                'singular_name' => __('Hardware Category', 'jijau-core'),
            ),
            'hierarchical' => true,
            'show_ui' => true,
            'show_in_rest' => true,
            'show_admin_column' => true,
        ));
    }
}

Jijau_CPT::init();
