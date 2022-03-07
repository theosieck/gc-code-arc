<?php
/*
   Plugin Name: GC Code ARC
   Version: 2.1
   Author: Global Cognition
   Author URI: https://www.globalcognition.org
   Description: Serve up responses for feature coding
   Text Domain: gc-assess-arc
   License: GPLv3
*/

defined( 'ABSPATH' ) or die( 'No direct access!' );

include_once 'assets/lib/cpt-setup.php';
include_once 'assets/lib/judgments-db.php';
include_once 'assets/lib/post-list-additions.php';
include_once 'assets/lib/progress-utils.php';
require_once( 'assets/lib/plugin-page.php' );

global $gc_project;
$gc_project = get_post_meta(get_page_by_title('Manage')->ID,'project',true);

// Call gcaa_create_table on plugin activation.
register_activation_hook(__FILE__,'gcac_create_table'); // this function call has to happen here

/**
 * set global variable
*/
function gc_set_project() {
	if(is_page('manage')) {
		global $gc_project;

		// enqueue js
		wp_enqueue_script(
				'gcaa-set-project-js',
				plugins_url('/assets/js/set-project.js', __FILE__),
				['jquery'],
				time(),
				true
		);

		// send ajax url and nonce to js
		$gc_project_data = array(
			'ajax_url' => admin_url('admin-ajax.php'),
			'nonce' => wp_create_nonce('gcaa_project_nonce'),
			'projOptions' => explode(',',get_post_meta(get_page_by_title('Manage')->ID,'project_options',true)),
		);
		wp_localize_script('gcaa-set-project-js', 'projObj', $gc_project_data);

		// print headings
		echo "<h3 id='current-project'>Current Global Project: {$gc_project}</h3>";
		echo "<h3>Project Options:</h3><div id='project-options'></div>";

		// allow user to add new project
		echo "<h3 style='margin-top:10px;'>Add New Project:</h3>";
		echo "<form id='new-project-form'><input placeholder='Project title' name='newProjectName'><button style='margin-top:10px;'>Submit</button></form>";

		// link to team progress
		echo "<br /><a href='" . get_site_url() . "/team-progress'><h3>Team Progress Page</h3></a>";	// this link won't work on local
	}
}
add_action('genesis_entry_content','gc_set_project');

// Genesis activation hook
add_action('wp_ajax_gc_update_project','gc_update_project');
function gc_update_project() {
	check_ajax_referer('gcaa_project_nonce');
	global $gc_project;

	// check for a project to remove
	$removable = $_POST['removable'];
	if($removable) {
		// if current project is the one to remove, return an error
		if($gc_project==$removable) {
			$response['type'] = 'Please change the current project before attempting to remove it';
		} else {
			// get current options
			$manage_id = get_page_by_title('Manage')->ID;
			$project_options = get_post_meta($manage_id,'project_options',true);
			$project_array = explode(',',$project_options);
			// make sure option exists, then remove it
			$key = array_search($removable,$project_array);
			if($key!==false) {
				unset($project_array[$key]);
				$new_options = implode(',',$project_array);
				update_post_meta($manage_id,'project_options',$new_options);
				$response['newOptions'] = $project_array;
				$response['removed'] = $removable;
				$response['type'] = 'success';
			} else {
				$response['type'] = 'Sorry, the given project does not exist';
			}
		}
	} else {
		// check for a new project and update the post meta if there is one
		$new_gc_project = $_POST['project'];
		if($new_gc_project) {
			$gc_project = $new_gc_project;
			update_post_meta(get_page_by_title('Manage')->ID,'project',$new_gc_project);
			$project_options = get_post_meta(get_page_by_title('Manage')->ID,'project_options',true);
			$project_array = explode(',',$project_options);
			if(!in_array($new_gc_project,$project_array)) {
				update_post_meta(get_page_by_title('Manage')->ID,'project_options',$project_options . ',' . $new_gc_project);
			}
			$response['type'] = 'success';
		} else {
			$response['type'] = 'No project defined';
		}
	}

	// send a response back
	$response = json_encode($response);
	echo $response;
	die();
}

