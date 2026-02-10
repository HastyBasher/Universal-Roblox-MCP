/**
 * Type definitions for mcp-roblox-docs integration
 *
 * This file contains TypeScript types and interfaces for all 27 documentation tools
 * provided by the mcp-roblox-docs Python MCP server.
 */

/**
 * All 27 tool names provided by mcp-roblox-docs
 */
export type RobloxDocsToolName =
  // Core API Tools
  | 'roblox_search'
  | 'roblox_get_class'
  | 'roblox_get_member'
  | 'roblox_get_enum'
  | 'roblox_check_deprecated'
  | 'roblox_list_services'
  // Extended API Tools
  | 'roblox_get_inheritance'
  | 'roblox_search_devforum'
  | 'roblox_recent_changes'
  | 'roblox_list_enums'
  | 'roblox_sync'
  | 'roblox_health'
  // FastFlags Tools
  | 'roblox_search_fflags'
  | 'roblox_get_fflag'
  | 'roblox_list_fflag_prefixes'
  // Luau Globals Tools
  | 'roblox_get_luau_globals'
  | 'roblox_get_luau_global'
  // Open Cloud API Tools
  | 'roblox_search_cloud_api'
  | 'roblox_get_cloud_endpoint'
  | 'roblox_list_cloud_apis'
  // Luau Language Tools
  | 'roblox_get_luau_topic'
  | 'roblox_list_luau_topics'
  // DataType Tools
  | 'roblox_get_datatype'
  | 'roblox_list_datatypes'
  // Library Tools
  | 'roblox_get_library'
  | 'roblox_get_library_function'
  | 'roblox_list_libraries';

/**
 * Input parameters for each tool
 */
export interface RobloxDocsToolArgs {
  // Core API Tools
  roblox_search: {
    query: string;
    fuzzy?: boolean;
  };
  roblox_get_class: {
    className: string;
  };
  roblox_get_member: {
    className: string;
    memberName: string;
  };
  roblox_get_enum: {
    enumName: string;
  };
  roblox_check_deprecated: {
    apiName: string;
  };
  roblox_list_services: Record<string, never>;

  // Extended API Tools
  roblox_get_inheritance: {
    className: string;
  };
  roblox_search_devforum: {
    query: string;
  };
  roblox_recent_changes: Record<string, never>;
  roblox_list_enums: Record<string, never>;
  roblox_sync: {
    language?: string;
  };
  roblox_health: Record<string, never>;

  // FastFlags Tools
  roblox_search_fflags: {
    query: string;
  };
  roblox_get_fflag: {
    fflagName: string;
  };
  roblox_list_fflag_prefixes: Record<string, never>;

  // Luau Globals Tools
  roblox_get_luau_globals: Record<string, never>;
  roblox_get_luau_global: {
    globalName: string;
  };

  // Open Cloud API Tools
  roblox_search_cloud_api: {
    query: string;
  };
  roblox_get_cloud_endpoint: {
    endpointPath: string;
  };
  roblox_list_cloud_apis: Record<string, never>;

  // Luau Language Tools
  roblox_get_luau_topic: {
    topic: string;
  };
  roblox_list_luau_topics: Record<string, never>;

  // DataType Tools
  roblox_get_datatype: {
    datatypeName: string;
  };
  roblox_list_datatypes: Record<string, never>;

  // Library Tools
  roblox_get_library: {
    libraryName: string;
  };
  roblox_get_library_function: {
    libraryName: string;
    functionName: string;
  };
  roblox_list_libraries: Record<string, never>;
}

/**
 * Supported language codes for documentation
 */
export type RobloxDocsLanguage =
  | 'en-us' // English (default)
  | 'id-id' // Indonesian
  | 'ja-jp' // Japanese
  | 'ko-kr' // Korean
  | 'zh-cn' // Chinese (Simplified)
  | 'zh-tw' // Chinese (Traditional)
  | 'de-de' // German
  | 'es-es' // Spanish
  | 'fr-fr' // French
  | 'it-it' // Italian
  | 'pt-br' // Portuguese (Brazil)
  | 'ru-ru' // Russian
  | 'th-th' // Thai
  | 'tr-tr' // Turkish
  | 'vi-vn'; // Vietnamese

/**
 * FastFlag prefix types
 */
export type FastFlagPrefix =
  | 'FFlag' // Feature boolean flag
  | 'FInt' // Feature integer flag
  | 'DFFlag' // Debug feature boolean flag
  | 'DFInt' // Debug feature integer flag
  | 'SFInt' // Server feature integer flag
  | 'SFFlag' // Server feature boolean flag
  | 'FFlagDebugGame'; // Debug game flag

/**
 * Member types in Roblox API
 */
export type RobloxMemberType = 'Property' | 'Function' | 'Event' | 'Callback';

/**
 * Class categories in Roblox API
 */
export type RobloxClassCategory =
  | 'Animation'
  | 'Audio'
  | 'Core'
  | 'Data'
  | 'Effects'
  | 'Game Logic'
  | 'Input'
  | 'Physics'
  | 'Rendering'
  | 'Social'
  | 'UI'
  | 'Utilities';
