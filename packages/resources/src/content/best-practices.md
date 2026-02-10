# Roblox Development Best Practices

## General Principles

### 1. Client-Server Architecture
- **Keep logic on the server** when possible for security and consistency
- Use **RemoteEvents/RemoteFunctions** for client-server communication
- Validate all inputs from the client on the server
- Use **ReplicatedStorage** for shared client/server objects

### 2. Performance
- Use **object pooling** for frequently created/destroyed objects
- Avoid **Wait()** - use `task.wait()` or events instead
- Use **CollectionService** with tags for organized object management
- Prefer `instance:Destroy()` over `instance:Remove()` (deprecated)
- Use **workspace**:WaitForChild() with timeout to prevent infinite waits

### 3. Memory Management
- Disconnect events when objects are destroyed: `connection:Disconnect()`
- Clean up **references** to destroyed objects
- Use **weak references** where appropriate
- Avoid storing player data in scripts (use DataStores)

## Script Organization

### Folder Structure
```
game
├── ReplicatedStorage
│   └── SharedModules          # Shared ModuleScripts
├── ServerScriptService
│   ├── ServerScripts          # Game logic scripts
│   └── DataStoreScripts       # Data management
├── StarterPlayer
│   ├── StarterPlayerScripts   # Client-side logic
│   └── StarterGui             # Initial GUI elements
└── StarterGui                 # Shared GUI
```

### ModuleScript Best Practices
- Always return a table or function
- Use **local** variables for internal state
- Document exported functions with comments
- Avoid circular dependencies

## Instance Management

### Hierarchy Best Practices
- Use **Folder** and **Model** objects to organize
- Name instances descriptively
- Use **CollectionService** tags for runtime identification
- Keep the hierarchy reasonably flat (avoid 10+ levels deep)

### Common Services
- `Players` - Player management
- `ReplicatedStorage` - Shared data
- `ServerStorage` - Server-only data
- `Workspace` - Physical game world
- `Lighting` - Visual effects
- `SoundService` - Audio management

## Property Management

### Common Property Patterns
```lua
-- Anchoring parts for building
part.Anchored = true

-- Making parts invisible but collidable
part.Transparency = 1
part.CanCollide = true

-- Making GUI elements interactive
guiButton.Active = true
guiButton.Selectable = true
```

## Scripting Patterns

### WaitForChild Pattern
```lua
-- Safe pattern with timeout
local part = workspace:WaitForChild("Part", 5)
if part then
    -- Do something with part
end
```

### Event Connection Pattern
```lua
-- Always store connections for cleanup
local connection = part.Touched:Connect(function(hit)
    -- Handle touch
end)

-- Clean up later
connection:Disconnect()
```

### CollectionService Pattern
```lua
-- Tag-based object management
local CollectionService = game:GetService("CollectionService")

local function onInstanceAdded(instance)
    -- Initialize tagged object
end

local function onInstanceRemoved(instance)
    -- Clean up tagged object
end

-- Connect to tag
CollectionService:GetInstanceAddedSignal("MyTag"):Connect(onInstanceAdded)
CollectionService:GetInstanceRemovedSignal("MyTag"):Connect(onInstanceRemoved)

-- Initialize existing tagged objects
for _, instance in CollectionService:GetTagged("MyTag") do
    onInstanceAdded(instance)
end
```

## Error Handling

### pcall Pattern
```lua
local success, result = pcall(function()
    return riskyFunction()
end)

if success then
    -- Use result
else
    warn("Error:", result)
end
```

### assert Pattern
```lua
local player = getPlayer()
assert(player, "Player not found")
```

## Common Pitfalls to Avoid

1. **Don't use `game.Players.PlayerAdded` after players have joined** - use a function that checks for existing players too
2. **Don't modify `game.Players`** - use the service events
3. **Don't use infinite loops without delays** - always add `task.wait()`
4. **Don't forget to disconnect events** - memory leaks will occur
5. **Don't trust client input** - always validate on the server
6. **Don't use deprecated APIs** - check the documentation

## Useful APIs

- `task.wait()` - Modern wait function
- `task.spawn()` - Run function without yielding
- `task.defer()` - Run function on next cycle
- `game:GetService()` - Get service reference
- `instance:Clone()` - Copy an instance
- `instance:Destroy()` - Clean up an instance
- `instance:WaitForChild()` - Wait for child to load
