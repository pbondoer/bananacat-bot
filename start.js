const path = require('path');
const fs = require('fs/promises');
const childProcess = require('child_process');

const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');
const pinoPretty = require('pino-pretty');
const colors = require('colorette');
const package = require('./package.json');

// Constants -------------------------------------

const isProd = process.env.NODE_ENV === 'production';
const useSourcemaps = true;
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// Helpers ---------------------------------------

const formatHrtime = time =>
  `${time[0]}.${Math.round(time[1] / 1000000)
    .toString()
    .padStart(3, '0')}s`;

// Bundler setup ---------------------------------

const getBundle = async () => {
  console.log(colors.cyan('⌛ Building...'));

  try {
    await fs.rm(distDir, { recursive: true, force: true });
  } catch (e) {
    console.log(colors.red("⚠️ Couldn't remove distDir"));
    console.log(e);

    process.exit(0);
  }

  const buildStart = process.hrtime();
  const build = await esbuild.build({
    bundle: true,

    // Node.js specific options
    platform: 'node',
    target: `node${process.versions.node}`,

    // Exclude node_modules from bundling
    plugins: [nodeExternalsPlugin()],

    // Output options
    entryPoints: [path.join(srcDir, 'index.ts')],
    outdir: distDir,

    // Build sourcemaps
    sourcemap: useSourcemaps,

    // Production options
    minify: isProd,
  });
  const buildTime = process.hrtime(buildStart);

  console.log(colors.gray(` -> Build time: ${formatHrtime(buildTime)}`));
  process.stdout.write('\n');

  return path.join(distDir, 'index.js');
};

// Logging ---------------------------------------

const prettify = obj => {
  const str = JSON.stringify(obj, null, 2);

  return str.slice(2, str.length - 2);
};

const logger = pinoPretty({
  colorize: colors.isColorSupported,
  crlf: false,

  errorLikeObjectKeys: ['err', 'error', 'e'],
  errorProps: '',

  levelFirst: false,

  messageKey: 'msg',
  messageFormat: `${colors.yellow('{component}')} ${colors.white(':')} {msg}`,

  timestampKey: 'time',
  translateTime: 'yyyy-mm-dd HH:MM:ss.l',

  search: '',
  ignore: 'pid,hostname,component,name',

  customPrettifiers: {
    client: value => {
      const { name, version, ...client } = value;

      const header = colors.cyan(`${name} v${version}`);
      return `${header}\n${prettify(client)}`;
    },
    command: c => colors.blueBright(c),
    user: u => colors.blueBright(`${u.tag} (${u.id})`),
    guild: g => colors.blueBright(`${g.name} (${g.id})`),
    request: req => `${req.options.method} ${colors.blue(req.options.url)}`,
    dumpPath: p => colors.red(p),
    event: event => {
      const { name, message } = event;
      if (name === 'message' && message) {
        const { author, content } = message;

        return `message\n  ${colors.gray(author + ':')} ${content}`;
      }

      return `\n${prettify(event)}`;
    },
    error: e => `\n${prettify(e)}`,
    err: e => `\n${prettify(e)}`,
    e: e => `\n${prettify(e)}`,
  },
});

// Start the app ---------------------------------

console.log(
  colors.magentaBright(
    `✨ Starting ${colors.greenBright(package.name)} in ${
      isProd
        ? colors.redBright('production')
        : colors.yellowBright('development')
    } mode\n`
  )
);

// 1. Build the app
(async () => {
  const bundlePath = await getBundle();

  // 2. Fork and start
  const startProcess = () => {
    console.log(colors.cyan('⌛ Starting sub-process...'));

    console.log(colors.gray(` -> Node version: ${process.version}`));
    console.log(
      colors.gray(` -> Source maps: ${useSourcemaps ? 'yes' : 'no'}`)
    );
    process.stdout.write('\n');

    const server = childProcess.fork(bundlePath, [], {
      execArgv: useSourcemaps ? ['-r', 'source-map-support/register'] : [],
      silent: true,
    });

    server.on('error', e => {
      console.error(colors.red('⚠️ Failed to start sub-process!'));
      console.error(e);
    });

    server.on('close', code => {
      console.error(
        colors.red(`⚠️ Node process exited with code ${code}, restarting...`)
      );
      startProcess();
    });

    server.stderr.pipe(process.stderr);
    server.stdout.pipe(logger);

    process.on('SIGINT', () => {
      const success = server.kill();

      process.stdout.clearLine();
      process.stdout.write('\n');
      console.log(
        success
          ? colors.cyan(`👋 Killed subprocess, exiting...`)
          : colors.red(`⚠️ Failed to kill subprocess, exiting...`)
      );

      process.exit(0);
    });
  };

  startProcess();
})();
