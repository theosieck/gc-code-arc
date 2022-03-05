<?php

include_once 'judgments-db.php';
// require_once 'export.php';

add_action( 'admin_menu', 'arc_data_export_menu' );

$main_menu_url = 'arc-data-export';

function arc_data_export_menu() {
  global $main_menu_url;
	add_menu_page(
    'ARC Data Export',
    'ARC Data Export',
    'manage_options',
    $main_menu_url . '.php',
    'arc_data_export_page',
    'dashicons-download',
    76
  );
}

function arc_data_export_page() {
	// get the list of project options
	$all_projects = explode(',',get_post_meta(get_page_by_title('Manage')->ID,'project_options',true));

	// enqueue axios script
	wp_enqueue_script(
		'axios',
		'https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js'
	);

	// enqueue script
	wp_enqueue_script(
		'gcca-set-download-project-js',
		plugins_url('../js/set-download-project.js', __FILE__),
		['jquery'],
		time(),
		true
	);

	// send data
	$gcca_ajax_url = admin_url('admin-ajax.php') . '?action=gcca_do_export';
	$gcca_proj_data = array(
		// 'ajax_url' => admin_url('admin-ajax.php'),
		'ajax_url' => $gcca_ajax_url,
		'nonce' => wp_create_nonce('gcca_project_download_nonce'),
		'allProjects' => $all_projects
	);
	wp_localize_script('gcca-set-download-project-js', 'projDownloadInfo', $gcca_proj_data);
}

function gcac_send_data($csv_file,$filename,$headers) {
	// close temp file
	fclose($csv_file);

	if (version_compare(phpversion(), '5.3.0', '>')) {
		//make sure we get the right file size
		clearstatcache( true, $filename );
	} else {
		// for any PHP version prior to v5.3.0
		clearstatcache();
	}

	// set download size
	$headers[] = "Content-Length: " . filesize($filename);

	// make sure headers have not been sent already
	if(headers_sent()) {
		$response['type'] = 'error: headers already sent';
		$response = json_encode($response);
		die;
	}

	// send headers
	foreach($headers as $header) {
		header($header . "\r\n");
	}

	// disable compression for the duration of file download
	if(ini_get('zlib.output_compression')){
		ini_set('zlib.output_compression', 'Off');
	}

	// read the file to output - if using on flywheel site, use readfile instead
	if(function_exists('fpassthru')) {
		$fp = fopen($filename, 'rb');
		fpassthru($fp);
		fclose($fp);
	} else {
		readfile($filename);
	}

	// remove temp file
	unlink($filename);

	// exit
	exit;
}

add_action('wp_ajax_gcca_do_export', 'gcca_do_export');
function gcca_do_export() {
	// check_ajax_referer('gcca_project_download_nonce');

	$selected_project = $_POST['project'];

	// global $gc_project;
	$db = new ARCJudgDB;

	// set headers
	$headers = array();
	$headers[] = "Content-Disposition: attachment; filename=\"competency_csv_data.csv\"";
	$headers[] = "Content-Type: text/csv";
	$headers[] = "Cache-Control: max-age=0, no-cache, no-store";
	$headers[] = "Pragma: no-cache";
	$headers[] = "Connection: close";

	// $response = $headers;
	// $response = json_encode($response);
	// echo $response;
	// die();

	// set default csv headers
	$columns = $db->get_columns();
	$csv_headers = "";
	foreach($columns as $column) {
	    $csv_headers .= $column->Key == "PRI" ? $column->Field : ("," . $column->Field);
	}
	$csv_headers .= "\n";

	// get data from db
	$all_rows = $db->get_all_arraya("project = '{$selected_project}'");
	$csv_rows = "";
	foreach($all_rows as $row) {
	    foreach($row as $key => $cell) {
	        // differentiate between true null and the empty string, convert from UTF-8 encoding to ANSI
	        $cell_data = $cell === null ? "null" : ('"' . iconv("UTF-8", "WINDOWS-1252", $cell) . '"');
	        $csv_rows .= $key == "judg_id" ? $cell_data : ("," . $cell_data);
	    }
	    $csv_rows .= "\n";
	}

	// create temp dir/file
	$tmp_dir = sys_get_temp_dir();
	$filename = tempnam( $tmp_dir, 'gcac_data_');

	// open file for appending
	$csv_file = fopen($filename, 'a');

	// write csv header, rows to file
	fprintf($csv_file, '%s', $csv_headers);
	fprintf($csv_file, '%s', $csv_rows);

	// send data
	gcac_send_data($csv_file,$filename,$headers);

	exit;

}
// add_action( 'wp_ajax_gcac_do_export', 'gcac_wp_ajax_do_export' );
