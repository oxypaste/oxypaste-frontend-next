import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

public class LongJavaCode {

    public static void main(String[] args) {
        System.out.println("Starting long Java program...");

        // Create a list of numbers
        List<Integer> numbers = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            numbers.add(i);
        }

        // Process numbers
        Map<Integer, String> processed = new HashMap<>();
        for (int num : numbers) {
            processed.put(num, processNumber(num));
        }

        // Print some results
        for (int i = 0; i < 10; i++) {
            System.out.println("Number " + i + " processed as: " + processed.get(i));
        }

        // Create and manipulate some objects
        List<Person> people = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            people.add(new Person("Person" + i, i + 20));
        }

        // Filter adults
        List<Person> adults = filterAdults(people);

        // Print adults
        for (Person p : adults) {
            System.out.println(p.getName() + " is an adult, age: " + p.getAge());
        }

        // Work with nested loops and conditions
        int[][] matrix = generateMatrix(10, 10);
        int sum = 0;
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] % 2 == 0) {
                    sum += matrix[i][j];
                } else {
                    sum -= matrix[i][j];
                }
            }
        }
        System.out.println("Final sum after matrix processing: " + sum);

        // Recursive function example
        int factorialOf10 = factorial(10);
        System.out.println("Factorial of 10 is: " + factorialOf10);

        // Exception handling
        try {
            int div = divide(10, 0);
            System.out.println("Division result: " + div);
        } catch (ArithmeticException e) {
            System.out.println("Caught an arithmetic exception: " + e.getMessage());
        }

        // Use an enum and switch-case
        Day today = Day.WEDNESDAY;
        System.out.println("Today is " + today);
        switch (today) {
            case MONDAY:
                System.out.println("Start of the work week.");
                break;
            case FRIDAY:
                System.out.println("Almost weekend!");
                break;
            case SATURDAY:
            case SUNDAY:
                System.out.println("Weekend!");
                break;
            default:
                System.out.println("Midweek days.");
        }

        // Run a thread
        Thread thread = new Thread(new RunnableTask());
        thread.start();

        // Wait for thread to finish
        try {
            thread.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // Use a synchronized block
        SynchronizedCounter counter = new SynchronizedCounter();
        List<Thread> threads = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            Thread t = new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    counter.increment();
                }
            });
            threads.add(t);
            t.start();
        }

        for (Thread t : threads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        System.out.println("Counter value after multi-threading: " + counter.getValue());

        // More data structures - stacks and queues
        Stack<String> stack = new Stack<>();
        for (int i = 0; i < 10; i++) {
            stack.push("StackItem" + i);
        }
        while (!stack.isEmpty()) {
            System.out.println("Popped from stack: " + stack.pop());
        }

        Queue<String> queue = new LinkedList<>();
        for (int i = 0; i < 10; i++) {
            queue.offer("QueueItem" + i);
        }
        while (!queue.isEmpty()) {
            System.out.println("Polled from queue: " + queue.poll());
        }

        // HashSet usage
        Set<Integer> set = new HashSet<>();
        for (int i = 0; i < 50; i += 3) {
            set.add(i);
        }
        System.out.println("HashSet contents:");
        for (int s : set) {
            System.out.print(s + " ");
        }
        System.out.println();

        // LinkedList usage
        LinkedList<Person> linkedPeople = new LinkedList<>(people);
        linkedPeople.addFirst(new Person("NewPersonFirst", 30));
        linkedPeople.addLast(new Person("NewPersonLast", 25));
        System.out.println("LinkedList first: " + linkedPeople.getFirst().getName());
        System.out.println("LinkedList last: " + linkedPeople.getLast().getName());

        // More recursive stuff - Fibonacci
        int fib20 = fibonacci(20);
        System.out.println("Fibonacci(20): " + fib20);

        // Anonymous inner class example
        Greeting greeting = new Greeting() {
            @Override
            public void sayHello() {
                System.out.println("Hello from anonymous class!");
            }
        };
        greeting.sayHello();

        // Lambda expression example
        List<Integer> squared = map(numbers, n -> n * n);
        System.out.println("First 10 squares:");
        for (int i = 0; i < 10; i++) {
            System.out.println(numbers.get(i) + " squared = " + squared.get(i));
        }

        // Custom generic class usage
        Pair<String, Integer> pair = new Pair<>("Age", 42);
        System.out.println("Pair: key=" + pair.getKey() + ", value=" + pair.getValue());

        // More threads with Runnable and Callable
        List<Thread> workerThreads = new ArrayList<>();
        for (int i = 0; i < 3; i++) {
            Thread t = new Thread(new Worker(i));
            workerThreads.add(t);
            t.start();
        }
        for (Thread t : workerThreads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        // Final message
        System.out.println("Long Java program finished.");
    }

    // Helper function for processNumber
    static String processNumber(int num) {
        if (num % 15 == 0) {
            return "FizzBuzz";
        } else if (num % 3 == 0) {
            return "Fizz";
        } else if (num % 5 == 0) {
            return "Buzz";
        } else {
            return Integer.toString(num);
        }
    }

    // Filter adults
    static List<Person> filterAdults(List<Person> people) {
        List<Person> adults = new ArrayList<>();
        for (Person p : people) {
            if (p.getAge() >= 18) {
                adults.add(p);
            }
        }
        return adults;
    }

    // Generate random matrix
    static int[][] generateMatrix(int rows, int cols) {
        int[][] matrix = new int[rows][cols];
        Random rand = new Random();
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                matrix[i][j] = rand.nextInt(100);
            }
        }
        return matrix;
    }

    // Factorial recursive
    static int factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    // Division (may throw ArithmeticException)
    static int divide(int a, int b) {
        return a / b;
    }

    // Fibonacci recursive with memoization
    static Map<Integer, Integer> fibCache = new HashMap<>();
    static int fibonacci(int n) {
        if (n <= 1) return n;
        if (fibCache.containsKey(n)) return fibCache.get(n);
        int result = fibonacci(n - 1) + fibonacci(n - 2);
        fibCache.put(n, result);
        return result;
    }

    // Generic map method using Java 8 functional interface
    static <T, R> List<R> map(List<T> list, Transformer<T, R> transformer) {
        List<R> result = new ArrayList<>();
        for (T t : list) {
            result.add(transformer.transform(t));
        }
        return result;
    }

    interface Transformer<T, R> {
        R transform(T input);
    }

    // Enum for days
    enum Day {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }

    // Person class
    static class Person {
        private String name;
        private int age;

        Person(String name, int age) {
            this.name = name;
            this.age = age;
        }
        public String getName() { return name; }
        public int getAge() { return age; }
    }

    // RunnableTask for thread example
    static class RunnableTask implements Runnable {
        public void run() {
            for (int i = 0; i < 5; i++) {
                System.out.println("Runnable task running iteration " + i);
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // Synchronized counter class
    static class SynchronizedCounter {
        private int value = 0;

        public synchronized void increment() {
            value++;
        }
        public int getValue() {
            return value;
        }
    }

    // Greeting interface
    interface Greeting {
        void sayHello();
    }

    // Generic Pair class
    static class Pair<K, V> {
        private K key;
        private V value;

        Pair(K key, V value) {
            this.key = key;
            this.value = value;
        }
        public K getKey() { return key; }
        public V getValue() { return value; }
    }

    // Worker thread class
    static class Worker implements Runnable {
        private int id;

        Worker(int id) {
            this.id = id;
        }
        public void run() {
            for (int i = 0; i < 3; i++) {
                System.out.println("Worker " + id + " working, step " + i);
                try {
                    Thread.sleep(300);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // Additional nested classes to bulk up code

    static class MathUtils {
        public static int gcd(int a, int b) {
            while (b != 0) {
                int temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        }

        public static int lcm(int a, int b) {
            return a / gcd(a, b) * b;
        }

        public static boolean isPrime(int n) {
            if (n <= 1) return false;
            for (int i = 2; i <= Math.sqrt(n); i++) {
                if (n % i == 0) return false;
            }
            return true;
        }
    }

    static class StringUtils {
        public static String reverse(String s) {
            StringBuilder sb = new StringBuilder(s);
            return sb.reverse().toString();
        }

        public static boolean isPalindrome(String s) {
            String reversed = reverse(s);
            return s.equalsIgnoreCase(reversed);
        }

        public static String capitalizeWords(String sentence) {
            String[] words = sentence.split(" ");
            StringBuilder result = new StringBuilder();
            for (String w : words) {
                if (w.length() > 0) {
                    result.append(Character.toUpperCase(w.charAt(0)));
                    if (w.length() > 1) {
                        result.append(w.substring(1).toLowerCase());
                    }
                    result.append(" ");
                }
            }
            return result.toString().trim();
        }
    }

    static class DataStructures {
        public static <T> void printList(List<T> list) {
            for (T item : list) {
                System.out.println(item);
            }
        }

        public static <K, V> void printMap(Map<K, V> map) {
            for (Map.Entry<K, V> entry : map.entrySet()) {
                System.out.println(entry.getKey() + " -> " + entry.getValue());
            }
        }
    }

    // Big method that does some calculations
    static int complicatedCalculation(int base, int exponent, int mod) {
        int result = 1;
        int b = base % mod;
        int e = exponent;
        while (e > 0) {
            if ((e & 1) == 1) {
                result = (result * b) % mod;
            }
            b = (b * b) % mod;
            e >>= 1;
        }
        return result;
    }

    // Lots of overloaded methods for no reason

    static void print(String s) {
        System.out.println("String: " + s);
    }

    static void print(int i) {
        System.out.println("Int: " + i);
    }

    static void print(double d) {
        System.out.println("Double: " + d);
    }

    static void print(Person p) {
        System.out.println("Person: " + p.getName() + ", age " + p.getAge());
    }

    static void print(List<?> list) {
        System.out.println("List size: " + list.size());
        for (Object obj : list) {
            System.out.println(" - " + obj);
        }
    }
}
