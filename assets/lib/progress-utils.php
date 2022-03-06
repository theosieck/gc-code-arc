<?php

function get_comps_and_tasks() {
    global $wpdb;
	$posts_table = $wpdb->prefix . 'posts';
	$postmeta_table = $wpdb->prefix . 'postmeta';
	$db = new ARCJudgDB;

	// get array of competencies
	$sql = "SELECT DISTINCT `post_title` FROM `{$posts_table}` WHERE `post_status` = 'publish' AND `post_type` = 'competency' AND `ID` IN (SELECT DISTINCT `post_id` FROM `{$postmeta_table}` WHERE `meta_key` = 'comp_part' AND `meta_value` = 0)  ORDER BY `ID`";
    $competencies = $wpdb->get_results($sql);
    
	// get array of scenario titles
    $sql = "SELECT DISTINCT `post_title` FROM `{$posts_table}` WHERE `post_title` NOT LIKE '0-%' AND `post_status` = 'publish' AND `post_type` = 'scenario'";
    $task_objs = $wpdb->get_results($sql);
    $tasks = [];
    foreach($task_objs as $task_obj) {
      $task_name = $task_obj->post_title;
      $task_num = substr($task_name,0,strpos($task_name,'-'));
      $tasks[$task_num] = $task_name;
    }
    
	// get array of responses
    $sql = "SELECT DISTINCT `post_title` FROM `{$posts_table}` WHERE `post_title` LIKE '%sub%' AND `post_status` = 'publish' AND `post_type` = 'response'";
    $total_responses = $wpdb->get_results($sql);

    // find each task-competency pair
    $ct_pairs = [];
    foreach($total_responses as $resp_obj) {
      $resp_str = $resp_obj->post_title;
      $comp_num = substr($resp_str,1,strpos($resp_str,'-')-1);
      $ct_pair = substr($resp_str,0,strpos($resp_str,'-',4));
      if(!is_array($ct_pairs[$comp_num]) || !in_array($ct_pair, $ct_pairs[$comp_num])) {
        $ct_pairs[$comp_num][] = $ct_pair;
      }
    }

	return array(
		'competencies' => $competencies,
		'ct_pairs' => $ct_pairs,
		'tasks' => $tasks,
	);
}

function print_ct_info($ct_pair, $tasks, $current_project, $comp_num) {
	global $wpdb;
	global $current_user;	// only needed for indep
	$db = new ARCJudgDB;
	$judgments_table = $db->get_name();
	$is_indep = is_page('progress');
	$ct_pair_page = get_site_url() . "/progress/coded-cases/?";	// live
	$ct_pair_rev_page = get_site_url() . "/progress/reviewed-cases/?";	// live

	// print scenario name
	$ind = strpos($ct_pair,'t')+1;
	$task_num = substr($ct_pair,$ind,strlen($ct_pair)-$ind);
	echo "<b>Scenario {$tasks[$task_num]}</b><br />";

	// get total number of responses
	$meta_query = array(
		'relation' => 'AND',
		array(
			'key' => 'comp_num',
			'value' => $comp_num,
			'compare' => '=',
		),
		array(
			'relation' => 'AND',
			array(
				'key' => 'task_num',
				'value' => $task_num,
				'compare' => '=',
			),
			array(
				'key' => 'project',
				'value' => $current_project,
				'compare' => '=',
			),
		),
	);
	$resp_args = array(
		'numberposts' => -1,
		'post_type' => 'response',
		'meta_query' => $meta_query
	);
	$total_responses = count(get_posts($resp_args));

	// get total number of coded responses
	$sql = "SELECT DISTINCT `resp_title` FROM `{$judgments_table}` WHERE `resp_title` LIKE 'c{$comp_num}-t{$task_num}-%' AND `judg_type` = 'ind' AND `project` = '{$current_project}'";
	if($is_indep) {
		$sql .= " AND `user_id` = {$current_user->ID}";
	}
	$num_coded_responses = count($wpdb->get_results($sql));

	// get total number of reviewed responses
	$sql = "SELECT DISTINCT `resp_title` FROM `{$judgments_table}` WHERE `resp_title` LIKE 'c{$comp_num}-t{$task_num}-%' AND `judg_type` = 'rev' AND `project` = '{$current_project}'";
	if($is_indep) {
		$sql .= " AND `user_id` = {$current_user->ID}";
	}
	$num_reviewed_responses = count($wpdb->get_results($sql));

	if($is_indep) {
		// make url for editing coded responses
		$list_url = $ct_pair_page . "comp_num={$comp_num}&task_num={$task_num}";
		$list_rev_url = $ct_pair_rev_page . "comp_num={$comp_num}&task_num={$task_num}";
	}

	// print counts
	echo "{$total_responses} responses to code.<br />";
	echo "{$num_coded_responses} coded responses." . ($is_indep ? " <a href=\"{$list_url}\" target=\"_blank\">Click to see list</a><br />" : "<br />");
	// echo "{$num_reviewed_responses} reviewed responses.<br /><br />";
	echo "{$num_reviewed_responses} reviewed responses.". ($is_indep ? " <a href=\"{$list_rev_url}\" target=\"_blank\">Click to see list</a><br /><br />" : "<br /><br />");
}

?>