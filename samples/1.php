<?php

// Dummy config
$siteName = "Really Really Long PHP Script";
$version = "1.0.0";

// Generate tons of meaningless variables
for ($i = 0; $i < 1000; $i++) {
    ${"var_$i"} = "Value $i";
}

// Giant meaningless function
function doSomethingCompletelyPointless($iterations = 1000) {
    $result = "";
    for ($i = 0; $i < $iterations; $i++) {
        $result .= "Iteration $i: " . str_repeat("*", $i % 50) . PHP_EOL;
    }
    return $result;
}

// Some dummy classes
class UselessClass {
    public $prop;

    public function __construct($val) {
        $this->prop = $val;
    }

    public function repeatStuff($word, $times) {
        $out = "";
        for ($i = 0; $i < $times; $i++) {
            $out .= "$word ";
        }
        return trim($out);
    }

    public function doMoreStuff() {
        for ($i = 0; $i < 500; $i++) {
            echo "Doing more stuff: $i" . PHP_EOL;
        }
    }
}

class AnotherUselessClass extends UselessClass {
    public function invertString($str) {
        return strrev($str);
    }

    public function endlessLoop() {
        for ($i = 0; $i < 1000; $i++) {
            echo "Loop $i in AnotherUselessClass" . PHP_EOL;
        }
    }
}

// Massive array builder
$massiveArray = [];
for ($i = 0; $i < 10000; $i++) {
    $massiveArray[] = "Item $i";
}

// Nested functions and loops
function deeplyNestedFunction() {
    for ($i = 0; $i < 50; $i++) {
        for ($j = 0; $j < 50; $j++) {
            for ($k = 0; $k < 10; $k++) {
                echo "Nested level $i-$j-$k" . PHP_EOL;
            }
        }
    }
}

// Instantiate classes just to call them
$object1 = new UselessClass("Test");
$object2 = new AnotherUselessClass("Another Test");

echo $object1->repeatStuff("echo", 100) . PHP_EOL;
echo $object2->invertString("pointless") . PHP_EOL;

// Call the pointless function
$output = doSomethingCompletelyPointless(200);
file_put_contents("pointless_output.txt", $output);

// Random switch statements
function randomSwitch($val) {
    switch ($val) {
        case 0:
            return "Zero";
        case 1:
            return "One";
        case 2:
            return "Two";
        case 3:
            return "Three";
        case 4:
            return "Four";
        default:
            return "Other";
    }
}

// Run a bunch of those
for ($i = 0; $i < 1000; $i++) {
    echo randomSwitch($i % 6) . PHP_EOL;
}

// Pointless recursive function
function pointlessRecursion($n) {
    if ($n <= 0) return;
    echo "Recursing at $n" . PHP_EOL;
    pointlessRecursion($n - 1);
}
pointlessRecursion(10);

// Unused namespaces and interfaces
namespace MyNamespace {
    interface DoNothingInterface {
        public function doNothing();
    }

    class DoNothingClass implements DoNothingInterface {
        public function doNothing() {
            // Does nothing
        }
    }
}

// Another pointless loop
foreach (range(0, 9999) as $number) {
    $tmp = $number * 2 / 3;
}

// Final note
echo "Done generating long PHP script." . PHP_EOL;

?>
