<?php
/**
 * Plugin Name: GBP Tracker Integration
 * Plugin URI: https://gbptracker.com
 * Description: Integrates your WordPress site with GBP Tracker for location audits and post synchronization
 * Version: 1.0.0
 * Author: GBP Tracker
 * Author URI: https://gbptracker.com
 * License: GPL v2 or later
 * Text Domain: gbp-tracker
 */

if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('GBP_TRACKER_VERSION', '1.0.0');
define('GBP_TRACKER_PATH', plugin_dir_path(__FILE__));
define('GBP_TRACKER_URL', plugin_dir_url(__FILE__));

class GBPTracker {
    private static $instance = null;
    private $api_key = '';
    private $location_id = '';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Initialize plugin
        add_action('init', array($this, 'init'));
        
        // Register shortcode
        add_shortcode('gbp_audit_widget', array($this, 'render_audit_widget'));
        
        // Register REST API endpoints
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        
        // Add admin menu
        add_action('admin_menu', array($this, 'add_admin_menu'));
        
        // Register settings
        add_action('admin_init', array($this, 'register_settings'));
    }

    public function init() {
        // Load translations
        load_plugin_textdomain('gbp-tracker', false, dirname(plugin_basename(__FILE__)) . '/languages');
        
        // Get settings
        $this->api_key = get_option('gbp_tracker_api_key');
        $this->location_id = get_option('gbp_tracker_location_id');
        
        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    public function register_rest_routes() {
        register_rest_route('gbp-tracker/v1', '/posts', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_post_creation'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));

        register_rest_route('gbp-tracker/v1', '/posts/(?P<id>\d+)', array(
            'methods' => 'PUT',
            'callback' => array($this, 'handle_post_update'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));

        register_rest_route('gbp-tracker/v1', '/validate', array(
            'methods' => 'GET',
            'callback' => array($this, 'validate_connection'),
            'permission_callback' => array($this, 'verify_api_key'),
        ));
    }

    public function verify_api_key($request) {
        $api_key = $request->get_header('X-API-Key');
        return $api_key === $this->api_key;
    }

    public function handle_post_creation($request) {
        $params = $request->get_params();
        
        // Create post
        $post_data = array(
            'post_title' => sanitize_text_field($params['title']),
            'post_content' => wp_kses_post($params['content']),
            'post_status' => 'publish',
            'post_type' => 'post',
            'meta_input' => array(
                'gbp_tracker_post_id' => sanitize_text_field($params['id']),
                'gbp_tracker_location_id' => sanitize_text_field($params['locationId'])
            )
        );

        $post_id = wp_insert_post($post_data);

        if (is_wp_error($post_id)) {
            return new WP_Error('post_creation_failed', $post_id->get_error_message(), array('status' => 500));
        }

        // Handle featured image if provided
        if (!empty($params['featured_media'])) {
            $this->handle_media_upload($post_id, $params['featured_media']);
        }

        return rest_ensure_response(array(
            'id' => $post_id,
            'url' => get_permalink($post_id)
        ));
    }

    public function handle_post_update($request) {
        $params = $request->get_params();
        $post_id = $request->get_param('id');

        // Update post
        $post_data = array(
            'ID' => $post_id,
            'post_title' => sanitize_text_field($params['title']),
            'post_content' => wp_kses_post($params['content'])
        );

        $updated = wp_update_post($post_data);

        if (is_wp_error($updated)) {
            return new WP_Error('post_update_failed', $updated->get_error_message(), array('status' => 500));
        }

        return rest_ensure_response(array(
            'id' => $post_id,
            'url' => get_permalink($post_id)
        ));
    }

    private function handle_media_upload($post_id, $media_data) {
        require_once(ABSPATH . 'wp-admin/includes/image.php');
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        require_once(ABSPATH . 'wp-admin/includes/media.php');

        // Download and attach media
        $media_id = media_sideload_image($media_data['url'], $post_id, $media_data['alt'], 'id');

        if (!is_wp_error($media_id)) {
            set_post_thumbnail($post_id, $media_id);
        }
    }

    public function render_audit_widget($atts) {
        $attributes = shortcode_atts(array(
            'theme' => 'light'
        ), $atts);

        ob_start();
        ?>
        <div 
            id="gbp-tracker-widget" 
            data-theme="<?php echo esc_attr($attributes['theme']); ?>"
            data-location="<?php echo esc_attr($this->location_id); ?>"
        ></div>
        <?php
        return ob_get_clean();
    }

    public function enqueue_frontend_assets() {
        wp_enqueue_style(
            'gbp-tracker-widget',
            GBP_TRACKER_URL . 'assets/css/widget.css',
            array(),
            GBP_TRACKER_VERSION
        );

        wp_enqueue_script(
            'gbp-tracker-widget',
            GBP_TRACKER_URL . 'assets/js/widget.js',
            array('jquery'),
            GBP_TRACKER_VERSION,
            true
        );

        wp_localize_script('gbp-tracker-widget', 'gbpTrackerConfig', array(
            'apiUrl' => esc_url_raw(rest_url('gbp-tracker/v1')),
            'apiKey' => $this->api_key,
            'locationId' => $this->location_id
        ));
    }

    public function enqueue_admin_assets($hook) {
        if ('settings_page_gbp-tracker' !== $hook) {
            return;
        }

        wp_enqueue_style(
            'gbp-tracker-admin',
            GBP_TRACKER_URL . 'assets/css/admin.css',
            array(),
            GBP_TRACKER_VERSION
        );

        wp_enqueue_script(
            'gbp-tracker-admin',
            GBP_TRACKER_URL . 'assets/js/admin.js',
            array('jquery'),
            GBP_TRACKER_VERSION,
            true
        );
    }

    public function add_admin_menu() {
        add_options_page(
            __('GBP Tracker Settings', 'gbp-tracker'),
            __('GBP Tracker', 'gbp-tracker'),
            'manage_options',
            'gbp-tracker',
            array($this, 'render_settings_page')
        );
    }

    public function register_settings() {
        register_setting('gbp_tracker_options', 'gbp_tracker_api_key');
        register_setting('gbp_tracker_options', 'gbp_tracker_location_id');
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            
            <form action="options.php" method="post">
                <?php
                settings_fields('gbp_tracker_options');
                do_settings_sections('gbp_tracker_options');
                ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="gbp_tracker_api_key"><?php _e('API Key', 'gbp-tracker'); ?></label>
                        </th>
                        <td>
                            <input type="text" 
                                id="gbp_tracker_api_key" 
                                name="gbp_tracker_api_key" 
                                value="<?php echo esc_attr(get_option('gbp_tracker_api_key')); ?>" 
                                class="regular-text"
                            />
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <label for="gbp_tracker_location_id"><?php _e('Location ID', 'gbp-tracker'); ?></label>
                        </th>
                        <td>
                            <input type="text" 
                                id="gbp_tracker_location_id" 
                                name="gbp_tracker_location_id" 
                                value="<?php echo esc_attr(get_option('gbp_tracker_location_id')); ?>" 
                                class="regular-text"
                            />
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>

            <div class="gbp-tracker-shortcode-info">
                <h2><?php _e('Widget Shortcode', 'gbp-tracker'); ?></h2>
                <p><?php _e('Use this shortcode to add the GBP Tracker widget to any page:', 'gbp-tracker'); ?></p>
                <code>[gbp_audit_widget theme="light"]</code>
                <p class="description"><?php _e('Available themes: light, dark', 'gbp-tracker'); ?></p>
            </div>
        </div>
        <?php
    }

    public function validate_connection($request) {
        return rest_ensure_response(array(
            'status' => 'connected',
            'version' => GBP_TRACKER_VERSION
        ));
    }
}

// Initialize the plugin
function gbp_tracker_init() {
    return GBPTracker::get_instance();
}

add_action('plugins_loaded', 'gbp_tracker_init');