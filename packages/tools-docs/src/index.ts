/**
 * @roblox-mcp/tools-docs
 *
 * Documentation tools for Roblox MCP (Python bridge to mcp-roblox-docs)
 *
 * This package provides 27 documentation tools via a Python MCP server bridge:
 * - Core API Tools: search, get_class, get_member, get_enum, check_deprecated, list_services
 * - Extended API Tools: get_inheritance, search_devforum, recent_changes, list_enums, sync, health
 * - FastFlags Tools: search_fflags, get_fflag, list_fflag_prefixes
 * - Luau Globals Tools: get_luau_globals, get_luau_global
 * - Open Cloud API Tools: search_cloud_api, get_cloud_endpoint, list_cloud_apis
 * - Luau Language Tools: get_luau_topic, list_luau_topics
 * - DataType Tools: get_datatype, list_datatypes
 * - Library Tools: get_library, get_library_function, list_libraries
 */

export * from './bridge/index.js';
export { DocsToolProxy, DocsToolRegistry, ToolSchemas, ToolDefinitions } from './proxy/index.js';
export * from './types.js';
