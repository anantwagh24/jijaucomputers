<?php
/**
 * REST API Endpoints for Jijau Computers Core Plugin
 * Accessible at /wp-json/jijau/v1/
 */

if (!defined('ABSPATH')) {
    exit;
}

class Jijau_API {

    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_routes'));
    }

    public static function register_routes() {
        $namespace = 'jijau/v1';

        // 1. Store Database Snapshot
        register_rest_route($namespace, '/store-data', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_store_data'),
            'permission_callback' => '__return_true',
        ));

        // 2. Products
        register_rest_route($namespace, '/products', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'get_products'),
            'permission_callback' => '__return_true',
        ));

        // 3. Service Request Status Tracking
        register_rest_route($namespace, '/track-service', array(
            'methods' => 'GET',
            'callback' => array(__CLASS__, 'track_service'),
            'permission_callback' => '__return_true',
        ));

        // 4. Submit Order
        register_rest_route($namespace, '/orders', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'submit_order'),
            'permission_callback' => '__return_true',
        ));

        // 5. Submit Custom PC Request
        register_rest_route($namespace, '/custom-pc', array(
            'methods' => 'POST',
            'callback' => array(__CLASS__, 'submit_custom_pc'),
            'permission_callback' => '__return_true',
        ));
    }

    public static function get_store_database() {
        $db = get_option('jijau_full_store_database');
        if (!$db || !is_array($db)) {
            $db = Jijau_Demo_Importer::seed_default_store_data();
        }
        return $db;
    }

    public static function get_store_data() {
        return rest_ensure_response(self::get_store_database());
    }

    public static function get_products($request) {
        $db = self::get_store_database();
        $products = $db['products'] ?? array();

        $category = $request->get_param('category');
        $brand = $request->get_param('brand');
        $search = $request->get_param('search');

        if ($category) {
            $products = array_filter($products, function($p) use ($category) {
                return stripos($p['category'] ?? '', $category) !== false;
            });
        }

        if ($brand) {
            $products = array_filter($products, function($p) use ($brand) {
                return strcasecmp($p['brand'] ?? '', $brand) === 0;
            });
        }

        if ($search) {
            $products = array_filter($products, function($p) use ($search) {
                return stripos($p['name'] ?? '', $search) !== false || stripos($p['specs'] ?? '', $search) !== false;
            });
        }

        return rest_ensure_response(array_values($products));
    }

    public static function track_service($request) {
        $query = sanitize_text_field($request->get_param('q'));
        if (!$query) {
            return new WP_Error('missing_param', 'Please provide a ticket ID or phone number', array('status' => 400));
        }

        $db = self::get_store_database();
        $repairs = $db['repairs'] ?? array();

        $matches = array_filter($repairs, function($r) use ($query) {
            return strcasecmp($r['ticketId'] ?? '', $query) === 0 || ($r['phone'] ?? '') === $query;
        });

        return rest_ensure_response(array_values($matches));
    }

    public static function submit_order($request) {
        $params = $request->get_json_params();
        if (empty($params['customerName']) || empty($params['phone'])) {
            return new WP_Error('invalid_data', 'Missing customer details', array('status' => 400));
        }

        $db = self::get_store_database();
        if (!isset($db['orders']) || !is_array($db['orders'])) {
            $db['orders'] = array();
        }

        $newOrder = array(
            'id' => 'ord-' . time(),
            'orderNumber' => 'JC-ORD-' . rand(1000, 9999),
            'customerName' => sanitize_text_field($params['customerName']),
            'phone' => sanitize_text_field($params['phone']),
            'address' => sanitize_textarea_field($params['address'] ?? ''),
            'items' => sanitize_text_field($params['items'] ?? ''),
            'total' => floatval($params['total'] ?? 0),
            'paymentMethod' => sanitize_text_field($params['paymentMethod'] ?? 'Instant UPI via WhatsApp'),
            'status' => 'Pending Confirmation',
            'createdAt' => current_time('mysql'),
        );

        array_unshift($db['orders'], $newOrder);
        update_option('jijau_full_store_database', $db);

        return rest_ensure_response(array('success' => true, 'order' => $newOrder));
    }

    public static function submit_custom_pc($request) {
        $params = $request->get_json_params();
        if (empty($params['customerName']) || empty($params['phone'])) {
            return new WP_Error('invalid_data', 'Missing customer details', array('status' => 400));
        }

        $db = self::get_store_database();
        if (!isset($db['customPcRequests']) || !is_array($db['customPcRequests'])) {
            $db['customPcRequests'] = array();
        }

        $newReq = array(
            'reqNumber' => 'JC-PC-' . rand(1000, 9999),
            'customerName' => sanitize_text_field($params['customerName']),
            'phone' => sanitize_text_field($params['phone']),
            'budget' => sanitize_text_field($params['budget'] ?? 'Flexible'),
            'purpose' => sanitize_text_field($params['purpose'] ?? 'Gaming / Workstation'),
            'notes' => sanitize_textarea_field($params['notes'] ?? ''),
            'status' => 'PENDING',
            'totalEst' => floatval($params['totalEst'] ?? 0),
            'createdAt' => current_time('mysql'),
        );

        array_unshift($db['customPcRequests'], $newReq);
        update_option('jijau_full_store_database', $db);

        return rest_ensure_response(array('success' => true, 'request' => $newReq));
    }
}

Jijau_API::init();