/**
 * print clarifying info to the user based on which project is assigned to them
*/
function gc_print_instructions() {
	global $current_user;
  if (is_page('coding') || is_page('review')) {
    // get the user's assigned project
    $assigned_project = get_user_meta($current_user->ID, 'project', true);
    $proj_display = $assigned_project ? $assigned_project : 'None';
    echo "<h3>Project: {$proj_display}</h3>";
    if(strpos($assigned_project,'Exemplar')) {
      echo "<p>Leave 'Block Number' as 0 for this project.</p>";
    }
  }
}
add_action('genesis_entry_content','gc_print_instructions');

function gc_assess_arc_enqueue_scripts() {

  if( is_page( 'coding/live' ) ) {
      global $current_user;
      get_currentuserinfo();
      if ( $current_user->ID) {

          wp_enqueue_script(
              'gcaa-main-js',
              plugins_url('/assets/js/main.js', __FILE__),
              ['wp-element', 'wp-components', 'jquery'],
              time(),
              true
          );

          $comp_num = sanitize_text_field(get_query_var('comp_num'));
          $task_num = sanitize_text_field(get_query_var('task_num'));
					$block_num = sanitize_text_field(get_query_var('block_num'));
          $review = sanitize_text_field(get_query_var('review'));;
          if($review) {
            $judge1 = sanitize_text_field(get_query_var('judge1'));
            $judge2 = sanitize_text_field(get_query_var('judge2'));
            $data_for_js = arc_pull_review_data_cpts($judge1, $judge2, $comp_num, $task_num, $block_num);
          } else {
						$sub_num = sanitize_text_field(get_query_var('sub_num'));
            $data_for_js = arc_pull_data_cpts($comp_num, $task_num, $sub_num, $block_num);
          }
          $other_data = array(
              'compNum' => $comp_num,
              'taskNum' => $task_num,
							'subNum' => $sub_num,
              'review' => $review
            );
          if(is_array($data_for_js)) {
            // there were no errors in pulling the data
            $data_for_js = array_merge($data_for_js,$other_data);
            // var_dump($data_for_js);
            // pass responses, scenarios, and competencies to Judgment App
            wp_localize_script('gcaa-main-js', 'respObj', $data_for_js);
          } else {
            // one of the pull_data functions returned an error message
            echo $data_for_js;
            // eventually, want to change this so it's not echoing where it currently is
          }
      } else {
          echo "please log in";
      }

  }
}
add_action( 'wp_enqueue_scripts', 'gc_assess_arc_enqueue_scripts' );


function gc_assess_arc_enqueue_styles() {

  wp_enqueue_style(
    'gcaa-main-css',
    plugins_url( '/assets/css/main.css', __FILE__ ),
    [],
    time(),
    'all'
  );

}
add_action( 'wp_enqueue_scripts', 'gc_assess_arc_enqueue_styles' );

/**
 * Display current judgment progress
 */
function gcac_display_progress() {
	$is_indep = is_page('progress');
  if(is_page('manage/team-progress') || $is_indep) {
		// global $gc_project;
    global $wpdb;
		global $current_user;	// only needed for indep

    // if independent progress, get currently assigned project
    if ($is_indep) {
      $current_project = get_user_meta($current_user->ID, 'project', true);
      // if none assigned, print that and return
      if ($current_project==null) {
        echo "Sorry, you have not been assigned a project.";
        return;
      }
    } else {
      // otherwise, get the list of all projects and start with the first one
	    $all_projects = explode(',',get_post_meta(get_page_by_title('Manage')->ID,'project_options',true));
      $current_project = $all_projects[0];
    }

    // set up the page
    // create a container
	  echo "<div id='gcac-progress-page'>";
    // print the inner content
    set_up_progress_page($current_project);
    // close the div
    echo "</div>";
  }
}
add_action('genesis_entry_content','gcac_display_progress');

/**
 * enqueue scripts for current judgment team progress
 */
