<?php
/**
 * Add selected custom post meta to Response admin post list.
 */

/**
 * Add columns to admin post list
 */

function gcac_response_columns($defaults) {
		$defaults['project'] = 'Project';
    $defaults['comp_num'] = 'Competency Number';
    $defaults['task_num'] = 'Scenario ID';
    $defaults['sub_num'] = 'Participant ID';
    $defaults['block_num'] = 'Block Number';
    return $defaults;
}
add_filter('manage_response_posts_columns','gcac_response_columns');

/**
 * Populate columns
 */
function gcac_populate_columns($column_title, $post_id) {;
    echo get_post_meta($post_id,$column_title)[0];
}
add_action('manage_response_posts_custom_column','gcac_populate_columns', 10, 2);
