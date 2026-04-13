// ClaudeTokenVampire — install/uninstall helper
// Usage: node setup.js install | uninstall

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MARKETPLACE   = 'claudetokenvampire';
const PLUGIN_ID     = 'claudetokenvampire';
const PLUGIN_KEY    = PLUGIN_ID + '@' + MARKETPLACE;
const VERSION       = 'local';
const CLAUDE_DIR    = path.join(process.env.USERPROFILE, '.claude');
const PLUGINS_DIR   = path.join(CLAUDE_DIR, 'plugins');
const CACHE_DIR     = path.join(PLUGINS_DIR, 'cache', MARKETPLACE, PLUGIN_ID, VERSION);
const MKT_DIR       = path.join(PLUGINS_DIR, 'marketplaces', MARKETPLACE);
const SETTINGS_FILE = path.join(CLAUDE_DIR, 'settings.json');
const KNOWN_MKT     = path.join(PLUGINS_DIR, 'known_marketplaces.json');
const INSTALLED     = path.join(PLUGINS_DIR, 'installed_plugins.json');
const PLUGIN_DIR    = __dirname;

function readJSON(filePath) {
    if (!fs.existsSync(filePath)) return null;
    try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
    catch (e) { return null; }
}

function writeJSON(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function createJunction(target, linkPath) {
    // Remove existing junction/directory
    if (fs.existsSync(linkPath)) {
        const stat = fs.lstatSync(linkPath);
        if (stat.isSymbolicLink() || stat.isDirectory()) {
            try { fs.rmSync(linkPath, { recursive: true }); } catch (e) {}
        }
    }
    // Ensure parent exists
    const parent = path.dirname(linkPath);
    if (!fs.existsSync(parent))
        fs.mkdirSync(parent, { recursive: true });
    // Create Windows junction (no admin needed)
    execSync(`mklink /J "${linkPath}" "${target}"`, { shell: 'cmd.exe', stdio: 'ignore' });
}

function removeJunction(linkPath) {
    if (fs.existsSync(linkPath)) {
        // rmdir removes junction without deleting target contents
        try { execSync(`rmdir "${linkPath}"`, { shell: 'cmd.exe', stdio: 'ignore' }); } catch (e) {}
    }
}

function install() {
    const now = new Date().toISOString();

    // 1. Create junctions (cache + marketplace) → plugin directory
    //    Claude Code reads skills from cache path, marketplace for discovery
    createJunction(PLUGIN_DIR, CACHE_DIR);
    createJunction(PLUGIN_DIR, MKT_DIR);
    console.log('  Cache junction: ' + CACHE_DIR + ' -> ' + PLUGIN_DIR);
    console.log('  Mkt junction:   ' + MKT_DIR + ' -> ' + PLUGIN_DIR);

    // 2. settings.json — declare marketplace + enable plugin
    const s = readJSON(SETTINGS_FILE) || {};
    if (!s.extraKnownMarketplaces) s.extraKnownMarketplaces = {};
    s.extraKnownMarketplaces[MARKETPLACE] = {
        source: { source: 'directory', path: PLUGIN_DIR }
    };
    if (!s.enabledPlugins) s.enabledPlugins = {};
    s.enabledPlugins[PLUGIN_KEY] = true;
    writeJSON(SETTINGS_FILE, s);

    // 3. known_marketplaces.json — register marketplace with install location
    const km = readJSON(KNOWN_MKT) || {};
    km[MARKETPLACE] = {
        source: { source: 'directory', path: PLUGIN_DIR },
        installLocation: MKT_DIR,
        lastUpdated: now
    };
    writeJSON(KNOWN_MKT, km);

    // 4. installed_plugins.json — register plugin (cache path)
    const ip = readJSON(INSTALLED) || { version: 2, plugins: {} };
    if (!ip.plugins) ip.plugins = {};
    ip.plugins[PLUGIN_KEY] = [{
        scope: 'user',
        installPath: CACHE_DIR,
        version: VERSION,
        installedAt: now,
        lastUpdated: now
    }];
    writeJSON(INSTALLED, ip);

    console.log('Plugin installed.');
    console.log('  Plugin dir:     ' + PLUGIN_DIR);
    console.log('  Settings:       ' + SETTINGS_FILE);
}

function uninstall() {
    // 1. Remove junctions
    removeJunction(CACHE_DIR);
    removeJunction(MKT_DIR);
    // Clean up empty parent dirs
    for (const d of [path.dirname(CACHE_DIR), path.dirname(path.dirname(CACHE_DIR)),
                      path.dirname(MKT_DIR)]) {
        try {
            if (fs.existsSync(d) && fs.readdirSync(d).length === 0)
                fs.rmdirSync(d);
        } catch (e) {}
    }

    // 2. settings.json — remove plugin + marketplace
    const s = readJSON(SETTINGS_FILE) || {};
    if (s.enabledPlugins) {
        delete s.enabledPlugins[PLUGIN_KEY];
        if (Object.keys(s.enabledPlugins).length === 0)
            delete s.enabledPlugins;
    }
    if (s.extraKnownMarketplaces) {
        const othersUseIt = s.enabledPlugins &&
            Object.keys(s.enabledPlugins).some(k => k.endsWith('@' + MARKETPLACE));
        if (!othersUseIt) {
            delete s.extraKnownMarketplaces[MARKETPLACE];
            if (Object.keys(s.extraKnownMarketplaces).length === 0)
                delete s.extraKnownMarketplaces;
        }
    }
    writeJSON(SETTINGS_FILE, s);

    // 3. known_marketplaces.json — remove marketplace
    const km = readJSON(KNOWN_MKT);
    if (km) {
        delete km[MARKETPLACE];
        writeJSON(KNOWN_MKT, km);
    }

    // 4. installed_plugins.json — remove plugin
    const ip = readJSON(INSTALLED);
    if (ip && ip.plugins) {
        delete ip.plugins[PLUGIN_KEY];
        writeJSON(INSTALLED, ip);
    }

    console.log('Plugin uninstalled.');
    console.log('  Settings:       ' + SETTINGS_FILE);
}

// --- Main ---
const action = process.argv[2];
if (action === 'install')        install();
else if (action === 'uninstall') uninstall();
else {
    console.error('Usage: node setup.js install | uninstall');
    process.exit(1);
}
