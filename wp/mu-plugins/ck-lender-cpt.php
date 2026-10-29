<?php
/**
 * Plugin Name: CommercialKonnect — Lender Directory CPT
 * Description: Registers the `lender` custom post type and its provenance-forcing meta.
 *              Must-use plugin: auto-loads, cannot be deactivated from the admin so the
 *              verification gate cannot be switched off by accident.
 * Author:      CommercialKonnect
 * Version:     0.1.0
 *
 * Source of record for fields and the publication gate: docs/LENDER_DIRECTORY.md.
 * Nothing here publishes a lender. It enforces the opposite: a lender is invisible on the
 * public front end unless `ck_verification_status` === 'verified', OR a counsel-approved
 * directory disclaimer flag is set site-wide. See ck_lender_is_publishable().
 *
 * @package CommercialKonnect
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const CK_LENDER_CPT = 'lender';

/**
 * Register the `lender` post type. show_in_rest=true so the MCP server / REST API can
 * read and write records, but see the publication gate below — REST exposure is not the
 * same as public front-end rendering.
 */
function ck_register_lender_cpt(): void {
	register_post_type(
		CK_LENDER_CPT,
		array(
			'label'        => 'Lenders',
			'labels'       => array(
				'name'          => 'Lenders',
				'singular_name' => 'Lender',
				'add_new_item'  => 'Add New Lender',
				'edit_item'     => 'Edit Lender',
			),
			'public'       => true,
			'show_in_rest' => true,
			'menu_icon'    => 'dashicons-bank',
			'supports'     => array( 'title', 'editor', 'custom-fields', 'revisions' ),
			'has_archive'  => true,
			'rewrite'      => array( 'slug' => 'lenders' ),
		)
	);
}
add_action( 'init', 'ck_register_lender_cpt' );

/**
 * Provenance + product meta. Field list mirrors docs/LENDER_DIRECTORY.md §"Build-out actions".
 * Every field is show_in_rest so the MCP tools can populate them, and auth_callback requires
 * edit_posts so an unauthenticated REST caller cannot write.
 */