function gcac_enqueue_progress_script() {
  if (is_page('manage/team-progress')) {
    // enqueue the script
    wp_enqueue_script(
      'gcac-progress-js',
      plugins_url('/assets/js/team-progress.js', __FILE__),
      ['jquery'],
      time(),
      true
    );

    // get the list of all projects
    $all_projects = explode(',',get_post_meta(get_page_by_title('Manage')->ID,'project_options',true));
    // get the admin url and a nonce
    $data_to_send = array(
      'ajax_url' => admin_url('admin-ajax.php'),
      'nonce' => wp_create_nonce('gcca_progress_nonce'),
      'allProjects' => $all_projects
    );

    // send to script
    wp_localize_script('gcac-progress-js', 'progData', $data_to_send);
  }
}
add_action('wp_enqueue_scripts', 'gcac_enqueue_progress_script');

/**
 * change the project for team progress on select change
 */
function gcac_change_prog_proj() {
  check_ajax_referer('gcca_progress_nonce');
  // get project from ajax req
  $selected_project = $_POST['project'];

  // set up the page (this will actually just send the new page data back to the front end)
  set_up_progress_page($selected_project);

  // $response['type'] = $selected_project;
  // $response = json_encode($response);
  // echo $response;
  die();
}
add_action('wp_ajax_gcac_change_prog_proj', 'gcac_change_prog_proj');

/**
 * display list of coded posts for given task/competency pair for user's currently assigned project project
*/
function gcac_display_ct_pair_list() {
	// if(is_page('progress/coded-cases')) {
  if(is_page('progress/coded-cases') || is_page('progress/reviewed-cases')) {
    $is_rev = is_page('progress/reviewed-cases');
		global $wpdb;
		global $current_user;
		$posts_table = $wpdb->prefix . 'posts';
		$db = new ARCJudgDB;
    $judgments_table = $db->get_name();
		// $assess_page = 'https://local.sandbox/?page_id=5252&';	// local
		$assess_page = get_site_url() . "/coding/live/?";	// live
    $current_project = get_user_meta($current_user->ID, 'project', true);

		// get url vars
		$comp_num = sanitize_text_field(get_query_var('comp_num'));
		$task_num = sanitize_text_field(get_query_var('task_num'));
		echo "<h2>{$current_project} Competency {$comp_num} Task {$task_num} Coded Cases</h2>";

		// get list of titles from db
    $judg_type = $is_rev ? 'rev' : 'ind';
		$sql = "SELECT DISTINCT `resp_title` FROM `{$judgments_table}` WHERE `resp_title` LIKE 'c{$comp_num}-t{$task_num}-%' AND `user_id` = {$current_user->ID} AND `judg_type` = '{$judg_type}' AND `project` = '{$current_project}'";
		$titles = $wpdb->get_results($sql);

		// loop over titles, displaying post title & excerpt for each
		foreach($titles as $title_obj) {
			$title = $title_obj->resp_title;
			$sub_num = substr($title,strpos($title,'sub')+3,2);
			// $link = $assess_page . "comp_num={$comp_num}&task_num={$task_num}&sub_num={$sub_num}";
			$link = $assess_page . "comp_num={$comp_num}&task_num={$task_num}&sub_num={$sub_num}";

			$sql = "SELECT `post_content` FROM `{$posts_table}` WHERE `post_title` = '{$title}'";
			$content_obj = ($wpdb->get_results($sql))[0];
			$excerpt = substr($content_obj->post_content,0,300);

			echo "<a href=\"{$link}\" target=\"_blank\"><h3>{$title}</h3></a>";
			echo "{$excerpt}<br /><br />";
		}
	}
}
add_action('genesis_entry_content', 'gcac_display_ct_pair_list');

// Add judge1 to url
function arc_judge1_query_vars( $qvars ) {
  $qvars[] = 'judge1';
  return $qvars;
}
add_filter( 'query_vars', 'arc_judge1_query_vars' );

