# Universal Roblox MCP

**Comprehensive MCP integration for Roblox Studio development** — 60+ tools, 30+ prompts, and 4+ resources so AI assistants (Claude, Cursor, Windsurf) can read/write Roblox Studio and use the Roblox API.

## Features

- **37+ Studio Tools** - Full read-write access to Roblox Studio
- **27 Documentation Tools** - Complete API reference, FastFlags, Luau docs
- **Open Cloud APIs** - DataStores, Assets, Publishing
- **Multi-transport** - stdio (Claude/Cursor) + SSE (Windsurf/web)
- **Python Bridge** - Automatic `uvx mcp-roblox-docs` subprocess management

## Installation

### 1. Install the Server

```bash
git clone https://github.com/HastyBasher/Universal-Roblox-MCP.git
cd Universal-Roblox-MCP
pnpm install
pnpm build
```

### 2. Install the Studio Plugin

Copy `studio-plugin/MCPPlugin.rbxmx` to your Roblox Studio plugins folder:

- **Windows**: `%LOCALAPPDATA%\Roblox\Plugins\`
- **macOS**: `~/Documents/Roblox/Plugins/`

Or install via Roblox Creator Store: https://create.roblox.com/store/asset/132985143757536

### 3. Configure Your MCP Client

**Claude Desktop** (`~/.config/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "roblox": {
      "command": "node",
      "args": ["/path/to/Universal-Roblox-MCP/packages/server/dist/index.js"]
    }
  }
}
```

**Cursor** (Settings > MCP):
```json
{
  "mcpServers": {
    "roblox": {
      "command": "node",
      "args": ["/path/to/Universal-Roblox-MCP/packages/server/dist/index.js"]
    }
  }
}
```
Replace `/path/to/Universal-Roblox-MCP` with your clone path (e.g. `C:\\Users\\You\\Universal-Roblox-MCP` on Windows).

## Usage

1. Start Roblox Studio
2. The MCP plugin will automatically connect
3. Ask your AI to interact with Studio:

```
"What's in my Workspace?"
"Create 10 parts in a circle"
"Find all scripts with deprecated APIs"
```

## Available Tools

### Studio Tools (37+)
- Instance hierarchy: `get_file_tree`, `search_files`, `get_project_structure`
- Properties: `get_instance_properties`, `set_property`, `mass_set_property`
- Scripts: `get_script_source`, `set_script_source`, `edit_script_lines`
- Attributes: `get_attribute`, `set_attribute`, `get_attributes`
- Tags: `get_tags`, `add_tag`, `remove_tag`, `get_tagged`
- Mass operations: `create_object`, `smart_duplicate`, `mass_create_objects`
- And more...

### Documentation Tools (27)
- **Core API**: `roblox_search`, `roblox_get_class`, `roblox_get_member`, `roblox_get_enum`
- **Deprecation**: `roblox_check_deprecated`
- **Services**: `roblox_list_services`
- **DevForum**: `roblox_search_devforum`
- **FastFlags**: `roblox_search_fflags`, `roblox_get_fflag`
- **Luau**: `roblox_get_luau_globals`, `roblox_get_luau_topic`
- **Cloud API**: `roblox_search_cloud_api`, `roblox_get_cloud_endpoint`
- **DataTypes**: `roblox_get_datatype`, `roblox_list_datatypes`
- **Libraries**: `roblox_get_library`, `roblox_get_library_function`
- And more...

## Architecture

```
Universal-Roblox-MCP/
├── packages/
│   ├── core/              # Core MCP framework
│   ├── studio-bridge/     # Studio connection (HTTP)
│   ├── tools-studio/      # 37+ Studio tools
│   ├── tools-docs/        # Python bridge for docs
│   └── server/            # Main server
└── studio-plugin/         # Roblox Studio plugin
```

## Configuration

Environment variables:
- `ROBLOX_STUDIO_PORT` - HTTP bridge port (default: 3002)
- `ROBLOX_STUDIO_HOST` - HTTP bridge host (default: 0.0.0.0)

## Development

```bash
# Build all packages
pnpm build

# Run the server in development mode
pnpm dev

# Type check all packages
pnpm typecheck

# Lint all packages
pnpm lint
```

## License

MIT
