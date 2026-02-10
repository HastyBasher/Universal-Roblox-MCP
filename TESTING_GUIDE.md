# Roblox MCP Testing Guide

## Quick Start

### Prerequisites
1. **Build the project:**
   ```bash
   cd roblox-mcp
   pnpm install
   pnpm build
   ```

2. **Prepare Roblox Studio:**
   - Open Roblox Studio with a **BLANK** place
   - Install the MCP plugin from `studio-plugin/MCPPlugin.rbxmx`
   - Ensure the plugin is enabled and connected

3. **Run tests:**
   ```bash
   # Test all phases (incremental feedback)
   node test-tools.js

   # Test a single phase
   node test-single-phase.js docs          # Documentation tools (no Studio needed)
   node test-single-phase.js readonly      # Read-only tools
   node test-single-phase.js creation      # Object creation
   node test-single-phase.js list          # List all phases
   ```

## Test Phases (Logical Order)

### Phase 1: Documentation Tools (`docs`)
**Risk:** None (standalone)
**Studio Required:** No

Tests the Python bridge for Roblox API documentation:
- `roblox_health` - Server health check
- `roblox_search` - Search API reference
- `roblox_list_services` - List all services
- `roblox_get_class` - Get class details
- `roblox_get_datatype` - Get datatype info
- `roblox_get_enum` - Get enum values
- `roblox_list_datatypes` - List all datatypes
- `roblox_list_enums` - List all enums
- `roblox_list_libraries` - List Luau libraries
- `roblox_get_library` - Get library details
- `roblox_get_luau_globals` - List Luau globals

### Phase 2: Read-Only Tools (`readonly`)
**Risk:** None (read operations only)
**Studio Required:** Yes

Tests safe read operations on the open place:
- `get_place_info` - Get place information
- `get_file_tree` - Get instance tree
- `get_project_structure` - Get project hierarchy
- `get_services` - List services
- `search_objects` - Search for instances
- `get_selection` - Get current selection

### Phase 3: Property Read Tools (`propertyRead`)
**Risk:** Low (creates test object)
**Studio Required:** Yes

Tests reading instance properties:
- Creates `Workspace.TestPart`
- `get_instance_properties` - Read all properties
- `get_instance_children` - Get child instances
- `get_class_info` - Get class metadata

### Phase 4: Property Write Tools (`propertyWrite`)
**Risk:** Medium (modifies properties)
**Studio Required:** Yes

Tests modifying instance properties:
- `set_property` - Change single property
- `set_property` - Revert changes
- `mass_set_property` - Bulk property changes
- `set_relative_property` - Relative value changes

### Phase 5: Attribute Tools (`attributes`)
**Risk:** Medium (adds/removes attributes)
**Studio Required:** Yes

Tests instance attributes system:
- `set_attribute` - Add/set attribute
- `get_attribute` - Read attribute
- `get_attributes` - List all attributes
- `delete_attribute` - Remove attribute

### Phase 6: Tag Tools (`tags`)
**Risk:** Medium (uses CollectionService)
**Studio Required:** Yes

Tests CollectionService tags:
- `add_tag` - Add tag to instance
- `get_tags` - List instance tags
- `get_tagged` - Find all with tag
- `remove_tag` - Remove tag

### Phase 7: Script Read Tools (`scriptRead`)
**Risk:** Low (creates test script)
**Studio Required:** Yes

Tests reading script source:
- Creates `ServerScriptService.TestScript`
- `get_script_source` - Read script content

### Phase 8: Script Write Tools (`scriptWrite`)
**Risk:** Medium (modifies scripts)
**Studio Required:** Yes

Tests modifying scripts:
- `edit_script_lines` - Replace lines
- `insert_script_lines` - Add new lines
- `delete_script_lines` - Remove lines

### Phase 9: Creation Tools (`creation`)
**Risk:** Medium-High (creates objects)
**Studio Required:** Yes

Tests object creation:
- `create_object` - Create single instance
- `create_object_with_properties` - Create with properties
- `mass_create_objects` - Bulk creation

### Phase 10: Duplication Tools (`duplication`)
**Risk:** Medium (duplicates objects)
**Studio Required:** Yes

Tests smart duplication:
- `smart_duplicate` - Duplicate with offset
- `mass_duplicate` - Bulk duplication

### Phase 11: Deletion Tools (`deletion`)
**Risk:** High (removes objects)
**Studio Required:** Yes

Tests object deletion (cleanup phase):
- `delete_object` - Remove instances
- Cleans up all test objects

## Tool Categories

### Instance Hierarchy (3 tools)
- `get_file_tree` - Get instance tree
- `search_files` - Search instances
- `get_project_structure` - Project hierarchy

### Studio Context (3 tools)
- `get_place_info` - Place metadata
- `get_services` - List services
- `search_objects` - Search instances

### Properties (6 tools)
- `get_instance_properties` - Read properties
- `set_property` - Set single property
- `mass_set_property` - Bulk set
- `mass_get_property` - Bulk get
- `search_by_property` - Find by property value
- `get_class_info` - Class metadata

### Object Lifecycle (7 tools)
- `create_object` - Create instance
- `create_object_with_properties` - Create with properties
- `mass_create_objects` - Bulk create
- `mass_create_objects_with_properties` - Bulk create with properties
- `delete_object` - Remove instance
- `smart_duplicate` - Smart duplicate
- `mass_duplicate` - Bulk duplicate

### Scripts (5 tools)
- `get_script_source` - Read source
- `set_script_source` - Replace source
- `edit_script_lines` - Edit lines
- `insert_script_lines` - Insert lines
- `delete_script_lines` - Delete lines

### Attributes (4 tools)
- `get_attribute` - Read attribute
- `set_attribute` - Set attribute
- `get_attributes` - List all
- `delete_attribute` - Remove attribute

### Tags (4 tools)
- `get_tags` - List tags
- `add_tag` - Add tag
- `remove_tag` - Remove tag
- `get_tagged` - Find by tag

### Advanced (2 tools)
- `set_calculated_property` - Formula-based properties
- `set_relative_property` - Relative value changes

### Selection (1 tool)
- `get_selection` - Get selected instances

### Documentation (27 tools)
- API search and reference
- FastFlags lookup
- DevForum search
- Luau documentation
- Open Cloud API reference

## Timeout Configuration

Default timeouts in test scripts:
- **Per-tool timeout:** 10 seconds
- **Server start timeout:** 30 seconds

Adjust in `CONFIG` object if needed.

## Troubleshooting

### Server fails to start
- Ensure `pnpm build` was run
- Check `packages/server/dist/index.js` exists
- Verify Node.js version (18+ recommended)

### Tools timeout
- Check Roblox Studio is running
- Verify MCP plugin is connected
- Check Studio console for plugin errors

### Documentation tools fail
- Ensure Python is installed
- Check `uvx` is available
- May need to install `mcp-roblox-docs` manually

### Cleanup failed
- Manually delete test objects from Workspace
- Look for: TestPart, TestFolder, TestScript, etc.