// Add judge2 to url
function arc_judge2_query_vars( $qvars ) {
  $qvars[] = 'judge2';
  return $qvars;
}
add_filter( 'query_vars', 'arc_judge2_query_vars' );

// Add comp_num to url
function arc_comp_query_vars( $qvars ) {
    $qvars[] = 'comp_num';
    return $qvars;
}
add_filter( 'query_vars', 'arc_comp_query_vars' );

// Add task_num to url
function arc_task_query_vars( $qvars ) {
    $qvars[] = 'task_num';
    return $qvars;
}
add_filter( 'query_vars', 'arc_task_query_vars' );

// Add sub_num to url
function arc_sub_query_vars( $qvars ) {
    $qvars[] = 'sub_num';
    return $qvars;
}
add_filter( 'query_vars', 'arc_sub_query_vars' );

// Add block_num to url
function arc_block_query_vars( $qvars ) {
  $qvars[] = 'block_num';
  return $qvars;
}
add_filter( 'query_vars', 'arc_block_query_vars' );

// Add review to url
function arc_review_query_vars( $qvars ) {
    $qvars[] = 'review';
    return $qvars;
}
add_filter( 'query_vars', 'arc_review_query_vars' );

// Add new_project to url
function arc_project_query_vars( $qvars ) {
    $qvars[] = 'new_project';
    return $qvars;
}
add_filter( 'query_vars', 'arc_project_query_vars' );

// Genesis activation hook
add_action('wp_ajax_arc_save_data','arc_save_data');
/*
 * Calls the insert function from the class ARCJudgDB to insert response data into the table
 */
function arc_save_data() {
    check_ajax_referer('gcaa_scores_nonce');
    global $current_user;
    // get the user's currently assigned project
    $assigned_project = get_user_meta($current_user->ID, 'project', true);
    // if they don't have one, error
    if (!$assigned_project) {
      $response['type'] = "No assigned project for this user.";
      $response = json_encode($response);
      echo $response;
      die();
    }

    $db = new ARCJudgDB;

    // Get data from React components
    $sub_num = $_POST['sub_num'];
    $comp_num = $_POST['comp_num'];
    $task_num = $_POST['task_num'];
    $block_num = $_POST['block_num'];
    $resp_id = $_POST['resp_id'];
    $judg_type = $_POST['judg_type'];
    $judg_time = $_POST['judg_time'];
    $codes = $_POST['codes'];
    $judges = $_POST['judges'];
    $code_scheme = $_POST['code_scheme'];
    $comment = $_POST['comment'];

    if($judg_time>=60) {
        $judg_time = date("H:i:s", mktime(0, 0, $judg_time));
    }
    if($ration_time>=60) {
        $ration_time = date("H:i:s", mktime(0, 0, $ration_time));
    }
    if($resp_id) {
      $title = get_the_title($resp_id);
    } else {
      $title = $_POST['resp_title'];
    }

    $db_data = array(
        'user_id' => $current_user->ID,
				'project' => $assigned_project,
        'sub_num' => $sub_num,
        'comp_num' => $comp_num,
        'task_num' => $task_num,
        'block_num' => $block_num,
        'resp_title' => $title,
        'judg_type' => $judg_type,
        'judg_time'  => $judg_time,
        'code_scheme' => $code_scheme,
        'rater1' => $judges[0],
        'rater2' => $judges[1],
        'judg_comments' => $comment
    );

		unset($codes[0]);	// there is no code 0
		$code_data = array();
		$i = 1;
		foreach($codes as $code) {
			$code_data["code{$i}"] = $code[0];
			$code_data["excerpt{$i}"] = $code[1];
			$i++;
		}

		$db_data = array_merge($db_data,$code_data);

    $success = $db->insert($db_data);
    if($success) {
      $response['type'] = 'success';
      $data = $db->get_all_obj("user_id = {$current_user->ID} AND resp_title = '{$title}'");
      $response['data'] = $data[count($data)-1];
    } else {
      $response['type'] = $success;
    }
    // $response['type'] = 'success';
    $response = json_encode($response);
    echo $response;
    die();
}

?>