function ck_register_lender_meta(): void {
	$string_fields = array(
		'ck_regulator',           // BCFSA | FSRA | none
		'ck_licence_no',
		'ck_verification_status', // verified | unverified | not-applicable
		'ck_verified_date',       // ISO 8601
		'ck_source_url',
		'ck_territory',
		'ck_ltv',
		'ck_dscr',
		'ck_rate_asof',           // date the rate/terms were last confirmed
		'ck_contact',
	);

	foreach ( $string_fields as $key ) {
		register_post_meta(
			CK_LENDER_CPT,
			$key,
			array(
				'type'              => 'string',
				'single'            => true,
				'default'           => ( 'ck_verification_status' === $key ) ? 'unverified' : '',
				'show_in_rest'      => true,
				'auth_callback'     => static function () {
					return current_user_can( 'edit_posts' );
				},
				'sanitize_callback' => ( 'ck_source_url' === $key ) ? 'esc_url_raw' : 'sanitize_text_field',
			)
		);
	}

	// products[]: repeatable list of product labels (e.g. "Interest-Only 12mo", "Bridge").
	register_post_meta(
		CK_LENDER_CPT,
		'ck_products',
		array(
			'type'          => 'array',
			'single'        => true,
			'default'       => array(),
			'show_in_rest'  => array(
				'schema' => array(
					'type'  => 'array',
					'items' => array( 'type' => 'string' ),
				),
			),
			'auth_callback' => static function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', 'ck_register_lender_meta' );

/**
 * The publication gate. A lender is publishable on the public front end only if it is
 * verified, unless a site owner has set the counsel-approved directory disclaimer flag
 * (option `ck_directory_disclaimer_approved`). Admins/editors always see every record in
 * wp-admin so they can work the verification queue.
 */
function ck_lender_is_publishable( int $post_id ): bool {
	if ( 'verified' === get_post_meta( $post_id, 'ck_verification_status', true ) ) {
		return true;
	}
	return (bool) get_option( 'ck_directory_disclaimer_approved', false );
}

/**
 * Hide non-publishable lenders from every public query (archive, feeds, search, REST reads
 * for non-editors). Admin screens and logged-in editors are untouched.
 */
function ck_filter_public_lender_queries( WP_Query $query ): void {
	if ( is_admin() || current_user_can( 'edit_posts' ) ) {
		return;
	}
	if ( ! $query->is_main_query() ) {
		return;
	}

	$is_lender_context =
		$query->is_post_type_archive( CK_LENDER_CPT )
		|| CK_LENDER_CPT === $query->get( 'post_type' )
		|| $query->is_singular( CK_LENDER_CPT );

	if ( ! $is_lender_context ) {
		return;
	}

	// Already-approved site-wide disclaimer lifts the per-record gate.
	if ( get_option( 'ck_directory_disclaimer_approved', false ) ) {
		return;
	}

	$meta_query   = (array) $query->get( 'meta_query' );
	$meta_query[] = array(
		'key'   => 'ck_verification_status',
		'value' => 'verified',
	);
	$query->set( 'meta_query', $meta_query );
}
add_action( 'pre_get_posts', 'ck_filter_public_lender_queries' );

/**
 * Belt and suspenders: 404 a direct hit on an unverified single lender URL for the public,
 * so an unverified record is never reachable even by guessed slug.
 */
function ck_block_unverified_single_lender(): void {
	if ( is_admin() || current_user_can( 'edit_posts' ) ) {
		return;
	}
	if ( ! is_singular( CK_LENDER_CPT ) ) {
		return;
	}
	$post_id = get_queried_object_id();
	if ( $post_id && ! ck_lender_is_publishable( $post_id ) ) {
		global $wp_query;
		$wp_query->set_404();
		status_header( 404 );
		nocache_headers();
	}
}
add_action( 'template_redirect', 'ck_block_unverified_single_lender' );

/**
 * REST hardening. pre_get_posts above does NOT cover the REST API (REST runs its own
 * WP_Query, not the main query), and this CPT is show_in_rest so the MCP tools can write it.
 * Without these filters the public could read an unverified lender through /wp-json. An
 * editor (cookie- or application-password-authenticated) still sees everything.
 */
function ck_rest_caller_is_editor(): bool {
	return current_user_can( 'edit_posts' );
}

/** Collections (GET /wp/v2/lender): restrict public callers to verified records. */
function ck_filter_rest_lender_collection( array $args, $request ): array {
	if ( ck_rest_caller_is_editor() || get_option( 'ck_directory_disclaimer_approved', false ) ) {
		return $args;
	}
	$meta_query   = isset( $args['meta_query'] ) ? (array) $args['meta_query'] : array();
	$meta_query[] = array(
		'key'   => 'ck_verification_status',
		'value' => 'verified',
	);
	$args['meta_query'] = $meta_query;
	return $args;
}
add_filter( 'rest_' . CK_LENDER_CPT . '_query', 'ck_filter_rest_lender_collection', 10, 2 );

/** Single item (GET /wp/v2/lender/{id}): 404 a public read of a non-publishable lender. */
function ck_filter_rest_lender_single( $response, $post, $request ) {
	if ( ck_rest_caller_is_editor() ) {
		return $response;
	}
	if ( ! ck_lender_is_publishable( (int) $post->ID ) ) {
		// Return a WP_REST_Response (not WP_Error): the posts controller calls
		// ->link_header() on whatever this filter returns, which WP_Error lacks.
		return new WP_REST_Response(
			array(
				'code'    => 'rest_post_invalid_id',
				'message' => 'Invalid post ID.',
				'data'    => array( 'status' => 404 ),
			),
			404
		);
	}
	return $response;
}
add_filter( 'rest_prepare_' . CK_LENDER_CPT, 'ck_filter_rest_lender_single', 10, 3 );
