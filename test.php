<?php
define('ALEXANDER_THE_GREAT', 'heisthegreatest');


include_once('includes/class-web-page.php');
$webpage = new Web_Page('index', 'template');

$max = rand(1, 10);
$rows = [];

for($rowindex = 0; $rowindex < $max; $rowindex++) {
    $row = '<tr>';
    for($cellindex = 0; $cellindex < $max; $cellindex++) {
        $row .= '<td>Row: ' . strval($rowindex + 1) . ', Cell: ' . strval($rowindex + 1) . '</td>';
    }
    $row .= '</tr>';
    
    array_push($rows, $row);
}


$contents =<<<KOTAROW
    <h1>Demo</h1>
    <div>
        <p>This is a test.</p>
        <table border="1">
            %s
        </table>
    </div>
    <div>
        <p id="paragraph"></p>
    </div>
    <section>
        <h2>Data Test</h2>
        <p>The dummy user data has been fetched and displayed by <em>Javascript (js2.js)</em>.</p>
        <div id="dataarea">
        </div>
    </section>
KOTAROW;

$contents = sprintf(
    $contents,
    implode("\n\t\t\t", $rows) . PHP_EOL
);

$webpage->build_contents(
    function ($config) use ($webpage, $contents) {
        $webpage->page_contents = $contents;
    }
);
$webpage->build_header();
$webpage->display();
?>