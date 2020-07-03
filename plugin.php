<?php

/**
 * Plugin Name: Dekode API Fnugg
 * Plugin URI: https://koicha.dev
 * Description: Code test from Dekode
 * Author: Khoi Hoang
 * Author URI: https://koicha.dev
 */

// Avoid accessing this file directly
if(!defined('ABSPATH')) {
    exit;
}

function gu_register_block_type($blockName, $options = array()) {
    register_block_type(
        'dekode/' . $blockName,
        array_merge(
            array(
                'editor_script' => 'gu-block-editor-script', // This will be JS file that is only going to be enqueued in the admin editor page
                'editor_style'  => 'gu-block-editor-style', // This will be our CSS that is only going to enqueued in the admin editor page
                // These scripts will be enqueued both in back- and front-end
                'script' => 'gu-block-editor-script', 
                'style' => 'gu-block-editor-style'
            ),
            $options
        )
    ); 
}

function de_gutenberg_api_fnugg() {

    // Register JavaScript Section
    wp_register_script(
        'gu-block-editor-script', 
        plugins_url('dist/bundle.js', __FILE__), 
        ['wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components']
    );

    // Register CSS Section
    wp_register_style(
        'gu-block-editor-style',
         plugins_url('dist/bundle.css', __FILE__), 
         array('wp-edit-blocks')
    );

    gu_register_block_type('api-fnugg');
}


// To register our block, we use 'init' action
add_action('init', 'de_gutenberg_api_fnugg');