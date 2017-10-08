const Benchmark = require('benchmark');

function noop() {}

function run(suites, { onStart = noop, onNext = noop, onError = noop, onComplete = noop } = {}) {
  return suites.reduce(
    (previous, suite) => previous.then((combinedResults) => (
      runSuite(suite.name, suite.benchmarks, { onStart, onNext, onError, onComplete })
        .then((results) => combinedResults.concat(results))
    )),
    Promise.resolve([])
  );
}

function runSuite(name, benchmarks, { onStart, onNext, onError, onComplete }) {
  return new Promise((resolve, reject) => {
    benchmarks
      .reduce(
        (suite, { name: testName, test }) => suite.add(testName, test),
        new Benchmark.Suite({ name })
      )
      .on('start', (event) => {
        const suite = event.currentTarget;
        const benchmark = event.target;
        onStart(suite, benchmark);
      })
      .on('error', (event) => {
        const suite = event.currentTarget;
        const currentBenchmark = event.target;
        const error = currentBenchmark.error;
        const tests = suite.slice();
        const currentBenchmarkIndex = tests.indexOf(currentBenchmark);
        const nextBenchmark = (currentBenchmarkIndex === suite.length - 1
          ? undefined
          : tests[currentBenchmarkIndex + 1]
        );
        onError(suite, error, currentBenchmark, nextBenchmark);
      })
      .on('cycle', (event) => {
        const suite = event.currentTarget;
        const currentBenchmark = event.target;
        const tests = suite.slice();
        const currentBenchmarkIndex = tests.indexOf(currentBenchmark);
        const nextBenchmark = (currentBenchmarkIndex === suite.length - 1
          ? undefined
          : tests[currentBenchmarkIndex + 1]
        );
        onNext(suite, currentBenchmark, nextBenchmark);
      })
      .on('complete', (event) => {
        const suite = event.currentTarget;
        const results = suite.sort((result1, result2) => result2.hz - result1.hz);
        onComplete(suite, results);
        resolve(results);
      })
      .run({ async: true });
  });
}

module.exports = run;
