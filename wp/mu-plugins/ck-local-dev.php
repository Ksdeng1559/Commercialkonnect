<?php
/**
 * Plugin Name: CommercialKonnect — Local Dev Overrides
 * Description: Dev-only tweaks for the local Docker stack. Inert unless WP_ENVIRONMENT_TYPE
 *              is 'local', so it is safe even if accidentally carried to another host.
 * Version:     0.1.0
 *
 * @package CommercialKonnect
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Only ever do anything on the local stack.
if ( function_exists( 'wp_get_environment_type' ) && 'local' !== wp_get_environment_type() ) {
	return;
}

/**
 * Application Passwords are gated behind HTTPS by default. The local stack is plain http on
 * localhost, so enable them here (NOT in wp-config.php, which runs before add_filter exists).
 * Needed so wp-mcp-ultimate can authenticate over the local REST endpoint. Never for prod.
 */
add_filter( 'wp_is_application_passwords_available', '__return_true' );
